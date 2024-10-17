import { useAtom } from "jotai"
import {
  CalendarDays,
  CalendarRange,
  CalendarSearch,
  LayoutList,
} from "lucide-react"
import { listOpenAtom, weekOpenAtom } from "../atom"
import { Button } from "../stories/Button"

export default function ListSwitch({
  className,
}: {
  className?: string
}) {
  const [listOpen, setIsListOpen] = useAtom(listOpenAtom)
  const [weekOpen, setIsWeekOpen] = useAtom(weekOpenAtom)

  return (
    <>
      <Button
        variant="secondary"
        onPress={() => setIsListOpen(listOpen === "list" ? "calendar" : "list")}
        className={className}
      >
        <ButtonLabel listOpen={listOpen} />
      </Button>
      <Button
        variant="secondary"
        onPress={() => setIsWeekOpen(weekOpen === "day" ? "week" : "day")}
        className={className}
      >
        <WeekButtonLabel weekOpen={weekOpen} />
      </Button>
    </>
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

function WeekButtonLabel({ weekOpen }: { weekOpen: string }) {
  const divClassName = "flex items-center gap-1"
  const titleClassName = "hidden md:block w-16"

  return weekOpen === "day" ? (
    <div className={divClassName}>
      <CalendarRange size={20} className="text-gray-500" />
      <div className={titleClassName}>週表示</div>
    </div>
  ) : (
    <div className={divClassName}>
      <CalendarDays size={20} className="text-gray-500" />
      <div className={titleClassName}>日表示</div>
    </div>
  )
}
