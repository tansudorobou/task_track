import { atom } from "jotai"

export const listOpenAtom = atom<"list" | "calendar">("list")

export const isTaskStartedAtom = atom(false)

export const isTagsOpenAtom = atom(false)

export const isCreateTagOpenAtom = atom(false)
