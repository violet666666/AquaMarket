import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"

type DashboardStats = {
  ordersToday: number
  ordersYesterday: number
  pendingOrders: number
  lowStockProducts: { title: string; inventory: number }[]
}

const StatCard = ({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string | number
  sub?: string
  color: string
}) => (
  <div
    style={{
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: "16px 20px",
      flex: 1,
      minWidth: 0,
    }}
  >
    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{sub}</div>}
  </div>
)

const DashboardSummaryWidget = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const backendUrl = "/api/admin"

        // Fetch orders
        const ordersRes = await fetch(
          `${backendUrl}/orders?limit=200&fields=id,created_at,status,fulfillment_status`,
          { credentials: "include" }
        )

        if (!ordersRes.ok) throw new Error("Failed to fetch orders")
        const ordersData = await ordersRes.json()
        const orders = ordersData.orders || []

        const now = new Date()
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const yesterdayStart = new Date(todayStart)
        yesterdayStart.setDate(yesterdayStart.getDate() - 1)

        const ordersToday = orders.filter(
          (o: any) => new Date(o.created_at) >= todayStart
        ).length

        const ordersYesterday = orders.filter((o: any) => {
          const d = new Date(o.created_at)
          return d >= yesterdayStart && d < todayStart
        }).length

        const pendingOrders = orders.filter(
          (o: any) =>
            o.status === "pending" ||
            o.fulfillment_status === "not_fulfilled" ||
            o.fulfillment_status === "awaiting"
        ).length

        // Fetch products for low stock
        const productsRes = await fetch(
          `${backendUrl}/products?limit=200&fields=id,title`,
          { credentials: "include" }
        )
        const productsData = productsRes.ok ? await productsRes.json() : { products: [] }
        const products = productsData.products || []

        // Fetch inventory for each product
        const lowStock: { title: string; inventory: number }[] = []
        for (const product of products.slice(0, 50)) {
          try {
            const invRes = await fetch(
              `${backendUrl}/products/${product.id}/variants?fields=id,inventory_quantity`,
              { credentials: "include" }
            )
            if (invRes.ok) {
              const invData = await invRes.json()
              const variants = invData.variants || []
              const totalQty = variants.reduce(
                (sum: number, v: any) => sum + (v.inventory_quantity || 0),
                0
              )
              if (totalQty < 5) {
                lowStock.push({ title: product.title, inventory: totalQty })
              }
            }
          } catch {}
        }

        setStats({ ordersToday, ordersYesterday, pendingOrders, lowStockProducts: lowStock })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #01696f 0%, #019fa7 100%)",
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          color: "white",
          fontSize: 14,
        }}
      >
        <strong>🐠 Glory Lumajang Koi Center</strong>
        <div style={{ marginTop: 8, opacity: 0.8 }}>Memuat ringkasan dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: 12,
          padding: 16,
          color: "#dc2626",
          fontSize: 13,
          marginBottom: 16,
        }}
      >
        ⚠️ Gagal memuat data: {error}
      </div>
    )
  }

  const changePercent =
    stats!.ordersYesterday > 0
      ? Math.round(
          ((stats!.ordersToday - stats!.ordersYesterday) / stats!.ordersYesterday) * 100
        )
      : null

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #01696f 0%, #019fa7 100%)",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "white",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          🐠
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Glory Lumajang Koi Center</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>
            Ringkasan Hari Ini —{" "}
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <StatCard
          label="Order Hari Ini"
          value={stats!.ordersToday}
          sub={
            changePercent !== null
              ? `${changePercent >= 0 ? "+" : ""}${changePercent}% vs kemarin (${stats!.ordersYesterday})`
              : `Kemarin: ${stats!.ordersYesterday}`
          }
          color={stats!.ordersToday >= stats!.ordersYesterday ? "#01696f" : "#dc2626"}
        />
        <StatCard
          label="Order Belum Diproses"
          value={stats!.pendingOrders}
          sub={stats!.pendingOrders > 0 ? "Perlu ditangani segera" : "Semua order diproses ✓"}
          color={stats!.pendingOrders > 0 ? "#d97706" : "#16a34a"}
        />
        <StatCard
          label="Produk Stok Menipis"
          value={stats!.lowStockProducts.length}
          sub={stats!.lowStockProducts.length > 0 ? "Stok < 5 unit" : "Semua stok aman ✓"}
          color={stats!.lowStockProducts.length > 0 ? "#dc2626" : "#16a34a"}
        />
      </div>

      {/* Low Stock Detail */}
      {stats!.lowStockProducts.length > 0 && (
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: 10,
            padding: "12px 16px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: "#c2410c", marginBottom: 8 }}>
            ⚠️ Produk dengan Stok Menipis ({"<"} 5 unit)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {stats!.lowStockProducts.map((p) => (
              <span
                key={p.title}
                style={{
                  background: "white",
                  border: "1px solid #fed7aa",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 12,
                  color: "#92400e",
                }}
              >
                {p.title} — <strong>{p.inventory} unit</strong>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default DashboardSummaryWidget
