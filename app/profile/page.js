"use client";

import { getUserReputation } from "@/lib/stellar";
import { 
    User, 
    ShieldCheck, 
    Award, 
    History, 
    TrendingUp, 
    AlertTriangle,
    CheckCircle,
    Wallet,
    Lock
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWallet } from "@/components/WalletProvider";

export default function Profile() {
    const { connected, publicKey, connect } = useWallet();
    const [score, setScore] = useState(100);

    useEffect(() => {
        if (connected && publicKey) {
            getUserReputation(publicKey).then(setScore);
        }
    }, [connected, publicKey]);

    if (!connected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-fade-in text-center">
                <div className="relative">
                    <div className="w-24 h-24 rounded-3xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-2xl">
                        <User className="text-zinc-600" size={40} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-accent-orange flex items-center justify-center shadow-lg border-4 border-[#0B0B0B]">
                        <Lock className="text-white" size={18} />
                    </div>
                </div>
                
                <div className="max-w-md space-y-4">
                    <h1 className="text-4xl font-black tracking-tighter text-white">
                        Private <span className="text-accent-orange">Profile</span>
                    </h1>
                    <p className="text-zinc-500 font-medium">
                        Connect your wallet to view your on-chain reputation stats, transaction history, and earned achievements.
                    </p>
                </div>

                <button 
                    onClick={connect}
                    className="px-8 py-4 bg-accent-orange text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-orange/10"
                >
                    CONNECT TO VIEW PROFILE
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Header / Avatar Section */}
            <section className="flex flex-col md:flex-row items-center gap-8 py-8 px-8 card-glass border-b-4 border-accent-orange bg-gradient-to-br from-zinc-950 to-zinc-900">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center overflow-hidden shadow-2xl group-hover:border-accent-orange transition-colors">
                        <User size={64} className="text-zinc-700 group-hover:text-white transition-colors" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-accent-orange p-2 rounded-xl shadow-lg shadow-accent-orange/20">
                        <ShieldCheck size={20} className="text-white" />
                    </div>
                </div>

                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-black mb-1">Stellar Operator</h1>
                    <code className="text-xs text-zinc-500 block mb-4 break-all max-w-xs md:max-w-none">
                        {publicKey}
                    </code>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <Badge label="Verified Seller" />
                        <Badge label="Elite Arbitrator" />
                    </div>
                </div>

                <div className="md:ml-auto flex flex-col items-center border-l border-zinc-800 pl-8">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Current Reputation</span>
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-orange">
                        {score}
                    </span>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stats & History */}
                <div className="md:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <StatCard icon={<CheckCircle className="text-green-500" />} label="Successful Deals" value="42" />
                        <StatCard icon={<AlertTriangle className="text-red-500" />} label="Disputes Lost" value="0" />
                    </div>

                    <section className="card-glass">
                        <h3 className="font-bold flex items-center gap-2 mb-6">
                            <History size={18} className="text-zinc-500" />
                            Reputation History
                        </h3>
                        <div className="space-y-6">
                            <HistoryItem 
                                action="Successfully Delivered" 
                                project="UI Design Kit" 
                                delta="+10" 
                                date="3 days ago" 
                            />
                            <HistoryItem 
                                action="Dispute Resolved (Winner)" 
                                project="API Integration" 
                                delta="+15" 
                                date="1 week ago" 
                            />
                            <HistoryItem 
                                action="Escrow Initialized" 
                                project="Logo Design" 
                                delta="0" 
                                date="2 weeks ago" 
                            />
                        </div>
                    </section>
                </div>

                {/* Achievement Panel */}
                <div className="space-y-6">
                    <section className="card-glass bg-zinc-950">
                        <h3 className="font-bold flex items-center gap-2 mb-6">
                            <Award size={18} className="text-accent-orange" />
                            Achievements
                        </h3>
                        <div className="space-y-4">
                            <Achievement 
                                title="Genesis User" 
                                description="Member of the first 100 users."
                                earned 
                            />
                            <Achievement 
                                title="Flawless Record" 
                                description="No disputes lost in 10+ deals."
                                earned 
                            />
                            <Achievement 
                                title="High Roller" 
                                description="Completed transactions over 5000 XLM."
                            />
                        </div>
                    </section>
                    
                    <div className="p-6 bg-accent-red/5 border border-accent-red/10 rounded-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <TrendingUp className="text-accent-red mb-3" size={24} />
                            <h4 className="text-sm font-bold text-white mb-1">Reputation Analytics</h4>
                            <p className="text-[10px] text-zinc-500 leading-relaxed uppercase font-bold tracking-tight">
                                Your visibility in the marketplace increases every 50 points. Next tier: <span className="text-accent-red">Tier 5 (Top 1%)</span>
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-red/10 blur-3xl -mr-16 -mt-16" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Badge({ label }) {
    return (
        <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {label}
        </span>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="card-glass flex items-center gap-4 bg-zinc-950/30">
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                {icon}
            </div>
            <div>
                <span className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{label}</span>
                <span className="text-2xl font-black">{value}</span>
            </div>
        </div>
    );
}

function HistoryItem({ action, project, delta, date }) {
    const isPositive = delta.startsWith('+');
    return (
        <div className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/10 px-2 rounded-lg transition-colors">
            <div>
                <h4 className="text-sm font-bold text-zinc-200">{action}</h4>
                <p className="text-[10px] text-zinc-500 font-mono uppercase">{project}</p>
            </div>
            <div className="text-right">
                <span className={`text-sm font-black ${isPositive ? 'text-green-500' : delta === '0' ? 'text-zinc-500' : 'text-red-500'}`}>
                    {delta}
                </span>
                <p className="text-[10px] text-zinc-600 mt-1">{date}</p>
            </div>
        </div>
    );
}

function Achievement({ title, description, earned = false }) {
    return (
        <div className={`flex gap-4 p-3 rounded-xl border ${earned ? 'border-zinc-800 bg-zinc-900/30' : 'border-zinc-900/50 opacity-40 grayscale'}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${earned ? 'bg-orange-400/10 text-orange-400' : 'bg-zinc-900 text-zinc-700'}`}>
                <Award size={18} />
            </div>
            <div>
                <h5 className="text-xs font-bold text-zinc-200">{title}</h5>
                <p className="text-[10px] text-zinc-500 leading-tight">{description}</p>
            </div>
        </div>
    );
}
