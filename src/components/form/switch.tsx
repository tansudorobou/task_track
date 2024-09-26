import { useAtom } from "jotai"
import { listOpenAtom } from "../atom"
import { Button } from "../stories/Button"

export default function ListSwitch({
  className,
}: {
  className?: string
}) {
  const [listOpen, setIsListOpen] = useAtom(listOpenAtom)

  return (
    <Button
      variant="secondary"
      onPress={() => setIsListOpen(listOpen === "list" ? "calendar" : "list")}
      className={className}
    >
      {listOpen === "list" ? "カレンダー表示" : "タスク表示"}
    </Button>
  )
}
