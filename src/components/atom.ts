import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const listOpenAtom = atomWithStorage("listOpen", "list")

export const isTaskStartedAtom = atom(false)

export const isTagsOpenAtom = atom(false)

export const isCreateTagOpenAtom = atom(false)
