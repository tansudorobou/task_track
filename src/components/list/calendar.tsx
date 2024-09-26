import jaLocale from "@fullcalendar/core/locales/ja"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { parse } from "date-fns"
import { useMemo, useState } from "react"
import type { Dates, Item } from "../types"
import "./calendarStyle.css"
import { DialogContainer } from "@adobe/react-spectrum"
import { MinusCircle } from "lucide-react"
import { Heading } from "react-aria-components"
import { Button } from "../stories/Button"
import { Dialog } from "../stories/Dialog"
import { Tag, TagGroup } from "../stories/TagGroup"
import type { Tag as TagType } from "../types"

export default function CalendarView({
  items,
  date,
  tags,
}: {
  items: (Item & Dates)[]
  date: string
  tags: TagType[]
}) {
  const [popupInfo, setPopupInfo] = useState<(Item & Dates) | null>(null)

  const events = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        title: item.title,
        start: parse(item.start_time, "yyyy-MM-dd HH:mm:ss", new Date()),
        end: parse(item.end_time, "yyyy-MM-dd HH:mm:ss", new Date()),
        tags: item.tags,
        interval: item.interval,
        date: item.date,
        week_number: item.week_number,
      })),
    [items],
  )

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleEventClick = (clickInfo: any) => {
    const id = clickInfo.event.id

    const item = items.find((item) => item.id === id)

    if (item) {
      setPopupInfo(item)
    }
  }

  return (
    <>
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
          eventClick={handleEventClick}
        />
      </div>
      <DialogContainer onDismiss={() => setPopupInfo(null)}>
        {popupInfo && (
          <Dialog>
            <div className="flex items-center">
              <Heading className="font-bold">{popupInfo.title}</Heading>
              <Button
                type="button"
                variant="icon"
                className="ml-auto"
                onPress={() => setPopupInfo(null)}
              >
                <MinusCircle className="text-red-400" />
              </Button>
            </div>
            <div className="my-2 ml-1">
              {popupInfo.start_time.slice(11, 16)} ~{" "}
              {popupInfo.end_time.slice(11, 16)}
            </div>
            <TagGroup
              className="gap-2 pb-2"
              items={popupInfo.tags.map(
                (tag) => tags.find((t) => t.name === tag) as TagType,
              )}
            >
              {(tag) => <Tag color={tag.color}>{tag.name}</Tag>}
            </TagGroup>
          </Dialog>
        )}
      </DialogContainer>
    </>
  )
}
