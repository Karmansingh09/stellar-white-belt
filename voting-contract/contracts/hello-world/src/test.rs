#![cfg(test)]

use super::*;
use soroban_sdk::Env;

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register(VotingContract, ());
    let client = VotingContractClient::new(&env, &contract_id);

    assert_eq!(client.get_votes(), (0, 0));

    assert_eq!(client.vote_a(), 1);
    assert_eq!(client.get_votes(), (1, 0));

    assert_eq!(client.vote_b(), 1);
    assert_eq!(client.vote_b(), 2);
    assert_eq!(client.get_votes(), (1, 2));
}
