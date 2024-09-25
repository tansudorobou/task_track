import { ChevronRightCircle, StopCircle, Tags } from "lucide-react"
import type React from "react"
import { useTransition } from "react"
import { DialogTrigger, type Selection } from "react-aria-components"
import { TimerComponent } from "../Timer"
import { Button } from "../stories/Button"
import { ComboBox, ComboBoxItem } from "../stories/ComboBox"
import { Form } from "../stories/Form"
import { DropdownItem, ListBox } from "../stories/ListBox"
import { Popover } from "../stories/Popover"
import { Tag as RTag, TagGroup, tagStyle } from "../stories/TagGroup"
import type { ComboxItem } from "../types"

export type Item = {
  id: string
  title: string
  tags: string[]
}

export interface Tag {
  id: string
  name: string
  color: "gray" | "green" | "yellow" | "blue" | undefined
}

export interface FormUiProps {
  data: Item & Dates
  items: ComboxItem[]
  tags: Tag[]
  selectedTags: Selection
  setSelectedTags: React.Dispatch<React.SetStateAction<Selection>>
  handleSubmit: (event: React.FormEvent) => Promise<void>
  isStarted: boolean
}

export interface Dates {
  date: string
  week_number: number
  start_time: string
  end_time: string
  interval: number
}

export function FormUi({
  data,
  items,
  tags,
  isStarted,
  selectedTags,
  setSelectedTags,
  handleSubmit,
}: FormUiProps) {
  const hasSelectedTags = selectedTags instanceof Set && selectedTags.size > 0
  const [isPending, startTransition] = useTransition()

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    startTransition(() => {
      handleSubmit(event)
    })
  }

  return (
    <div className="w-full pt-1">
      <Form onSubmit={onSubmit} className="gap-4">
        <ComboBox
          items={items}
          name="title"
          allowsCustomValue
          className="w-full"
          onSelectionChange={(key) => {
            const comboxTag = items.find((item) => item.id === key)?.tags
            const tagsId = tags.filter((tag) => comboxTag?.includes(tag.name))
            setSelectedTags(new Set(tagsId.map((tag) => tag.id)))
          }}
        >
          {(item) => <ComboBoxItem key={item.id}>{item.title}</ComboBoxItem>}
        </ComboBox>
        <div className="flex ml-auto gap-2 items-center">
          <TagGroup
            className="items-center gap-2 pb-2 w-0 overflow-hidden sm:w-fit sm:max-w-xs md:w-fit md:max-w-sm lg:w-fit lg:max-w-md xl:w-fit xl:max-w-lg 2xl:w-fit 2xl:max-w-xl hidden xs:block"
            items={Array.from(selectedTags).map(
              (tagId) => tags.find((tag) => tag.id === tagId) as Tag,
            )}
            onRemove={(tag) => {
              setSelectedTags((prev) => {
                const next = new Set(prev)
                const value = tag.values().next().value
                if (value !== undefined) {
                  next.delete(value)
                }
                return next
              })
            }}
          >
            {(tag) => (
              <RTag className="flex-row" key={tag.id} color={tag.color}>
                {tag.name}
              </RTag>
            )}
          </TagGroup>
          <DialogTrigger>
            <Button type="button" variant="icon" className="hidden xs:block">
              <Tags
                size={30}
                className={
                  hasSelectedTags ? "text-gray-800/70" : "text-gray-800/30"
                }
              />
            </Button>
            <Popover>
              <ListBox
                selectionMode="multiple"
                selectedKeys={selectedTags}
                onSelectionChange={(keys) => setSelectedTags(keys)}
                className="h-60 overflow-y-auto"
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
          <RecordButton isStarted={isStarted} isPending={isPending} />
          <TimerComponent
            start_time={data?.start_time}
            className="hidden xs:block"
          />
        </div>
      </Form>
    </div>
  )
}

export const RecordButton = ({
  isStarted,
  isPending,
}: { isStarted: boolean; isPending: boolean }) => {
  return (
    <Button type="submit" variant="icon" isDisabled={isPending}>
      {isStarted ? (
        <StopCircle size={40} className="text-red-400" />
      ) : (
        <ChevronRightCircle size={40} className="text-green-400" />
      )}
    </Button>
  )
}
