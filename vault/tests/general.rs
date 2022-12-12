use near_sdk::serde_json::to_string;
use threepass::VaultContract;

#[test]
fn set_then_get_item() {
    let mut contract = VaultContract::default();
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
    let mut contract = VaultContract::default();
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
    let mut contract = VaultContract::default();
    let id = 0;
    let content = "content";

    contract.add_item(id, content.to_string());

    let all = contract.get_all();

    assert_eq!(all.len(), 1);
    assert_eq!(all.get(&id).unwrap().content, content);
}

#[test]
fn delete_vault_items() {
    let mut contract = VaultContract::default();
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
//     let mut contract = VaultContract::default();
//     contract.set_number("123".to_string());
//     assert_eq!(
//         contract.get_number(),
//         123
//     );
// }
