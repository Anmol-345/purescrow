#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec, vec};

#[contracttype]
pub enum Achievement {
    FirstDeal = 1,
    TrustedTrader = 2,
    DisputeWinner = 3,
    Arbitrator = 4,
    EliteStatus = 5,
}

#[contracttype]
pub enum DataKey {
    Score(Address),
    Achievements(Address),
    DealCount(Address),
    Admin,
}

#[contract]
pub struct ReputationContract;

#[contractimpl]
impl ReputationContract {
    /// Initialize the contract with an admin and initial arbitrator
    pub fn init(env: Env, admin: Address, initial_arbitrator: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        
        // Set initial arbitrator's score
        env.storage().persistent().set(&DataKey::Score(initial_arbitrator), &160);
    }

    /// Get current score for a user
    pub fn get_score(env: Env, user: Address) -> i32 {
        env.storage().persistent().get(&DataKey::Score(user)).unwrap_or(100)
    }

    /// Get user achievements
    pub fn get_achievements(env: Env, user: Address) -> Vec<u32> {
        env.storage().persistent().get(&DataKey::Achievements(user)).unwrap_or(vec![&env])
    }

    /// Internal: Award an achievement
    fn award_achievement(env: &Env, user: Address, id: Achievement) {
        let mut achievements = Self::get_achievements(env.clone(), user.clone());
        let id_val = id as u32;
        
        if !achievements.contains(id_val) {
            achievements.push_back(id_val);
            env.storage().persistent().set(&DataKey::Achievements(user.clone()), &achievements);
            env.events().publish(("achievement_awarded", user), id_val);
        }
    }

    /// Record a successful deal (Called by Escrow)
    pub fn record_deal(env: Env, user: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let count: u32 = env.storage().persistent().get(&DataKey::DealCount(user.clone())).unwrap_or(0);
        let new_count = count + 1;
        env.storage().persistent().set(&DataKey::DealCount(user.clone()), &new_count);

        if new_count == 1 {
            Self::award_achievement(&env, user.clone(), Achievement::FirstDeal);
        }
        if new_count >= 5 {
            Self::award_achievement(&env, user.clone(), Achievement::TrustedTrader);
        }
    }

    /// Record a dispute win (Called by Escrow)
    pub fn record_dispute_winner(env: Env, user: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        Self::award_achievement(&env, user.clone(), Achievement::DisputeWinner);
    }

    /// Record an arbitration (Called by Escrow)
    pub fn record_arbitration(env: Env, user: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        Self::award_achievement(&env, user.clone(), Achievement::Arbitrator);
    }

    /// Update score and check for Elite Status
    pub fn update_score(env: Env, user: Address, delta: i32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let current_score = Self::get_score(env.clone(), user.clone());
        let new_score = current_score + delta;
        let final_score = if new_score < 0 { 0 } else if new_score > 1000 { 1000 } else { new_score };

        env.storage().persistent().set(&DataKey::Score(user.clone()), &final_score);

        if final_score >= 500 {
            Self::award_achievement(&env, user.clone(), Achievement::EliteStatus);
        }

        env.events().publish(("reputation", "update", user), final_score);
    }
}

mod test;
