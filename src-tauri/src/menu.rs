use tauri::{ CustomMenuItem, Menu, Submenu};

// それを返す関数を書く
pub fn get_menu() -> Menu {
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let export = CustomMenuItem::new("export".to_string(), "Export");
    let filemenu = Submenu::new("File", Menu::new().add_item(export).add_item(close));

    let create_tag = CustomMenuItem::new("createTag".to_string(), "Create Tag");
    let edit_tag = CustomMenuItem::new("editTag".to_string(), "Edit Tag");
    let tagsmenu= Submenu::new("Tags", Menu::new().add_item(create_tag).add_item(edit_tag));

    Menu::new()
    .add_submenu(filemenu)
    .add_submenu(tagsmenu)
}