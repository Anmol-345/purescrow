#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map};

#[contracttype]
pub enum DataKey {
    Score(Address),
    Admin,
}

#[contract]
pub struct ReputationContract;

#[contractimpl]
impl ReputationContract {
    /// Initialize the contract with an admin
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Get current score for a user
    pub fn get_score(env: Env, user: Address) -> i32 {
        env.storage().persistent().get(&DataKey::Score(user)).unwrap_or(100) // Default score is 100
    }

    /// Update score (delta can be positive or negative)
    /// Only admin can call this (Escrow contract will be registered as admin or authorized)
    pub fn update_score(env: Env, user: Address, delta: i32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let current_score = Self::get_score(env.clone(), user.clone());
        let new_score = current_score + delta;
        
        // Clamp score between 0 and 1000
        let final_score = if new_score < 0 { 0 } else if new_score > 1000 { 1000 } else { new_score };

        env.storage().persistent().set(&DataKey::Score(user), &final_score);
        
        // Emit event
        env.events().publish(("reputation", "update", user), final_score);
    }
}

mod test;
