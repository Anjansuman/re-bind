pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::*;
use state::*;

declare_id!("3uhtojvL7Yq1xHkj22zguqDHjboQzLqkK7pNsTEQjwWL");

#[program]
pub mod swe_project_1 {
    use crate::{instruction::ChangeAuthority, instructions::initialize_platform::InitializePlatform};

    use super::*;

    pub fn initialize_platform(ctx: Context<InitializePlatform>) -> Result<()> {
        instructions::initialize_platform::initialize_platform(ctx)
    }

    pub fn change_authority(ctx: Context<ChangeAuthority>, new_authority: Pubkey) -> Result<()> {
        instructions::change_authority::change_authority(ctx, new_authority)
    }

    pub fn withdraw_platform_fees(ctx: Context<InitializePlatform>) -> Result<()> {
        initialize_platform(ctx)
    }

    pub fn create_property(ctx: Context<InitializePlatform>) -> Result<()> {
        initialize_platform(ctx)
    }

    pub fn update_property(ctx: Context<InitializePlatform>) -> Result<()> {
        initialize_platform(ctx)
    }

    pub fn remove_property(ctx: Context<InitializePlatform>) -> Result<()> {
        initialize_platform(ctx)
    }

    pub fn book_property(ctx: Context<InitializePlatform>) -> Result<()> {
        initialize_platform(ctx)
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