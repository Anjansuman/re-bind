use anchor_lang::prelude::*;

use crate::state::platform_config::PlatformConfig;

pub fn change_authority(ctx: Context<ChangePlatformAuthority>, new_authority: Pubkey) -> Result<()> {
    
    let platform_config = &mut ctx.accounts.platform_config;

    platform_config.authority = new_authority;

    Ok(())
}

#[derive(Accounts)]
pub struct ChangePlatformAuthority<'info> {
    #[account(
        mut,
        seeds = [b"platform-config"],
        bump,
        has_one = authority
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    pub authority: Signer<'info>
}