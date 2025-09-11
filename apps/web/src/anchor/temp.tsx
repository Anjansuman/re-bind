import { AnchorProvider, BN, Idl, Program } from "@coral-xyz/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { SweProject1 } from "./swe_project_1";
import idl from "./swe_project_1.json";

export default class Contract {
    private program: Program<SweProject1> | null = null;
    private provider: AnchorProvider | null = null;
    private wallet: WalletContextState | null = null;

    constructor(connection: Connection, wallet: WalletContextState) {
        if (!wallet.publicKey || !wallet.signTransaction) {
            throw new Error("Wallet not connected or incomplete!");
        }
        this.init(connection, wallet);
    }

    private init(connection: Connection, wallet: WalletContextState) {
        try {
            this.wallet = wallet;
            this.provider = new AnchorProvider(
                connection,
                wallet as any,
                {
                    commitment: "confirmed",
                }
            );
            this.program = new Program<SweProject1>(idl as Idl, this.provider);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Platform initialization (only for platform authority)
    public async initializePlatform(): Promise<string | null> {
        try {
            if (!this.program) {
                throw new Error("Program not initialized");
            }

            const [platformConfigPDA] = this.getPlatformConfigPda();

            const res = await this.program.methods
                .initializePlatform()
                .accountsStrict({
                    platformConfig: platformConfigPDA,
                    authority: this.getWalletPublicKey(),
                    systemProgram: SystemProgram.programId,
                })
                .signers([])
                .rpc();

            return res;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    // Create a new property
    public async createProperty(
        name: string,
        symbol: string,
        uri: string,
        price: number,
        location: string,
        description: string
    ): Promise<string | null> {
        try {
            if (!this.program) {
                throw new Error("Program not initialized");
            }

            const [propertyPDA] = this.getPropertyPda(name, this.getWalletPublicKey());
            const [mintPDA] = this.getMintPda(name, this.getWalletPublicKey());
            const [tokenAccountPDA] = this.getTokenAccountPda(mintPDA, this.getWalletPublicKey());
            const [metadataPDA] = this.getMetadataPda(mintPDA);

            const res = await this.program.methods
                .createProperty(name, symbol, uri, new BN(price), location, description)
                .accountsStrict({
                    property: propertyPDA,
                    mint: mintPDA,
                    tokenAccount: tokenAccountPDA,
                    metadataAccount: metadataPDA,
                    owner: this.getWalletPublicKey(),
                    rent: PublicKey.default, // Will be filled by Anchor
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"), // Metaplex Token Metadata Program
                })
                .signers([])
                .rpc();

            return res;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    // Update property details
    public async updateProperty(
        propertyName: string,
        propertyOwner: PublicKey,
        updates: {
            name?: string;
            symbol?: string;
            uri?: string;
            price?: number;
            location?: string;
            description?: string;
            availability?: boolean;
        }
    ): Promise<string | null> {
        try {
            if (!this.program) {
                throw new Error("Program not initialized");
            }

            const [propertyPDA] = this.getPropertyPda(propertyName, propertyOwner);
            const [mintPDA] = this.getMintPda(propertyName, propertyOwner);
            const [tokenAccountPDA] = this.getTokenAccountPda(mintPDA, propertyOwner);
            const [metadataPDA] = this.getMetadataPda(mintPDA);

            const res = await this.program.methods
                .updateProperty(
                    updates.name || null,
                    updates.symbol || null,
                    updates.uri || null,
                    updates.price ? new BN(updates.price) : null,
                    updates.location || null,
                    updates.description || null,
                    updates.availability !== undefined ? updates.availability : null
                )
                .accountsStrict({
                    property: propertyPDA,
                    mint: mintPDA,
                    tokenAccount: tokenAccountPDA,
                    metadataAccount: metadataPDA,
                    owner: this.getWalletPublicKey(),
                    tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
                })
                .signers([])
                .rpc();

            return res;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    // Book a property
    public async bookProperty(
        propertyName: string,
        propertyOwner: PublicKey,
        checkInDate: Date,
        checkOutDate: Date
    ): Promise<string | null> {
        try {
            if (!this.program) {
                throw new Error("Program not initialized");
            }

            const checkInTimestamp = Math.floor(checkInDate.getTime() / 1000);
            const checkOutTimestamp = Math.floor(checkOutDate.getTime() / 1000);

            const [propertyPDA] = this.getPropertyPda(propertyName, propertyOwner);
            const [bookingPDA] = this.getBookingPda(propertyPDA, this.getWalletPublicKey(), checkInTimestamp);
            const [escrowPDA] = this.getEscrowPda(bookingPDA);
            const [platformConfigPDA] = this.getPlatformConfigPda();

            const res = await this.program.methods
                .bookProperty(new BN(checkInTimestamp), new BN(checkOutTimestamp))
                .accountsStrict({
                    property: propertyPDA,
                    booking: bookingPDA,
                    escrowAccount: escrowPDA,
                    platformConfig: platformConfigPDA,
                    guest: this.getWalletPublicKey(),
                    systemProgram: SystemProgram.programId,
                })
                .signers([])
                .rpc();

            return res;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    // Finalize booking (for hosts)
    public async finalizeBooking(
        propertyName: string,
        guestPublicKey: PublicKey,
        checkInTimestamp: number
    ): Promise<string | null> {
        try {
            if (!this.program) {
                throw new Error("Program not initialized");
            }

            const [propertyPDA] = this.getPropertyPda(propertyName, this.getWalletPublicKey());
            const [bookingPDA] = this.getBookingPda(propertyPDA, guestPublicKey, checkInTimestamp);
            const [escrowPDA] = this.getEscrowPda(bookingPDA);
            const [platformConfigPDA] = this.getPlatformConfigPda();

            const res = await this.program.methods
                .finalizeBooking()
                .accountsStrict({
                    booking: bookingPDA,
                    escrowAccount: escrowPDA,
                    platformConfig: platformConfigPDA,
                    host: this.getWalletPublicKey(),
                    platformAuthority: new PublicKey("PLATFORM_AUTHORITY_PUBKEY"), // Replace with actual platform authority
                    systemProgram: SystemProgram.programId,
                })
                .signers([])
                .rpc();

            return res;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    // Fetch all properties (this would require custom RPC calls)
    public async getAllProperties(): Promise<any[]> {
        try {
            if (!this.program) {
                throw new Error("Program not initialized");
            }

            // Get all property accounts
            const propertyAccounts = await this.program.account.property.all();
            return propertyAccounts;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    // Get properties owned by a specific user
    public async getPersonalProperties(ownerPublicKey: PublicKey): Promise<any[]> {
        try {
            if (!this.program) {
                throw new Error("Program not initialized");
            }

            const propertyAccounts = await this.program.account.property.all([
                {
                    memcmp: {
                        offset: 8, // Skip discriminator
                        bytes: ownerPublicKey.toBase58(),
                    },
                },
            ]);

            return propertyAccounts;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    // Get bookings for a user
    public async getUserBookings(userPublicKey: PublicKey): Promise<any[]> {
        try {
            if (!this.program) {
                throw new Error("Program not initialized");
            }

            const bookingAccounts = await this.program.account.booking.all([
                {
                    memcmp: {
                        offset: 40, // Skip discriminator + booking_id + property
                        bytes: userPublicKey.toBase58(),
                    },
                },
            ]);

            return bookingAccounts;
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    // PDA helper methods
    private getPlatformConfigPda(): [PublicKey, number] {
        if (!this.program) throw new Error("Program not initialized");

        return PublicKey.findProgramAddressSync(
            [Buffer.from("platform-config")],
            this.program.programId
        );
    }

    private getPropertyPda(name: string, owner: PublicKey): [PublicKey, number] {
        if (!this.program) throw new Error("Program not initialized");

        return PublicKey.findProgramAddressSync(
            [Buffer.from("property"), owner.toBuffer(), Buffer.from(name)],
            this.program.programId
        );
    }

    private getMintPda(name: string, owner: PublicKey): [PublicKey, number] {
        if (!this.program) throw new Error("Program not initialized");

        return PublicKey.findProgramAddressSync(
            [Buffer.from("mint"), owner.toBuffer(), Buffer.from(name)],
            this.program.programId
        );
    }

    private getTokenAccountPda(mint: PublicKey, owner: PublicKey): [PublicKey, number] {
        return PublicKey.findProgramAddressSync(
            [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            ASSOCIATED_TOKEN_PROGRAM_ID
        );
    }

    private getMetadataPda(mint: PublicKey): [PublicKey, number] {
        const metadataProgram = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
        return PublicKey.findProgramAddressSync(
            [Buffer.from("metadata"), metadataProgram.toBuffer(), mint.toBuffer()],
            metadataProgram
        );
    }

    private getBookingPda(property: PublicKey, guest: PublicKey, checkInDate: number): [PublicKey, number] {
        if (!this.program) throw new Error("Program not initialized");

        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("booking"),
                property.toBuffer(),
                guest.toBuffer(),
                new BN(checkInDate).toArrayLike(Buffer, "le", 8),
            ],
            this.program.programId
        );
    }

    private getEscrowPda(booking: PublicKey): [PublicKey, number] {
        if (!this.program) throw new Error("Program not initialized");

        return PublicKey.findProgramAddressSync(
            [Buffer.from("escrow"), booking.toBuffer()],
            this.program.programId
        );
    }

    public getWalletPublicKey(): PublicKey {
        if (!this.wallet?.publicKey) {
            throw new Error("Wallet not connected");
        }
        return this.wallet.publicKey;
    }

    private handleError(error: unknown): void {
        console.error("Contract error:", error);
        if (typeof error === "string") {
            throw new Error(error);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Unknown contract error");
    }
}