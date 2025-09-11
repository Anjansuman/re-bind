use crate::state::{platform_config::PlatformConfig, property::Property};

use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3,
        mpl_token_metadata::types::{Creator, DataV2},
        CreateMetadataAccountsV3, Metadata,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

pub fn create_property(
    ctx: Context<CreateProperty>,
    name: String,
    symbol: String,
    uri: String,
    price: u64,
    location: String,
    description: String,
) -> Result<()> {
    let property = &mut ctx.accounts.property;
    let property_mint = &ctx.accounts.property_mint;
    let owner = &ctx.accounts.owner;

    // Initialize property state
    property.owner = owner.key();
    property.mint = property_mint.key();
    property.name = name.clone();
    property.price = price;
    property.location = location;
    property.description = description;
    property.is_available = true;
    property.total_bookings = 0;
    property.bump = ctx.bumps.property;

    // Mint the NFT to the owner
    let cpi_context = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
            mint: ctx.accounts.property_mint.to_account_info(),
            to: ctx.accounts.owner_token_account.to_account_info(),
            authority: ctx.accounts.property.to_account_info(),
        },
    );

    let property_mint_key = ctx.accounts.property_mint.key();
    let seeds = &[
        b"property-mint",
        ctx.account.property.key().as_ref(),
        &[ctx.bumps.property_mint],
    ];
    let signer_seeds = &[&seeds[..]];

    mint_to(cpi_context.with_signer(signer_seeds), 1)?;

    // Create metadata for the NFT
    let creators = vec![Creator {
        address: ctx.accounts.platform_config.authority,
        verified: false,
        share: 100,
    }];

    let metadata = DataV2 {
        name: name,
        symbol: symbol,
        uri: uri,
        seller_fee_basis_points: 500, // 5% royalty
        creators: Some(creators),
        collection: None,
        uses: None,
    };

    let metadata_ctx = CpiContext::new(
        ctx.accounts.metadata_program.to_account_info(),
        CreateMetadataAccountsV3 {
            metadata: ctx.accounts.metadata_account.to_account_info(),
            mint: ctx.accounts.property_mint.to_account_info(),
            mint_authority: ctx.accounts.property.to_account_info(),
            update_authority: ctx.accounts.platform_config.to_account_info(),
            payer: ctx.accounts.owner.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        },
    );

    create_metadata_accounts_v3(
        metadata_ctx.with_signer(signer_seeds),
        metadata,
        false,
        true,
        None,
    )?;

    msg!("Property NFT created: {}", ctx.accounts.property_mint.key());
    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateProperty<'info> {
    #[account(
        init,
        payer = owner,
        seeds = [b"property", owner.key().as_ref(), name.as_bytes()],
        bump,
        space = Property::LEN
    )]
    pub property: Account<'info, Property>,

    #[account(
        init,
        payer = owner,
        seeds = [b"property-mint", property.key().as_ref()],
        bump,
        mint::decimals = 0,
        mint::authority = property,
    )]
    pub property_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = property_mint,
        associated_token::authority = owner,
    )]
    pub owner_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
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

/*

    /// CHECK: This account will be initialized by the metadata program
    // #[account(
    //     mut,
    //     seeds = [
    //         b"metadata",
    //         metadata_program.key().as_ref(),
    //         property_mint.key().as_ref(),
    //     ],
    //     bump,
    //     seeds::program = metadata_program.key(),
    // )]
    // pub metadata_account: UncheckedAccount<'info>,

*/
