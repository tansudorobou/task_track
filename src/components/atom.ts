import {
  type CalendarDate,
  fromDate,
  toCalendarDate,
} from "@internationalized/date"
import { endOfWeek, format, startOfWeek } from "date-fns"
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const listOpenAtom = atomWithStorage("listOpen", "list")

export const weekOpenAtom = atomWithStorage("weekOpen", "day")

export const isTaskStartedAtom = atom(false)

export const isTagsOpenAtom = atom(false)

export const isCreateTagOpenAtom = atom(false)

// export const themeAtom = atomWithStorage("theme", "light")

const weeekDateRangeAtom = (date: CalendarDate) => {
  const dateAtom = atom(date)

  const weekStartAtom = atom((get) => {
    const date = get(dateAtom)
    return format(startOfWeek(date.toString()), "yyyy-MM-dd")
  })

  const weekEndAtom = atom((get) => {
    const date = get(dateAtom)
    return format(endOfWeek(date.toString()), "yyyy-MM-dd")
  })

  return [dateAtom, weekStartAtom, weekEndAtom] as const
}
const zonedDateTime = fromDate(new Date(), "Asia/Tokyo")
const calendarDate: CalendarDate = toCalendarDate(zonedDateTime)
export const [dateAtom, weekStartAtom, weekEndAtom] =
  weeekDateRangeAtom(calendarDate)
