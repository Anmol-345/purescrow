import {
    rpc,
    Networks,
    xdr,
    scValToNative,
    Address,
    Account,
    TransactionBuilder,
    Contract,
    nativeToScVal
} from '@stellar/stellar-sdk';
import { kit } from './wallet';

/**
 * Stellar/Soroban Integration Utility
 */

const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';

export const server = new rpc.Server(RPC_URL);

// Contract IDs with strict fallbacks
export const ESCROW_CONTRACT_ID = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID || 'CDYYU2CNZBXEBOZTOG7LOYRPQ4MEATETKJVKTOBQ5PPBA6X4MEB35GP6';
export const REPUTATION_CONTRACT_ID = process.env.NEXT_PUBLIC_REPUTATION_CONTRACT_ID || 'CAFPMRKE6RX5GUGI5H2UZOKJH3ZXWPKN3NKE26RCQ3DMBDIPKW5LNXCA';

console.log("[Stellar] Interface initialized");
console.log("[Stellar] Escrow Contract:", ESCROW_CONTRACT_ID);
console.log("[Stellar] Reputation Contract:", REPUTATION_CONTRACT_ID);

/**
 * Native to ScVal conversion helper for common types
 */
export const jsToScVal = {
    u64: (value) => nativeToScVal(value, { type: 'u64' }),
    symbol: (value) => xdr.ScVal.scvSymbol(value),
    address: (value) => nativeToScVal(value, { type: 'address' }),
    string: (value) => nativeToScVal(value || "", { type: 'string' }),
    i128: (value) => {
        const bi = BigInt(value);
        const lo = bi & 0xFFFFFFFFFFFFFFFFn;
        const hi = bi >> 64n;
        return xdr.ScVal.scvI128(new xdr.Int128Parts({
            lo: xdr.Uint64.fromString(lo.toString()),
            hi: xdr.Int64.fromString(hi.toString())
        }));
    }
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
 * Generic Read-only Soroban Contract Call (Simulation)
 */
export async function readSmartContract(contractId, method, args = []) {
    try {
        const contract = new Contract(contractId.toString());
        
        // Use a valid G-address for simulations to satisfy SDK validation
        const mockAccount = new Account("GAYBPE4BFMBLGEZRFKMDVZSFRGSOSCKSPOZAVFBU5I22UD54HZOUZK36", "0");
        
        const tx = new TransactionBuilder(mockAccount, {
            fee: "100",
            networkPassphrase: Networks.TESTNET,
        })
        .addOperation(contract.call(method, ...args))
        .setTimeout(30)
        .build();

        const simulation = await server.simulateTransaction(tx);
        console.log(`[Stellar] Simulation for ${method}:`, simulation);
        
        if (rpc.Api.isSimulationError(simulation)) {
            // Specific 404-like behavior: If the contract logic itself isn't found/initialized
            return null;
        }

        if (simulation.result && simulation.result.retval) {
            return scValToJs(simulation.result.retval);
        }
        
        return null;
    } catch (error) {
        console.warn(`[Stellar] Read failed for ${method}:`, error);
        return null;
    }
}

/**
 * Fetches the current sequence/counter from the escrow contract
 */
export async function getCounter() {
    try {
        const result = await readSmartContract(ESCROW_CONTRACT_ID, "get_counter");
        return result !== null ? Number(result) : 0;
    } catch (error) {
        console.error("Error fetching counter:", error);
        return 0;
    }
}

/**
 * Fetches a specific escrow by ID
 */
export async function getEscrow(id) {
    try {
        const native = await readSmartContract(
            ESCROW_CONTRACT_ID, 
            "get_escrow", 
            [jsToScVal.u64(id)]
        );

        if (!native) return null;

        // Map the native object to our UI structure
        return {
            id: native.id.toString(),
            sender: native.sender,
            recipient: native.recipient,
            amount: (Number(native.amount) / 10000000).toLocaleString() + " XLM", 
            description: native.description,
            status: mapStatus(native.status),
            evidenceCids: native.evidence_cids || [],
            createdAt: new Date().toISOString() 
        };
    } catch (error) {
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
    console.log("Fetching network escrows from:", ESCROW_CONTRACT_ID);
    const counter = await getCounter();
    console.log("On-chain escrow counter:", counter);
    if (counter === 0) {
        console.warn("No escrows registered in this contract instance.");
        return [];
    }

    const promises = [];
    for (let i = 1; i <= counter; i++) {
        promises.push(getEscrow(i));
    }

    const results = await Promise.all(promises);
    const filtered = results.filter(e => e !== null).reverse();
    console.log(`Successfully fetched and decoded ${filtered.length} escrows.`);
    return filtered;
}

/**
 * Polls the server until the transaction is confirmed on-chain
 */
async function waitForConfirmation(server, hash, timeoutMs = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const response = await server.getTransaction(hash);
        if (response.status === "SUCCESS") return response;
        if (response.status === "FAILED") throw new Error(`Transaction failed: ${hash}`);
        await new Promise(r => setTimeout(r, 2000));
    }
    throw new Error("Transaction confirmation timeout");
}

/**
 * Generic Soroban Contract Invocation Wrapper
 */
export async function invokeSmartContract(contractId, method, args) {
    try {
        if (!contractId) throw new Error("Contract ID is missing");
        
        const addressData = await kit.getAddress();
        const publicKey = typeof addressData === 'string' ? addressData : addressData?.address;
        
        if (!publicKey) throw new Error("Wallet not connected");

        console.log(`[Stellar] Preparing ${method} for ${publicKey}`);
        
        const contract = new Contract(contractId.toString());
        const accountRes = await server.getAccount(publicKey);
        const sequence = accountRes.sequenceNumber();
        const account = new Account(publicKey, sequence);

        const tx = new TransactionBuilder(account, {
            fee: "5000",
            networkPassphrase: Networks.TESTNET,
        })
        .addOperation(contract.call(method, ...args))
        .setTimeout(60)
        .build();

        console.log(`[Stellar] Simulating ${method}...`);
        const simulation = await server.simulateTransaction(tx);
        if (rpc.Api.isSimulationError(simulation)) {
            throw new Error(`Simulation failed: ${simulation.error}`);
        }

        const assembledTx = rpc.assembleTransaction(tx, simulation).build();
        
        console.log(`[Stellar] Requesting signature...`);
        const { signedTxXdr } = await kit.signTransaction(assembledTx.toXDR(), {
            networkPassphrase: Networks.TESTNET,
        });
        
        console.log(`[Stellar] Reconstructing signed transaction...`);
        const signedTx = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET);
        
        console.log(`[Stellar] Broadcasting...`);
        const response = await server.sendTransaction(signedTx);
        
        if (response.status === "ERROR") {
            throw new Error(`Submission failed: ${JSON.stringify(response.errorResult)}`);
        }
        
        if (response.status === "DUPLICATE") {
            console.warn("Duplicate transaction detected, waiting for existing confirmation...");
        }

        console.log(`[Stellar] Waiting for confirmation (Hash: ${response.hash})...`);
        const result = await waitForConfirmation(server, response.hash);

        console.log(`${method} successful!`);
        return result;
    } catch (error) {
        console.error(`[Stellar] Error in ${method}:`, error);
        throw error;
    }
}

/**
 * Action Wrappers
 */
export async function createEscrow(recipient, amount, description) {
    const rawAmount = BigInt(Math.floor(parseFloat(amount || "0") * 10000000));
    const addressData = await kit.getAddress();
    const publicKey = typeof addressData === 'string' ? addressData : addressData?.address;
    
    if (!publicKey) throw new Error("Wallet not connected");

    return await invokeSmartContract(
        ESCROW_CONTRACT_ID,
        "create_escrow",
        [
            jsToScVal.address(publicKey),
            jsToScVal.address(recipient),
            jsToScVal.i128(rawAmount),
            jsToScVal.string(description || " ")
        ]
    );
}

export async function fundEscrow(id) {
    return await invokeSmartContract(
        ESCROW_CONTRACT_ID,
        "deposit",
        [jsToScVal.u64(id)]
    );
}

export async function confirmEscrowDelivery(id) {
    return await invokeSmartContract(
        ESCROW_CONTRACT_ID,
        "confirm_delivery",
        [jsToScVal.u64(id)]
    );
}

export async function raiseEscrowDispute(id) {
    const addressData = await kit.getAddress();
    const publicKey = typeof addressData === 'string' ? addressData : addressData?.address;
    if (!publicKey) throw new Error("Wallet not connected");

    return await invokeSmartContract(
        ESCROW_CONTRACT_ID,
        "raise_dispute",
        [
            jsToScVal.u64(id), 
            jsToScVal.address(publicKey)
        ]
    );
}

export async function submitEscrowEvidence(id, cid) {
    const addressData = await kit.getAddress();
    const publicKey = typeof addressData === 'string' ? addressData : addressData?.address;
    if (!publicKey) throw new Error("Wallet not connected");

    return await invokeSmartContract(
        ESCROW_CONTRACT_ID,
        "submit_evidence",
        [
            jsToScVal.u64(id), 
            jsToScVal.address(publicKey), 
            jsToScVal.string(cid)
        ]
    );
}

export async function resolveEscrowDispute(id, winnerAddress) {
    const addressData = await kit.getAddress();
    const publicKey = typeof addressData === 'string' ? addressData : addressData?.address;
    if (!publicKey) throw new Error("Wallet not connected");

    return await invokeSmartContract(
        ESCROW_CONTRACT_ID,
        "resolve_dispute",
        [
            jsToScVal.u64(id),
            jsToScVal.address(winnerAddress),
            jsToScVal.address(publicKey)
        ]
    );
}

/**
 * Fetches real reputation score from on-chain
 */
export async function getUserReputation(address) {
    try {
        const score = await readSmartContract(
            REPUTATION_CONTRACT_ID, 
            "get_score", 
            [jsToScVal.address(address)]
        );
        return score !== null ? Number(score) : 100; // Default score
    } catch (error) {
        console.error("Error fetching reputation:", error);
        return 100;
    }
}

/**
 * Fetches user achievements from on-chain
 */
export async function getUserAchievements(address) {
    try {
        const ids = await readSmartContract(
            REPUTATION_CONTRACT_ID, 
            "get_achievements", 
            [jsToScVal.address(address)]
        );
        return ids ? ids.map(id => Number(id)) : [];
    } catch (error) {
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
