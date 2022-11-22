extern crate core;

use std::fmt::format;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, Balance, env, Gas, near_bindgen, Promise, PromiseError};
use near_sdk::collections::{UnorderedMap};

type Version = [u8; 2];
const VERSION: Version = [1, 0];
const FEE: Balance = 2_000_000_000_000_000_000_000_000;
const CODE: &[u8] = include_bytes!("../../contract/target/wasm32-unknown-unknown/release/threepass.wasm");

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct RegistryContract {
    items: UnorderedMap<AccountId, AccountId>,
    version: Version
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct RegistryItem {
    items: UnorderedMap<AccountId, Vault>,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Vault {
    pub address: AccountId,
    pub version: Version,
    pub created_at: u64,
}

// Define the default, which automatically initializes the contract
impl Default for RegistryContract  {
    fn default() -> Self{
        let items: UnorderedMap<AccountId, AccountId> = UnorderedMap::new(b"".to_vec());
        Self {
            items,
            version: VERSION
        }
    }
}

// Implement the contract structure
#[near_bindgen]
impl RegistryContract {
    pub fn deploy_vault(&mut self, prefix: String) {
        let sender = env::predecessor_account_id();

        match self.get_vault(sender.clone()) {
            Some(_) => env::panic_str("contract already deployed"),
            None => self.create_vault(&sender, prefix)
        }
    }

    pub fn get_vault(&self, account_id: AccountId) -> Option<AccountId> {
        self.items.get(&account_id)
    }

    pub fn delete_vault(&mut self) {
        self.items.remove(&env::predecessor_account_id());
    }

    fn create_vault(&mut self, account_id: &AccountId, prefix: String) {
        let vault_account_id = self.deploy_vault_contract(prefix);
        self.items.insert(&account_id, &vault_account_id);
        dbg!(&self.items);
    }

    fn deploy_vault_contract(&mut self, prefix: String) -> AccountId {
        let vault_account_name = format!("{}.{}", prefix, env::current_account_id().to_string());
        let vault_account_id = AccountId::new_unchecked(vault_account_name);

        Promise::new(vault_account_id.clone())
            .create_account()
            // TODO calculate the fee and ask users to pay it
            .transfer(FEE)
            .add_full_access_key(env::signer_account_pk())
            .deploy_contract(CODE.to_vec());

        vault_account_id
    }
}