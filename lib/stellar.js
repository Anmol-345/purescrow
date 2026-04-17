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
        createdAt: '2024-03-15T10:00:00Z'
    },
    {
        id: '2',
        sender: 'GBRD...5678',
        recipient: 'GC2D...9012',
        amount: '1,200 XLM',
        description: 'Smart Contract Audit',
        status: 'DISPUTED',
        evidenceCids: ['bafybeig...'],
        reputationScore: 820,
        createdAt: '2024-03-14T14:30:00Z'
    },
    {
        id: '3',
        sender: 'GDUK...8890',
        recipient: 'GA7R...2231',
        amount: '250 XLM',
        description: 'Logo Animation Package',
        status: 'COMPLETED',
        evidenceCids: [],
        reputationScore: 125,
        createdAt: '2024-03-16T09:15:00Z'
    },
    {
        id: '4',
        sender: 'GC4S...7761',
        recipient: 'GDYI...0098',
        amount: '4,500 XLM',
        description: 'Content Marketing Strategy Q2',
        status: 'FUNDED',
        evidenceCids: [],
        reputationScore: 910,
        createdAt: '2024-03-17T11:45:00Z'
    },
    {
        id: '5',
        sender: 'GBNM...4432',
        recipient: 'GCXW...9901',
        amount: '800 XLM',
        description: 'Vector Illustration Set',
        status: 'DISPUTED',
        evidenceCids: ['bafybeih...'],
        reputationScore: 340,
        createdAt: '2024-03-12T16:20:00Z'
    },
    {
        id: '6',
        sender: 'GDSA...1122',
        recipient: 'GADQ...6655',
        amount: '150 XLM',
        description: 'Translation Services (EN -> ES)',
        status: 'RESOLVED',
        evidenceCids: [],
        reputationScore: 560,
        createdAt: '2024-03-10T13:10:00Z'
    }
];

export async function getUserReputation(address) {
    // In real implementation, call REPUTATION_CONTRACT.get_score(address)
    return 100 + Math.floor(Math.random() * 900);
}
