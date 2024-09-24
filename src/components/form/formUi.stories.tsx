import type { Meta, StoryObj } from "@storybook/react"
import { FormUi } from "./formUi"

const meta: Meta<typeof FormUi> = {
  component: FormUi,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof FormUi>

export const Example: Story = {
  args: {
    data: {
      id: "1",
      title: "task1",
      tags: [],
      start_time: "",
      end_time: "",
      interval: 0,
      date: "2021-10-10",
      week_number: 41,
    },

    items: [
      { id: "chocolate", title: "Chocolate", tags: [] },
      { id: "mint", title: "Mint", tags: [] },
      { id: "strawberry", title: "Strawberry", tags: [] },
      { id: "vanilla", title: "Vanilla", tags: [] },
    ],
    tags: [
      { id: "chocolate", name: "Chocolate", color: "blue" },
      { id: "mint", name: "Mint", color: "green" },
      { id: "strawberry", name: "Strawberry", color: "gray" },
      { id: "vanilla", name: "Vanilla", color: "yellow" },
    ],
    isStarted: true,
    selectedTags: new Set(),
    setSelectedTags: () => {},
    handleSubmit: () => Promise.resolve(),
  },
}
