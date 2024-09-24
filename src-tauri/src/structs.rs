use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Task {
    pub id: String,
    pub week_number: i32,
    pub date: String,
    pub title: String,
    pub tags: Vec<String>,
    pub content: Option<String>,
    pub start_time: String,
    pub end_time: Option<String>,
    pub interval: i32,
}

#[derive(Serialize, Deserialize)]
pub struct Tag {
    pub id: String,
    pub name: String,
    pub color: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Week {
    pub week_number: i32,
    pub year: i32,
    pub tasks: Vec<Task>,
}

#[derive(Serialize, Deserialize)]
pub struct Suggestion {
    pub title: String,
    pub project: String,
    pub tags: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ComboxTask {
    pub id: i32,
    pub title: String,
    pub tags: Vec<String>,
}
