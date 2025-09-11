"use client";

import { useState } from "react";
import { VscGithub } from "react-icons/vsc";
import { WalletPanel } from "../utility/WalletPanel";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useContract } from "@/app/contract";
import AdminPanel from "../admin/AdminPanel";


export default function Navbar() {

    const [walletPanel, setWalletPanel] = useState<boolean>(false);
    const [adminPanel, setAdminPanel] = useState<boolean>(false);

    const { publicKey } = useWallet();
    const { contract } = useContract();

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[76rem] bg-black border border-neutral-700 rounded-2xl py-5 px-10 flex justify-between items-center text-neutral-200 shadow-md ">
            <div>
                Hashed
            </div>
            <div className="flex px-3 gap-x-3 justify-between items-center ">
                <VscGithub size={30} className="cursor-pointer " />
            </div>
            <div className="flex justify-center items-center gap-x-3">
                {publicKey?.toBase58() === contract?.getPlatformOwnerPublicKey().toBase58() && (
                    <div
                        className="flex justify-center items-center bg-neutral-200 px-3 py-2 rounded-lg text-neutral-800 cursor-pointer hover:-translate-y-0.5 transition-transform "
                        onClick={() => setAdminPanel(true)}
                    >
                        Admin Controls
                    </div>
                )}
                <div
                    className="flex justify-center items-center bg-neutral-200 px-3 py-2 rounded-lg text-neutral-800 cursor-pointer hover:-translate-y-0.5 transition-transform "
                    onClick={() => setWalletPanel(true)}
                >
                    Connect Wallet
                </div>
            </div>
            {walletPanel && (
                <WalletPanel close={() => setWalletPanel(false)} />
            )}
            {adminPanel && (
                <AdminPanel close={() => setAdminPanel(false)} />
            )}
        </div>
    );
}