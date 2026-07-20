#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

const VOTE_A: Symbol = symbol_short!("vote_a");
const VOTE_B: Symbol = symbol_short!("vote_b");

#[contract]
pub struct VotingContract;

#[contractimpl]
impl VotingContract {
    pub fn vote_a(env: Env) -> u32 {
        let count: u32 = env.storage().instance().get(&VOTE_A).unwrap_or(0);
        let new_count = count + 1;
        env.storage().instance().set(&VOTE_A, &new_count);
        new_count
    }

    pub fn vote_b(env: Env) -> u32 {
        let count: u32 = env.storage().instance().get(&VOTE_B).unwrap_or(0);
        let new_count = count + 1;
        env.storage().instance().set(&VOTE_B, &new_count);
        new_count
    }

    pub fn get_votes(env: Env) -> (u32, u32) {
        let votes_a: u32 = env.storage().instance().get(&VOTE_A).unwrap_or(0);
        let votes_b: u32 = env.storage().instance().get(&VOTE_B).unwrap_or(0);
        (votes_a, votes_b)
    }
}

mod test;
