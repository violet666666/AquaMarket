import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

// This is a custom widget for the Product Details page to manage Koi attributes
const KoiAttributesWidget = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [metadata, setMetadata] = useState<any>({})
  const [error, setError] = useState<string | null>(null)

  // Fetch product metadata
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Gagal mengambil data produk")
        const data = await res.json()
        setMetadata(data.product.metadata || {})
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ metadata }),
        credentials: "include",
      })
      if (!res.ok) throw new Error("Gagal menyimpan atribut koi")
      alert("Atribut Koi berhasil disimpan!")
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setMetadata((prev: any) => ({ ...prev, [key]: value }))
  }

  if (loading) return <div style={{ padding: 20 }}>Memuat Atribut Koi...</div>
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "20px",
        marginTop: "20px",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#111827" }}>
        🐟 Atribut Ikan Koi (Custom)
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        
        {/* Ukuran Ikan */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
            Ukuran Ikan (cm)
          </label>
          <select
            value={metadata.koi_size || ""}
            onChange={(e) => handleChange("koi_size", e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          >
            <option value="">-- Pilih Ukuran --</option>
            <option value="15-20cm">15-20cm</option>
            <option value="21-30cm">21-30cm</option>
            <option value="31-40cm">31-40cm</option>
            <option value="41-50cm">41-50cm</option>
            <option value="51cm+">51cm+</option>
          </select>
        </div>

        {/* Grade */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
            Grade
          </label>
          <select
            value={metadata.koi_grade || ""}
            onChange={(e) => handleChange("koi_grade", e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          >
            <option value="">-- Pilih Grade --</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="S">S</option>
            <option value="Grand Champion">Grand Champion</option>
          </select>
        </div>

        {/* Asal Breeder */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
            Asal Breeder
          </label>
          <input
            type="text"
            value={metadata.koi_breeder || ""}
            onChange={(e) => handleChange("koi_breeder", e.target.value)}
            placeholder="Contoh: Dainichi, Sakai, dll."
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          />
        </div>

        {/* Jenis Koi */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
            Jenis Koi
          </label>
          <input
            type="text"
            value={metadata.koi_type || ""}
            onChange={(e) => handleChange("koi_type", e.target.value)}
            placeholder="Contoh: Doitsu Kohaku, Ginrin Showa"
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          />
        </div>

      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: "#01696f",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: saving ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "Menyimpan..." : "Simpan Atribut"}
      </button>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default KoiAttributesWidget
