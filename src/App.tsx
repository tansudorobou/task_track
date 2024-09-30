import { Provider, defaultTheme } from "@adobe/react-spectrum"
import type { CalendarDate } from "@internationalized/date"
import {
  QueryClient,
  QueryClientProvider,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { message } from "@tauri-apps/api/dialog"
import { listen } from "@tauri-apps/api/event"
import { useAtom, useAtomValue } from "jotai"
import { Suspense, lazy } from "react"
import {
  dateAtom,
  listOpenAtom,
  weekEndAtom,
  weekOpenAtom,
  weekStartAtom,
} from "./components/atom"
import {
  getTags,
  getTasksByDateRange,
  getTop50Items,
} from "./components/invokes"
import TaskList from "./components/list/list"
import { DatePicker } from "./components/stories/DatePicker"

const TaskForm = lazy(() => import("./components/form/form"))
const NewTaskForm = lazy(() => import("./components/form/new"))
const ListSwitch = lazy(() => import("./components/form/switch"))
const CalendarView = lazy(() => import("./components/list/calendar"))
const TagsCreate = lazy(() => import("./components/tags/create"))
const TagsList = lazy(() => import("./components/tags/list"))

const queryClient = new QueryClient()

listen("export", async (envent) => {
  message(envent.payload as string)
})

function App() {
  const [date, setDate] = useAtom(dateAtom)

  return (
    <QueryClientProvider client={queryClient}>
      <Provider theme={defaultTheme} colorScheme="light">
        <div className="max-w-full h-screen">
          <div className="fixed z-40 w-full bg-opacity-100 pb-2">
            <Suspense fallback={<div>Loading...</div>} key={"form"}>
              <TaskFormLoader date={date} setDate={setDate} />
            </Suspense>
          </div>
          <div className="pt-[92px] h-screen">
            <Suspense fallback={<div>Loading...</div>}>
              <TaskListLoader date={date} />
            </Suspense>
          </div>
        </div>
        <TagsList />
        <TagsCreate />
      </Provider>
    </QueryClientProvider>
  )
}

export default App

function TaskFormLoader({
  date,
  setDate,
}: { date: CalendarDate; setDate: (date: CalendarDate) => void }) {
  const { data: tags } = useSuspenseQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  })
  const { data: items } = useSuspenseQuery({
    queryKey: ["top50"],
    queryFn: getTop50Items,
  })

  return (
    <>
      <div className="mx-1 xs:mx-5">
        <TaskForm tags={tags} items={items} date={date} />
      </div>
      <div className="flex mx-1 xs:mx-5">
        <DatePicker defaultValue={date} onChange={setDate} key={"list"} />
        <NewTaskForm tags={tags} date={date} className="ml-1 xs:ml-5" />
        <ListSwitch className="ml-1 xs:ml-5 whitespace-nowrap px-2 xs:px-5" />
      </div>
    </>
  )
}

function TaskListLoader({ date }: { date: CalendarDate }) {
  const weekStart = useAtomValue(weekStartAtom)
  const weekEnd = useAtomValue(weekEndAtom)

  const { data: tags } = useSuspenseQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  })

  const { data: items } = useSuspenseQuery({
    queryKey: ["tasks", weekStart, weekEnd],
    queryFn: () => getTasksByDateRange(weekStart, weekEnd),
  })

  const [listOpen] = useAtom(listOpenAtom)
  const [weekOpen] = useAtom(weekOpenAtom)
  const dateString = date.toString()

  const filteredItems =
    weekOpen === "day"
      ? items.filter((item) => item.date === dateString)
      : items

  return (
    <>
      {(() => {
        switch (listOpen) {
          case "calendar":
            return (
              <CalendarView
                items={filteredItems}
                date={dateString}
                tags={tags}
                timeGrid={weekOpen === "week" ? "timeGridWeek" : "timeGridDay"}
              />
            )
          default:
            return <TaskList items={filteredItems} tags={tags} />
        }
      })()}
    </>
  )
}
