#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, contractevent, vec, Address, Env, String, Vec, IntoVal};

// Removed contractimport to resolve environment-specific build issues
// Using low-level invoke_contract for cross-contract calls

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

#[contractevent]
pub struct EscrowCreatedEvent {
    pub id: u64,
    pub sender: Address,
}

#[contractevent]
pub struct EscrowFundedEvent {
    pub id: u64,
    pub sender: Address,
}

#[contractevent]
pub struct EscrowDeliveredEvent {
    pub id: u64,
    pub recipient: Address,
}

#[contractevent]
pub struct EscrowDisputedEvent {
    pub id: u64,
    pub caller: Address,
}

#[contractevent]
pub struct EscrowEvidenceEvent {
    pub id: u64,
    pub caller: Address,
    pub cid: String,
}

#[contractevent]
pub struct EscrowResolvedEvent {
    pub id: u64,
    pub winner: Address,
}

#[contracttype]
pub enum DataKey {
    Escrow(u64),
    Counter,
    ReputationId,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Initialize with Reputation Contract Address
    pub fn init(env: Env, reputation_id: Address) {
        env.storage().instance().set(&DataKey::ReputationId, &reputation_id);
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

        EscrowCreatedEvent { id: new_id, sender }.publish(&env);
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

        EscrowFundedEvent { id, sender: escrow.sender }.publish(&env);
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

        // Update Reputation via low-level call
        let rep_id: Address = env.storage().instance().get(&DataKey::ReputationId).unwrap();
        env.invoke_contract::<()>(
            &rep_id,
            &soroban_sdk::Symbol::new(&env, "record_deal"),
            vec![&env, escrow.recipient.clone().into_val(&env)],
        );

        EscrowDeliveredEvent { id, recipient: escrow.recipient }.publish(&env);
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

        EscrowDisputedEvent { id, caller }.publish(&env);
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

        EscrowEvidenceEvent { id, caller, cid }.publish(&env);
    }

    /// Resolve dispute (Arbitrator only - requires score >= 150)
    pub fn resolve_dispute(env: Env, id: u64, winner: Address, arbitrator: Address) {
        arbitrator.require_auth();

        // Call Reputation Contract to get score
        let rep_id: Address = env.storage().instance().get(&DataKey::ReputationId).unwrap();
        let score: i32 = env.invoke_contract::<i32>(
            &rep_id,
            &soroban_sdk::Symbol::new(&env, "get_score"),
            vec![&env, arbitrator.clone().into_val(&env)],
        );

        if score < 150 {
            panic!("threshold not met: reputation score must be >= 150 to be an arbitrator");
        }

        let mut escrow: Escrow = env.storage().persistent().get(&DataKey::Escrow(id)).expect("escrow not found");
        
        if winner != escrow.sender && winner != escrow.recipient {
            panic!("invalid winner address");
        }

        escrow.status = EscrowStatus::Resolved;
        env.storage().persistent().set(&DataKey::Escrow(id), &escrow);

        // Record Arbitration for the arbitrator
        env.invoke_contract::<()>(
            &rep_id,
            &soroban_sdk::Symbol::new(&env, "record_arbitration"),
            vec![&env, arbitrator.into_val(&env)],
        );

        if winner == escrow.recipient {
            env.invoke_contract::<()>(
                &rep_id,
                &soroban_sdk::Symbol::new(&env, "record_dispute_winner"),
                vec![&env, escrow.recipient.clone().into_val(&env)],
            );
            env.invoke_contract::<()>(
                &rep_id,
                &soroban_sdk::Symbol::new(&env, "record_deal"),
                vec![&env, escrow.recipient.clone().into_val(&env)],
            );
            env.invoke_contract::<()>(
                &rep_id,
                &soroban_sdk::Symbol::new(&env, "update_score"),
                vec![&env, escrow.sender.clone().into_val(&env), (-20i32).into_val(&env)],
            );
        } else {
            env.invoke_contract::<()>(
                &rep_id,
                &soroban_sdk::Symbol::new(&env, "record_dispute_winner"),
                vec![&env, escrow.sender.clone().into_val(&env)],
            );
            env.invoke_contract::<()>(
                &rep_id,
                &soroban_sdk::Symbol::new(&env, "update_score"),
                vec![&env, escrow.recipient.clone().into_val(&env), (-30i32).into_val(&env)],
            );
        }

        EscrowResolvedEvent { id, winner }.publish(&env);
    }

    /// Getter: Get counter value
    pub fn get_counter(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::Counter).unwrap_or(0)
    }

    /// Getter: Get escrow details by ID
    pub fn get_escrow(env: Env, id: u64) -> Option<Escrow> {
        env.storage().persistent().get(&DataKey::Escrow(id))
    }
}
