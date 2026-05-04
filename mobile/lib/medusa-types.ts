/**
 * AquaMarket Mobile — @medusajs/medusa Type Compatibility
 * 
 * This module provides type stubs for @medusajs/medusa (v1) types
 * that are used throughout the mobile app components.
 * 
 * In Medusa v2, these types come from different packages,
 * but for compatibility we re-export them as `any`.
 */

// Core entity types used across the mobile app
export type Product = any
export type Region = any
export type Cart = any
export type Customer = any
export type Order = any
export type Address = any
export type LineItem = any
export type Variant = any
export type Collection = any
export type MoneyAmount = any
export type ShippingOption = any
export type PaymentSession = any
export type Fulfillment = any
export type Discount = any
export type GiftCard = any
export type Country = any
export type Currency = any

// Request/Response types
export type StorePostCartsCartReq = any
export type StoreGetProductsParams = any
export type StorePostCustomersReq = any
export type StorePostCustomersCustomerReq = any

// Calculated types
export type CalculatedVariant = Variant & {
  calculated_price: number
  original_price: number
  calculated_price_type: string
}
