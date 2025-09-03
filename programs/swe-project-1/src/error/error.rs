use anchor_lang::prelude::*;

#[error_code]
pub enum PropertyError {
    // Property ownership errors
    #[msg("Only the property owner can perform this action")]
    UnauthorizedOwner,
    
    #[msg("Must own the property NFT to perform this action")]
    MustOwnPropertyNFT,
    
    // Property validation errors
    #[msg("Property name must be 60 characters or less")]
    NameTooLong,
    
    #[msg("Location must be 124 characters or less")]
    LocationTooLong,
    
    #[msg("Description must be 252 characters or less")]
    DescriptionTooLong,
    
    #[msg("Property symbol must be 10 characters or less")]
    SymbolTooLong,
    
    #[msg("Property URI must be 200 characters or less")]
    UriTooLong,
    
    // Property status errors
    #[msg("Property is not available for booking")]
    PropertyNotAvailable,
    
    #[msg("Property is currently booked and cannot be modified")]
    PropertyCurrentlyBooked,
    
    #[msg("Property must be set to unavailable before removal")]
    PropertyMustBeUnavailable,
    
    #[msg("Property has active bookings and cannot be removed")]
    PropertyHasActiveBookings,
    
    // Booking errors
    #[msg("Cannot book your own property")]
    CannotBookOwnProperty,
    
    #[msg("Booking amount is insufficient")]
    InsufficientBookingAmount,
    
    #[msg("Booking duration must be at least 1 night")]
    InvalidBookingDuration,
    
    #[msg("Check-in date must be in the future")]
    InvalidCheckInDate,
    
    #[msg("Check-out date must be after check-in date")]
    InvalidCheckOutDate,
    
    #[msg("Invalid booking status for this operation")]
    InvalidBookingStatus,
    
    #[msg("Cannot cancel booking at this time")]
    CannotCancelBooking,
    
    #[msg("Unauthorized to perform booking action")]
    UnauthorizedBookingAction,
    
    #[msg("Insufficient funds in escrow account")]
    InsufficientEscrowFunds,
    
    // Platform errors
    #[msg("Only platform authority can perform this action")]
    UnauthorizedPlatformAction,
    
    #[msg("Platform fee cannot exceed 10%")]
    InvalidPlatformFee,
    
    // General errors
    #[msg("Invalid account provided")]
    InvalidAccount,
    
    #[msg("Arithmetic overflow occurred")]
    ArithmeticOverflow,
    
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
}