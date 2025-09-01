use anchor_lang::prelude::*;


#[account]
pub struct PlatformConfig {
    pub authority: Pubkey,
    pub platform_fee: u64,
    pub bump: u8
}