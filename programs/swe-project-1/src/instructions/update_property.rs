use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        mpl_token_metadata::types::DataV2, update_metadata_accounts_v2, Metadata,
        UpdateMetadataAccountsV2,
    },
    token::{Mint, Token, TokenAccount},
};

use crate::error::PropertyError;
use crate::state::{PlatformConfig, Property};

pub fn update_property(
    ctx: Context<UpdateProperty>,
    new_name: Option<String>,
    new_symbol: Option<String>,
    new_uri: Option<String>,
    new_price: Option<u64>,
    new_location: Option<String>,
    new_description: Option<String>,
    new_avaibility: Option<bool>,
) -> Result<()> {
    let property = &mut ctx.accounts.property;
    let mut metadata_updated = false;

    if let Some(name) = new_name.clone() {
        require!(name.len() <= 60, PropertyError::NameTooLong);
        property.name = name;
        metadata_updated = true;
    }

    if let Some(price) = new_price {
        property.price = price;
    }

    if let Some(location) = new_location {
        require!(location.len() <= 124, PropertyError::LocationTooLong);
        property.location = location;
    }

    if let Some(description) = new_description {
        require!(description.len() <= 252, PropertyError::DescriptionTooLong);
        property.description = description;
    }

    if let Some(is_available) = new_avaibility {
        property.is_available = is_available;
    }

    if metadata_updated || new_symbol.is_some() || new_uri.is_some() {
        let current_name = new_name.unwrap_or_else(|| property.name.clone());
        let current_symbol = new_symbol.unwrap_or_else(|| "PROP".to_string());
        let current_uri = new_uri.unwrap_or_else(|| "".to_string());

        let metadata = DataV2 {
            name: current_name,
            symbol: current_symbol,
            uri: current_uri,
            seller_fee_basis_points: 500,
            creators: None,
            collection: None,
            uses: None,
        };

        let metadata_ctx = CpiContext::new(
            ctx.accounts.metadata_program.to_account_info(),
            UpdateMetadataAccountsV2 {
                metadata: ctx.accounts.metadata_account.to_account_info(),
                update_authority: ctx.accounts.property_mint.to_account_info(),
            },
        );

        let property_mint_key = ctx.accounts.property_mint.key();
        let seeds = &[
            b"property-mint",
            property_mint_key.as_ref(),
            &[ctx.bumps.property_mint],
        ];
        let signer_seeds = &[&seeds[..]];

        update_metadata_accounts_v2(
            metadata_ctx.with_signer(signer_seeds),
            None,
            Some(metadata),
            None,
            Some(true),
        )?;

        msg!("Property metadata updated");
    }

    msg!("Property updated: {}", property.mint);
    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct UpdateProperty<'info> {
    #[account(
        mut,
        seeds = [b"property", owner.key().as_ref(), property.name.as_bytes()],
        bump = property.bump,
        has_one = owner @ PropertyError::UnauthorizedOwner,
    )]
    pub property: Account<'info, Property>,

    #[account(
        mut,
        seeds = [b"property-mint", property.key().as_ref()],
        bump,
        mint::authority = property_mint,
        mint::freeze_authority = property_mint,
    )]
    pub property_mint: Account<'info, Mint>,

    #[account(
        associated_token::mint = property_mint,
        associated_token::authority = owner,
        constraint = owner_token_account.amount == 1 @ PropertyError::MustOwnPropertyNFT,
    )]
    pub owner_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [
            b"metadata",
            metadata_program.key().as_ref(),
            property_mint.key().as_ref(),
        ],
        bump,
        seeds::program = metadata_program.key(),
    )]
    pub metadata_account: UncheckedAccount<'info>,

    #[account(
        seeds = [b"platform-config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub metadata_program: Program<'info, Metadata>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
