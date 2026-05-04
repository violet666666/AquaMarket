/**
 * AquaMarket Mobile — medusa-react Compatibility Shim
 * 
 * This module provides drop-in replacements for medusa-react v1 hooks
 * using @medusajs/js-sdk v2 under the hood.
 * 
 * This allows existing components to continue working without mass refactoring.
 * Import from '@/lib/medusa-compat' instead of 'medusa-react'.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { medusaClient, MEDUSA_BACKEND_URL } from "@/lib/config"

// ========================================
// Format Amount — replaces medusa-react formatAmount
// ========================================
export function formatAmount({
  amount,
  region,
  includeTaxes = true,
}: {
  amount: number
  region: any
  includeTaxes?: boolean
}): string {
  const currencyCode = region?.currency_code || "idr"
  const divisor = currencyCode === "idr" ? 1 : 100

  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount / divisor)
  } catch {
    return `${currencyCode.toUpperCase()} ${(amount / divisor).toLocaleString("id-ID")}`
  }
}

export function formatVariantPrice({
  variant,
  region,
}: {
  variant: any
  region: any
}): string {
  const price = variant?.prices?.find(
    (p: any) => p.currency_code === region?.currency_code
  )
  if (!price) return ""
  return formatAmount({ amount: price.amount, region })
}

// ========================================
// Cart Hooks — replaces medusa-react useCart
// ========================================
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type CartState = {
  cart: any | null
  totalItems: number
  addItem: (item: { variantId: string; quantity: number }) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  updateItem: (lineItemId: string, data: { quantity: number }) => Promise<void>
  setCart: (cart: any) => void
  createCart: () => Promise<any>
}

const CartContext = createContext<CartState>({
  cart: null,
  totalItems: 0,
  addItem: async () => {},
  removeItem: async () => {},
  updateItem: async () => {},
  setCart: () => {},
  createCart: async () => null,
})

export { CartContext }

export function useCart() {
  return useContext(CartContext)
}

// ========================================
// Customer Hooks
// ========================================
export function useMeCustomer() {
  return useQuery({
    queryKey: ["me", "customer"],
    queryFn: async () => {
      try {
        const result = await medusaClient.store.customer.retrieve()
        return { customer: result.customer }
      } catch {
        return { customer: null }
      }
    },
    retry: false,
  })
}

export function useUpdateMe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const result = await medusaClient.store.customer.update(data)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] })
    },
  })
}

export function useCustomerOrders(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["customer", "orders", params],
    queryFn: async () => {
      const result = await medusaClient.store.order.list(params)
      return { orders: result.orders, count: result.count }
    },
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const result = await medusaClient.store.order.retrieve(id)
      return { order: result.order }
    },
    enabled: !!id,
  })
}

// ========================================
// Products & Collections
// ========================================
export function useProducts(params?: any) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const result = await medusaClient.store.product.list(params)
      return { products: result.products, count: result.count }
    },
  })
}

export function useCollections(params?: any) {
  return useQuery({
    queryKey: ["collections", params],
    queryFn: async () => {
      const result = await medusaClient.store.collection.list(params)
      return { collections: result.collections }
    },
  })
}

// ========================================
// Region Hooks
// ========================================
export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const result = await medusaClient.store.region.list()
      return { regions: result.regions }
    },
  })
}

// ========================================
// Cart Shipping Options
// ========================================
export function useCartShippingOptions(cartId: string) {
  return useQuery({
    queryKey: ["shipping-options", cartId],
    queryFn: async () => {
      const result = await medusaClient.store.fulfillment.listCartOptions({ cart_id: cartId })
      return { shipping_options: result.shipping_options }
    },
    enabled: !!cartId,
  })
}

// ========================================
// Update Cart
// ========================================
export function useUpdateCart(cartId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const result = await medusaClient.store.cart.update(cartId, data)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

// ========================================
// Order Keys (for query invalidation)
// ========================================
export const orderKeys = {
  all: ["orders"] as const,
}

// ========================================
// Cart Line Item Mutations
// ========================================
export function useCreateLineItem(cartId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { variant_id: string; quantity: number }) => {
      const result = await medusaClient.store.cart.createLineItem(cartId, data)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

export function useDeleteLineItem(cartId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ lineId }: { lineId: string }) => {
      const result = await medusaClient.store.cart.deleteLineItem(cartId, lineId)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

export function useUpdateLineItem(cartId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ lineId, quantity }: { lineId: string; quantity: number }) => {
      const result = await medusaClient.store.cart.updateLineItem(cartId, lineId, { quantity })
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

// ========================================
// Payment Session
// ========================================
export function useSetPaymentSession(cartId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ provider_id }: { provider_id: string }) => {
      const result = await medusaClient.store.payment.initiatePaymentSession(
        { id: cartId } as any,
        { provider_id }
      )
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

// ========================================
// Complete Cart
// ========================================
export function useCompleteCart(cartId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await medusaClient.store.cart.complete(cartId)
      return result
    },
  })
}

