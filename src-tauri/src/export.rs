use csv::WriterBuilder;
use std::error::Error;
use std::fs::File;
use std::io::Write;

use crate::structs::Task;

pub fn export_tasks(data: Vec<Task>) -> Result<(), Box<dyn Error>> {
    // home desktop path
    let desktop = std::env::var("USERPROFILE")? + "\\Desktop";

    // タスクデータをCSVに変換
    let file_path = desktop + "\\tasks.csv";
    let mut file = File::create(&file_path)?;

    // BOMを追加
    file.write_all(b"\xEF\xBB\xBF")?;

    let mut wtr = WriterBuilder::new().from_writer(file);

    // CSVのヘッダー行を記述
    wtr.write_record(&[
        "id",
        "week_number",
        "date",
        "title",
        "tags",
        "content",
        "start_time",
        "end_time",
        "interval",
    ])?;

    // 各タスクデータをCSVに書き込む
    for task in data {
        wtr.write_record(&[
            task.id,
            task.week_number.to_string(),
            task.date,
            task.title,
            task.tags.join(", "),
            task.content.clone().unwrap_or_default(),
            task.start_time,
            task.end_time.clone().unwrap_or_default(),
            task.interval.to_string(),
        ])?;
    }

    // バッファをディスクに書き込む
    wtr.flush()?;
    Ok(())
}
