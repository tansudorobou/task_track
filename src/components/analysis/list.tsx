import type { Dates, Item, Tag } from "../types"
import { processChartData } from "./pie"

export default function AnalysisListComponent({
  data,
  tags,
}: {
  data: (Item & Dates)[]
  tags: Tag[]
}) {
  const titleChartData = processChartData(data, "title")
  const tagChartData = processChartData(data, "tags", tags)

  const height = Math.floor(window.innerHeight / 2)

  return (
    <div
      className="w-full bg-opacity-100 overflow-y-scroll my-2 md:flex"
      style={{ height: `${height}px` }}
    >
      <div>
        <div className="text-base ml-4">タイトル</div>
        <ul className="mx-1 xs:mx-5 pb-2">
          {titleChartData?.map((item) => (
            <li
              key={item.name}
              className="flex gap-2 border border-gray-300 rounded-md my-2 px-4 items-center bg-white/90 h-10"
            >
              <div className="w-2/4 whitespace-nowrap text-ellipsis overflow-hidden">
                {item.name}
              </div>
              <div className="flex ml-auto gap-2 items-center">
                <div className="text-right">{Math.ceil(item.value)} 分</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-base ml-4">タグ</div>
        <ul className="mx-1 xs:mx-5 pb-2">
          {tagChartData?.map((item) => (
            <li
              key={item.name}
              className="flex gap-2 border border-gray-300 rounded-md my-2 px-4 items-center bg-white/90 h-10"
            >
              <div className="w-2/4 whitespace-nowrap text-ellipsis overflow-hidden">
                {item.name}
              </div>
              <div className="flex ml-auto gap-2 items-center">
                <div className="text-right">{Math.ceil(item.value)} 分</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
