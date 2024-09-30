import { DialogContainer } from "@adobe/react-spectrum"
import type { CalendarDate } from "@internationalized/date"
import { FileEdit } from "lucide-react"
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

  return (
    <>
      <div className={className}>
        <Button
          className="whitespace-nowrap px-2 xs:px-5"
          variant="secondary"
          onPress={() => setIsDialogOpen("new")}
        >
          <div className="flex items-center gap-1">
            <FileEdit size={20} className="text-gray-500" />
            <div className="hidden sm:block">新規タスク</div>
          </div>
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
