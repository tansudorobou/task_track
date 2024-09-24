import type { Meta } from "@storybook/react"
import type { Tag as TagType } from "../types"
import { Tag, TagGroup } from "./TagGroup"

const meta: Meta<typeof TagGroup> = {
  component: TagGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Ice cream flavor",
    selectionMode: "multiple",
    slot: "tag",
    items: [
      { id: "1", name: "Chocolate", color: "blue" },
      { id: "2", name: "Mint", color: "green" },
      { id: "3", name: "Strawberry", color: "red" },
      { id: "4", name: "Vanilla", color: "yellow" },
      { id: "5", name: "Pistachio", color: "green" },
      { id: "6", name: "Rocky Road", color: "brown" },
      { id: "7", name: "Peanut Butter", color: "yellow" },
      { id: "8", name: "Cookies 'n Cream", color: "gray" },
    ],
  },
}

export default meta

export const Example = (args: Meta<typeof TagGroup>) => (
  <TagGroup {...args}>
    {(tag: TagType) => (
      <Tag key={tag.id} color={tag.color}>
        {tag.name}
      </Tag>
    )}
  </TagGroup>
)
