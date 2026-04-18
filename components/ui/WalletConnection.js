"use client";

import { useWallet } from '@/components/WalletProvider';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function WalletConnection({ minimal = false }) {
    const { publicKey, connected, connect, disconnect } = useWallet();
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            await connect();
        } catch (error) {
            console.error('Failed to connect:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    if (connected && publicKey) {
        if (minimal) {
            return (
                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 py-1.5 pl-3 pr-1.5 rounded-full backdrop-blur-md">
                    <span className="text-[10px] font-mono text-zinc-400">
                        {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
                    </span>
                    <button
                        onClick={disconnect}
                        className="p-1.5 rounded-full hover:bg-accent-red/10 text-zinc-500 hover:text-accent-red transition-colors"
                        title="Disconnect"
                    >
                        <LogOut size={14} />
                    </button>
                </div>
            );
        }

        return (
            <div className="w-full space-y-2">
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Connected Wallet</span>
                    <span className="text-xs font-mono text-zinc-300 truncate">
                        {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
                    </span>
                </div>
                <button
                    onClick={disconnect}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-accent-red hover:bg-accent-red/5 transition-all group"
                >
                    <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase">Disconnect</span>
                </button>
            </div>
        );
    }

    if (minimal) {
        return (
            <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-br from-accent-red to-accent-orange text-white font-black text-[10px] shadow-lg shadow-accent-red/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
                {isConnecting ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : (
                    <Wallet size={14} />
                )}
                <span>CONNECT</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-br from-accent-red to-accent-orange text-white font-black text-sm shadow-lg shadow-accent-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
        >
            {isConnecting ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <Wallet size={20} />
            )}
            <span>CONNECT WALLET</span>
        </button>
    );
}
