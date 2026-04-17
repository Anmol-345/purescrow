import { 
    rpc, 
    Networks, 
} from '@stellar/stellar-sdk';

/**
 * Stellar/Soroban Integration Utility
 */

const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';

export const server = new rpc.Server(RPC_URL);

// Contract IDs (Placeholders - you would deploy and update these)
export const ESCROW_CONTRACT_ID = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID || '';
export const REPUTATION_CONTRACT_ID = process.env.NEXT_PUBLIC_REPUTATION_CONTRACT_ID || '';

/**
 * Mock Data for immediate UI development
 */
export const MOCK_ESCROWS = [
    {
        id: '1',
        sender: 'GARD...1234',
        recipient: 'GBRD...5678',
        amount: '500 XLM',
        description: 'Frontend UI Design Work',
        status: 'FUNDED',
        evidenceCids: [],
        reputationScore: 450,
    },
    {
        id: '2',
        sender: 'GBRD...5678',
        recipient: 'GC2D...9012',
        amount: '1200 XLM',
        description: 'Smart Contract Audit',
        status: 'DISPUTED',
        evidenceCids: ['bafybeig...'],
        reputationScore: 820,
    }
];

export async function getUserReputation(address) {
    // In real implementation, call REPUTATION_CONTRACT.get_score(address)
    return 100 + Math.floor(Math.random() * 900);
}
