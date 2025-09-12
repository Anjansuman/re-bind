import { AnchorProvider, BN, Idl, Program, ProgramAccount } from "@coral-xyz/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

// contract imports should be updated everytime when contract built
import { SweProject1 } from "./swe_project_1";
import idl from "./swe_project_1.json";
import { PropertyType } from "../types/PropertyType";


export default class Contract {

    private program: Program<SweProject1> | null = null;
    private provider: AnchorProvider | null = null;
    private wallet: WalletContextState | null = null;

    constructor(connection: Connection, wallet: WalletContextState) {
        if (!wallet.publicKey || !wallet.signTransaction) throw new Error("Wallet not connected or incomplete!");

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
                },
            );

            this.program = new Program<SweProject1>(idl as Idl, this.provider);

        } catch (error) {
            this.handleError(error);
        }
    }

    public async initializePlatform(): Promise<string | null> {
        try {

            if (!this.program) throw new Error('Program not initialized!');

            const [platformConfigPDA] = this.getPlatformConfigPda();

            const res = await this.program.methods
                .initializePlatform()
                .accountsStrict({
                    platformConfig: platformConfigPDA,
                    initializer: this.getWalletPublicKey(),
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

    public async createProperty(
        name: string,
        symbol: string,
        uri: string,
        price: number,
        location: string,
        description: string,
    ): Promise<string | null> {
        try {
            if (!this.program) throw new Error('Program not initialized!');

            const owner = this.getWalletPublicKey();
            console.log("Owner PublicKey:", owner.toBase58());

            const [propertyPDA, propertyBump] = this.getPropertyPda(name, owner);
            const [mintPDA, mintBump] = this.getMintPda(propertyPDA);
            const [tokenAccountPDA, tokenBump] = this.getTokenAccountPda(mintPDA, owner);
            const [metadataPDA, metaBump] = this.getMetadataPda(mintPDA);
            const [platformConfigPDA, configBump] = this.getPlatformConfigPda();

            console.log("All PDAs:", {
                property: { address: propertyPDA.toBase58(), bump: propertyBump },
                mint: { address: mintPDA.toBase58(), bump: mintBump },
                tokenAccount: { address: tokenAccountPDA.toBase58(), bump: tokenBump },
                metadata: { address: metadataPDA.toBase58(), bump: metaBump },
                platformConfig: { address: platformConfigPDA.toBase58(), bump: configBump }
            });

            const res = await this.program.methods
                .createProperty(name, symbol, uri, new BN(price), location, description)
                .accountsStrict({
                    property: propertyPDA,
                    propertyMint: mintPDA,
                    ownerTokenAccount: tokenAccountPDA,
                    metadataAccount: metadataPDA,
                    platformConfig: platformConfigPDA,
                    owner: owner,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
                    metadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
                    systemProgram: SystemProgram.programId,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .rpc();

            return res;

        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    public async updateProperty(
        propertyName: string,
        propertyOwner: PublicKey,
        updates: {
            name?: string,
            symbol?: string,
            uri?: string,
            price?: number,
            location?: string,
            description?: string,
            availability?: boolean,
        }
    ): Promise<string | null> {
        try {

            if (!this.program) throw new Error("Program not initialized!");

            const owner = this.getWalletPublicKey();

            const [propertyPDA] = this.getPropertyPda(propertyName, propertyOwner);
            const [mintPDA] = this.getMintPda(propertyPDA);
            const [tokenAccountPDA] = this.getTokenAccountPda(mintPDA, propertyOwner);
            const [metadataPDA] = this.getMetadataPda(mintPDA);
            const [platformConfigPDA] = this.getPlatformConfigPda();

            const res = await this.program.methods
                .updateProperty(
                    updates.name || null,
                    updates.symbol || null,
                    updates.uri || null,
                    updates.price || null,
                    updates.location || null,
                    updates.description || null,
                    updates.availability !== undefined ? updates.availability : null,
                )
                .accountsStrict({
                    property: propertyPDA,
                    propertyMint: mintPDA,
                    ownerTokenAccount: tokenAccountPDA,
                    metadataAccount: metadataPDA,
                    platformConfig: platformConfigPDA,
                    owner: owner,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
                    metadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
                    systemProgram: SystemProgram.programId,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .signers([])
                .rpc();

            return res;

        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    public async BookProperty(
        propertyName: string,
        propertyOwner: PublicKey,
        checkInDate: Date,
        checkOutDate: Date,
    ): Promise<string | null> {
        try {

            if (!this.program) throw new Error('Program not initialized!');

            const checkInTimestamp = Math.floor(checkInDate.getTime() / 1000);
            const checkOutTimestamp = Math.floor(checkOutDate.getTime() / 1000);

            const [platformConfigPDA] = this.getPlatformConfigPda();
            const [propertyPDA] = this.getPropertyPda(propertyName, propertyOwner);
            const [bookingPDA] = this.getBookingPda(propertyPDA, this.getWalletPublicKey(), checkInTimestamp);
            const [escrowPDA] = this.getEscrowPda(bookingPDA);

            const res = await this.program.methods
                .bookProperty(checkInTimestamp, checkOutTimestamp)
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

    public async finalizeBooking(
        propertyName: string,
        guestPublicKey: PublicKey,
        checkInTimestamp: number,
    ): Promise<string | null> {
        try {

            if (!this.program) throw new Error('Program not initialized');

            const owner = this.getWalletPublicKey();

            const [propertyPDA] = this.getPropertyPda(propertyName, owner);
            const [bookingPDA] = this.getBookingPda(propertyPDA, guestPublicKey, checkInTimestamp);
            const [escrowPDA] = this.getEscrowPda(bookingPDA);
            const [platformConfigPDA] = this.getPlatformConfigPda();

            const res = await this.program.methods
                .finalizeBooking()
                .accountsStrict({
                    property: propertyPDA,
                    booking: bookingPDA,
                    escrowAccount: escrowPDA,
                    platformConfig: platformConfigPDA,
                    host: owner,
                    platformAuthority: this.getPlatformOwnerPublicKey(),
                    owner: owner,
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

    public async getAllProperties(): Promise<ProgramAccount<PropertyType>[]> {
        try {

            if (!this.program) throw new Error('Program not initialized!');

            const propertyAccounts = await this.program.account.property.all();
            return propertyAccounts;

        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    public async getOwnedProperties(ownerPublicKey?: PublicKey): Promise<any[]> {
        try {

            if (!this.program) throw new Error('PRogram not initialized!');

            if (!this.getWalletPublicKey() && !ownerPublicKey) throw new Error('No PublicKey provided!');


            const ownedProperties = await this.program.account.property.all([
                {
                    memcmp: {
                        offset: 8,
                        bytes: ownerPublicKey?.toBase58() || this.getWalletPublicKey().toBase58(),
                    },
                },
            ]);

            return ownedProperties;

        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    public async getBookedProperties(ownerPublicKey?: PublicKey): Promise<any[]> {
        try {

            if (!this.program) throw new Error('PRogram not initialized!');

            if (!this.getWalletPublicKey() && !ownerPublicKey) throw new Error('No PublicKey provided!');

            const bookedProperties = await this.program.account.booking.all([
                {
                    memcmp: {
                        offset: 8,
                        bytes: ownerPublicKey?.toBase58() || this.getWalletPublicKey().toBase58(),
                    },
                },
            ]);

            return bookedProperties;

        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    private getPlatformConfigPda(): [PublicKey, number] {
        if (!this.program) throw new Error('Program not initialized!');

        return PublicKey.findProgramAddressSync(
            [Buffer.from('platform-config')],
            this.program.programId,
        );
    }

    private getPropertyPda(name: string, owner: PublicKey): [PublicKey, number] {
        if (!this.program) throw new Error('Program not initialized!');

        return PublicKey.findProgramAddressSync(
            [Buffer.from("property"), owner.toBuffer(), Buffer.from(name)],
            this.program.programId,
        );
    }

    private getMintPda(property: PublicKey): [PublicKey, number] {
        if (!this.program) throw new Error('Program not initialized!');

        return PublicKey.findProgramAddressSync(
            [
                Buffer.from('property-mint'),
                property.toBuffer(),
            ],
            this.program.programId,
        );
    }

    private getTokenAccountPda(mint: PublicKey, owner: PublicKey): [PublicKey, number] {
        if (!this.program) throw new Error('Program not initialized!');

        return PublicKey.findProgramAddressSync(
            [
                owner.toBuffer(),
                TOKEN_PROGRAM_ID.toBuffer(),
                mint.toBuffer()
            ],
            ASSOCIATED_PROGRAM_ID,
        );
    }

    private getMetadataPda(mint: PublicKey): [PublicKey, number] {
        const metadataProgram = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

        return PublicKey.findProgramAddressSync(
            [
                Buffer.from('metadata'),
                metadataProgram.toBuffer(),
                mint.toBuffer()
            ],
            metadataProgram,
        );
    }

    private getBookingPda(
        property: PublicKey,
        guest: PublicKey,
        checkInDate: number
    ): [PublicKey, number] {
        if (!this.program) throw new Error('program not initialized!');

        return PublicKey.findProgramAddressSync(
            [
                Buffer.from('booking'),
                property.toBuffer(),
                guest.toBuffer(),
                new BN(checkInDate).toArrayLike(Buffer, 'le', 8)
            ],
            this.program.programId,
        );
    }

    private getEscrowPda(booking: PublicKey): [PublicKey, number] {
        if (!this.program) throw new Error('program not initialized!');

        return PublicKey.findProgramAddressSync(
            [Buffer.from('escrow'), booking.toBuffer()],
            this.program.programId,
        );
    }

    private getWalletPublicKey(): PublicKey {
        if (!this.wallet?.publicKey) throw new Error('Wallet not connected');

        return this.wallet.publicKey;
    }

    public getPlatformOwnerPublicKey(): PublicKey {
        return new PublicKey('AEPkjDJAbyVUhVjGFfsuLWPwcA1qr64VU4hqEiL745Mn');
    }

    private handleError(error: unknown): void {
        console.error('Contract error: ', error);

        if (typeof error === 'string') {
            throw new Error(error);
        } else if (error instanceof Error) {
            throw error;
        }
        throw new Error('Unknown contract error!');
    }

}