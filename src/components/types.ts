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
  items: Item[]
  tags: Tag[]
  handleSubmit: (event: React.FormEvent) => Promise<void>
  selectedTags: Selection
  setSelectedTags: React.Dispatch<React.SetStateAction<Selection>>
  isStarted: boolean
}

export interface Dates {
  date: string
  week_number: number
  start_time: string
  end_time: string
  interval: number
}

export type ComboxItem = {
  id: string
  title: string
  tags: string[]
}
