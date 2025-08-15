"use client"

import { useQuery } from "@tanstack/react-query"
import { contentAPI } from "@/lib/api"

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await contentAPI.getProjects()
      return response.data
    },
  })
}

export function useTechStack() {
  return useQuery({
    queryKey: ["techstack"],
    queryFn: async () => {
      const response = await contentAPI.getTechStack()
      return response.data
    },
  })
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const response = await contentAPI.getSkills()
      return response.data
    },
  })
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await contentAPI.getProfile()
      return response.data
    },
  })
}
