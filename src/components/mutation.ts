import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { weekEndAtom, weekStartAtom } from "./atom"
import {
  addTag,
  addTask,
  removeTag,
  removeTask,
  updateTag,
  updateTask,
} from "./invokes"
import type { Dates, Item, Tag } from "./types"

export function useUpdateTask() {
  const queryClient = useQueryClient()
  const weekStart = useAtomValue(weekStartAtom)
  const weekEnd = useAtomValue(weekEndAtom)

  return useMutation({
    mutationFn: (jsonData: Item & Dates) => updateTask(jsonData),
    onMutate: (jsonData: Item & Dates) => {
      queryClient.setQueryData(
        ["tasks", weekStart, weekEnd],
        (data: Item[]) => {
          return data.map((item) => {
            if (item.id === jsonData.id) {
              return jsonData
            }
            return item
          })
        },
      )
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const weekStart = useAtomValue(weekStartAtom)
  const weekEnd = useAtomValue(weekEndAtom)

  return useMutation({
    mutationFn: (jsonData: Item & Dates) => addTask(jsonData),
    onMutate: (jsonData: Item & Dates) => {
      queryClient.setQueryData(
        ["tasks", weekStart, weekEnd],
        (data: Item[]) => {
          return [...data, jsonData]
        },
      )
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  const weekStart = useAtomValue(weekStartAtom)
  const weekEnd = useAtomValue(weekEndAtom)

  return useMutation({
    mutationFn: (jsonData: Item & Dates) => removeTask(jsonData.id),
    onMutate: (jsonData: Item & Dates) => {
      queryClient.setQueryData(
        ["tasks", weekStart, weekEnd],
        (data: Item[]) => {
          return data.filter((item) => item.id !== jsonData.id)
        },
      )
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jsonData: Tag) => updateTag(jsonData),
    onMutate: (jsonData: Tag) => {
      queryClient.setQueryData(["tags"], (data: Tag[]) => {
        return data.map((tag) => {
          if (tag.id === jsonData.id) {
            return jsonData
          }
          return tag
        })
      })
    },
  })
}

export function useAddTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jsonData: Tag) => addTag(jsonData),
    onMutate: (jsonData: Tag) => {
      queryClient.setQueryData(["tags"], (data: Tag[]) => {
        return [...data, jsonData]
      })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jsonData: Tag) => removeTag(jsonData.id),
    onMutate: (jsonData: Tag) => {
      queryClient.setQueryData(["tags"], (data: Tag[]) => {
        return data.filter((tag) => tag.id !== jsonData.id)
      })
    },
  })
}
