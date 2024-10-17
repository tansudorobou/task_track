use rusqlite::{named_params, Connection};
use std::fs;
use tauri::{AppHandle, Manager};

use crate::structs::{ComboxTask, Tag, Task};

const CURRENT_DB_VERSION: u32 = 1;

/// Initializes the database connection, creating the .sqlite file if needed, and upgrading the database
/// if it's out of date.
pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir: std::path::PathBuf = app_handle
        .path()
        .app_data_dir()
        .expect("The app data directory should exist.");

    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("TaskTrack.sqlite");

    let mut db = Connection::open(sqlite_path)?;

    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let existing_user_version: u32 = user_pragma.query_row([], |row| Ok(row.get(0)?))?;
    drop(user_pragma);

    upgrade_database_if_needed(&mut db, existing_user_version)?;

    Ok(db)
}

/// Upgrades the database to the current version.
pub fn upgrade_database_if_needed(
    db: &mut Connection,
    existing_version: u32,
) -> Result<(), rusqlite::Error> {
    if existing_version < CURRENT_DB_VERSION {
        db.pragma_update(None, "journal_mode", "WAL")?;

        let tx = db.transaction()?;

        tx.pragma_update(None, "user_version", CURRENT_DB_VERSION)?;

        tx.execute_batch(
            "
      CREATE TABLE tasks (
        id TEXT PRIMARY KEY,
        week_number INTEGER NOT NULL,
        date TEXT NOT NULL,
        title TEXT,
        tags TEXT,
        content TEXT,
        start_time TEXT NOT NULL,
        end_time TEXT,
        interval INTEGER
      );",
        )?;

        tx.execute_batch(
            "
      CREATE INDEX idx_date ON tasks (date);
      ",
        )?;

        tx.execute_batch(
            "
          CREATE TABLE tags (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            color TEXT
            );",
        )?;

        tx.commit()?;
    }

    Ok(())
}

pub fn add_task(task: &Task, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare(
        "
    INSERT INTO tasks (
      id,
      week_number,
      date,
      title,
      tags,
      content,
      start_time,
      end_time,
      interval
    ) VALUES (
      :id,
      :week_number,
      :date,
      :title,
      :tags,
      :content,
      :start_time,
      :end_time,
      :interval
    )
  ",
    )?;

    statement.execute(named_params! {
      ":id": &task.id,
      ":week_number": task.week_number,
      ":date": &task.date,
      ":title": &task.title,
      ":tags": &task.tags.join(","),
      ":content": &task.content,
      ":start_time": &task.start_time,
      ":end_time": &task.end_time,
      ":interval": task.interval,
    })?;

    Ok(())
}

pub fn get_all(db: &Connection) -> Result<Vec<Task>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM tasks")?;
    let mut rows = statement.query([])?;
    let mut tasks = Vec::new();
    while let Some(row) = rows.next()? {
        let task = Task {
            id: row.get::<_, String>("id")?,
            week_number: row.get::<_, i32>("week_number")?,
            date: row.get::<_, String>("date")?,
            title: row.get::<_, String>("title")?,
            tags: row
                .get::<_, String>("tags")?
                .split(",")
                .map(|s| s.to_string())
                .collect(),
            content: row.get::<_, Option<String>>("content")?,
            start_time: row.get::<_, String>("start_time")?,
            end_time: row.get::<_, Option<String>>("end_time")?,
            interval: row.get::<_, i32>("interval")?,
        };
        tasks.push(task);
    }
    Ok(tasks)
}

pub fn get_top_50(db: &Connection) -> Result<Vec<ComboxTask>, rusqlite::Error> {
    let mut statement =
        db.prepare("SELECT DISTINCT title, tags FROM tasks WHERE title != '' LIMIT 50")?;
    let mut rows = statement.query([])?;
    let mut tasks = Vec::new();
    let mut index = 1;
    while let Some(row) = rows.next()? {
        let task = ComboxTask {
            id: index,
            title: row.get::<_, String>("title")?,
            tags: row
                .get::<_, String>("tags")?
                .split(",")
                .map(|s| s.to_string())
                .collect(),
        };
        tasks.push(task);
        index += 1
    }
    Ok(tasks)
}

pub fn get_tasks_by_day(day: &str, db: &Connection) -> Result<Vec<Task>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM tasks WHERE date = :date")?;
    let mut rows = statement.query(named_params! {
      ":date": day,
    })?;
    let mut tasks = Vec::new();
    while let Some(row) = rows.next()? {
        let task = Task {
            id: row.get::<_, String>("id")?,
            week_number: row.get::<_, i32>("week_number")?,
            date: row.get::<_, String>("date")?,
            title: row.get::<_, String>("title")?,
            tags: row
                .get::<_, String>("tags")?
                .split(",")
                .map(|s| s.to_string())
                .collect(),
            content: row.get::<_, Option<String>>("content")?,
            start_time: row.get::<_, String>("start_time")?,
            end_time: row.get::<_, Option<String>>("end_time")?,
            interval: row.get::<_, i32>("interval")?,
        };
        tasks.push(task);
    }

    Ok(tasks)
}

pub fn get_tasks_by_date_range(
    start_date: &str,
    end_date: &str,
    db: &Connection,
) -> Result<Vec<Task>, rusqlite::Error> {
    let mut statement =
        db.prepare("SELECT * FROM tasks WHERE date BETWEEN :start_date AND :end_date")?;
    let mut rows = statement.query(named_params! {
      ":start_date": start_date,
      ":end_date": end_date,
    })?;
    let mut tasks = Vec::new();
    while let Some(row) = rows.next()? {
        let task = Task {
            id: row.get::<_, String>("id")?,
            week_number: row.get::<_, i32>("week_number")?,
            date: row.get::<_, String>("date")?,
            title: row.get::<_, String>("title")?,
            tags: row
                .get::<_, String>("tags")?
                .split(",")
                .map(|s| s.to_string())
                .collect(),
            content: row.get::<_, Option<String>>("content")?,
            start_time: row.get::<_, String>("start_time")?,
            end_time: row.get::<_, Option<String>>("end_time")?,
            interval: row.get::<_, i32>("interval")?,
        };
        tasks.push(task);
    }

    Ok(tasks)
}

pub fn remove_task(id: &str, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("DELETE FROM tasks WHERE id = :id")?;
    statement.execute(named_params! {
      ":id": id,
    })?;

    Ok(())
}

pub fn update_task(task: &Task, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare(
        "
    UPDATE tasks SET
      week_number = :week_number,
      date = :date,
      title = :title,
      tags = :tags,
      content = :content,
      start_time = :start_time,
      end_time = :end_time,
      interval = :interval
    WHERE id = :id
  ",
    )?;

    statement.execute(named_params! {
      ":id": &task.id,
      ":week_number": task.week_number,
      ":date": &task.date,
      ":title": &task.title,
      ":tags": &task.tags.join(","),
      ":content": &task.content,
      ":start_time": &task.start_time,
      ":end_time": &task.end_time,
      ":interval": task.interval,
    })?;

    Ok(())
}

pub fn get_tags(db: &Connection) -> Result<Vec<Tag>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT id, name, color FROM tags")?;
    let mut rows = statement.query([])?;
    let mut tags = Vec::new();

    while let Some(row) = rows.next()? {
        let tag = Tag {
            id: row.get::<_, String>("id")?,
            name: row.get::<_, String>("name")?,
            color: row.get::<_, Option<String>>("color")?,
        };
        tags.push(tag);
    }

    Ok(tags)
}

pub fn add_tag(tag: &Tag, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare(
        "
    INSERT INTO tags (
      id,
      name,
      color
    ) VALUES (
      :id,
      :name,
      :color
    )
  ",
    )?;

    statement.execute(named_params! {
      ":id": tag.id,
      ":name": tag.name,
      ":color": tag.color,
    })?;

    Ok(())
}

pub fn remove_tag(id: &str, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("DELETE FROM tags WHERE id = :id")?;
    statement.execute(named_params! {
      ":id": id,
    })?;

    Ok(())
}

pub fn update_tag(tag: &Tag, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare(
        "
    UPDATE tags SET
      name = :name,
      color = :color
    WHERE id = :id
  ",
    )?;

    statement.execute(named_params! {
      ":id": tag.id,
      ":name": tag.name,
      ":color": tag.color,
    })?;

    Ok(())
}
