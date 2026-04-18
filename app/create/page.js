"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Info, AlertCircle } from 'lucide-react';
import { createEscrow } from '@/lib/stellar';

export default function CreateEscrow() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        console.log("Initializing real escrow transaction...");
        await createEscrow(
            formData.recipient,
            formData.amount,
            formData.description
        );
        router.push('/');
    } catch (error) {
        console.error("Escrow creation failed:", error);
        alert(`Transaction failed: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in">
      <div className="mb-10 text-center md:text-left">
        <h1 className="title-xl mb-4">Initialize <span className="text-accent-red">Escrow</span></h1>
        <p className="text-zinc-500 text-sm md:text-base">
          Establish a secure, reputation-backed transaction. The funds will be held in a decentralized contract until delivery is confirmed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Recipient Address</label>
          <input 
            type="text" 
            placeholder="G..." 
            required
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red transition-all font-mono text-sm"
            value={formData.recipient}
            onChange={(e) => setFormData({...formData, recipient: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Amount (XLM)</label>
                <input 
                    type="number" 
                    placeholder="0.00" 
                    required
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red transition-all font-black text-xl"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 flex items-start gap-3">
                <Info size={16} className="text-accent-orange mt-1 shrink-0" />
                <p className="text-[10px] text-zinc-500 leading-relaxed uppercase font-bold tracking-tight">
                    Ensure the amount is available in your wallet. Reputation points are staked alongside the transaction.
                </p>
            </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Description</label>
          <textarea 
            rows={4}
            placeholder="Describe the service or items being exchanged..." 
            required
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red transition-all text-sm"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
            <AlertCircle className="text-accent-red shrink-0" size={24} />
            <div>
                <h4 className="text-sm font-bold text-white mb-1">Dispute Awareness</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                    By initializing this escrow, you agree to the automated reputation adjustment protocol. Resolving disputes through logic-based evidence is required if delivery is contested.
                </p>
            </div>
        </div>

        <button 
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Initialize Escrow
              <Send size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
