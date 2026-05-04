/**
 * AquaMarket Mobile — Medusa v2 API Hooks
 * 
 * Replaces medusa-react (v1) hooks with direct @medusajs/js-sdk (v2) calls
 * wrapped in @tanstack/react-query for caching and state management.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { medusaClient } from "@/lib/config"

// ========================================
// Products
// ========================================
export function useProducts(params?: { limit?: number; offset?: number; category_id?: string[] }) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const result = await medusaClient.store.product.list(params)
      return result
    },
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const result = await medusaClient.store.product.retrieve(id)
      return result
    },
    enabled: !!id,
  })
}

// ========================================
// Categories
// ========================================
export function useCategories(params?: { limit?: number }) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: async () => {
      const result = await medusaClient.store.category.list(params)
      return result
    },
  })
}

// ========================================
// Cart
// ========================================
export function useGetCart(cartId: string | null) {
  return useQuery({
    queryKey: ["cart", cartId],
    queryFn: async () => {
      if (!cartId) return null
      const result = await medusaClient.store.cart.retrieve(cartId)
      return result
    },
    enabled: !!cartId,
  })
}

export function useCreateCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { region_id?: string }) => {
      const result = await medusaClient.store.cart.create(data)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

export function useAddLineItem(cartId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { variant_id: string; quantity: number }) => {
      const result = await medusaClient.store.cart.createLineItem(cartId, data)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] })
    },
  })
}

export function useUpdateLineItem(cartId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ lineItemId, quantity }: { lineItemId: string; quantity: number }) => {
      const result = await medusaClient.store.cart.updateLineItem(cartId, lineItemId, { quantity })
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] })
    },
  })
}

export function useRemoveLineItem(cartId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (lineItemId: string) => {
      const result = await medusaClient.store.cart.deleteLineItem(cartId, lineItemId)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] })
    },
  })
}

// ========================================
// Collections
// ========================================
export function useCollections(params?: { limit?: number }) {
  return useQuery({
    queryKey: ["collections", params],
    queryFn: async () => {
      const result = await medusaClient.store.collection.list(params)
      return result
    },
  })
}

// ========================================
// Regions
// ========================================
export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const result = await medusaClient.store.region.list()
      return result
    },
  })
}

// ========================================
// Customer (Auth)
// ========================================
export function useCustomer() {
  return useQuery({
    queryKey: ["customer"],
    queryFn: async () => {
      const result = await medusaClient.store.customer.retrieve()
      return result
    },
    retry: false,
  })
}

export function useCreateCustomer() {
  return useMutation({
    mutationFn: async (data: {
      first_name: string
      last_name: string
      email: string
      password: string
    }) => {
      // In v2, customer registration goes through auth first
      const authResult = await medusaClient.auth.register("customer", "emailpass", {
        email: data.email,
        password: data.password,
      })
      return authResult
    },
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await medusaClient.auth.login("customer", "emailpass", {
        email: data.email,
        password: data.password,
      })
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] })
    },
  })
}
