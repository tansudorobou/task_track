import type { CalendarDate } from "@internationalized/date"
import { getWeek, parse } from "date-fns"
import { useAtom } from "jotai"
import { useMemo, useState } from "react"
import type { Selection } from "react-aria-components"
import { v4 as uuidv4, v4 } from "uuid"
import { calculateTimeDifferenceInSeconds } from "../Timer"
import { isTaskStartedAtom } from "../atom"
import { getTime, updateTime } from "../invokes"
import { useCreateTask, useUpdateTask } from "../mutation"
import type { ComboxItem } from "../types"
import { FormUi } from "./formUi"
import type { Dates, Item, Tag } from "./formUi"

export default function TaskForm({
  tags,
  items,
  date,
}: { tags: Tag[]; items: ComboxItem[]; date: CalendarDate }) {
  const initialData = useMemo(() => createInitialData(date), [date])
  const [data, setData] = useState<Item & Dates>(initialData)
  const [isStarted, setIsStarted] = useAtom(isTaskStartedAtom)
  const [selectedTags, setSelectedTags] = useState<Selection>(new Set([]))
  const addTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await updateTime()
    const setTime = (await getTime()) as string
    const { title, inputTagsArray } = getFormData(event, tags, selectedTags)
    const jsonData = createJsonData(
      data,
      isStarted,
      title,
      inputTagsArray,
      setTime,
    )

    if (!isStarted) {
      setData(jsonData)
      addTaskMutation.mutate(jsonData)
      setIsStarted(true)
    } else {
      setData(initialData)
      updateTaskMutation.mutate(jsonData)
      setSelectedTags(new Set([]))
      setIsStarted(false)
    }
  }

  return (
    <>
      <FormUi
        data={data}
        items={items}
        tags={tags}
        isStarted={isStarted}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        handleSubmit={handleSubmit}
      />
    </>
  )
}

// createInitialData関数を定義
export const createInitialData = (date: CalendarDate) => {
  const dateString = date.toString()
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date())

  return {
    id: v4(),
    title: "",
    tags: [],
    date: dateString,
    week_number: getWeek(parsedDate, { weekStartsOn: 0 }),
    start_time: "",
    end_time: "",
    interval: 0,
  }
}

const getFormData = (
  event: React.FormEvent,
  tags: Tag[],
  selectedTags: Selection,
) => {
  const formData = new FormData(event.target as HTMLFormElement)
  const title = formData.get("title") as string
  const inputTags = tags.filter((tag) =>
    Array.from(selectedTags).includes(tag.id),
  )
  const inputTagsArray = inputTags.map((tag) => tag.name)
  return { title, inputTagsArray }
}

const createJsonData = (
  data: Item & Dates,
  isStarted: boolean,
  title: string,
  inputTagsArray: string[],
  setTime: string,
) => {
  if (!isStarted) {
    return {
      id: uuidv4(),
      title: title,
      tags: inputTagsArray,
      date: data.date,
      week_number: data.week_number,
      start_time: setTime,
      end_time: "",
      interval: 0,
    }
  }
  return {
    id: data.id,
    title: title,
    tags: inputTagsArray,
    date: data.date,
    week_number: data.week_number,
    start_time: data.start_time,
    end_time: setTime,
    interval: calculateTimeDifferenceInSeconds(
      data.start_time,
      setTime,
      "yyyy-MM-dd HH:mm:ss",
    ),
  }
}
