pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use error::*;
use instructions::{
    change_authority,
    create_property,
    initialize_platform,
    update_property,
    book_property,
};
use state::*;

declare_id!("3uhtojvL7Yq1xHkj22zguqDHjboQzLqkK7pNsTEQjwWL");

#[program]
pub mod swe_project_1 {
    use crate::{
        instructions::change_authority::ChangePlatformAuthority,
        instructions::create_property::CreateProperty,
        instructions::initialize_platform::InitializePlatform,
        instructions::update_property::UpdateProperty,
        instructions::book_property::BookProperty,
    };

    use super::*;

    pub fn initialize_platform(ctx: Context<InitializePlatform>) -> Result<()> {
        initialize_platform::initialize_platform(ctx)
    }

    pub fn change_authority(
        ctx: Context<ChangePlatformAuthority>,
        new_authority: Pubkey,
    ) -> Result<()> {
        change_authority::change_authority(ctx, new_authority)
    }

    pub fn withdraw_platform_fees(ctx: Context<InitializePlatform>) -> Result<()> {
        initialize_platform(ctx)
    }

    pub fn create_property(
        ctx: Context<CreateProperty>,
        name: String,
        symbol: String,
        uri: String,
        price: u64,
        location: String,
        description: String,
    ) -> Result<()> {
        create_property::create_property(ctx, name, symbol, uri, price, location, description)
    }

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
        update_property::update_property(
            ctx,
            new_name,
            new_symbol,
            new_uri,
            new_price,
            new_location,
            new_description,
            new_avaibility,
        )
    }

    pub fn remove_property(ctx: Context<InitializePlatform>) -> Result<()> {
        initialize_platform(ctx)
    }

    pub fn book_property(
        ctx: Context<BookProperty>,
        check_in_date: i64,
        check_out_date: i64,
    ) -> Result<()> {
        book_property::book_property(ctx, check_in_date, check_out_date)
    }

    pub fn finalize_booking(ctx: Context<InitializePlatform>) -> Result<()> {
        initialize_platform(ctx)
    }

    pub fn cancel_booking(ctx: Context<InitializePlatform>) -> Result<()> {
        initialize_platform(ctx)
    }

    // add the collected money to provide pools if it is not collected in 4 days
    pub fn claim_property_funds(ctx: Context<InitializePlatform>) -> Result<()> {
        initialize_platform(ctx)
    }
}
