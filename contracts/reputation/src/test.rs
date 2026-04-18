#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_reputation() {
    let env = Env::default();
    let contract_id = env.register(ReputationContract, ());
    let client = ReputationContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let initial_arbitrator = Address::generate(&env);
    let user = Address::generate(&env);

    client.init(&admin, &initial_arbitrator);
    
    // Default score
    assert_eq!(client.get_score(&user), 100);

    // Update score
    env.mock_all_auths();
    client.update_score(&user, &50);
    assert_eq!(client.get_score(&user), 150);

    // Clamp test
    client.update_score(&user, &1000);
    assert_eq!(client.get_score(&user), 1000);

    client.update_score(&user, &-2000);
    assert_eq!(client.get_score(&user), 0);
}
