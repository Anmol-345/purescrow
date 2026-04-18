"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArbitrationPanel } from '@/components/ui/ArbitrationPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EvidenceTimeline } from '@/components/ui/EvidenceTimeline';
import { useWallet } from '@/components/WalletProvider';
import { ArrowLeft, CheckCircle2, ShieldAlert, MessageSquare, Upload, Gavel, ExternalLink, RefreshCw, Wallet, Clock } from 'lucide-react';
import { 
    getEscrow, 
    confirmEscrowDelivery, 
    raiseEscrowDispute, 
    submitEscrowEvidence, 
    fundEscrow 
} from '@/lib/stellar';

export default function EscrowDetail({ params }) {
  const { id } = use(params);
  const { publicKey, connected } = useWallet();
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [evidenceMsg, setEvidenceMsg] = useState('');
  
  useEffect(() => {
    loadEscrow();
  }, [id]);

  async function loadEscrow() {
    setLoading(true);
    try {
      const data = await getEscrow(id);
      setEscrow(data);
    } catch (error) {
      console.error("Escrow fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleEvidenceSubmit = async () => {
    if (!evidenceMsg) return;
    setActionLoading(true);
    
    try {
        console.log("Submitting real evidence to blockchain...");
        // In a production app, we would upload the message/file to IPFS here
        // For now, we use a placeholder CID to demonstrate the contract call
        const mockCid = `msg-${Date.now()}`;
        await submitEscrowEvidence(id, mockCid);
        setEvidenceMsg('');
        await loadEscrow();
    } catch (error) {
        console.error("Evidence submission failed:", error);
        alert(`Failed to submit evidence: ${error.message}`);
    } finally {
        setActionLoading(false);
    }
  };

  const handleAction = async (actionFn, name) => {
    setActionLoading(true);
    try {
        console.log(`Executing real on-chain action: ${name}...`);
        await actionFn(id);
        await loadEscrow();
    } catch (error) {
        console.error(`${name} failed:`, error);
        alert(`${name} failed: ${error.message}`);
    } finally {
        setActionLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <RefreshCw className="animate-spin text-accent-red" size={40} />
            <p className="text-zinc-500 font-bold animate-pulse uppercase tracking-widest text-xs">Fetching Escrow Details...</p>
        </div>
    );
  }

  if (!escrow) {
    return (
        <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-zinc-900 border-dashed">
            <h2 className="text-2xl font-black text-white">Escrow Not Found</h2>
            <p className="text-zinc-500 mt-2">The requested transaction could not be located on the blockchain.</p>
            <Link href="/global-escrows" className="text-accent-red font-bold hover:underline mt-6 inline-block">Return to Marketplace</Link>
        </div>
    );
  }

    const isBuyer = connected && publicKey === escrow.sender;
    const isSeller = connected && publicKey === escrow.recipient;
    const isArbitrator = !isBuyer && !isSeller;
    const isDisputed = escrow.status === 'DISPUTED';

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <Link href="/global-escrows" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Marketplace
      </Link>

      {/* Role Indicator Banner */}
      {connected && (
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
          isBuyer ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
          isSeller ? 'bg-green-500/10 border-green-500/20 text-green-400' :
          'bg-orange-500/10 border-orange-500/20 text-orange-400'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isBuyer ? 'bg-blue-500' : isSeller ? 'bg-green-500' : 'bg-orange-500'
          }`} />
          Current Role: {isBuyer ? 'Buyer (Sender)' : isSeller ? 'Seller (Recipient)' : 'Arbitrator / Spectator'}
        </div>
      )}

      {/* Main Header Card */}
      <div className={`card-glass border-l-4 transition-all ${isDisputed ? 'border-accent-red ring-1 ring-accent-red/20 shadow-[0_0_30px_rgba(239,68,68,0.05)]' : 'border-zinc-800'}`}>
        <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-4">
                    <StatusBadge status={escrow.status} />
                    <span className="text-zinc-500 text-xs font-mono">ID: {escrow.id}</span>
                </div>
                <h1 className="text-3xl font-black mb-2">{escrow.description}</h1>
                <div className="space-y-1">
                    <p className="text-zinc-400 text-xs">Buyer: <span className="font-mono text-white/70">{escrow.sender === publicKey ? "You" : escrow.sender}</span></p>
                    <p className="text-zinc-400 text-xs">Seller: <span className="font-mono text-white/70">{escrow.recipient === publicKey ? "You" : escrow.recipient}</span></p>
                </div>
            </div>
            
            <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center min-w-[200px] transition-colors ${isDisputed ? 'bg-accent-red/5 border-accent-red/20' : 'bg-zinc-950 border-zinc-800'}`}>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Escrowed Funds</span>
                <span className={`text-3xl font-black ${isDisputed ? 'text-accent-red' : 'text-white'}`}>{escrow.amount}</span>
                <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded ${isDisputed ? 'bg-accent-red/10 text-accent-red' : 'bg-green-500/10 text-green-500'}`}>
                    {isDisputed ? "LOCKED IN DISPUTE" : "SECURED ON STELLAR"}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Actions & Info */}
        <div className="lg:col-span-2 space-y-8">
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-accent-red" />
                        Available Actions
                    </h3>
                    {!connected && (
                        <span className="text-[10px] font-black text-accent-orange uppercase flex items-center gap-1">
                            Connect wallet to act
                        </span>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* BUYER ACTIONS */}
                    {isBuyer && (
                        <>
                            {escrow.status === 'CREATED' && (
                                <ActionButton 
                                    title="Fund Escrow" 
                                    description="Transfer the agreed amount to the secure contract."
                                    icon={<Wallet className="text-accent-orange" />}
                                    variant="success"
                                    onClick={() => handleAction(fundEscrow, "Funding")}
                                    disabled={actionLoading}
                                />
                            )}
                            <ActionButton 
                                title="Confirm Delivery" 
                                description="Verify you received the items/service to release funds."
                                icon={<CheckCircle2 className="text-green-500" />}
                                variant="success"
                                disabled={escrow.status !== 'FUNDED' || actionLoading}
                                onClick={() => handleAction(confirmEscrowDelivery, "Confirmation")}
                            />
                        </>
                    )}

                    {/* SELLER INFORMATIONAL STATE */}
                    {isSeller && (
                        <div className="col-span-1 md:col-span-2 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/50 flex flex-col items-center text-center">
                            <Clock className="text-accent-orange mb-3 animate-spin-slow" size={32} />
                            <h4 className="text-white font-bold mb-1">
                                {escrow.status === 'CREATED' ? "Waiting for Buyer to Fund" :
                                 escrow.status === 'FUNDED' ? "Waiting for Buyer to Confirm Delivery" :
                                 "Escrow Finalized"}
                            </h4>
                            <p className="text-xs text-zinc-500 max-w-sm">
                                {escrow.status === 'CREATED' ? "The buyer has created the escrow but hasn't transferred the funds yet. Once funded, you can proceed with delivery." :
                                 escrow.status === 'FUNDED' ? "The funds are secured. Please provide the service/item and wait for the buyer to confirm receipt." :
                                 "This transaction is complete and funds have been handled according to on-chain rules."}
                            </p>
                        </div>
                    )}

                    {/* ARBITRATOR / NON-INVOLVED MESSAGE */}
                    {isArbitrator && connected && (
                        <div className="col-span-1 md:col-span-2 p-6 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10 flex flex-col items-center text-center">
                            <ShieldAlert className="text-accent-orange mb-3" size={32} />
                            <h4 className="text-zinc-400 font-bold mb-1">View Only Access</h4>
                            <p className="text-xs text-zinc-600 max-w-sm">
                                You are not a direct participant in this transaction. You can monitor the status or participate in arbitration if a dispute is raised.
                            </p>
                        </div>
                    )}

                    {/* SHARED ACTIONS */}
                    {(isBuyer || isSeller) && (
                        <ActionButton 
                            title="Raise Dispute" 
                            description="Escalate this transaction to community arbitration."
                            icon={<ShieldAlert className="text-red-500" />}
                            variant="danger"
                            disabled={escrow.status === 'RESOLVED' || escrow.status === 'DELIVERED' || escrow.status === 'DISPUTED' || actionLoading}
                            onClick={() => handleAction(raiseEscrowDispute, "Dispute")}
                        />
                    )}
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <MessageSquare size={20} className="text-accent-orange" />
                        Evidence Timeline
                    </h3>
                </div>
                <EvidenceTimeline evidence={escrow.evidenceCids.map((cid, i) => ({
                    id: `e-${i}`,
                    uploader: 'ON-CHAIN',
                    timestamp: 'Archive Data',
                    cid: cid,
                    type: 'file'
                }))} />
            </section>
        </div>

        {/* Right Column: Interaction Panel */}
        <div className="space-y-6">
            {/* Arbitration Panel for Disputed Escrows */}
            {isDisputed && (
                <ArbitrationPanel escrow={escrow} status={escrow.status} />
            )}

            <div className="card-glass bg-zinc-900/40">
                <h4 className="font-bold flex items-center gap-2 mb-4">
                    <Upload size={18} className="text-accent-red" />
                    Submit Evidence
                </h4>
                <div className="space-y-4">
                    <textarea 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs focus:ring-1 focus:ring-accent-red outline-none transition-all"
                        placeholder="Explain your case or paste additional metadata..."
                        rows={6}
                        value={evidenceMsg}
                        onChange={(e) => setEvidenceMsg(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center gap-2 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-[10px] font-bold hover:bg-zinc-700 transition-colors">
                            <Upload size={14} />
                            Attach File
                        </button>
                        <button 
                            onClick={handleEvidenceSubmit}
                            disabled={loading || !evidenceMsg}
                            className="flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl text-[10px] font-black hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Uploading..." : "Publish to IPFS"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="card-glass border-orange-500/20 bg-orange-500/5">
                <h4 className="font-bold flex items-center gap-2 mb-2 text-orange-400">
                    <Gavel size={18} />
                    Arbitration Logic
                </h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Once a dispute is raised, the arbitrator will analyze the IPFS-stored evidence. Their decision is final and will automatically adjust user reputation on-chain.
                </p>
                <Link href="#" className="flex items-center gap-1 text-[10px] font-bold text-orange-400 mt-4 hover:underline">
                    View Arbitration Guidelines <ExternalLink size={10} />
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ title, description, icon, variant, disabled = false, onClick }) {
    return (
        <button 
            disabled={disabled}
            onClick={onClick}
            className={`
                group p-5 rounded-2xl border text-left transition-all relative overflow-hidden
                ${disabled ? 'opacity-40 grayscale cursor-not-allowed border-zinc-800 bg-zinc-900/20' : 
                    variant === 'success' ? 'border-zinc-800 hover:border-green-500/30 bg-zinc-900/30 hover:bg-green-500/[0.03]' : 
                    'border-zinc-800 hover:border-red-500/30 bg-zinc-900/30 hover:bg-red-500/[0.03]'
                }
            `}
        >
            <div className="flex items-center gap-3 mb-2">
                {icon}
                <span className={`font-bold text-sm ${disabled ? 'text-zinc-500' : 'text-white'}`}>{title}</span>
            </div>
            <p className="text-xs text-zinc-500 line-clamp-2">{description}</p>
            {!disabled && (
                <div className={`absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${variant === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                    <ArrowLeft size={16} className="rotate-180" />
                </div>
            )}
        </button>
    );
}
