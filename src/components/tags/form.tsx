import { DialogContainer } from "@adobe/react-spectrum"
import { MinusCircle } from "lucide-react"
import { Form, Heading } from "react-aria-components"
import { v4 } from "uuid"
import { Button } from "../stories/Button"
import { Dialog } from "../stories/Dialog"
import { Select, SelectItem } from "../stories/Select"
import { colors } from "../stories/TagGroup"
import { TextField } from "../stories/TextField"
import type { Tag } from "../types"

export default function TagsForm({
  isTagsItem,
  onDismiss,
  handleSubmit,
}: {
  isTagsItem: Tag | null | boolean
  onDismiss: () => void
  handleSubmit: (event: React.FormEvent) => void
}) {
  return (
    <DialogContainer onDismiss={onDismiss}>
      {isTagsItem && (
        <Dialog>
          <div className="flex items-center">
            <Heading className="font-bold">タグ編集</Heading>
            <Button
              type="button"
              variant="icon"
              className="ml-auto"
              onPress={onDismiss}
            >
              <MinusCircle className="text-red-400" />
            </Button>
          </div>
          <Form onSubmit={handleSubmit} className="space-y-2">
            <input type="hidden" name="id" value={v4()} />
            <TextField
              label="タグ名"
              name="name"
              defaultValue={
                typeof isTagsItem === "object" ? isTagsItem.name : ""
              }
            />
            <Select label="カラー" name="color">
              {Object.keys(colors).map((color) => (
                <SelectItem key={color} id={color}>
                  {color}
                </SelectItem>
              ))}
            </Select>
            <Button type="submit">Submit</Button>
          </Form>
        </Dialog>
      )}
    </DialogContainer>
  )
}
