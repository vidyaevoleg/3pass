extern crate core;

use std::fmt::format;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, Balance, env, Gas, near_bindgen, Promise, PromiseError, log};
use near_sdk::collections::{UnorderedMap};

type Version = [u8; 2];
const VERSION: Version = [1, 0];
// TODO calculate the fee and ask users to pay it
const FEE: Balance = 2_000_000_000_000_000_000; // 2 * 10e18yⓃ, 2 NEAR
const DEFAULT_GAS: Gas = Gas(5_000_000_000_000); // 5 * 10e12yⓃ
const DEFAULT_ALLOWANCE: Balance = 250_000_000_000_000_000; // 25 * 10e16yⓃ, 0.25 NEAR
const NO_DEPOSIT: Balance = 0; // 0yⓃ
const VAULT_CODE: &[u8] = include_bytes!("../../vault/target/wasm32-unknown-unknown/release/threepass.wasm");

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct RegistryContract {
    vaults: UnorderedMap<AccountId, AccountId>,
    version: Version
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Vault {
    pub address: AccountId,
    pub version: Version,
    pub created_at: u64,
}

#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
struct VaultContractInitArgs {
    owner: AccountId,
    hash: String
}

// Define the default, which automatically initializes the contract
impl Default for RegistryContract  {
    fn default() -> Self{
        let vaults: UnorderedMap<AccountId, AccountId> = UnorderedMap::new(b"".to_vec());
        Self {
            vaults,
            version: VERSION
        }
    }
}

// Implement the contract structure
#[near_bindgen]
impl RegistryContract {

    #[payable]
    pub fn deploy_vault(&mut self, prefix: String, hash: String) -> Promise {
        let sender = env::predecessor_account_id();

        match self.get_vault(sender.clone()) {
            Some(_) => self.deploy_vault_error(sender, env::attached_deposit(), "vault already exists"),
            None => self.deploy_vault_contract(sender, env::attached_deposit(), prefix, hash)
        }
    }

    pub fn get_vault(&self, account_id: AccountId) -> Option<AccountId> {
        self.vaults.get(&account_id)
    }

    pub fn delete_vault(&mut self) {
        self.vaults.remove(&env::predecessor_account_id());
    }

    fn deploy_vault_contract(&mut self, account_id: AccountId, amount: Balance, prefix: String, hash: String) -> Promise {
        let vault_account_id: AccountId = format!("{}.{}", prefix, env::current_account_id()).parse().unwrap();

        assert!(
            env::is_valid_account_id(vault_account_id.as_bytes()),
            "Invalid vault contract name"
        );

        assert!(
            amount >= FEE,
            "Too low fee"
        );

        let init_args = near_sdk::serde_json::to_vec(&VaultContractInitArgs { hash, owner: account_id.clone() }).unwrap();

        let promise = Promise::new(vault_account_id.clone())
            .create_account()
            .transfer(amount)
            .add_full_access_key(env::signer_account_pk())
            .deploy_contract(VAULT_CODE.to_vec())
            .function_call("new".to_owned(), init_args, NO_DEPOSIT, DEFAULT_GAS);
            // .add_access_key(env::signer_account_pk(), DEFAULT_ALLOWANCE, account_id.clone(),  "add_item,update_item".to_string()  );

        promise.then(
            Self::ext(env::current_account_id()).deploy_vault_contract_callback(
                vault_account_id,
                account_id,
                amount,
            ),
        )
    }

    fn deploy_vault_error(&self, account_id: AccountId, amount: Balance, error: &str) -> Promise {
        log!(format!("error while deploying the vault contract, returning {amount}yⓃ to {account_id}"));
        Promise::new(account_id).transfer(amount);
        env::panic_str(error);
    }

    #[private]
    pub fn deploy_vault_contract_callback(
        &mut self,
        vault_account_id: AccountId,
        account_id: AccountId,
        attached: Balance,
        #[callback_result] deploy_result: Result<(), PromiseError>,
    ) -> bool {
        if let Ok(_result) = deploy_result {
            self.vaults.insert(&account_id, &vault_account_id);
            log!(format!("Vault deployed to {}", vault_account_id));
            return true;
        };

        self.deploy_vault_error(account_id, attached, "error occurred while creating the vault");
        false
    }
}