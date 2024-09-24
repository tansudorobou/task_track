import type { Meta, StoryObj } from "@storybook/react"
import { RecordButton } from "./formUi"

const meta: Meta<typeof RecordButton> = {
  component: RecordButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    isStarted: false,
  },
}

export default meta

type Story = StoryObj<typeof RecordButton>

export const StartButton: Story = {
  args: {
    isStarted: false,
  },
}

export const StopButton: Story = {
  args: {
    isStarted: true,
  },
}
