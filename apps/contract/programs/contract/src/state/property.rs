use anchor_lang::prelude::*;

#[account]
pub struct Property {
    pub owner: Pubkey,       
    pub mint: Pubkey,        
    pub name: String,        
    pub price: u64,
    pub location: String,    
    pub description: String, 
    pub is_available: bool,  
    pub total_bookings: u64, 
    pub created_at: i64,     
    pub bump: u8,            
}

impl Property {

    pub const LEN: usize = 8 +
        32 + 
        32 + 
        4 + 60 +
        8 +  
        4 + 124 +
        4 + 252 +
        1 +  
        8 +  
        8 +  
        1;
}
