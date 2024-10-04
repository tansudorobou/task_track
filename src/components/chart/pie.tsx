import { useDialogContainer } from "@adobe/react-spectrum"
import { parseDate } from "@internationalized/date"
import { useQuery } from "@tanstack/react-query"
import { endOfWeek, format, startOfWeek } from "date-fns"
import { useAtom } from "jotai"
import { MinusCircle } from "lucide-react"
import { useState } from "react"
import { Cell, Pie, PieChart, Tooltip } from "recharts"
import { weekOpenAtom } from "../atom"
import { getTags, getTasksByDateRange } from "../invokes"
import { Button } from "../stories/Button"
import { DateRangePicker } from "../stories/DateRangePicker"
import type { Dates, Item, Tag } from "../types"

export default function PieChartComponent() {
  const [weekOpen] = useAtom(weekOpenAtom)
  const dialog = useDialogContainer()
  const [dateRange, setDateRange] = useState({
    start:
      weekOpen === "week"
        ? parseDate(startOfWeek(new Date()).toISOString().slice(0, 10))
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
      <div className="flex">
        <DateRangePicker defaultValue={dateRange} onChange={setDateRange} />
        <Button
          type="button"
          variant="icon"
          className="ml-auto"
          onPress={dialog.dismiss}
        >
          <MinusCircle className="text-red-400" />
        </Button>
      </div>
      {query.data && tags && (
        <div className="md:flex">
          <PieTagsChartUI
            data={query.data as (Item & Dates)[]}
            tags={tags as Tag[]}
          />
          <PieTitlesChartUI data={query.data as (Item & Dates)[]} />
        </div>
      )}
    </>
  )
}

function PieTitlesChartUI({
  data,
}: {
  data: (Item & Dates)[]
}) {
  const chartData: ChartDataEntry[] = processTitlesChartData(data)

  function processTitlesChartData(data: (Item & Dates)[]) {
    let totalValue = 0

    return Object.values(
      data.reduce(
        (
          acc: {
            [key: string]: { name: string; value: number; color: string }
          },
          item,
        ) => {
          if (!acc[item.title]) {
            acc[item.title] = { name: item.title, value: 0, color: "gray" }
          }
          acc[item.title].value += item.interval
          totalValue += item.interval
          return acc
        },
        {},
      ),
    )
      .sort((a, b) => b.value - a.value)
      .map((item) => ({
        ...item,
        value: Number.parseFloat((item.value / 60).toFixed(2)),
      })) as ChartDataEntry[]
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    ...props
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        className="text-xs text-wrap"
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${truncate(props.name, 6)} ${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <>
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          data={chartData}
          isAnimationActive={false}
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          labelLine={false}
          label={renderCustomizedLabel}
        />
        <Tooltip formatter={(value) => `${value}分`} />
      </PieChart>
    </>
  )
}

function PieTagsChartUI({
  data,
  tags,
}: {
  data: (Item & Dates)[]
  tags: Tag[]
}) {
  const chartData: ChartDataEntry[] = processTagsChartData(data)

  function processTagsChartData(data: (Item & Dates)[]) {
    let totalValue = 0

    return Object.values(
      data.reduce(
        (
          acc: {
            [key: string]: { name: string; value: number; color: string }
          },
          item,
        ) => {
          for (const tag of item.tags) {
            if (!acc[tag]) {
              acc[tag] = { name: tag, value: 0, color: "gray" }
            }
            acc[tag].value += item.interval
            acc[tag].color =
              (tags as Tag[]).find((t: Tag) => t.name === tag)?.color || "gray"
            totalValue += item.interval
          }
          return acc
        },
        {},
      ),
    )
      .sort((a, b) => b.value - a.value)
      .map((item) => ({
        ...item,
        value: Number.parseFloat((item.value / 60).toFixed(2)),
      })) as ChartDataEntry[]
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    ...props
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="gray"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${truncate(props.name, 6)} ${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <>
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          data={chartData}
          isAnimationActive={false}
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={TailwindBgColor[entry.color]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}分`} />
      </PieChart>
    </>
  )
}

// Define the type for chartData entries
interface ChartDataEntry {
  name: string
  value: number
  color:
    | "gray"
    | "green"
    | "yellow"
    | "blue"
    | "red"
    | "purple"
    | "orange"
    | "pink"
}
const TailwindBgColor: {
  [key in
    | "gray"
    | "green"
    | "yellow"
    | "blue"
    | "red"
    | "purple"
    | "orange"
    | "pink"]: string
} = {
  gray: "#d1d5db",
  green: "#10b981",
  yellow: "#f59e0b",
  blue: "#3b82f6",
  red: "#ef4444",
  purple: "#8b5cf6",
  orange: "#f97316",
  pink: "#ec4899",
}

// 文字を6文字までに省略する
function truncate(str: string, num: number) {
  return str.length > num ? `${str.slice(0, num)}...` : str
}
