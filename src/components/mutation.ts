import { useMutation, useQueryClient } from "@tanstack/react-query"
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
  return useMutation({
    mutationFn: (jsonData: Item & Dates) => updateTask(jsonData),
    onMutate: (jsonData: Item & Dates) => {
      queryClient.setQueryData(["tasks", jsonData.date], (data: Item[]) => {
        return data.map((item) => {
          if (item.id === jsonData.id) {
            return jsonData
          }
          return item
        })
      })
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jsonData: Item & Dates) => addTask(jsonData),
    onMutate: (jsonData: Item & Dates) => {
      queryClient.setQueryData(["tasks", jsonData.date], (data: Item[]) => {
        return [...data, jsonData]
      })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jsonData: Item & Dates) => removeTask(jsonData.id),
    onMutate: (jsonData: Item & Dates) => {
      queryClient.setQueryData(["tasks", jsonData.date], (data: Item[]) => {
        return data.filter((item) => item.id !== jsonData.id)
      })
    },
  })
}

export function useIsStarted() {
  const queryClient = useQueryClient()
  const IS_STARTED_QUERY_KEY = ["isStarted"] // 配列として定義

  // `getQueryData`を配列形式のキーで呼び出し
  const isStarted =
    (queryClient.getQueryData(IS_STARTED_QUERY_KEY) as boolean) || false

  const mutation = useMutation({
    mutationFn: async (newState: boolean) => newState,
    onMutate: (newState: boolean) => {
      queryClient.setQueryData(IS_STARTED_QUERY_KEY, newState)
    },
  })

  return {
    isStarted,
    setIsStarted: mutation.mutate,
  }
}

export function useIsTagsOpen() {
  const queryClient = useQueryClient()
  const IS_TAGS_OPEN_QUERY_KEY = ["isTagsOpen"]

  const isTagsOpen =
    (queryClient.getQueryData(IS_TAGS_OPEN_QUERY_KEY) as boolean) || false

  const mutation = useMutation({
    mutationFn: async (newState: boolean) => newState,
    onMutate: (newState: boolean) => {
      queryClient.setQueryData(IS_TAGS_OPEN_QUERY_KEY, newState)
    },
  })

  return {
    isTagsOpen,
    setIsTagsOpen: mutation.mutate,
  }
}

export function useIsTagsEditOpen() {
  const queryClient = useQueryClient()
  const IS_TAGS_EDIT_OPEN_QUERY_KEY = ["isTagsEditOpen"]

  const isTagsEditOpen =
    (queryClient.getQueryData(IS_TAGS_EDIT_OPEN_QUERY_KEY) as boolean) || false

  const mutation = useMutation({
    mutationFn: async (newState: boolean) => newState,
    onMutate: (newState: boolean) => {
      queryClient.setQueryData(IS_TAGS_EDIT_OPEN_QUERY_KEY, newState)
    },
  })

  return {
    isTagsEditOpen,
    setIsTagsEditOpen: mutation.mutate,
  }
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

export function useIsCreateTagOpen() {
  const queryClient = useQueryClient()
  const IS_CREATE_TAG_OPEN_QUERY_KEY = ["isCreateTagOpen"]

  const createTagOpen =
    (queryClient.getQueryData(IS_CREATE_TAG_OPEN_QUERY_KEY) as boolean) || false

  const mutation = useMutation({
    mutationFn: async (newState: boolean) => newState,
    onMutate: (newState: boolean) => {
      queryClient.setQueryData(IS_CREATE_TAG_OPEN_QUERY_KEY, newState)
    },
  })

  return {
    createTagOpen,
    setCreateTagOpen: mutation.mutate,
  }
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
