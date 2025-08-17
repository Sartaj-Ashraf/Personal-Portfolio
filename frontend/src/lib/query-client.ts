"use client"

import { QueryClient } from "@tanstack/react-query"
import { useState } from "react"

export function useReactQueryClient() {
  // Lazily create one shared client per app lifecycle
  const [queryClient] = useState(() => new QueryClient())
  return queryClient
}
