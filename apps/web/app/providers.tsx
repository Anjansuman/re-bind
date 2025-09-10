"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import {
    AlphaWalletAdapter,
    PhantomWalletAdapter,
    SolflareWalletAdapter
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { ReactNode, useMemo } from "react";



export default function Providers({ children }: { children: ReactNode }) {

    const endpoint = clusterApiUrl('devnet');

    const wallets = useMemo(
        () => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new AlphaWalletAdapter()],
        [],
    )

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                {children}
            </WalletProvider>
        </ConnectionProvider>
    );
}