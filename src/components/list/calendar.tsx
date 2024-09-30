import jaLocale from "@fullcalendar/core/locales/ja"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { format, isBefore, parse, startOfDay, subHours } from "date-fns"
import { useMemo, useState } from "react"
import type { Dates, Item } from "../types"
import "./calendarStyle.css"
import { DialogContainer } from "@adobe/react-spectrum"
import { useUpdateTask } from "../mutation"
import type { Tag as TagType } from "../types"
import { EditDialog } from "./edit"

export default function CalendarView({
  items,
  date,
  tags,
  timeGrid,
}: {
  items: (Item & Dates)[]
  date: string
  tags: TagType[]
  timeGrid: "timeGridDay" | "timeGridWeek"
}) {
  const [popupInfo, setPopupInfo] = useState<(Item & Dates) | undefined>(
    undefined,
  )

  const updateTaskMutation = useUpdateTask()

  const events = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      start: parse(item.start_time, "yyyy-MM-dd HH:mm:ss", new Date()),
      end: parse(item.end_time, "yyyy-MM-dd HH:mm:ss", new Date()),
      tags: item.tags,
      interval: item.interval,
      date: item.date,
      week_number: item.week_number,
    }))
  }, [items])

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleEventClick = (clickInfo: any) => {
    const id = clickInfo.event.id
    const item = items.find((item) => item.id === id)
    if (item) {
      setPopupInfo(item)
    }
  }

  const formattedTime = format(
    isBefore(subHours(new Date(), 2), startOfDay(new Date()))
      ? startOfDay(new Date())
      : subHours(new Date(), 2),
    "HH:mm",
  )

  return (
    <>
      <div className="md:w-3/4 mx-auto max-h-max mt-2">
        <FullCalendar
          key={timeGrid}
          plugins={[timeGridPlugin]}
          initialView={timeGrid}
          headerToolbar={false}
          locale={jaLocale}
          events={events}
          allDaySlot={false}
          height={"84vh"}
          scrollTime={formattedTime}
          nowIndicator={true}
          initialDate={date}
          eventClick={handleEventClick}
        />
      </div>
      <DialogContainer onDismiss={() => setPopupInfo(undefined)}>
        {popupInfo && (
          <EditDialog
            item={popupInfo}
            tags={tags}
            setIsEditData={setPopupInfo}
            mutate={updateTaskMutation}
          />
        )}
      </DialogContainer>
    </>
  )
}
