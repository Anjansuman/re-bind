import Contract from "@/src/anchor/Contract";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { createContext, useContext, useEffect, useState } from "react";

type ContractContextType = {
    contract: Contract | null;
}

const ContractContext = createContext<ContractContextType>({
    contract: null,
});

export const ContractProvider = ({ children }: { children: React.ReactNode }) => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [contract, setContract] = useState<Contract | null>(null);

    useEffect(() => {
        if(wallet.connected && wallet.publicKey) {
            try {
                
                const contractInstance = new Contract(connection, wallet);
                setContract(contractInstance);

            } catch (error) {
                console.error("Contract initialization failed: ", error);
            }
        } else {
            setContract(null);
        }
    }, [wallet.connected, wallet.publicKey, connection]);

    return (
        <ContractContext.Provider value={{ contract }}>
            {children}
        </ContractContext.Provider>
    );
}

export const useContract = () => useContext(ContractContext);