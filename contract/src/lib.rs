use std::collections::HashMap;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, log, near_bindgen};
use near_sdk::collections::{UnorderedMap};

// Define the default message

const VERSION: Version = [1, 0];

type Version = [u8; 2];

// Define the contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
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
    content: String,
    created_at: u64,
    updated_at: u64
}


// Define the default, which automatically initializes the contract
impl Default for Contract{
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
impl Contract {
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

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
#[cfg(test)]
mod tests {
    use near_sdk::serde_json::to_string;
    use super::*;

    #[test]
    fn set_then_get_item() {
        let mut contract = Contract::default();
        let id = 0;
        let content = "content";
        contract.add_item(id,content.to_string());
        assert_eq!(
            contract.get_item(id).content,
            content.to_string()
        );
    }

    #[test]
    fn set_then_update_item() {
        let mut contract = Contract::default();
        let id = 1;
        let content = "content";
        let new_content = "new_content";

        contract.add_item(id, content.to_string());
        contract.update_item(id, new_content.to_string());

        assert_eq!(
            contract.get_item(id).content,
            new_content.to_string()
        );
    }

    #[test]
    fn get_all_vault_items() {
        let mut contract = Contract::default();
        let id = 0;
        let content = "content";

        contract.add_item(id, content.to_string());

        let all = contract.get_all();

        assert_eq!(all.len(), 1);
        assert_eq!(all.get(&id).unwrap().content, content);
    }

    #[test]
    fn delete_vault_items() {
        let mut contract = Contract::default();
        let id = 0;
        let content = "content";
        let all = contract.get_all();

        assert_eq!(all.len(), 0);

        contract.add_item(id, content.to_string());
        let all = contract.get_all();
        assert_eq!(all.len(), 1);
        assert_eq!(all.get(&id).unwrap().content, content);

        contract.delete_item(id);
        let all = contract.get_all();
        assert_eq!(all.len(), 0);
    }

    //
    // #[test]
    // fn set_then_get_number() {
    //     let mut contract = Contract::default();
    //     contract.set_number("123".to_string());
    //     assert_eq!(
    //         contract.get_number(),
    //         123
    //     );
    // }
}
