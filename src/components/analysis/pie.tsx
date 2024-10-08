import { Cell, Pie, PieChart, Tooltip } from "recharts"
import type { Dates, Item, Tag } from "../types"

export default function PieChartComponent({
  data,
  tags,
}: {
  data: (Item & Dates)[]
  tags: Tag[]
}) {
  return (
    <>
      <div className="md:flex">
        <PieChartUI data={data} type="tags" tags={tags} />
        <PieChartUI data={data} type="title" />
      </div>
    </>
  )
}

const PieChartUI = ({
  data,
  type,
  tags,
}: {
  data: (Item & Dates)[]
  type: "tags" | "title"
  tags?: Tag[]
}) => {
  const chartData = processChartData(data, type, tags)

  const getChartSize = () => {
    if (window.innerWidth < 480) {
      return { width: 200, height: 200, outerRadius: 60 }
    }
    if (window.innerWidth < 640) {
      return { width: 200, height: 200, outerRadius: 80 }
    }
    if (window.innerWidth < 768) {
      return { width: 300, height: 300, outerRadius: 120 }
    }
    if (window.innerWidth < 1024) {
      return { width: 350, height: 350, outerRadius: 140 }
    }
    return { width: 400, height: 400, outerRadius: 150 }
  }

  const { width, height, outerRadius } = getChartSize()
  const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"]

  return (
    <PieChart width={width} height={height}>
      <Pie
        dataKey="value"
        data={chartData}
        isAnimationActive={false}
        cx="50%"
        cy="50%"
        outerRadius={outerRadius}
        fill="#8884d8"
        labelLine={false}
        label={renderCustomizedLabel}
      >
        {chartData.map((entry, index) => (
          <Cell
            key={entry.name}
            fill={
              tags
                ? TailwindBgColor[entry.color]
                : index < 4
                  ? COLORS[index % COLORS.length]
                  : "gray"
            }
          />
        ))}
      </Pie>
      <Tooltip formatter={(value) => `${value}分`} />
    </PieChart>
  )
}

export const processChartData = (
  data: (Item & Dates)[],
  key: "tags" | "title",
  tags?: Tag[],
) => {
  let totalValue = 0

  return Object.values(
    data.reduce(
      (
        acc: {
          [key: string]: { name: string; value: number; color: string }
        },
        item,
      ) => {
        const keys = key === "tags" ? item.tags : [item.title]
        for (const k of keys) {
          if (!acc[k]) {
            acc[k] = { name: k, value: 0, color: "gray" }
          }
          acc[k].value += item.interval
          if (tags) {
            acc[k].color = tags.find((t: Tag) => t.name === k)?.color || "gray"
          }
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
      className="text-sm md:text-base text-wrap"
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
