use threepass::VaultContract;

use near_sdk::serde_json::to_string;
use std::fmt::format;
use near_sdk::{AccountId, Balance, Promise, testing_env, VMContext};
use near_sdk::test_utils::VMContextBuilder;

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {

    use super::*;

    const DEFAULT_SENDER: &str = "bob";

    fn get_context(sender: Option<&str>) -> VMContext {
        let account_id = sender.unwrap_or(DEFAULT_SENDER);
        let current_account_id = "3pass";
        let amount: Balance = 2_000_000_000_000_000_000_000_000;

        VMContextBuilder::new()
            .predecessor_account_id(account_id.parse().unwrap())
            // .current_account_id(current_account_id.parse().unwrap())
            // .attached_deposit(amount)
            .build()
    }

    #[test]
    fn set_then_get_item() {
        // Arrange
        testing_env!(get_context(None));
        let mut contract = VaultContract::new(DEFAULT_SENDER.parse().unwrap());
        let id = 0;
        let content = "content";

        // Act
        contract.add_item(id, content.to_string());

        // Assert
        assert_eq!(
            contract.get_item(id).content,
            content.to_string()
        );
    }

    #[test]
    fn set_then_update_item() {
        // Arrange
        testing_env!(get_context(None));
        let mut contract = VaultContract::new(DEFAULT_SENDER.parse().unwrap());
        let id = 1;
        let content = "content";
        let new_content = "new_content";
        contract.add_item(id, content.to_string());

        // Act
        contract.update_item(id, new_content.to_string());

        // Assert
        assert_eq!(
            contract.get_item(id).content,
            new_content.to_string()
        );
    }

    #[test]
    fn get_all_vault_items() {
        // Arrange
        testing_env!(get_context(None));
        let mut contract = VaultContract::new(DEFAULT_SENDER.parse().unwrap());
        let id = 0;
        let content = "content";
        contract.add_item(id, content.to_string());

        // Assert
        assert_eq!(contract.get_all().len(), 1);
        assert_eq!(contract.get_all().get(&id).unwrap().content, content);
    }

    #[test]
    fn delete_vault_items() {
        // Arrange
        testing_env!(get_context(None));
        let mut contract = VaultContract::new(DEFAULT_SENDER.parse().unwrap());
        let id = 0;
        let content = "content";
        contract.add_item(id, content.to_string());

        // Act
        contract.delete_item(id);

        // Assert
        let all = contract.get_all();
        assert_eq!(all.len(), 0);
    }
}

