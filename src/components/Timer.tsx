import { invoke } from "@tauri-apps/api/core"
import { differenceInSeconds, parse } from "date-fns"
import { useEffect, useMemo, useState } from "react"

// Custom hook for updating time
function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = async () => {
      await invoke("update_time")
      const time: string = await invoke("get_time")
      setCurrentTime(time)
    }

    updateTime() // 初期時間をセット
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return currentTime
}

export function TimerComponent({
  start_time,
  className,
}: { start_time: string; className?: string }) {
  const currentTime = useCurrentTime()

  const startTime = useMemo(
    () => parse(start_time, "yyyy-MM-dd HH:mm:ss", new Date()),
    [start_time],
  )

  const diff =
    differenceInSeconds(
      parse(currentTime, "yyyy-MM-dd HH:mm:ss", new Date()),
      startTime,
    ) || 0

  return <div className={className}>{secondsToTime(diff)}</div>
}

export function secondsToTime(seconds: number) {
  // 秒をミリ秒に変換
  const date = new Date(seconds * 1000)

  // タイムゾーンのオフセットを適用しないためにUTCを使用して時間をフォーマット
  const day = String(date.getUTCDate()).padStart(2, "0")
  const hours = String(date.getUTCHours()).padStart(2, "0")
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")
  const secondsStr = String(date.getUTCSeconds()).padStart(2, "0")

  if (day !== "01") {
    return `${day}d ${hours}:${minutes}:${secondsStr}`
  }
  // フォーマットされた時間を返す
  return `${hours}:${minutes}:${secondsStr}`
}

export function calculateTimeDifferenceInSeconds(
  startTime: string,
  endTime: string,
  dateFormat: string,
) {
  const parsedStartTime = parse(startTime, dateFormat, new Date())
  const parsedEndTime = parse(endTime, dateFormat, new Date())
  return differenceInSeconds(parsedEndTime, parsedStartTime)
}
