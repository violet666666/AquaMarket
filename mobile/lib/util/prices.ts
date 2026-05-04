import { formatAmount } from "medusa-react"
import { Region, Variant } from "types/medusa"

// v2 compatible: use `any` for MoneyAmount since @medusajs/medusa (v1) types are removed
type PriceAmount = { amount: number; region_id?: string; currency_code?: string }

export const findCheapestRegionPrice = (variants: Variant[], regionId: string) => {
  const regionPrices = variants.reduce((acc, v) => {
    const price = v.prices?.find((p: any) => p.region_id === regionId)
    if (price) {
      acc.push(price)
    }
    return acc
  }, [] as PriceAmount[])

  if (!regionPrices.length) {
    return undefined
  }

  const cheapestPrice = regionPrices.reduce((acc, p) => {
    if (acc.amount > p.amount) return p
    return acc
  })

  return cheapestPrice
}

export const findCheapestCurrencyPrice = (
  variants: Variant[],
  currencyCode: string
) => {
  const currencyPrices = variants.reduce((acc, v) => {
    const price = v.prices?.find((p: any) => p.currency_code === currencyCode)
    if (price) {
      acc.push(price)
    }
    return acc
  }, [] as PriceAmount[])

  if (!currencyPrices.length) {
    return undefined
  }

  const cheapestPrice = currencyPrices.reduce((acc, p) => {
    if (acc.amount > p.amount) return p
    return acc
  })

  return cheapestPrice
}

export const findCheapestPrice = (variants: Variant[], region: Region) => {
  const { id, currency_code } = region
  
  let cheapestPrice = findCheapestRegionPrice(variants, id)

  if (!cheapestPrice) {
    cheapestPrice = findCheapestCurrencyPrice(variants, currency_code)
  }

  if (cheapestPrice) {
    return formatAmount({
      amount: cheapestPrice.amount,
      region: region,
    })
  }

  return "Tidak tersedia di region Anda"
}
