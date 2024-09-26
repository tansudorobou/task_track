import jaLocale from "@fullcalendar/core/locales/ja"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { parse } from "date-fns"
import { useMemo } from "react"
import type { Dates, Item } from "../types"
import "./calendarStyle.css"

export default function CalendarView({
  items,
  date,
}: {
  items: (Item & Dates)[]
  date: string
}) {
  const events = useMemo(
    () =>
      items.map((item) => ({
        title: item.title,
        start: parse(item.start_time, "yyyy-MM-dd HH:mm:ss", new Date()),
        end: parse(item.end_time, "yyyy-MM-dd HH:mm:ss", new Date()),
      })),
    [items],
  )

  console.log(date)

  return (
    <div className="md:w-3/4 mx-auto max-h-max mt-2">
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridDay"
        headerToolbar={false}
        locale={jaLocale}
        events={events}
        allDaySlot={false}
        height={"84vh"}
        scrollTime={new Date().toTimeString().slice(0, 5)}
        nowIndicator={true}
        initialDate={date}
      />
    </div>
  )
}
