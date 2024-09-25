import { DialogContainer } from "@adobe/react-spectrum"
import type { CalendarDate } from "@internationalized/date"
import { useState } from "react"
import { EditDialog } from "../list/edit"
import { useCreateTask } from "../mutation"
import { Button } from "../stories/Button"
import type { Dates, Item, Tag } from "../types"
import { createInitialData } from "./form"

export default function NewTaskForm({
  tags,
  date,
  className,
}: {
  tags: Tag[]
  date: CalendarDate
  className?: string
}) {
  const initialData = createInitialData(date)
  const [task, setTask] = useState<(Item & Dates) | undefined>(initialData)
  const [isDialogOpen, setIsDialogOpen] = useState<string | null>(null)
  const createTaskMutation = useCreateTask()
  console.log(isDialogOpen, initialData)

  return (
    <>
      <div className={className}>
        <Button
          className="whitespace-nowrap"
          variant="secondary"
          onPress={() => setIsDialogOpen("new")}
        >
          新規タスク
        </Button>
      </div>
      <DialogContainer onDismiss={() => setIsDialogOpen(null)}>
        {isDialogOpen === "new" && (
          <EditDialog
            item={task ? task : createInitialData(date)}
            tags={tags}
            mutate={createTaskMutation}
            setIsEditData={setTask}
          />
        )}
      </DialogContainer>
    </>
  )
}
