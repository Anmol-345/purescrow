"use client";

import { useState, useEffect } from 'react';
import { Gavel, CheckCircle2, User, UserCheck, ShieldAlert, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { getUserReputation } from '@/lib/stellar';
import { useWallet } from '@/components/WalletProvider';

export function ArbitrationPanel({ escrow, status }) {
  const { connected, publicKey } = useWallet();
  const [reputation, setReputation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [voteType, setVoteType] = useState(null); // 'BUYER' or 'SELLER'

  useEffect(() => {
    async function loadReputation() {
      if (connected && publicKey) {
        const score = await getUserReputation(publicKey);
        setReputation(score);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    loadReputation();
  }, [connected, publicKey]);

  const isEligible = reputation >= 150;

  const handleVote = (type) => {
    setLoading(true);
    // Simulate on-chain vote
    setTimeout(() => {
      setVoted(true);
      setVoteType(type);
      setLoading(false);
    }, 2000);
  };

  if (status !== 'DISPUTED') return null;

  return (
    <div className="card-glass border-accent-red/20 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-red/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Gavel size={24} className="text-accent-red" />
                Arbitration Hub
            </h3>
            <div className="px-2 py-1 rounded bg-accent-red/10 border border-accent-red/20 text-[10px] font-black text-accent-red uppercase tracking-tighter">
                Live Dispute
            </div>
        </div>

        {/* Eligibility Section */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-3">
            <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-bold uppercase tracking-widest">Eligibility Check</span>
                {isEligible ? (
                    <span className="text-green-500 font-bold flex items-center gap-1">
                        <UserCheck size={14} />
                        Eligible to Vote
                    </span>
                ) : (
                    <span className="text-red-500 font-bold flex items-center gap-1">
                        <ShieldAlert size={14} />
                        Not Eligible
                    </span>
                )}
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ${isEligible ? 'bg-green-500' : 'bg-accent-red'}`} 
                            style={{ width: `${Math.min((reputation / 50) * 100, 100)}%` }}
                        />
                    </div>
                </div>
                <span className="text-lg font-black text-white">
                    {reputation} <span className="text-[10px] text-zinc-500">/ 150 RP</span>
                </span>
            </div>
            
            {!isEligible && (
                <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                    Arbitration is restricted to high-reputation network participants to ensure fair and unbiased resolutions. Gain reputation by completing successful transactions.
                </p>
            )}
        </div>

        {/* Voting UI */}
        {voted ? (
            <div className="p-8 bg-green-500/5 border border-green-500/20 rounded-2xl flex flex-col items-center text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-white">Decision Recorded</h4>
                    <p className="text-xs text-zinc-400 mt-1">You voted for the <span className="text-white font-bold">{voteType}</span>. This transaction has been locked for final consensus.</p>
                </div>
                <button className="text-[10px] font-black text-green-500 hover:underline flex items-center gap-1 uppercase tracking-widest">
                    View on Stellar Expert <ArrowRight size={10} />
                </button>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => handleVote(escrow.sender)}
                        disabled={!isEligible || loading || !connected}
                        className={`
                            group flex items-center justify-between p-4 rounded-xl border transition-all
                            ${!isEligible || !connected ? 'opacity-40 grayscale cursor-not-allowed border-zinc-800' : 'border-zinc-800 hover:border-accent-red bg-zinc-900/40 hover:bg-accent-red/[0.02]'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-800 group-hover:border-accent-red/50 transition-colors">
                                <User size={20} className="text-zinc-500 group-hover:text-accent-red" />
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-black text-white uppercase tracking-tighter">Support Buyer</span>
                                <span className="text-[10px] text-zinc-500">Release funds to the sender</span>
                            </div>
                        </div>
                        {isEligible && connected && <ArrowRight size={16} className="text-zinc-700 group-hover:translate-x-1 group-hover:text-accent-red transition-all" />}
                    </button>

                    <button 
                        onClick={() => handleVote(escrow.recipient)}
                        disabled={!isEligible || loading || !connected}
                        className={`
                            group flex items-center justify-between p-4 rounded-xl border transition-all
                            ${!isEligible || !connected ? 'opacity-40 grayscale cursor-not-allowed border-zinc-800' : 'border-zinc-800 hover:border-accent-orange bg-zinc-900/40 hover:bg-accent-orange/[0.02]'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-800 group-hover:border-accent-orange/50 transition-colors">
                                <User Check size={20} className="text-zinc-500 group-hover:text-accent-orange" />
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-black text-white uppercase tracking-tighter">Support Seller</span>
                                <span className="text-[10px] text-zinc-500">Send funds to the recipient</span>
                            </div>
                        </div>
                        {isEligible && connected && <ArrowRight size={16} className="text-zinc-700 group-hover:translate-x-1 group-hover:text-accent-orange transition-all" />}
                    </button>
                </div>

                {!connected ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-[10px] font-bold justify-center uppercase tracking-widest">
                        <Lock size={12} />
                        Wallet Connection Required
                    </div>
                ) : !isEligible ? (
                    <div className="mt-4 p-4 rounded-xl bg-accent-red/5 border border-accent-red/10 border-dashed">
                        <div className="flex items-center gap-2 text-accent-red font-black text-[10px] uppercase tracking-widest mb-1">
                            <Sparkles size={12} />
                            Reputation Booster
                        </div>
                        <p className="text-[10px] text-zinc-500">You need <span className="text-white font-bold">{150 - reputation} more points</span> to participate in network governance.</p>
                    </div>
                ) : (
                    <p className="text-[10px] text-zinc-600 text-center italic mt-2">
                        Note: Decisions are final and will impact your own reputation relative to the final consensus.
                    </p>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
