import {
    rpc,
    Networks,
    xdr,
    scValToNative,
    Address
} from '@stellar/stellar-sdk';

/**
 * Stellar/Soroban Integration Utility
 */

const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';

export const server = new rpc.Server(RPC_URL);

// Contract IDs
export const ESCROW_CONTRACT_ID = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID || 'CDYYU2CNZBXEBOZTOG7LOYRPQ4MEATETKJVKTOBQ5PPBA6X4MEB35GP6';
export const REPUTATION_CONTRACT_ID = process.env.NEXT_PUBLIC_REPUTATION_CONTRACT_ID || 'CAFPMRKE6RX5GUGI5H2UZOKJH3ZXWPKN3NKE26RCQ3DMBDIPKW5LNXCA';

/**
 * Native to ScVal conversion helper for common types
 */
export const jsToScVal = {
    u64: (value) => xdr.ScVal.scvU64(xdr.Uint64.fromString(value.toString())),
    symbol: (value) => xdr.ScVal.scvSymbol(value),
    address: (value) => new Address(value).toScVal(),
    string: (value) => xdr.ScVal.scvString(value),
};

/**
 * Robust ScVal to Native conversion that handles environmental quirks
 */
export function scValToJs(val) {
    if (!val) return null;
    
    // Check if it's a LedgerEntryValue (common in some RPC responses)
    if (typeof val.contractData === 'function') {
        return scValToJs(val.contractData().val());
    }
    
    // Check if it's an entry with a val property (GetContractDataResponse style)
    if (val.val && typeof val.val.switch === 'function') {
        return scValToJs(val.val);
    }

    try {
        // Try the standard SDK converter first
        return scValToNative(val);
    } catch (e) {
        let type = "unknown";
        try {
            type = val.switch().name;
        } catch (inner) {
            console.error("Failed to get type from val:", val);
        }
        
        console.warn(`scValToNative failed for type "${type}", using robust decoder:`, e.message);
        
        switch (type) {
            case 'scvI32':
                return val.i32();
            case 'scvU32':
                return val.u32();
            case 'scvI64':
                return BigInt(val.i64().toString());
            case 'scvU64':
                return BigInt(val.u64().toString());
            case 'scvI128': {
                const parts = val.i128();
                const lo = BigInt(parts.lo().toString());
                const hi = BigInt(parts.hi().toString());
                return (hi << 64n) | lo;
            }
            case 'scvU128': {
                const parts = val.u128();
                const lo = BigInt(parts.lo().toString());
                const hi = BigInt(parts.hi().toString());
                return (hi << 64n) | lo;
            }
            case 'scvSymbol':
                return val.sym().toString();
            case 'scvString':
                return val.str().toString();
            case 'scvAddress':
                return Address.fromScVal(val).toString();
            case 'scvVec':
                return val.vec().map(v => scValToJs(v));
            case 'scvBool':
                return val.b();
            default:
                console.error("Unhandleable ScVal type in robust decoder:", type);
                throw e;
        }
    }
}

/**
 * Fetches the current sequence/counter from the escrow contract
 */
export async function getCounter() {
    try {
        const key = jsToScVal.symbol("Counter");
        const response = await server.getContractData(
            ESCROW_CONTRACT_ID,
            key
        );
        return response ? scValToJs(response.val) : 0;
    } catch (error) {
        if (error.code === 404 || (error.response && error.response.status === 404)) {
            console.log("Counter not initialized on-chain, using 0.");
            return 0;
        }
        console.error("Error fetching counter:", error);
        return 0;
    }
}

/**
 * Fetches a specific escrow by ID
 */
export async function getEscrow(id) {
    try {
        const key = xdr.ScVal.scvVec([
            jsToScVal.symbol("Escrow"),
            jsToScVal.u64(id)
        ]);

        const response = await server.getContractData(
            ESCROW_CONTRACT_ID,
            key
        );

        if (!response) return null;

        const native = scValToJs(response.val);

        // Map the native object to our UI structure
        return {
            id: native.id.toString(),
            sender: native.sender,
            recipient: native.recipient,
            amount: (Number(native.amount) / 10000000).toLocaleString() + " XLM", // Assuming 7 decimals
            description: native.description,
            status: mapStatus(native.status),
            evidenceCids: native.evidence_cids || [],
            createdAt: new Date().toISOString() // Blockchain doesn't store this in our struct, could fetch from ledger
        };
    } catch (error) {
        if (error.code === 404 || (error.response && error.response.status === 404)) {
            return null;
        }
        console.error(`Error fetching escrow ${id}:`, error);
        return null;
    }
}

function mapStatus(status) {
    const statuses = ["CREATED", "FUNDED", "DELIVERED", "DISPUTED", "RESOLVED"];
    return statuses[status] || "UNKNOWN";
}

/**
 * Fetches all active escrows into a single list
 */
export async function fetchAllEscrows() {
    const counter = await getCounter();
    if (counter === 0) return [];

    const promises = [];
    for (let i = 1; i <= counter; i++) {
        promises.push(getEscrow(i));
    }

    const results = await Promise.all(promises);
    return results.filter(e => e !== null).reverse(); // Newest first
}

/**
 * Fetches real reputation score from on-chain
 */
export async function getUserReputation(address) {
    try {
        const key = xdr.ScVal.scvVec([
            jsToScVal.symbol("Score"),
            jsToScVal.address(address)
        ]);

        const response = await server.getContractData(
            REPUTATION_CONTRACT_ID,
            key
        );

        return response ? Number(scValToJs(response.val)) : 100; // Default score
    } catch (error) {
        if (error.code === 404 || (error.response && error.response.status === 404)) {
            console.log("Reputation not set on-chain, using default: 100");
            return 100;
        }
        console.error("Error fetching reputation:", error);
        return 100;
    }
}

/**
 * Fetches user achievements from on-chain
 */
export async function getUserAchievements(address) {
    try {
        const key = xdr.ScVal.scvVec([
            jsToScVal.symbol("Achievements"),
            jsToScVal.address(address)
        ]);

        const response = await server.getContractData(
            REPUTATION_CONTRACT_ID,
            key
        );

        const ids = response ? scValToJs(response.val) : [];
        return ids.map(id => Number(id));
    } catch (error) {
        if (error.code === 404 || (error.response && error.response.status === 404)) {
            return [];
        }
        console.error("Error fetching achievements:", error);
        return [];
    }
}

/**
 * Metadata mapping for achievement IDs
 */
export const ACHIEVEMENT_META = {
    1: { title: "First Deal", desc: "Completed first secure transaction", icon: "⚡" },
    2: { title: "Trusted Trader", desc: "5+ successful deals completed", icon: "🤝" },
    3: { title: "Dispute Winner", desc: "Won a contract dispute", icon: "⚖️" },
    4: { title: "Master Arbitrator", desc: "Resolved network disputes", icon: "🛡️" },
    5: { title: "Elite Status", desc: "Reputation score over 500", icon: "🔥" }
};
