import { listen } from "@tauri-apps/api/event"
import { useAtom } from "jotai"
import { isCreateTagOpenAtom } from "../atom"
import { useAddTag } from "../mutation"
import type { Tag } from "../types"
import TagsForm from "./form"

export default function TagsCreate() {
  const [createTagOpen, setCreateTagOpen] = useAtom(isCreateTagOpenAtom)
  const addTag = useAddTag()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const color = formData.get("color") as Tag["color"]
    addTag.mutate({ id, name, color })
    setCreateTagOpen(false)
  }

  listen("createTag", async () => {
    setCreateTagOpen(true)
  })

  return (
    <TagsForm
      isTagsItem={createTagOpen}
      onDismiss={() => setCreateTagOpen(false)}
      handleSubmit={handleSubmit}
    />
  )
}
