import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"

/**
 * POST /store/custom/midtrans/notification
 * 
 * Webhook endpoint yang dipanggil oleh Midtrans saat status pembayaran berubah.
 * Midtrans mengirim HTTP POST notification ke URL ini setelah customer menyelesaikan,
 * membatalkan, atau timeout pembayaran.
 * 
 * Flow:
 * 1. Midtrans mengirim notification payload
 * 2. Kita verifikasi signature_key untuk memastikan authenticity
 * 3. Update status order di Medusa sesuai transaction_status
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const notification = req.body as {
      order_id: string
      status_code: string
      gross_amount: string
      signature_key: string
      transaction_status: string
      fraud_status?: string
      payment_type: string
      transaction_id: string
      transaction_time: string
    }

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = notification

    // Log untuk debugging
    console.log("[Midtrans Webhook] Received notification:", {
      order_id,
      transaction_status,
      payment_type,
      fraud_status,
    })

    // ========================================
    // Step 1: Verifikasi Signature Key
    // ========================================
    const serverKey = process.env.MIDTRANS_SERVER_KEY
    if (!serverKey) {
      console.error("[Midtrans Webhook] MIDTRANS_SERVER_KEY tidak ditemukan")
      return res.status(500).json({ error: "Server key not configured" })
    }

    // Signature = SHA512(order_id + status_code + gross_amount + server_key)
    const expectedSignature = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex")

    if (signature_key !== expectedSignature) {
      console.error("[Midtrans Webhook] Signature mismatch!", {
        received: signature_key?.substring(0, 20) + "...",
        expected: expectedSignature.substring(0, 20) + "...",
      })
      return res.status(403).json({ error: "Invalid signature" })
    }

    console.log("[Midtrans Webhook] Signature verified ✓")

    // ========================================
    // Step 2: Tentukan action berdasarkan transaction_status
    // ========================================
    let orderAction: "capture" | "cancel" | "pending" | "expire" = "pending"

    if (transaction_status === "capture") {
      // Kartu kredit — cek fraud status
      orderAction = fraud_status === "accept" ? "capture" : "cancel"
    } else if (transaction_status === "settlement") {
      // Pembayaran sudah settlement (bank transfer, QRIS, dll)
      orderAction = "capture"
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny"
    ) {
      orderAction = "cancel"
    } else if (transaction_status === "expire") {
      orderAction = "expire"
    } else if (transaction_status === "pending") {
      orderAction = "pending"
    }

    console.log("[Midtrans Webhook] Order action:", orderAction, "for order:", order_id)

    // ========================================
    // Step 3: Update status di Medusa (opsional — tergantung setup)
    // ========================================
    // TODO: Ketika Medusa payment module sudah dikonfigurasi,
    // tambahkan logic untuk update payment status di Medusa.
    // Contoh:
    // const orderService = req.scope.resolve("orderService")
    // if (orderAction === "capture") {
    //   await orderService.capturePayment(medusaOrderId)
    // } else if (orderAction === "cancel") {
    //   await orderService.cancelOrder(medusaOrderId)
    // }

    // Untuk sekarang, kita log dan acknowledge
    console.log(`[Midtrans Webhook] ✅ Processed: ${order_id} → ${orderAction}`)

    // Midtrans expects HTTP 200 response
    return res.status(200).json({
      status: "ok",
      order_id,
      action: orderAction,
    })
  } catch (error: any) {
    console.error("[Midtrans Webhook] Error:", error)
    // Tetap return 200 agar Midtrans tidak retry terus
    return res.status(200).json({
      status: "error",
      message: error.message,
    })
  }
}
