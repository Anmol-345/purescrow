"use client";

import { EscrowCard } from "@/components/ui/EscrowCard";
import { MOCK_ESCROWS } from "@/lib/stellar";
import { Search, Filter, TrendingUp, ShieldCheck, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
            Your <span className="text-accent-red">Escrows</span>
          </h1>
          <p className="text-zinc-500 max-w-lg">
            Monitor active transactions, manage disputes, and track your cryptographic reputation in real-time.
          </p>
        </div>

        <div className="flex bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800 gap-2">
           <div className="bg-zinc-950 px-6 py-3 rounded-xl flex items-center gap-3 border border-zinc-800 shadow-inner">
              <TrendingUp className="text-green-500" size={18} />
              <div>
                <span className="block text-[10px] uppercase font-bold text-zinc-500">Global Reputation</span>
                <span className="text-lg font-black text-white">842 <span className="text-xs text-zinc-500">/ 1000</span></span>
              </div>
           </div>
           <div className="bg-zinc-950 px-6 py-3 rounded-xl flex items-center gap-3 border border-zinc-800 shadow-inner">
              <ShieldCheck className="text-accent-orange" size={18} />
              <div>
                <span className="block text-[10px] uppercase font-bold text-zinc-500">Trust Index</span>
                <span className="text-lg font-black text-white">Top 2%</span>
              </div>
           </div>
        </div>
      </section>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, recipient, or description..." 
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-300 hover:bg-zinc-800 transition-colors">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Escrow Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ESCROWS.map((escrow) => (
          <EscrowCard 
            key={escrow.id}
            id={escrow.id}
            description={escrow.description}
            amount={escrow.amount}
            status={escrow.status}
            recipient={escrow.recipient}
            reputation={escrow.reputationScore}
          />
        ))}
        
        {/* Create CTA Card */}
        <Link href="/create" className="border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-8 gap-4 hover:border-accent-red/50 hover:bg-accent-red/[0.02] transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle className="text-zinc-600 group-hover:text-accent-red" size={24} />
          </div>
          <div className="text-center">
            <h4 className="font-bold text-zinc-300">Start New Transaction</h4>
            <p className="text-xs text-zinc-500 mt-1">Initialize a secure reputation-backed escrow.</p>
          </div>
        </Link>
      </section>

      {/* Statistics Section */}
      <section className="pt-8 border-t border-zinc-900">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-6">Network Insights</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Active Escrows" value="12" delta="+2" />
          <StatBox label="Total Value" value="4.2k XLM" delta="+540" />
          <StatBox label="Resolved" value="128" delta="+12" />
          <StatBox label="Dispute Rate" value="0.8%" delta="-0.2%" />
        </div>
      </section>
    </div>
  );
}

function StatBox({ label, value, delta }) {
  const isPositive = delta.startsWith('+');
  return (
    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-sm">
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-black text-white">{value}</span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {delta}
        </span>
      </div>
    </div>
  );
}
