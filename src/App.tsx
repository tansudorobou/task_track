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
import { Suspense, useState } from "react"
import TaskForm from "./components/form/form"
import { getTags, getTasksByDay, getTop50Items } from "./components/invokes"
import TaskList from "./components/list/list"
import { DatePicker } from "./components/stories/DatePicker"
import TagsCreate from "./components/tags/create"
import { TagsList } from "./components/tags/list"

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
              <div className="mx-5">
                <TaskFormLoader date={date} />
              </div>
            </Suspense>
            <div className="w-12 mx-5">
              <DatePicker defaultValue={date} onChange={setDate} key={"list"} />
            </div>
          </div>
          <div className="pt-[88px]">
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

function TaskFormLoader({ date }: { date: CalendarDate }) {
  const { data: tags } = useSuspenseQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  })
  const { data: items } = useSuspenseQuery({
    queryKey: ["top50"],
    queryFn: getTop50Items,
  })

  return <TaskForm tags={tags} items={items} date={date} />
}

function TaskListLoader({ date }: { date: CalendarDate }) {
  const { data: items } = useSuspenseQuery({
    queryKey: ["tasks", date.toString()],
    queryFn: () => getTasksByDay(date.toString()),
  })

  return <TaskList items={items} />
}
