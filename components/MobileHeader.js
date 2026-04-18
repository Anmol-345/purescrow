"use client";

import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { WalletConnection } from './ui/WalletConnection';

export function MobileHeader() {
    return (
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-900 z-[60] px-4 flex items-center justify-between shadow-2xl">
            <Link href="/" className="flex items-center gap-2 group active:scale-95 transition-transform">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-red to-accent-orange flex items-center justify-center shadow-lg shadow-accent-red/20">
                    <Shield className="text-white" size={20} />
                </div>
                <span className="text-sm sm:text-base font-black tracking-tighter text-white uppercase italic">
                    PUR<span className="text-accent-red">ESCROW</span>
                </span>
            </Link>

            <div className="flex items-center gap-3">
                <WalletConnection minimal={true} />
            </div>
        </header>
    );
}
