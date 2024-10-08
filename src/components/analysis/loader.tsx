import { useDialogContainer } from "@adobe/react-spectrum"
import { parseDate } from "@internationalized/date"
import { useQuery } from "@tanstack/react-query"
import { endOfWeek, format, startOfWeek } from "date-fns"
import { useAtom } from "jotai"
import { ChartArea, LayoutList, MinusCircle } from "lucide-react"
import { useState } from "react"
import { weekOpenAtom } from "../atom"
import { getTags, getTasksByDateRange } from "../invokes"
import { Button } from "../stories/Button"
import { DateRangePicker } from "../stories/DateRangePicker"
import AnalysisListComponent from "./list"
import PieChartComponent from "./pie"

export default function AnalysisLoaderComponent() {
  const [weekOpen] = useAtom(weekOpenAtom)
  const [openOption, setOpenOption] = useState<"chart" | "list">("chart")
  const dialog = useDialogContainer()
  const [dateRange, setDateRange] = useState({
    start:
      weekOpen === "week"
        ? parseDate(
            startOfWeek(new Date(), { weekStartsOn: 1 })
              .toISOString()
              .slice(0, 10),
          )
        : parseDate(format(new Date(), "yyyy-MM-dd")),
    end:
      weekOpen === "week"
        ? parseDate(endOfWeek(new Date()).toISOString().slice(0, 10))
        : parseDate(format(new Date(), "yyyy-MM-dd")),
  })

  const query = useQuery({
    queryKey: ["items", dateRange.start.toString(), dateRange.end.toString()],
    queryFn: () =>
      getTasksByDateRange(dateRange.start.toString(), dateRange.end.toString()),
  })

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  })

  return (
    <>
      <div className="sm:flex">
        <DateRangePicker defaultValue={dateRange} onChange={setDateRange} />
        <div className="flex sm:ml-auto">
          <Button
            type="button"
            variant="secondary"
            className="sm:mr-5"
            onPress={() =>
              setOpenOption(openOption === "chart" ? "list" : "chart")
            }
          >
            {openOption === "chart" ? (
              <div className="flex">
                <ChartArea size={20} className="text-gray-500" />
                <div className="hidden md:block">チャート表示</div>
              </div>
            ) : (
              <div className="flex">
                <LayoutList size={20} className="text-gray-500" />
                <div className="hidden md:block">リスト表示</div>
              </div>
            )}
          </Button>
          <Button
            type="button"
            variant="icon"
            className="ml-auto"
            onPress={dialog.dismiss}
          >
            <MinusCircle className="text-red-400" />
          </Button>
        </div>
      </div>
      <div className="flex items-center mx-1 my-1 text-gray-600/80">
        <div>合計</div>
        <div className="ml-1">{calculateTotalTime(query.data)}</div>
      </div>
      {query.data &&
        tags &&
        (openOption === "chart" ? (
          <PieChartComponent data={query.data} tags={tags} />
        ) : (
          <AnalysisListComponent data={query.data} tags={tags} />
        ))}
    </>
  )
}

const calculateTotalTime = (
  data: { interval: number }[] | undefined,
): string => {
  const totalSeconds = data
    ? data.reduce((acc, item) => acc + item.interval, 0)
    : 0
  // const hours = Math.floor(totalSeconds / 3600)
  // const minutes = Math.floor((totalSeconds % 3600) / 60)
  // return `${hours}時間 ${minutes}分
  return `${Math.floor(totalSeconds / 60)} 分`
}
