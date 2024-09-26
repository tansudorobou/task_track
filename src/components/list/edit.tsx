import { useDialogContainer } from "@adobe/react-spectrum"
import { parseDateTime } from "@internationalized/date"
import type { UseMutationResult } from "@tanstack/react-query"
import { Tags } from "lucide-react"
import { useState } from "react"
import {
  DialogTrigger,
  Form,
  Heading,
  type Selection,
} from "react-aria-components"
import { calculateTimeDifferenceInSeconds } from "../Timer"
import { ComvertServerDatetime, ConvertToISO8601 } from "../func"
import { Button } from "../stories/Button"
import { DateField } from "../stories/DateField"
import { Dialog } from "../stories/Dialog"
import { FieldError } from "../stories/Field"
import { DropdownItem, ListBox } from "../stories/ListBox"
import { Popover } from "../stories/Popover"
import { Tag, TagGroup, tagStyle } from "../stories/TagGroup"
import { TextField } from "../stories/TextField"
import type { Dates, Item, Tag as TagType } from "../types"

export function EditDialog({
  item,
  tags,
  setIsEditData,
  mutate,
}: {
  item: Item & Dates
  tags: TagType[]
  setIsEditData: React.Dispatch<
    React.SetStateAction<(Item & Dates) | undefined>
  >
  mutate: UseMutationResult<unknown, Error, Item & Dates, void>
}) {
  const dialog = useDialogContainer()
  const startTime = ConvertToISO8601(item.start_time)
  const endTime = ConvertToISO8601(item.end_time)
  console.log(item)
  const initialSelectedTags = new Set(
    item.tags
      .filter((t) => t !== "")
      .map((tag) => tags.find((t) => t.name === tag)?.id as string),
  )

  const [selectedTags, setSelectedTags] =
    useState<Selection>(initialSelectedTags)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const title = formData.get("title") as string
    const start_time = ComvertServerDatetime(
      formData.get("start_time") as string,
    )
    const end_time = ComvertServerDatetime(formData.get("end_time") as string)
    const inputTags = tags.filter((tag) =>
      Array.from(selectedTags).includes(tag.id),
    )
    const inputTagsArray = inputTags.map((tag) => tag.name)

    mutate.mutate({
      ...item,
      title,
      start_time,
      end_time,
      tags: inputTagsArray,
      interval: calculateTimeDifferenceInSeconds(
        start_time,
        end_time,
        "yyyy-MM-dd HH:mm:ss",
      ),
    })
    setIsEditData(undefined)
    dialog.dismiss()
  }

  return (
    <Dialog>
      <Heading className="font-bold">タスク編集</Heading>
      <Form onSubmit={handleSubmit} className="space-y-2 mt-2">
        <TextField
          label="タイトル"
          name="title"
          isRequired
          defaultValue={item.title}
        />
        <div className="flex justify-end">
          <TagGroup
            className="items-center gap-2 pb-2"
            items={Array.from(selectedTags).map(
              (tagId) => tags?.find((tag) => tag.id === tagId) as TagType,
            )}
            onRemove={(tag) => {
              setSelectedTags((prev) => {
                const next = new Set(prev)
                const tagValue = tag.values().next().value
                if (tagValue !== undefined) {
                  next.delete(tagValue)
                }
                return next
              })
            }}
          >
            {(tag) => (
              <Tag
                className="flex-row"
                key={tag.id}
                color={tag?.color}
                textValue={tag.name}
              >
                {tag.name}
              </Tag>
            )}
          </TagGroup>
          <DialogTrigger>
            <Button type="button" variant="icon">
              <Tags size={30} />
            </Button>
            <Popover showArrow>
              <ListBox
                selectionMode="multiple"
                selectedKeys={selectedTags}
                onSelectionChange={(keys) => setSelectedTags(keys)}
              >
                {tags?.map((tag) => (
                  <DropdownItem id={tag.id} key={tag.id}>
                    <span className={tagStyle(tag.color || "gray")}>
                      {tag.name}
                    </span>
                  </DropdownItem>
                ))}
              </ListBox>
            </Popover>
          </DialogTrigger>
        </div>
        <DateField
          label="開始時間"
          name="start_time"
          granularity="minute"
          isRequired
          defaultValue={parseDateTime(startTime)}
        >
          <FieldError />
        </DateField>
        <DateField
          label="終了時間"
          name="end_time"
          granularity="minute"
          isRequired
          defaultValue={parseDateTime(endTime)}
          validate={(value) => {
            if (value > parseDateTime(startTime)) {
              return "開始時間より後の時間を選択してください"
            }
          }}
        >
          <FieldError />
        </DateField>
        <div className="flex justify-center gap-5 pt-2">
          <Button type="submit">保存</Button>
          <Button
            type="button"
            onPress={() => {
              setIsEditData(undefined)
              dialog.dismiss()
            }}
            variant="secondary"
          >
            キャンセル
          </Button>
        </div>
      </Form>
    </Dialog>
  )
}
