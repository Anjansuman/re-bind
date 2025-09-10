import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

import { SweProject1 } from "./swe_project_1";
import idl from "./swe_project_1.json";


export default class Contract {

    private program: Program<SweProject1> | null = null;
    private provider:  AnchorProvider | null = null;
    private wallet: WalletContextState | null = null;

    constructor(connection: Connection, wallet: WalletContextState) {
        if(!wallet.publicKey || !wallet.signTransaction) throw new Error("Wallet not connected or incomplete!");

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
            
        }
    }

    public async getAllProperties() {
        try {

            
            
        } catch (error) {
            
        }
    }

    public async getPersonalProperties(publicKey: string) {

    }

    public async bookProperty(propertyAddress: string) {

    }

}