import { medusaClient } from '@/lib/config'

const COL_LIMIT = 15

/**
 * Get featured products using Medusa v2 SDK
 */
const getFeaturedProducts = async (): Promise<any[]> => {
  const payload: Record<string, unknown> = {}

  if (process.env.FEATURED_PRODUCTS) {
    payload.id = process.env.FEATURED_PRODUCTS as string
  } else {
    payload.limit = 3
  }

  try {
    const { products } = await medusaClient.store.product.list(payload)
    return products
  } catch {
    return []
  }
}

/**
 * Get global data used in header and footer
 */
const getGlobalData = async () => {
  let totalCount = 0

  let collections: any[] = []
  try {
    const result = await medusaClient.store.collection.list({ limit: COL_LIMIT })
    collections = result.collections || []
    totalCount = result.count || 0
  } catch {
    collections = []
  }

  const featuredProducts = await getFeaturedProducts()

  return {
    navData: {
      hasMoreCollections: totalCount > COL_LIMIT,
      collections: collections.map((c: any) => ({ id: c.id, title: c.title })),
      featuredProducts,
    },
  }
}

export const getSiteData = async () => {
  const globalData = await getGlobalData()
  return { site: globalData }
}

/**
 * Get data for a specific product by handle
 */
export const getProductData = async (handle: string) => {
  try {
    const { products } = await medusaClient.store.product.list({ handle })
    const product = products[0]

    if (!product) {
      throw new Error(`Product with handle ${handle} not found`)
    }

    return { page: { data: product } }
  } catch (error) {
    throw error
  }
}

const getInitialProducts = async (collectionId: string) => {
  try {
    const { products, count } = await medusaClient.store.product.list({
      collection_id: [collectionId],
      limit: 10,
    })

    return {
      initialProducts: products,
      count: count || 0,
      hasMore: (count || 0) > 10,
    }
  } catch {
    return { initialProducts: [], count: 0, hasMore: false }
  }
}

/**
 * Get data for a specific collection
 */
export const getCollectionData = async (id: string) => {
  const siteData = await getGlobalData()

  let data: any = null
  try {
    const result = await medusaClient.store.collection.retrieve(id)
    data = result.collection
  } catch {
    throw new Error(`Collection with id ${id} not found`)
  }

  const additionalData = await getInitialProducts(id)

  return {
    page: { data, additionalData },
    site: siteData,
  }
}

type FetchProductListParams = {
  pageParam?: number
  queryParams: any
}

/**
 * Fetch products list with pagination
 */
export const fetchProductsList = async ({
  pageParam = 0,
  queryParams,
}: FetchProductListParams) => {
  const { products, count } = await medusaClient.store.product.list({
    limit: 12,
    offset: pageParam,
    ...queryParams,
  })

  const offset = pageParam

  return {
    response: { products, count },
    nextPage: (count || 0) > offset + 12 ? offset + 12 : null,
  }
}
