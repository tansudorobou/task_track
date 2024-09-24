import type { Meta } from "@storybook/react"
import { Form } from "react-aria-components"
import { Button } from "./Button"
import { DatePicker } from "./DatePicker"

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Event date",
  },
}

export default meta

export const Example = (args: Meta<typeof DatePicker>) => (
  <DatePicker {...args} />
)

export const Validation = (args: Meta<typeof DatePicker>) => (
  <Form className="flex flex-col gap-2 items-start">
    <DatePicker {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
)

Validation.args = {
  isRequired: true,
}
