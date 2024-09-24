import { invoke } from "@tauri-apps/api"
import { differenceInMilliseconds, parse } from "date-fns"
import { useCallback, useEffect, useMemo, useState } from "react"

// Custom hook for updating time
function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState("")

  const updateTime = useCallback(async () => {
    await invoke("update_time")
    const time: string = await invoke("get_time")
    setCurrentTime(time)
  }, [])

  useEffect(() => {
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [updateTime])

  return currentTime
}

export function TimerComponent({ start_time }: { start_time: string }) {
  if (start_time === "") {
    return <div>00:00:00</div>
  }

  const currentTime = useCurrentTime()

  const startTime = useMemo(
    () => parse(start_time, "yyyy-MM-dd HH:mm:ss", new Date()),
    [start_time],
  )

  const diff = useMemo(() => {
    const parsedTime = parse(currentTime, "yyyy-MM-dd HH:mm:ss", new Date())
    return differenceInMilliseconds(parsedTime, startTime) || 0
  }, [currentTime, startTime])

  return <div>{millisecondsToTime(diff)}</div>
}

export function millisecondsToTime(milliseconds: number) {
  // ミリ秒を日付オブジェクトに変換
  const date = new Date(milliseconds)

  // タイムゾーンのオフセットを適用しないためにUTCを使用して時間をフォーマット
  const day = String(date.getUTCDate()).padStart(2, "0")
  const hours = String(date.getUTCHours()).padStart(2, "0")
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")
  const seconds = String(date.getUTCSeconds()).padStart(2, "0")

  if (day !== "01") {
    return `${day}d ${hours}:${minutes}:${seconds}`
  }
  // フォーマットされた時間を返す
  return `${hours}:${minutes}:${seconds}`
}

export function calculateTimeDifferenceInMilliseconds(
  startTime: string,
  endTime: string,
  dateFormat: string,
) {
  const parsedStartTime = parse(startTime, dateFormat, new Date())
  const parsedEndTime = parse(endTime, dateFormat, new Date())
  return differenceInMilliseconds(parsedEndTime, parsedStartTime)
}
