import { DialogContainer } from "@adobe/react-spectrum"
import { LucideAreaChart } from "lucide-react"
import { useState } from "react"
import { Button } from "../stories/Button"
import { Dialog } from "../stories/Dialog"
import PieChartComponent from "./pie"

export default function ChartView({
  className,
}: {
  className: string
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<string | null>(null)

  return (
    <>
      <div className={className}>
        <Button
          className="whitespace-nowrap px-2 xs:px-5"
          variant="secondary"
          onPress={() => setIsDialogOpen("title")}
        >
          <div className="flex items-center gap-1">
            <LucideAreaChart size={20} className="text-gray-500" />
            <div className="hidden md:block">チャート表示</div>
          </div>
        </Button>
      </div>
      <DialogContainer onDismiss={() => setIsDialogOpen(null)}>
        {isDialogOpen === "title" && (
          <Dialog>
            <PieChartComponent />
          </Dialog>
        )}
      </DialogContainer>
    </>
  )
}
