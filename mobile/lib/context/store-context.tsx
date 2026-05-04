import { medusaClient } from 'lib/config'
import React, { useEffect, useState, useCallback } from 'react'
import { useCartDropdown } from './cart-dropdown-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { ToastPosition, toast } from '@backpackapp-io/react-native-toast'

interface VariantInfoProps {
  variantId: string
  quantity: number
}

interface LineInfoProps {
  lineId: string
  quantity: number
}

interface StoreContext {
  countryCode: string | undefined
  setRegion: (regionId: string, countryCode: string) => void
  addItem: (item: VariantInfoProps) => void
  updateItem: (item: LineInfoProps) => void
  deleteItem: (lineId: string) => void
  resetCart: () => void
}

const StoreContext = React.createContext<StoreContext | null>(null)

export const useStore = () => {
  const context = React.useContext(StoreContext)
  if (context === null) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

interface StoreProps {
  children: React.ReactNode
}

const IS_SERVER = !['web', 'ios', 'android'].includes(Platform.OS)
const CART_KEY = 'medusa_cart_id'
const REGION_KEY = 'medusa_region'

export const StoreProvider = ({ children }: StoreProps) => {
  const [cart, setCart] = useState<any>(null)
  const [countryCode, setCountryCode] = useState<string | undefined>(undefined)
  const { timedOpen } = useCartDropdown()

  // ========================================
  // Storage helpers
  // ========================================
  const storeRegion = async (regionId: string, countryCode: string) => {
    if (!IS_SERVER) {
      await AsyncStorage.setItem(REGION_KEY, JSON.stringify({ regionId, countryCode }))
      setCountryCode(countryCode)
    }
  }

  const getRegion = async () => {
    if (!IS_SERVER) {
      const region = await AsyncStorage.getItem(REGION_KEY)
      if (region) return JSON.parse(region) as { regionId: string; countryCode: string }
    }
    return null
  }

  const storeCart = async (id: string) => {
    if (!IS_SERVER) await AsyncStorage.setItem(CART_KEY, id)
  }

  const getCart = async () => {
    if (!IS_SERVER) return await AsyncStorage.getItem(CART_KEY)
    return null
  }

  const deleteCart = async () => {
    if (!IS_SERVER) await AsyncStorage.removeItem(CART_KEY)
  }

  // ========================================
  // Cart operations using Medusa v2 JS SDK
  // ========================================
  const createNewCart = async (regionId?: string) => {
    try {
      const result = await medusaClient.store.cart.create({ region_id: regionId })
      const newCart = result.cart
      setCart(newCart)
      await storeCart(newCart.id)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Create cart error:', error)
    }
  }

  const setRegion = async (regionId: string, countryCode: string) => {
    try {
      if (cart?.id) {
        const result = await medusaClient.store.cart.update(cart.id, { region_id: regionId })
        setCart(result.cart)
      }
      await storeRegion(regionId, countryCode)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Set region error:', error)
    }
  }

  const resetCart = async () => {
    await deleteCart()
    const savedRegion = await getRegion()
    await createNewCart(savedRegion?.regionId)
  }

  // ========================================
  // Initialize cart on mount
  // ========================================
  useEffect(() => {
    const loadRegion = async () => {
      if (!IS_SERVER) {
        const storedRegion = await AsyncStorage.getItem(REGION_KEY)
        if (storedRegion) {
          const { countryCode } = JSON.parse(storedRegion)
          setCountryCode(countryCode)
        }
      }
    }
    loadRegion()
  }, [])

  useEffect(() => {
    const ensureCart = async () => {
      const cartId = await getCart()
      const region = await getRegion()

      if (cartId) {
        try {
          // Medusa v2 SDK: store.cart.retrieve
          const result = await medusaClient.store.cart.retrieve(cartId)
          const existingCart = result.cart

          if (!existingCart || existingCart.completed_at) {
            await deleteCart()
            await createNewCart()
            return
          }

          setCart(existingCart)
        } catch {
          await deleteCart()
          await createNewCart(region?.regionId)
        }
      } else {
        await createNewCart(region?.regionId)
      }
    }

    if (!IS_SERVER && !cart?.id) {
      ensureCart()
    }
  }, [])

  // ========================================
  // Line item operations
  // ========================================
  const addItem = useCallback(async ({ variantId, quantity }: VariantInfoProps) => {
    if (!cart?.id) return
    try {
      const result = await medusaClient.store.cart.createLineItem(cart.id, {
        variant_id: variantId,
        quantity,
      })
      setCart(result.cart)
      await storeCart(result.cart.id)
      timedOpen()
      toast.success('Ditambahkan ke keranjang')
    } catch (error: any) {
      toast.error('Gagal menambahkan item')
      console.error('Add item error:', error)
    }
  }, [cart?.id, timedOpen])

  const deleteItem = useCallback(async (lineId: string) => {
    if (!cart?.id) return
    try {
      const result = await medusaClient.store.cart.deleteLineItem(cart.id, lineId)
      setCart(result.cart)
      await storeCart(result.cart.id)
    } catch (error: any) {
      console.error('Delete item error:', error)
    }
  }, [cart?.id])

  const updateItem = useCallback(async ({ lineId, quantity }: LineInfoProps) => {
    if (!cart?.id) return
    try {
      const result = await medusaClient.store.cart.updateLineItem(cart.id, lineId, { quantity })
      setCart(result.cart)
      await storeCart(result.cart.id)
    } catch (error: any) {
      console.error('Update item error:', error)
    }
  }, [cart?.id])

  return (
    <StoreContext.Provider
      value={{
        countryCode,
        setRegion,
        addItem,
        deleteItem,
        updateItem,
        resetCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
