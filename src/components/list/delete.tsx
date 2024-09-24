import { Trash2 } from "lucide-react"
import { Text } from "react-aria-components"

import { Button } from "../stories/Button"
import { Dialog } from "../stories/Dialog"

export function DeleteDialog({
  onMutate,
  onPress,
}: {
  onMutate: () => void
  onPress: () => void
}) {
  return (
    <Dialog className="mx-5 my-5">
      <Text className="flex gap-2 text-xl items-center font-bold">
        本当に削除しますか？ <Trash2 className="w-5 h-5" />
      </Text>
      <div className="flex gap-4 justify-center mt-5">
        <Button
          variant="destructive"
          onPress={() => {
            onMutate()
            onPress()
          }}
        >
          はい
        </Button>
        <Button variant="secondary" onPress={() => onPress()}>
          いいえ
        </Button>
      </div>
    </Dialog>
  )
}
