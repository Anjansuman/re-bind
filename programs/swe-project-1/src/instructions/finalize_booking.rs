use anchor_lang::{prelude::*, system_program};

use crate::state::{
    Booking, BookingStatus, PlatformConfig, Property
};

use crate::error::PropertyError;

pub fn finalize_booking(
    ctx: Context<FinalizeBooking>,
) -> Result<()> {

    let property = &mut ctx.accounts.property;
    let booking = &mut ctx.accounts.booking;
    let host = &ctx.accounts.host;
    let platform_authority = &ctx.accounts.platform_authority;

    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;

    require!(
        booking.status == BookingStatus::Pending || booking.status == BookingStatus::Confirmed,
        PropertyError::InvalidBookingStatus,
    );

    let is_host_confirming = host.key() == booking.host && booking.status == BookingStatus::Pending;
    let is_auto_completing = current_time > booking.check_out_date && booking.status == BookingStatus::Pending;

    require!(
        is_host_confirming || is_auto_completing,
        PropertyError::UnauthorizedBookingAction
    );

    let host_payment = booking.total_amount.checked_sub(booking.platform_fee)
        .ok_or(PropertyError::ArithmeticOverflow)?;

    let escrow_lamports = ctx.accounts.escrow_account.lamports();
    require!(escrow_lamports >= booking.total_amount, PropertyError::InsufficientEscrowFunds);

    let booking_key = booking.key();
    let seeds = &[
        b"escrow",
        booking_key.as_ref(),
        &[ctx.bumps.escrow_account],
    ];
    let signer_seeds = &[&seeds[..]];

    // transfer payment to host
    let transfer_to_host = system_program::Transfer {
        from: ctx.accounts.escrow_account.to_account_info(),
        to: host.to_account_info(),
    };

    let cpi_ctx_host = CpiContext::new_with_signer(
        ctx.accounts.system_program.to_account_info(),
        transfer_to_host,
        signer_seeds,
    );

    system_program::transfer(cpi_ctx_host, host_payment);

    if booking.platform_fee > 0 {
        let transfer_to_platform = system_program::Transfer {
            from: ctx.accounts.escrow_account.to_account_info(),
            to: platform_authority.to_account_info(),
        };

        let cpi_ctx_platform = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            transfer_to_platform,
            signer_seeds,
        );
        
        system_program::transfer(cpi_ctx_platform, booking.platform_fee);
    }

    if is_host_confirming {
        booking.status = BookingStatus::Confirmed;
        property.total_bookings = property.total_bookings.checked_add(1)
            .ok_or(PropertyError::ArithmeticOverflow)?;
        msg!("Booking {} confirmed by host", booking.booking_id);
    } else {
        booking.status = BookingStatus::Confirmed;
        property.total_bookings = property.total_bookings.checked_add(1)
            .ok_or(PropertyError::ArithmeticOverflow)?;
        msg!("Booking {} completed automatically", booking.booking_id);
    }

    Ok(())
}


#[derive(Accounts)]
pub struct FinalizeBooking<'info> {
    #[account(
        mut,
        seeds = [b"property", property.owner.as_ref(), property.name.as_bytes()],
        bump = property.bump,
        has_one = owner @ PropertyError::UnauthorizedOwner
    )]
    pub property: Account<'info, Property>,

    #[account(
        mut,
        seeds = [b"booking", property.key().as_ref(), guest.key().as_ref(), &check_in_date.to_le_bytes()],
        bump = booking.bump,
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
    pub host: Signer<'info>,

    #[account(
        mut,
        address = platform_config.authority @ PropertyError::UnauthorizedPlatformAction,
    )]
    pub platform_authority: UncheckedAccount<'info>,

    pub owner: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}