import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "AquaMarket Backend",
    version: "2.13.6",
  })
}
