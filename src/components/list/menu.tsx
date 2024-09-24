import { MoreHorizontal, PenSquare, Trash2 } from "lucide-react"
import { type Key, MenuTrigger } from "react-aria-components"
import { Button } from "../stories/Button"
import { Menu, MenuItem, MenuSeparator } from "../stories/Menu"

export function ListMenu({
  onAction,
  disabledKeys,
}: { onAction: (key: Key) => void; disabledKeys?: string[] }) {
  return (
    <MenuTrigger>
      <Button variant="icon" className="px-2">
        <MoreHorizontal className="w-5 h-5" />
      </Button>
      <Menu onAction={onAction} disabledKeys={disabledKeys}>
        <MenuItem id="edit" key="edit">
          <PenSquare className="w-5 h-5" /> 編集
        </MenuItem>
        <MenuSeparator />
        <MenuItem id="delete" key="delete">
          <Trash2 className="w-5 h-5" /> 削除
        </MenuItem>
      </Menu>
    </MenuTrigger>
  )
}
