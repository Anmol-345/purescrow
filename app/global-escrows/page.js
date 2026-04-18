"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { EscrowCard } from "@/components/ui/EscrowCard";
import { fetchAllEscrows } from "@/lib/stellar";
import { Search, Filter, Globe, Gavel, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { useWallet } from "@/components/WalletProvider";

export default function GlobalMarketplace() {
  const { connected } = useWallet();
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [onlyArbitrable, setOnlyArbitrable] = useState(false);

  useEffect(() => {
    loadEscrows();
  }, []);

  async function loadEscrows() {
    setLoading(true);
    try {
      const data = await fetchAllEscrows();
      setEscrows(data);
    } catch (error) {
      console.error("Marketplace fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }

  // Filter logic
  const filteredEscrows = useMemo(() => {
    return escrows.filter(escrow => {
      // 1. Status Filter
      const statusMatch = activeTab === 'ALL' || escrow.status === activeTab;

      // 2. Search Filter
      const searchMatch = searchQuery === '' ||
        escrow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        escrow.id.includes(searchQuery) ||
        escrow.recipient.toLowerCase().includes(searchQuery.toLowerCase());

      // 3. Arbitration Filter (Disputed)
      const arbitrationMatch = !onlyArbitrable || escrow.status === 'DISPUTED';

      return statusMatch && searchMatch && arbitrationMatch;
    });
  }, [escrows, searchQuery, activeTab, onlyArbitrable]);

  const tabs = [
    { id: 'ALL', label: 'All Escrows' },
    { id: 'FUNDED', label: 'Active' },
    { id: 'DISPUTED', label: 'Disputed' },
    { id: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Hero Header */}
      <section className="hidden sm:block relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-6 md:p-8 lg:p-12 mb-8">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Globe size={240} className="text-accent-red" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-red/10 border border-accent-red/20 text-accent-red text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} />
            Network Marketplace
          </div>
          <h1 className="title-xl">
            Global <span className="text-accent-red">Escrows</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg leading-relaxed max-w-xl">
            The public ledger of active, disputed, and completed reputation-backed transactions on the Stellar network. Search, monitor, and participate in decentralized arbitration.
          </p>
        </div>
      </section>

      {/* Control Bar */}
      <div className="sticky top-4 z-40 bg-[#0B0B0B]/80 backdrop-blur-xl border border-zinc-900 rounded-2xl p-4 shadow-2xl flex flex-col lg:flex-row gap-6 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
          <input
            type="text"
            placeholder="Search by ID, address, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="w-full lg:w-auto overflow-x-auto no-scrollbar">
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-900 min-w-max lg:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-zinc-800 text-white shadow-lg'
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Arbitration Toggle */}
        <div className="flex items-center gap-4 pl-6 border-l border-zinc-800 hidden lg:flex">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-zinc-500 uppercase">Arbitration Filter</span>
            <span className="text-xs font-bold text-zinc-300 whitespace-nowrap">Show only open disputes</span>
          </div>
          <button
            onClick={() => setOnlyArbitrable(!onlyArbitrable)}
            className={`w-12 h-6 rounded-full transition-all relative ${onlyArbitrable ? 'bg-accent-red' : 'bg-zinc-800'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${onlyArbitrable ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center px-2">
        <h3 className="text-zinc-500 font-bold text-sm tracking-widest uppercase flex items-center gap-2">
          <SlidersHorizontal size={14} />
          Showing {filteredEscrows.length} Results
        </h3>

        {onlyArbitrable && (
          <div className="flex items-center gap-2 text-accent-orange text-[10px] font-black uppercase">
            <Gavel size={14} />
            High Reputation Match
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[250px] bg-zinc-900/40 animate-pulse rounded-2xl border border-zinc-900" />
          ))}
        </section>
      ) : filteredEscrows.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEscrows.map((escrow) => (
            <div key={escrow.id} className={escrow.status === 'DISPUTED' ? 'ring-1 ring-red-500/30 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.05)]' : ''}>
              <EscrowCard
                id={escrow.id}
                description={escrow.description}
                amount={escrow.amount}
                status={escrow.status}
                recipient={escrow.recipient}
                reputation={100} // Fetching individual rep would be too many RPCs here, could be added later
              />
            </div>
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-950/50 rounded-3xl border border-zinc-900 border-dashed">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
            <Search className="text-zinc-700" size={32} />
          </div>
          <h3 className="text-xl font-bold text-zinc-400">No escrows found</h3>
          <p className="text-zinc-600 mt-1">Try adjusting your filters or search terms.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveTab('ALL');
              setOnlyArbitrable(false);
            }}
            className="mt-6 text-accent-red font-bold text-sm hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
