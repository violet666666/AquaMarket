import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useState } from "react"

type Order = {
  id: string
  display_id: number
  created_at: string
  email: string
  status: string
  fulfillment_status: string
  payment_status: string
  total: number
  currency_code: string
  customer?: { first_name?: string; last_name?: string }
  items?: { title: string; quantity: number; unit_price: number }[]
  fulfillments?: { tracking_links?: { tracking_number?: string }[]; provider_id?: string }[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency || "IDR",
    minimumFractionDigits: 0,
  }).format(amount / 100)
}

function escapeCSV(value: string | number | null | undefined) {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function ordersToCSV(orders: Order[]): string {
  const headers = [
    "Tanggal Order",
    "No. Order",
    "Nama Pembeli",
    "Email",
    "Produk",
    "Jumlah Item",
    "Total Harga",
    "Status Order",
    "Status Pembayaran",
    "Status Pengiriman",
    "Ekspedisi",
    "No. Resi",
  ]

  const rows = orders.map((o) => {
    const customerName = o.customer
      ? `${o.customer.first_name || ""} ${o.customer.last_name || ""}`.trim()
      : o.email || ""

    const productNames = (o.items || []).map((i) => i.title).join("; ")
    const totalQty = (o.items || []).reduce((sum, i) => sum + i.quantity, 0)

    const lastFulfillment = (o.fulfillments || []).slice(-1)[0] || null
    const trackingLinks = lastFulfillment?.tracking_links || []
    const trackingNumber = trackingLinks[0]?.tracking_number || ""
    const provider = lastFulfillment?.provider_id || ""

    return [
      formatDate(o.created_at),
      `#${o.display_id}`,
      customerName,
      o.email,
      productNames,
      totalQty,
      formatCurrency(o.total, o.currency_code),
      o.status,
      o.payment_status,
      o.fulfillment_status,
      provider,
      trackingNumber,
    ].map(escapeCSV)
  })

  return [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join("\n")
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const ExportOrdersWidget = () => {
  const [loading, setLoading] = useState(false)
  const [lastExport, setLastExport] = useState<string | null>(null)

  const handleExport = async () => {
    setLoading(true)
    try {
      // Fetch all orders with relevant relations
      const res = await fetch(
        `/api/admin/orders?limit=500&fields=id,display_id,created_at,email,status,fulfillment_status,payment_status,total,currency_code&expand=customer,items,fulfillments,fulfillments.tracking_links`,
        { credentials: "include" }
      )

      if (!res.ok) throw new Error("Gagal mengambil data order")

      const data = await res.json()
      const orders: Order[] = data.orders || []

      if (orders.length === 0) {
        alert("Tidak ada order untuk diekspor.")
        return
      }

      const csv = ordersToCSV(orders)
      const filename = `orders-glkc-${new Date().toISOString().split("T")[0]}.csv`
      downloadCSV(csv, filename)
      setLastExport(`${orders.length} order diekspor pada ${new Date().toLocaleTimeString("id-ID")}`)
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid #f3f4f6",
        marginBottom: 8,
      }}
    >
      <button
        onClick={handleExport}
        disabled={loading}
        style={{
          background: loading ? "#9ca3af" : "#01696f",
          color: "white",
          border: "none",
          borderRadius: 8,
          padding: "8px 18px",
          fontSize: 13,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "background 0.2s",
        }}
      >
        {loading ? "⏳ Menyiapkan..." : "📥 Export CSV"}
      </button>

      {lastExport && (
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          ✓ {lastExport}
        </span>
      )}

      <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: "auto" }}>
        Format: Tanggal, No. Order, Pembeli, Produk, Total, Status, Resi
      </span>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default ExportOrdersWidget
