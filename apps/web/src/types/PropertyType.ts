import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export interface PropertyType {
    owner: PublicKey;
    mint: PublicKey;
    name: string;
    price: BN;
    location: string;
    description: string;
    isAvailable: boolean;
    totalBookings: BN;
    createdAt: BN;
    bump: number;
}