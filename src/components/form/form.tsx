import type { CalendarDate } from "@internationalized/date"
import { getWeek, parse } from "date-fns"
import { useState } from "react"
import type { Selection } from "react-aria-components"
import { v4 as uuidv4 } from "uuid"
import { calculateTimeDifferenceInMilliseconds } from "../Timer"
import { getTime, updateTime } from "../invokes"
import { useCreateTask, useIsStarted, useUpdateTask } from "../mutation"
import type { ComboxItem } from "../types"
import { FormUi } from "./formUi"
import type { Dates, Item, Tag } from "./formUi"

export default function TaskForm({
  tags,
  items,
  date,
}: { tags: Tag[]; items: ComboxItem[]; date: CalendarDate }) {
  const initialData = {
    id: "",
    title: "",
    tags: [],
    date: date.toString(),
    week_number: getWeek(parse(date.toString(), "yyyy-MM-dd", new Date()), {
      weekStartsOn: 0,
    }),
    start_time: "",
    end_time: "",
    interval: 0,
  }
  const [data, setData] = useState<Item & Dates>(initialData)
  const { isStarted, setIsStarted } = useIsStarted()
  const [selectedTags, setSelectedTags] = useState<Selection>(new Set([]))
  const addTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await updateTime()
    const setTime = (await getTime()) as string
    const formData = new FormData(event.target as HTMLFormElement)
    const title = formData.get("title") as string
    const inputTags = tags.filter((tag) =>
      Array.from(selectedTags).includes(tag.id),
    )
    const inputTagsArray = inputTags.map((tag) => tag.name)
    if (isStarted === false) {
      const jsonData = {
        id: uuidv4(),
        title: title,
        tags: inputTagsArray,
        date: data.date,
        week_number: data.week_number,
        start_time: setTime,
        end_time: "",
        interval: 0,
      }
      setData(jsonData)
      addTaskMutation.mutate(jsonData)
      setIsStarted(!isStarted)
    }
    if (isStarted === true) {
      const jsonData = {
        id: data.id,
        title: title,
        tags: inputTagsArray,
        date: data.date,
        week_number: data.week_number,
        start_time: data.start_time,
        end_time: setTime,
        interval: calculateTimeDifferenceInMilliseconds(
          data.start_time,
          setTime,
          "yyyy-MM-dd HH:mm:ss",
        ),
      }

      setData(initialData)
      updateTaskMutation.mutate(jsonData)
      setSelectedTags(new Set([]))
      setIsStarted(!isStarted)
    }
  }

  return (
    <>
      <FormUi
        data={data}
        items={items}
        tags={tags}
        handleSubmit={handleSubmit}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        isStarted={isStarted}
      />
    </>
  )
}
