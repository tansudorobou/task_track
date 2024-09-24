import { DialogContainer } from "@adobe/react-spectrum"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { Dates, Item } from "../form/formUi"
import { getTags } from "../invokes"
import { useDeleteTask, useIsStarted, useUpdateTask } from "../mutation"
import { Tag, TagGroup } from "../stories/TagGroup"
import { DeleteDialog } from "./delete"
import { EditDialog } from "./edit"
import { ListMenu } from "./menu"

export default function TaskList({
  items,
}: {
  items: (Item & Dates)[]
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<string | null>(null)
  const [isEditData, setIsEditData] = useState<(Item & Dates) | undefined>(
    undefined,
  )
  const { data: tags } = useSuspenseQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  })

  const { isStarted } = useIsStarted()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const millisecondsToMinutes = (milliseconds: number) => {
    return Math.floor(milliseconds / 1000 / 60)
  }

  return (
    <div className="w-full">
      <ul className="mx-5">
        {items?.map((item) => (
          <li
            key={item.id}
            className="flex gap-2 border border-gray-300 rounded-md my-2 px-4 items-center bg-white/90 h-10"
          >
            <div className="w-2/4 whitespace-nowrap text-ellipsis overflow-hidden ...">
              {item.title}
            </div>
            <div className="flex ml-auto gap-2 items-center">
              <TagGroup className="my-1 overflow-hidden">
                {item.tags.map((tag) => (
                  <Tag
                    key={tag}
                    color={tags.find((t) => t.name === tag)?.color}
                  >
                    {tag}
                  </Tag>
                ))}
              </TagGroup>
              <div className="w-20 sm:flex hidden">
                <div>{item.start_time.slice(11, 16)}</div>
                <div>~</div>
                <div>{item?.end_time.slice(11, 16)}</div>
              </div>
              <div className="w-12 text-right">
                {millisecondsToMinutes(item?.interval)} 分
              </div>
              <ListMenu
                onAction={(key) => {
                  if (key === "edit") {
                    setIsEditData(item)
                    setIsDialogOpen("edit")
                  }
                  if (key === "delete") {
                    setIsEditData(item)
                    setIsDialogOpen("delete")
                  }
                }}
                disabledKeys={isStarted ? ["edit", "delete"] : []}
              />
            </div>
          </li>
        ))}
      </ul>
      <DialogContainer onDismiss={() => setIsDialogOpen(null)}>
        {isDialogOpen === "edit" && isEditData && (
          <EditDialog
            item={isEditData}
            tags={tags}
            mutate={updateTaskMutation}
            setIsEditData={setIsEditData}
          />
        )}
        {isDialogOpen === "delete" && isEditData && (
          <DeleteDialog
            onMutate={() => deleteTaskMutation.mutate(isEditData)}
            onPress={() => setIsDialogOpen(null)}
          />
        )}
      </DialogContainer>
    </div>
  )
}
