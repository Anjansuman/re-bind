use anchor_lang::prelude::*;

use crate::state::{
    booking::{Booking, BookingStatus},
    platform_config::PlatformConfig,
    property::Property,
};

use crate::error::PropertyError;

pub fn book_property(
    ctx: Context<BookProperty>,
    check_in_date: i64,
    check_out_date: i64,
) -> Result<()> {
    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;

    require!(
        check_in_date >= current_time,
        PropertyError::InvalidCheckInDate
    );
    require!(
        check_out_date > check_in_date,
        PropertyError::InvalidCheckOutDate
    );

    let property = &mut ctx.accounts.property;
    let booking = &mut ctx.accounts.booking;
    let guest = &ctx.accounts.guest;
    let platform_config = &ctx.accounts.platform_config;

    require!(property.is_available, PropertyError::PropertyNotAvailable);
    require!(
        property.owner != guest.key(),
        PropertyError::CannotBookOwnProperty
    );

    let total_time = ((check_out_date - check_in_date) / 86400) as u64;
    require!(total_time >= 1, PropertyError::InvalidBookingDuration);

    let sub_total = property
        .price
        .checked_mul(total_nights)
        .ok_or(PropertyError::ArithmeticOverflow)?;

    let platform_fee = sub_total
        .checked_mul(platform_config.platform_fee as u64)
        .ok_or(PropertyError::ArithmeticOverflow)?
        .checked_div(10000)
        .ok_or(PropertyError::ArithmeticOverflow)?;

    let total_amount = sub_total.checked_add(platform_fee)
        .ok_or(PropertyError::ArithmeticOverflow)?;

    require!(guest.lamports() >= total_amount, PropertyError::InsufficientBookingAmount);

    booking.booking_id = clock.slot;
    booking.property = property.key();
    booking.guest = guest.key();
    booking.host = property.owner;
    booking.check_in_date = check_in_date;
    booking.check_out_date = check_out_date;
    booking.total_time = total_time;
    booking.price = property.price;
    booking.total_amount = total_amount;
    booking.platform_fee = platform_fee;
    booking.status = BookingStatus::Pending;
    booking.created_at = current_time;
    booking.confirmed_at = None;
    booking.cancelled_at = None;
    booking.bump = ctx.bumps.booking;

    let transfer_instruction = system_program::Transfer {
        from: guest.to_account_info(),
        to: ctx.accounts.escrow_account.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        transfer_instruction,
    );

    system_program::transfer(cpi_ctx, total_amount);

    msg!("Booking created: ID {}, Total: {} lamports", booking.booking_id, total_amount);

    Ok(())
}

#[derive(Accounts)]
#[instruction(check_in_date: u64, check_out_date: u64)]
pub struct BookProperty<'info> {
    #[account(
        seeds = [b"property", property.owner.as_ref(), property.name.as_bytes()],
        bump = property.bump,
    )]
    pub property: Account<'info, Property>,

    #[account(
        init,
        payer = guest,
        seeds = [b"booking", property.key().as_ref(), guest.key().as_ref(), &check_in_date.to_le_bytes()],
        bump,
        space = Booking::LEN,
    )]
    pub booking: Account<'info, Booking>,

    #[account(
        mut,
        seeds = [b"escrow", booking.key().as_ref()],
        bump,
    )]
    pub escrow_account: UncheckedAccount<'info>,

    #[account(
        seeds = [b"platform-config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    #[account(mut)]
    pub guest: Signer<'info>,

    pub system_program: Program<'info, System>,
}
