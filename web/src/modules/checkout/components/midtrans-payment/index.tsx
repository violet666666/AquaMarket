"use client"

import { useState, useEffect } from "react"
import { Button } from "@medusajs/ui"
import { loadSnapJs, openSnapPopup } from "@lib/midtrans"

type MidtransPaymentProps = {
  cart: any
  countryCode: string
}

const MidtransPayment = ({ cart, countryCode }: MidtransPaymentProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [snapReady, setSnapReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Snap.js saat komponen mount
  useEffect(() => {
    loadSnapJs()
      .then(() => setSnapReady(true))
      .catch((err) => {
        console.error("[MidtransPayment] Failed to load Snap.js:", err)
        setError("Gagal memuat sistem pembayaran. Silakan refresh halaman.")
      })
  }, [])

  const handlePayment = async () => {
    if (!cart || !cart.id) {
      setError("Keranjang belanja kosong.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Minta Snap token dari backend
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

      const items = cart.items?.map((item: any) => ({
        id: item.variant_id || item.id,
        name: item.title || item.product_title || "Item",
        price: item.unit_price / 100, // Medusa stores in cents
        quantity: item.quantity,
      }))

      const response = await fetch(
        `${backendUrl}/store/custom/midtrans/create-transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: cart.id,
            gross_amount: (cart.total || 0) / 100, // Convert from cents
            customer_name:
              cart.shipping_address?.first_name ||
              cart.billing_address?.first_name ||
              "Customer",
            customer_email: cart.email || "",
            items,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat transaksi pembayaran.")
      }

      // Step 2: Buka Snap popup
      openSnapPopup(data.token, {
        onSuccess: (result) => {
          console.log("[MidtransPayment] Payment success:", result)
          // Redirect ke halaman konfirmasi
          window.location.href = `/${countryCode}/order/confirmed?order_id=${data.order_id}&transaction_status=settlement`
        },
        onPending: (result) => {
          console.log("[MidtransPayment] Payment pending:", result)
          // Redirect ke halaman konfirmasi dengan status pending
          window.location.href = `/${countryCode}/order/confirmed?order_id=${data.order_id}&transaction_status=pending`
        },
        onError: (result) => {
          console.error("[MidtransPayment] Payment error:", result)
          setError("Pembayaran gagal. Silakan coba lagi.")
        },
        onClose: () => {
          console.log("[MidtransPayment] Snap popup closed")
          setIsLoading(false)
        },
      })
    } catch (err: any) {
      console.error("[MidtransPayment] Error:", err)
      setError(err.message || "Terjadi kesalahan saat memproses pembayaran.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <Button
        onClick={handlePayment}
        disabled={isLoading || !snapReady}
        className="w-full !py-3 !text-base !font-semibold !rounded-lg"
        style={{
          background: isLoading ? "#9ca3af" : "linear-gradient(135deg, #01696f 0%, #019fa7 100%)",
          color: "white",
          border: "none",
        }}
        data-testid="midtrans-pay-button"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Memproses Pembayaran...
          </span>
        ) : !snapReady ? (
          "Memuat Sistem Pembayaran..."
        ) : (
          <span className="flex items-center gap-2">
            💳 Bayar Sekarang
          </span>
        )}
      </Button>

      <p className="text-xs text-center text-ui-fg-muted">
        Pembayaran diproses melalui Midtrans. Mendukung QRIS, Transfer Bank, Kartu Kredit/Debit, dan E-Wallet.
      </p>

      {/* Payment method icons */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {["QRIS", "BCA", "BNI", "Mandiri", "GoPay", "OVO", "DANA"].map((method) => (
          <span
            key={method}
            className="text-xs px-2 py-1 rounded border border-ui-border-base text-ui-fg-subtle"
          >
            {method}
          </span>
        ))}
      </div>
    </div>
  )
}

export default MidtransPayment
