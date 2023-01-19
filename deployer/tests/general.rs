use near_sdk::serde_json::to_string;
use threepass_deployer::RegistryContract;
use near_sdk::test_utils::VMContextBuilder;
use near_sdk::{testing_env, VMContext};

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use std::fmt::format;
    use near_sdk::AccountId;
    use super::*;

    fn get_context() -> VMContext {
        let account_id = "bob";
        let current_account_id = "3pass";

        VMContextBuilder::new()
            .predecessor_account_id(account_id.parse().unwrap())
            .current_account_id(current_account_id.parse().unwrap())
            .build()
    }

    #[test]
    fn deploy_vault() {
        let context = get_context();
        let prefix = "blabla";
        let current_id = context.current_account_id.clone();
        let account_id = context.predecessor_account_id.clone();
        let expected_account_id_string = format!("{}.{}", prefix.to_string(), current_id.to_string());
        let expected_account_id = AccountId::new_unchecked(expected_account_id_string);
        testing_env!(context);

        let mut contract = RegistryContract::default();
        contract.deploy_vault(prefix.to_string());

        assert_eq!(
            contract.get_vault(account_id).unwrap(),
            expected_account_id
        );
    }
}