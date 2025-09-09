use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BookingStatus {
    Pending,  
    Confirmed,
    Active,   
    Completed,
    Cancelled,
}

#[account]
pub struct Booking {
    pub booking_id: u64,          
    pub property: Pubkey,         
    pub guest: Pubkey,            
    pub host: Pubkey,             
    pub check_in_date: i64,       
    pub check_out_date: i64,      
    pub total_time: u64,        
    pub price: u64,     
    pub total_amount: u64,        
    pub platform_fee: u64,        
    pub status: BookingStatus,    
    pub created_at: i64,          
    pub confirmed_at: Option<i64>,
    pub cancelled_at: Option<i64>,
    pub bump: u8,                 
}

impl Booking {
    pub const LEN: usize = 8 + // discriminator
        8 +   // booking_id
        32 +  // property
        32 +  // guest
        32 +  // host
        8 +   // check_in_date
        8 +   // check_out_date
        8 +   // total_nights
        8 +   // price_per_night
        8 +   // total_amount
        8 +   // platform_fee
        1 + 1 + // status (enum discriminant + variant)
        8 +   // created_at
        1 + 8 + // confirmed_at (option + value)
        1 + 8 + // cancelled_at (option + value)
        1;    // bump

    pub fn is_active(&self) -> bool {
        matches!(self.status, BookingStatus::Pending | BookingStatus::Confirmed | BookingStatus::Active)
    }

    pub fn can_be_cancelled(&self) -> bool {
        matches!(self.status, BookingStatus::Pending | BookingStatus::Confirmed)
    }

    pub fn is_expired(&self, current_time: i64) -> bool {
        // Booking expires if check-in date passed and still pending
        self.status == BookingStatus::Pending && current_time > self.check_in_date
    }
}