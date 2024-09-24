import { format, parse } from "date-fns"

export function ConvertToISO8601(time: string) {
  if (time === "") {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
  }
  const dateTime = parse(time, "yyyy-MM-dd HH:mm:ss", new Date())
  const isoTime = format(dateTime, "yyyy-MM-dd'T'HH:mm:ss")
  return isoTime
}

export function ComvertServerDatetime(time: string) {
  const isoTime = format(time, "yyyy-MM-dd HH:mm:ss")
  return isoTime
}
