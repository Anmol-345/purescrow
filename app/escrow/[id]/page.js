"use client";

import { use, useState } from 'react';
import { MOCK_ESCROWS } from '@/lib/stellar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EvidenceTimeline } from '@/components/ui/EvidenceTimeline';
import { uploadToIPFS } from '@/lib/ipfs';
import { 
    ArrowLeft, 
    ShieldAlert, 
    CheckCircle2, 
    Upload, 
    MessageSquare,
    ExternalLink,
    Gavel
} from 'lucide-react';
import Link from 'next/link';

export default function EscrowDetail({ params }) {
  const { id } = use(params);
  const escrow = MOCK_ESCROWS.find(e => e.id === id) || MOCK_ESCROWS[0];
  
  const [loading, setLoading] = useState(false);
  const [evidenceMsg, setEvidenceMsg] = useState('');
  
  // Local state for demonstration
  const [currentEvidence, setCurrentEvidence] = useState([
    {
        id: 'e1',
        uploader: 'GC2D...9012',
        timestamp: '2 hours ago',
        cid: 'bafybeigclv...mock1',
        type: 'file'
    }
  ]);

  const handleEvidenceSubmit = async () => {
    if (!evidenceMsg) return;
    setLoading(true);
    
    // Simulate IPFS upload
    const cid = await uploadToIPFS(evidenceMsg);
    
    setTimeout(() => {
        setCurrentEvidence([
            ...currentEvidence,
            {
                id: Math.random().toString(),
                uploader: 'YOU (GARD...)',
                timestamp: 'Just now',
                cid: cid,
                type: 'message'
            }
        ]);
        setEvidenceMsg('');
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      {/* Main Header Card */}
      <div className="card-glass border-l-4 border-accent-red">
        <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <StatusBadge status={escrow.status} />
                    <span className="text-zinc-500 text-xs font-mono">ID: {escrow.id}</span>
                </div>
                <h1 className="text-3xl font-black mb-2">{escrow.description}</h1>
                <p className="text-zinc-400">Recipient: <span className="font-mono text-white">{escrow.recipient}</span></p>
            </div>
            
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center min-w-[200px]">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Escrowed Funds</span>
                <span className="text-3xl font-black text-white">{escrow.amount}</span>
                <div className="mt-2 text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded">
                    SECURED ON STELLAR
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Actions & Info */}
        <div className="lg:col-span-2 space-y-8">
            <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-accent-red" />
                    Available Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ActionButton 
                        title="Confirm Delivery" 
                        description="Verify you received the items/service."
                        icon={<CheckCircle2 className="text-green-500" />}
                        variant="success"
                        disabled={escrow.status !== 'FUNDED'}
                    />
                    <ActionButton 
                        title="Raise Dispute" 
                        description="Escalate this transaction to arbitration."
                        icon={<ShieldAlert className="text-red-500" />}
                        variant="danger"
                        disabled={escrow.status === 'RESOLVED' || escrow.status === 'DISPUTED'}
                    />
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <MessageSquare size={20} className="text-accent-orange" />
                        Evidence Timeline
                    </h3>
                </div>
                <EvidenceTimeline evidence={currentEvidence} />
            </section>
        </div>

        {/* Right Column: Interaction Panel */}
        <div className="space-y-6">
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

function ActionButton({ title, description, icon, variant, disabled = false }) {
    return (
        <button 
            disabled={disabled}
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
