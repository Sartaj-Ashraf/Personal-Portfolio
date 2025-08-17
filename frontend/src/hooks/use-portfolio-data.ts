"use client";

import { useQuery } from "@tanstack/react-query";
import { profileAPI, contentAPI ,porjectAPI} from "@/lib/api";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await porjectAPI.getProjects();
      return response.data;
    },
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const response = await contentAPI.getExperiences();
      return response.data;
    },
  });
}

export function useTechStack() {
  return useQuery({
    queryKey: ["techstack"],
    queryFn: async () => {
      const response = await contentAPI.getTechStack();
      return response.data;
    },
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const response = await contentAPI.getSkills();
      return response.data;
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await profileAPI.getProfile();
      return response.data;
    },
  });
}
