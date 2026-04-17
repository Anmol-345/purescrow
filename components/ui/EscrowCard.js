"use client";

import { StatusBadge } from './StatusBadge';
import { ShieldCheck, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

export function EscrowCard({ id, description, amount, status, recipient, reputation }) {
    return (
        <div className="card-glass group hover:bg-zinc-900/80 transition-all">
            <div className="flex justify-between items-start mb-4">
                <StatusBadge status={status} />
                <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-md">
                    <ShieldCheck size={14} />
                    Reputation: {reputation}
                </div>
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-accent-red transition-colors">
                {description}
            </h3>

            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-6">
                <User size={14} />
                <span>To: <span className="text-zinc-300 font-mono">{recipient}</span></span>
            </div>

            <div className="flex justify-between items-center bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                <div>
                    <span className="block text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Amount</span>
                    <span className="text-2xl font-black text-white">{amount}</span>
                </div>
                <Link 
                    href={`/escrow/${id}`}
                    className="flex items-center gap-2 text-sm font-bold text-accent-red hover:text-accent-orange transition-colors"
                >
                    View Details
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
