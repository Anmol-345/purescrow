"use client";

import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { WalletConnection } from './ui/WalletConnection';

export function MobileHeader() {
    return (
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 z-[60] px-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-red to-accent-orange flex items-center justify-center shadow-lg shadow-accent-red/10">
                    <Shield className="text-white" size={18} />
                </div>
                <span className="text-sm font-black tracking-tighter text-white uppercase italic">
                    PUR<span className="text-accent-red">ESCROW</span>
                </span>
            </Link>

            <div className="flex-shrink-0">
                <WalletConnection minimal={true} />
            </div>
        </header>
    );
}
