import TaskList from "./list"

import type { Meta } from "@storybook/react"

const meta: Meta<typeof TaskList> = {
  component: TaskList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = Meta<typeof TaskList>

export const Example: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "task1",
        tags: ["tag"],
        start_time: "2021-10-10 00:00:00",
        end_time: "2021-10-11 00:00:00",
        interval: 1,
        date: "2021-10-10",
        week_number: 41,
      },
      {
        id: "2",
        title: "task2",
        tags: [],
        start_time: "2021-10-10 00:00:00",
        end_time: "2021-10-11 00:00:00",
        interval: 1,
        date: "2021-10-10",
        week_number: 41,
      },
    ],
  },
}
