import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * POST /store/custom/midtrans/create-transaction
 * 
 * Menerima order_id dan data customer, lalu membuat Snap transaction token
 * yang akan digunakan oleh frontend untuk menampilkan popup pembayaran Midtrans.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { order_id, gross_amount, customer_name, customer_email, items } = req.body as {
      order_id: string
      gross_amount: number
      customer_name: string
      customer_email: string
      items?: Array<{
        id: string
        name: string
        price: number
        quantity: number
      }>
    }

    // Validasi input
    if (!order_id || !gross_amount) {
      return res.status(400).json({
        error: "order_id dan gross_amount wajib diisi.",
      })
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true"

    if (!serverKey) {
      return res.status(500).json({
        error: "MIDTRANS_SERVER_KEY belum dikonfigurasi di .env",
      })
    }

    // Midtrans Snap API endpoint
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions"

    // Buat parameter transaksi sesuai Midtrans Snap API
    const parameter = {
      transaction_details: {
        order_id: `AQUA-${order_id}-${Date.now()}`,
        gross_amount: Math.round(gross_amount), // Midtrans butuh integer
      },
      customer_details: {
        first_name: customer_name || "Customer",
        email: customer_email || "",
      },
      item_details: items?.map((item) => ({
        id: item.id,
        name: item.name.substring(0, 50), // Midtrans max 50 chars
        price: Math.round(item.price),
        quantity: item.quantity,
      })),
      callbacks: {
        finish: `${process.env.STORE_CORS?.split(",")[0] || "http://localhost:8000"}/id/order/confirmed`,
        unfinish: `${process.env.STORE_CORS?.split(",")[0] || "http://localhost:8000"}/id/checkout`,
        error: `${process.env.STORE_CORS?.split(",")[0] || "http://localhost:8000"}/id/checkout?error=payment`,
      },
    }

    // Panggil Midtrans Snap API dengan fetch (tidak butuh midtrans-client library)
    const authString = Buffer.from(`${serverKey}:`).toString("base64")

    const response = await fetch(snapUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(parameter),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[Midtrans] Error creating transaction:", data)
      return res.status(response.status).json({
        error: "Gagal membuat transaksi Midtrans",
        details: data,
      })
    }

    // Berhasil — kembalikan token dan redirect_url ke frontend
    return res.status(200).json({
      token: data.token,
      redirect_url: data.redirect_url,
      order_id: parameter.transaction_details.order_id,
    })
  } catch (error: any) {
    console.error("[Midtrans] Unexpected error:", error)
    return res.status(500).json({
      error: "Terjadi kesalahan server saat membuat transaksi.",
      message: error.message,
    })
  }
}
