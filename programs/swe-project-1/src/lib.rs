use anchor_lang::prelude::*;

declare_id!("3uhtojvL7Yq1xHkj22zguqDHjboQzLqkK7pNsTEQjwWL");

#[program]
pub mod swe_project_1 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
