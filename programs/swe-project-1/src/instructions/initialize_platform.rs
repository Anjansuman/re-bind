use anchor_lang::prelude::*;

use crate::state::platform_config::PlatformConfig;

pub fn initialize_platform(ctx: Context<InitializePlatform>) -> Result<()> {
    
    let platform_config = &mut ctx.accounts.platform_config;
    let initializer = &ctx.accounts.initializer;


    platform_config.authority = initializer.key();
    platform_config.platform_fee = 0;
    platform_config.bump = ctx.bumps.platform_config;

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = initializer,
        seeds = [b"platform-config"],
        bump,
        space = 8 + 32 + 8 + 1
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    #[account(mut)]
    pub initializer: Signer<'info>,

    pub system_program: Program<'info, System>
}