import { invoke } from "@tauri-apps/api/core"
import type { ComboxItem, Dates, Item, Tag } from "./types"

export async function getTags() {
  return (await invoke("get_tags")) as Tag[]
}

export async function getItems() {
  return (await invoke("get_tasks")) as (Item & Dates)[]
}

export async function getTasksByDay(day: string) {
  return (await invoke("get_tasks_by_day", { day })) as (Item & Dates)[]
}

export async function getTasksByWeek(week: string) {
  return (await invoke("get_tasks_by_week", { week })) as (Item & Dates)[]
}

export async function getTasksByDateRange(startDate: string, endDate: string) {
  return (await invoke("get_tasks_by_date_range", {
    startDate,
    endDate,
  })) as (Item & Dates)[]
}

export async function getTop50Items() {
  return (await invoke("get_top_50_tasks")) as ComboxItem[]
}

export async function updateTime() {
  return await invoke("update_time")
}

export async function getTime() {
  return (await invoke("get_time")) as string
}

export async function addTask(task: Item) {
  return await invoke("add_task", { task })
}

export async function updateTask(task: Item) {
  return await invoke("update_task", { task })
}

export async function removeTask(id: string) {
  return await invoke("remove_task", { id })
}

export async function addTag(tag: Tag) {
  return await invoke("add_tag", { tag })
}

export async function updateTag(tag: Tag) {
  return await invoke("update_tag", { tag })
}

export async function removeTag(id: string) {
  return await invoke("remove_tag", { id })
}
