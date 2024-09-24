// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod database;
mod export;
mod menu;
mod state;
mod structs;

use export::export_tasks;
use menu::get_menu;
use state::{AppState, ServiceAccess, TimeState};
use structs::{Tag, Task};
use tauri::{AppHandle, Manager, State};

// Time management
#[tauri::command]
fn get_time(app_handle: AppHandle) -> String {
    app_handle.get_time(|time| time.clone())
}

#[tauri::command]
fn update_time(app_handle: AppHandle) -> String {
    app_handle.update_time(|time| {
        *time = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
        time.clone()
    })
}

// Database management
#[tauri::command]
fn get_tasks(app_handle: AppHandle) -> Vec<structs::Task> {
    app_handle.db(|db| database::get_all(db)).unwrap()
}

#[tauri::command]
fn get_tasks_by_day(app_handle: AppHandle, day: &str) -> Vec<structs::Task> {
    app_handle
        .db(|db| database::get_tasks_by_day(day, db))
        .unwrap()
}

#[tauri::command]
fn get_top_50_tasks(app_handle: AppHandle) -> Vec<structs::ComboxTask> {
    app_handle.db(|db| database::get_top_50(db)).unwrap()
}

#[tauri::command]
fn add_task(app_handle: AppHandle, task: Task) {
    app_handle.db(|db| database::add_task(&task, db)).unwrap();
}

#[tauri::command]
fn update_task(app_handle: AppHandle, task: Task) {
    app_handle
        .db(|db| database::update_task(&task, db))
        .unwrap();
}

#[tauri::command]
fn remove_task(app_handle: AppHandle, id: &str) {
    app_handle.db(|db| database::remove_task(&id, db)).unwrap();
}
#[tauri::command]
fn get_tags(app_handle: AppHandle) -> Vec<Tag> {
    return app_handle.db(|db| database::get_tags(db)).unwrap();
}

#[tauri::command]
fn add_tag(app_handle: AppHandle, tag: Tag) {
    app_handle.db(|db| database::add_tag(&tag, db)).unwrap();
}

#[tauri::command]
fn remove_tag(app_handle: AppHandle, id: &str) {
    app_handle.db(|db| database::remove_tag(&id, db)).unwrap();
}

#[tauri::command]
fn update_tag(app_handle: AppHandle, tag: Tag) {
    app_handle.db(|db| database::update_tag(&tag, db)).unwrap();
}

fn main() {
    let menus = get_menu();

    tauri::Builder::default()
        .manage(AppState {
            db: Default::default(),
        })
        .manage(TimeState {
            current_time: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            get_time,
            update_time,
            get_tasks,
            add_task,
            update_task,
            remove_task,
            get_tags,
            add_tag,
            remove_tag,
            update_tag,
            get_top_50_tasks,
            get_tasks_by_day
        ])
        .menu(menus)
        .on_menu_event(|event| match event.menu_item_id() {
            "export" => {
                let app_handle = event.window().app_handle();
                let data = match app_handle.db(|db| database::get_all(db)) {
                    Ok(data) => data,
                    Err(e) => {
                        eprintln!("Error while fetching data: {}", e);
                        return;
                    }
                };
                if let Err(e) = export_tasks(data) {
                    eprintln!("Error while exporting tasks: {}", e);
                }
                let window = event.window();
                let message_payload = "Export Desktop tasks.csv".to_string();
                window.emit("export", message_payload).unwrap();
            }
            "close" => {
                let window = event.window();
                window.close().unwrap();
            }
            "createTag" => {
                let window = event.window();
                let message_payload = "Create Tag".to_string();
                window.emit("createTag", message_payload).unwrap();
            }
            "editTag" => {
                let window = event.window();
                let message_payload = "Edit Tag".to_string();
                window.emit("editTag", message_payload).unwrap();
            }

            _ => {}
        })
        .setup(|app| {
            let handle = app.handle();
            let app_state: State<AppState> = handle.state();
            let db =
                database::initialize_database(&handle).expect("Database initialize should succeed");
            *app_state.db.lock().unwrap() = Some(db);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
