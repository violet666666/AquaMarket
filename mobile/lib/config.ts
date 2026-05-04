import Medusa from "@medusajs/js-sdk"
import { QueryClient } from "@tanstack/react-query"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL =
  process.env.EXPO_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24,
      retry: 1,
    },
  },
})

// Medusa JS SDK v2 client
const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  publishableKey: process.env.EXPO_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
})

export { MEDUSA_BACKEND_URL, queryClient, medusaClient }
