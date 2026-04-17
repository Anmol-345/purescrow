"use client";

import { FileText, Clock, ExternalLink } from 'lucide-react';
import { getIPFSUrl } from '@/lib/ipfs';

export function EvidenceTimeline({ evidence }) {
    if (!evidence || evidence.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-2xl">
                <p className="text-zinc-500">No evidence submitted yet.</p>
            </div>
        );
    }

    return (
        <div className="relative space-y-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
            {evidence.map((item, index) => (
                <div key={item.id} className="relative pl-12 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center z-10">
                        <FileText size={14} className="text-accent-orange" />
                    </div>
                    
                    <div className="card-glass p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-mono text-zinc-500 font-bold tracking-wider">
                                FROM: {item.uploader}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                                <Clock size={12} />
                                {item.timestamp}
                            </div>
                        </div>
                        
                        <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50 mb-3">
                            <p className="text-sm text-zinc-300">
                                {item.type === 'message' ? "Evidence submitted via IPFS" : "File uploaded to IPFS"}
                            </p>
                            <code className="text-[10px] text-accent-red block mt-1 truncate">
                                CID: {item.cid}
                            </code>
                        </div>

                        <a 
                            href={getIPFSUrl(item.cid)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                        >
                            View on IPFS
                            <ExternalLink size={12} />
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}
