import React, { createContext, useContext, useState, useEffect } from "react"
import { MEDUSA_BACKEND_URL, queryClient, medusaClient } from "@/lib/config"
import { QueryClientProvider } from "@tanstack/react-query"

// ========================================
// Medusa v2 SDK Context
// ========================================
type CartContextType = {
  cartId: string | null
  setCartId: (id: string | null) => void
}

const CartContext = createContext<CartContextType>({
  cartId: null,
  setCartId: () => {},
})

export function useCart() {
  return useContext(CartContext)
}

export function Cart({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null)

  return (
    <CartContext.Provider value={{ cartId, setCartId }}>
      {children}
    </CartContext.Provider>
  )
}

// ========================================
// SDK Context — provides medusaClient globally
// ========================================
type MedusaContextType = {
  client: typeof medusaClient
}

const MedusaContext = createContext<MedusaContextType>({
  client: medusaClient,
})

export function useMedusa() {
  return useContext(MedusaContext)
}

export function Medusa({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MedusaContext.Provider value={{ client: medusaClient }}>
        {children}
      </MedusaContext.Provider>
    </QueryClientProvider>
  )
}
