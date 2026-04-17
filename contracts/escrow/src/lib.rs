#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, vec, Address, Env, String, Symbol, Vec};

// Reference to Reputation Contract Client
mod reputation_contract {
    soroban_sdk::contractimport!(
        file = "../reputation/target/wasm32-unknown-unknown/release/reputation.wasm"
    );
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum EscrowStatus {
    Created = 0,
    Funded = 1,
    Delivered = 2,
    Disputed = 3,
    Resolved = 4,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Escrow {
    pub id: u64,
    pub sender: Address,
    pub recipient: Address,
    pub amount: i128,
    pub description: String,
    pub status: EscrowStatus,
    pub evidence_cids: Vec<String>,
}

#[contracttype]
pub enum DataKey {
    Escrow(u64),
    Counter,
    ReputationId,
    Arbitrator,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Initialize with Reputation Contract Address and Arbitrator
    pub fn init(env: Env, reputation_id: Address, arbitrator: Address) {
        env.storage().instance().set(&DataKey::ReputationId, &reputation_id);
        env.storage().instance().set(&DataKey::Arbitrator, &arbitrator);
        env.storage().instance().set(&DataKey::Counter, &0u64);
    }

    /// Create a new escrow
    pub fn create_escrow(env: Env, sender: Address, recipient: Address, amount: i128, description: String) -> u64 {
        sender.require_auth();

        let counter: u64 = env.storage().instance().get(&DataKey::Counter).unwrap_or(0);
        let new_id = counter + 1;

        let escrow = Escrow {
            id: new_id,
            sender: sender.clone(),
            recipient: recipient.clone(),
            amount,
            description,
            status: EscrowStatus::Created,
            evidence_cids: vec![&env],
        };

        env.storage().persistent().set(&DataKey::Escrow(new_id), &escrow);
        env.storage().instance().set(&DataKey::Counter, &new_id);

        env.events().publish(("escrow", "created", new_id), sender);
        new_id
    }

    /// Deposit funds into escrow (simulation for now, usually handles token transfer)
    pub fn deposit(env: Env, id: u64) {
        let mut escrow: Escrow = env.storage().persistent().get(&DataKey::Escrow(id)).expect("escrow not found");
        escrow.sender.require_auth();
        
        if escrow.status != EscrowStatus::Created {
            panic!("escrow already funded or in other state");
        }

        escrow.status = EscrowStatus::Funded;
        env.storage().persistent().set(&DataKey::Escrow(id), &escrow);

        env.events().publish(("escrow", "funded", id), escrow.sender);
    }

    /// Confirm delivery - moves funds to recipient and increases reputation
    pub fn confirm_delivery(env: Env, id: u64) {
        let mut escrow: Escrow = env.storage().persistent().get(&DataKey::Escrow(id)).expect("escrow not found");
        escrow.sender.require_auth();

        if escrow.status != EscrowStatus::Funded {
            panic!("escrow not funded");
        }

        escrow.status = EscrowStatus::Delivered;
        env.storage().persistent().set(&DataKey::Escrow(id), &escrow);

        // Update Reputation
        let rep_id: Address = env.storage().instance().get(&DataKey::ReputationId).unwrap();
        let rep_client = reputation_contract::Client::new(&env, &rep_id);
        rep_client.update_score(&escrow.recipient, &10); // Reward recipient with +10 reputation

        env.events().publish(("escrow", "delivered", id), escrow.recipient);
    }

    /// Raise a dispute
    pub fn raise_dispute(env: Env, id: u64, caller: Address) {
        caller.require_auth();
        let mut escrow: Escrow = env.storage().persistent().get(&DataKey::Escrow(id)).expect("escrow not found");
        
        if caller != escrow.sender && caller != escrow.recipient {
            panic!("unauthorized");
        }

        escrow.status = EscrowStatus::Disputed;
        env.storage().persistent().set(&DataKey::Escrow(id), &escrow);

        env.events().publish(("escrow", "disputed", id), caller);
    }

    /// Submit evidence (IPFS CID)
    pub fn submit_evidence(env: Env, id: u64, caller: Address, cid: String) {
        caller.require_auth();
        let mut escrow: Escrow = env.storage().persistent().get(&DataKey::Escrow(id)).expect("escrow not found");
        
        if caller != escrow.sender && caller != escrow.recipient {
            panic!("unauthorized");
        }

        escrow.evidence_cids.push_back(cid.clone());
        env.storage().persistent().set(&DataKey::Escrow(id), &escrow);

        env.events().publish(("escrow", "evidence", id), (caller, cid));
    }

    /// Resolve dispute (Arbitrator only)
    pub fn resolve_dispute(env: Env, id: u64, winner: Address) {
        let arbitrator: Address = env.storage().instance().get(&DataKey::Arbitrator).expect("arbitrator not set");
        arbitrator.require_auth();

        let mut escrow: Escrow = env.storage().persistent().get(&DataKey::Escrow(id)).expect("escrow not found");
        
        if winner != escrow.sender && winner != escrow.recipient {
            panic!("invalid winner address");
        }

        escrow.status = EscrowStatus::Resolved;
        env.storage().persistent().set(&DataKey::Escrow(id), &escrow);

        // Update Reputation
        let rep_id: Address = env.storage().instance().get(&DataKey::ReputationId).unwrap();
        let rep_client = reputation_contract::Client::new(&env, &rep_id);
        
        if winner == escrow.recipient {
            rep_client.update_score(&escrow.recipient, &15); // Large reward for winning dispute
            rep_client.update_score(&escrow.sender, &-20);  // Penalty for false dispute
        } else {
            rep_client.update_score(&escrow.recipient, &-30); // Heavy penalty for failing to deliver
        }

        env.events().publish(("escrow", "resolved", id), winner);
    }
}
