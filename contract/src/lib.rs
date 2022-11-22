use std::collections::HashMap;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, log, near_bindgen};
use near_sdk::collections::{UnorderedMap};

type Version = [u8; 2];
const VERSION: Version = [1, 0];

// Define the contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct VaultContract {
    vault: Vault,
    version: Version,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Vault {
    items: UnorderedMap<u16, VaultItem>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct VaultItem {
    pub content: String,
    pub created_at: u64,
    pub updated_at: u64
}

// Define the default, which automatically initializes the contract
impl Default for VaultContract{
    fn default() -> Self{
        let items: UnorderedMap<u16, VaultItem> = UnorderedMap::new(b"".to_vec());
        Self {
            vault: Vault { items },
            version: VERSION,
        }
    }
}

// Implement the contract structure
#[near_bindgen]
impl VaultContract {
    pub fn add_item(&mut self, id: u16, hashed_content: String) {
        let timestamp = env::block_timestamp();
        assert!(self.vault.items.get(&id).is_none(), "KEY ALREADY EXISTS");
        let item_to_add = VaultItem { content: hashed_content, created_at: timestamp, updated_at: timestamp };
        self.vault.items.insert(&id, &item_to_add);
    }

    pub fn update_item(&mut self, id: u16, hashed_content: String) {
        let timestamp = env::block_timestamp();
        let item_option = self.vault.items.get(&id);
        assert!(item_option.is_some(), "ITEM NOT FOUND");
        let mut item_to_update = item_option.unwrap();
        item_to_update.content = hashed_content;
        item_to_update.updated_at = timestamp;
        self.vault.items.insert(&id, &item_to_update);
    }


    pub fn delete_item(&mut self, id: u16) {
        self.vault.items.remove(&id);
    }

    pub fn get_item(&self, id: u16) -> VaultItem {
        self.vault.items.get(&id).unwrap()
    }

    pub fn get_all(&self) -> HashMap<u16, VaultItem> {
        let mut items: HashMap<u16, VaultItem> = HashMap::default();
        for (id, item) in self.vault.items.iter() {
            items.insert(id, item);
        }
        return items;
    }
}