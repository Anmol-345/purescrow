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
            // Re-ensure theme is set right before opening the modal
            initWallet();
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
