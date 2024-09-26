import { Provider, defaultTheme } from "@adobe/react-spectrum"
import {
  type CalendarDate,
  fromDate,
  toCalendarDate,
} from "@internationalized/date"
import {
  QueryClient,
  QueryClientProvider,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { message } from "@tauri-apps/api/dialog"
import { listen } from "@tauri-apps/api/event"
import { useAtom } from "jotai"
import { Suspense, lazy, useState } from "react"
import { listOpenAtom } from "./components/atom"
import { getTags, getTasksByDay, getTop50Items } from "./components/invokes"
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
  const zonedDateTime = fromDate(new Date(), "Asia/Tokyo")
  const calendarDate: CalendarDate = toCalendarDate(zonedDateTime)
  const [date, setDate] = useState<CalendarDate>(calendarDate)

  return (
    <QueryClientProvider client={queryClient}>
      <Provider theme={defaultTheme} colorScheme="light">
        <div className="max-w-full max-h-full">
          <div className="fixed z-40 w-full bg-gray-50 pb-2">
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
      <div className="mx-5">
        <TaskForm tags={tags} items={items} date={date} />
      </div>
      <div className="flex mx-5 w-12">
        <DatePicker defaultValue={date} onChange={setDate} key={"list"} />
        <NewTaskForm tags={tags} date={date} className="ml-5 hidden xs:block" />
        <ListSwitch className="ml-5 whitespace-nowrap" />
      </div>
    </>
  )
}

function TaskListLoader({ date }: { date: CalendarDate }) {
  const { data: items } = useSuspenseQuery({
    queryKey: ["tasks", date.toString()],
    queryFn: () => getTasksByDay(date.toString()),
  })

  const { data: tags } = useSuspenseQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  })

  const [listOpen] = useAtom(listOpenAtom)
  const dateString = date.toString()

  return (
    <>
      {(() => {
        switch (listOpen) {
          case "calendar":
            return <CalendarView items={items} date={dateString} tags={tags} />
          default:
            return <TaskList items={items} tags={tags} />
        }
      })()}
    </>
  )
}
