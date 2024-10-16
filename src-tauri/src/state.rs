use rusqlite::Connection;
use std::sync::Mutex;

use tauri::{AppHandle, Manager, State};

pub struct AppState {
    pub db: std::sync::Mutex<Option<Connection>>,
}

pub struct TimeState {
    pub current_time: Mutex<String>,
}

pub trait ServiceAccess {
    fn db<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&Connection) -> TResult;
    // fn db_mut<F, TResult>(&self, operation: F) -> TResult where F: FnOnce(&mut Connection) -> TResult;

    fn get_time<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&String) -> TResult;
    fn update_time<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&mut String) -> TResult;
}

impl ServiceAccess for AppHandle {
    fn db<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&Connection) -> TResult,
    {
        let app_state: State<AppState> = self.state();
        let db_connection_guard = app_state.db.lock().unwrap();
        let db = db_connection_guard.as_ref().unwrap();

        operation(db)
    }

    // fn db_mut<F, TResult>(&self, operation: F) -> TResult where F: FnOnce(&mut Connection) -> TResult {
    //   let app_state: State<AppState> = self.state();
    //   let mut db_connection_guard = app_state.db.lock().unwrap();
    //   let db = db_connection_guard.as_mut().unwrap();

    //   operation(db)
    // }

    fn get_time<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&String) -> TResult,
    {
        let time_state: State<TimeState> = self.state();
        let time_guard = time_state.current_time.lock().unwrap();

        operation(&time_guard)
    }

    fn update_time<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&mut String) -> TResult,
    {
        let time_state: State<TimeState> = self.state();
        let mut time_guard = time_state.current_time.lock().unwrap();

        operation(&mut time_guard)
    }
}
