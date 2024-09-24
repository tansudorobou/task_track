import { DialogContainer } from "@adobe/react-spectrum"
import { useQuery } from "@tanstack/react-query"
import { listen } from "@tauri-apps/api/event"
import { MinusCircle } from "lucide-react"
import { useState } from "react"
import { Heading } from "react-aria-components"
import { getTags } from "../invokes"
import { DeleteDialog } from "../list/delete"
import { ListMenu } from "../list/menu"
import { useDeleteTag, useIsTagsOpen, useUpdateTag } from "../mutation"
import { Button } from "../stories/Button"
import { Dialog } from "../stories/Dialog"
import { colors } from "../stories/TagGroup"
import type { Tag } from "../types"
import TagsForm from "./form"

export function TagsList() {
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  })

  const { isTagsOpen, setIsTagsOpen } = useIsTagsOpen()
  const [isTagsItem, setIsTagsItem] = useState<Tag | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<string | null>(null)

  listen("editTag", async () => {
    setIsTagsOpen(true)
  })

  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const color = formData.get("color") as Tag["color"]
    updateTag.mutate({ id, name, color })
    setIsTagsItem(null)
    setIsTagsOpen(false)
  }

  return (
    <>
      <DialogContainer onDismiss={() => setIsTagsOpen(false)}>
        {isTagsOpen && (
          <Dialog className="w-96">
            <div className="flex items-center">
              <Heading className="font-bold">タグ一覧</Heading>
              <Button
                type="button"
                variant="icon"
                className="ml-auto"
                onPress={() => setIsTagsOpen(false)}
              >
                <MinusCircle className="text-red-400" />
              </Button>
            </div>
            <div className="overflow-y-scroll w-full">
              {tags?.map((tag) => (
                <li
                  id={tag.id}
                  key={tag.id}
                  className="flex gap-2 border border-gray-300 rounded-md my-2 px-2 items-center bg-white/90 h-10 "
                >
                  <div className="w-2/4 whitespace-nowrap text-ellipsis overflow-hidden ...">
                    {tag.name}
                  </div>
                  <div className="flex ml-auto gap-2 items-center">
                    <div
                      className={`transition cursor-default text-xs rounded-full border px-3 py-0.5 flex items-center max-w-fit gap-1 ${
                        colors[tag.color || "gray"]
                      }`}
                    >
                      {tag.color}
                    </div>
                    <ListMenu
                      onAction={(key) => {
                        if (key === "edit") {
                          setIsTagsItem(tag)
                          setIsDialogOpen("edit")
                        }
                        if (key === "delete") {
                          setIsTagsItem(tag)
                          setIsDialogOpen("delete")
                        }
                      }}
                    />
                  </div>
                </li>
              ))}
            </div>
          </Dialog>
        )}
      </DialogContainer>
      {isDialogOpen === "edit" && isTagsItem && (
        <TagsForm
          isTagsItem={isTagsItem}
          onDismiss={() => setIsTagsItem(null)}
          handleSubmit={handleSubmit}
        />
      )}
      {isDialogOpen === "delete" && isTagsItem && (
        <DialogContainer onDismiss={() => setIsDialogOpen(null)}>
          <DeleteDialog
            onMutate={() => deleteTag.mutate(isTagsItem)}
            onPress={() => setIsDialogOpen(null)}
          />
        </DialogContainer>
      )}
    </>
  )
}
