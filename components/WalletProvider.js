"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { kit, initWallet, PUR_ESCROW_THEME } from '@/lib/wallet';

const WalletContext = createContext({
    publicKey: null,
    connected: false,
    connect: async () => {},
    disconnect: () => {},
});

export const useWallet = () => useContext(WalletContext);

export function WalletProvider({ children }) {
    const [publicKey, setPublicKey] = useState(null);
    const [connected, setConnected] = useState(false);

    // Initialize kit and load wallet from localStorage on mount
    useEffect(() => {
        initWallet();
        const storedWallet = localStorage.getItem('stellar_wallet');
        if (storedWallet) {
            setPublicKey(storedWallet);
            setConnected(true);
        }
    }, []);

    const connect = async () => {
        try {
            // Ensure the kit is initialized
            await initWallet();
            
            // Force a refresh of the supported wallets right before opening the modal
            // This helps catch extensions that might have been detected slightly late
            await kit.refreshSupportedWallets();
            
            const { address } = await kit.authModal();
            setPublicKey(address);
            setConnected(true);
            localStorage.setItem('stellar_wallet', address);
            return address;
        } catch (error) {
            console.error('Connection failed:', error);
            throw error;
        }
    };

    const disconnect = () => {
        setPublicKey(null);
        setConnected(false);
        localStorage.removeItem('stellar_wallet');
    };

    return (
        <WalletContext.Provider value={{ publicKey, connected, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    );
}
