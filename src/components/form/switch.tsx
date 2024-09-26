import { useAtom } from "jotai"
import { CalendarSearch, LayoutList } from "lucide-react"
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
      <ButtonLabel listOpen={listOpen} />
    </Button>
  )
}

function ButtonLabel({ listOpen }: { listOpen: string }) {
  const divClassName = "flex items-center gap-1"
  const titleClassName = "hidden sm:block"

  return listOpen === "list" ? (
    <div className={divClassName}>
      <CalendarSearch size={20} className="text-gray-500" />
      <div className={titleClassName}>カレンダー表示</div>
    </div>
  ) : (
    <div className={divClassName}>
      <LayoutList size={20} className="text-gray-500" />
      <div className={titleClassName}>タスク表示</div>
    </div>
  )
}
