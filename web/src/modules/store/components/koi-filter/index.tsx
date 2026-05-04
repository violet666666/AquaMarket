"use client"

import { useLanguage } from "@lib/context/language-context"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

const varieties = [
  "Kohaku", "Showa", "Sanke", "Tancho", "Bekko", "Ogon", "Asagi", "Shiro Utsuri",
]

const grades = [
  { value: "grand-champion", label: "Grand Champion", color: "#d4a017" },
  { value: "s", label: "Grade S", color: "#01696f" },
  { value: "a", label: "Grade A", color: "#27ae60" },
  { value: "b", label: "Grade B", color: "#2980b9" },
]

const priceRanges = [
  { value: "0-500000", label: { id: "< Rp 500rb", en: "< Rp 500K" } },
  { value: "500000-2000000", label: { id: "Rp 500rb - 2jt", en: "Rp 500K - 2M" } },
  { value: "2000000-10000000", label: { id: "Rp 2jt - 10jt", en: "Rp 2M - 10M" } },
  { value: "10000000-999999999", label: { id: "> Rp 10jt", en: "> Rp 10M" } },
]

const sizeRanges = [
  { value: "0-15", label: "< 15 cm" },
  { value: "15-25", label: "15 - 25 cm" },
  { value: "25-40", label: "25 - 40 cm" },
  { value: "40-999", label: "> 40 cm" },
]

const KoiFilter = () => {
  const { locale } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)

  const activeVariety = searchParams.get("variety") || ""
  const activeGrade = searchParams.get("grade") || ""
  const activePrice = searchParams.get("price") || ""
  const activeSize = searchParams.get("size") || ""

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      return params.toString()
    },
    [searchParams]
  )

  const setFilter = (key: string, value: string) => {
    const current = searchParams.get(key)
    const newValue = current === value ? "" : value
    const query = createQueryString({ [key]: newValue })
    router.push(`${pathname}?${query}`)
  }

  const clearAll = () => {
    const query = createQueryString({ variety: "", grade: "", price: "", size: "" })
    router.push(`${pathname}?${query}`)
  }

  const hasFilters = activeVariety || activeGrade || activePrice || activeSize

  return (
    <div className="w-full">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="small:hidden flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-lg mb-4 text-sm font-medium text-gray-700"
      >
        <span>🔍 {locale === "id" ? "Filter" : "Filters"} {hasFilters ? `(${[activeVariety, activeGrade, activePrice, activeSize].filter(Boolean).length})` : ""}</span>
        <span className="text-lg">{isOpen ? "−" : "+"}</span>
      </button>

      {/* Filter Content */}
      <div className={`${isOpen ? "block" : "hidden"} small:block space-y-6`}>
        {/* Clear All */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
            style={{ color: "#01696f", background: "#e8f8f5" }}
          >
            ✕ {locale === "id" ? "Hapus Semua Filter" : "Clear All Filters"}
          </button>
        )}

        {/* Variety Filter */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {locale === "id" ? "Varietas" : "Variety"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {varieties.map((v) => (
              <button
                key={v}
                onClick={() => setFilter("variety", v.toLowerCase())}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  activeVariety === v.toLowerCase()
                    ? "text-white border-transparent shadow-sm"
                    : "text-gray-600 border-gray-200 hover:border-gray-400 bg-white"
                }`}
                style={
                  activeVariety === v.toLowerCase()
                    ? { background: "linear-gradient(135deg, #01696f 0%, #019fa7 100%)" }
                    : {}
                }
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Grade Filter */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Grade
          </h3>
          <div className="flex flex-wrap gap-2">
            {grades.map((g) => (
              <button
                key={g.value}
                onClick={() => setFilter("grade", g.value)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  activeGrade === g.value
                    ? "text-white border-transparent shadow-sm"
                    : "text-gray-600 border-gray-200 hover:border-gray-400 bg-white"
                }`}
                style={
                  activeGrade === g.value
                    ? { background: g.color }
                    : {}
                }
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {locale === "id" ? "Rentang Harga" : "Price Range"}
          </h3>
          <div className="space-y-1.5">
            {priceRanges.map((p) => (
              <button
                key={p.value}
                onClick={() => setFilter("price", p.value)}
                className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${
                  activePrice === p.value
                    ? "text-white font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                style={
                  activePrice === p.value
                    ? { background: "linear-gradient(135deg, #01696f 0%, #019fa7 100%)" }
                    : {}
                }
              >
                {p.label[locale]}
              </button>
            ))}
          </div>
        </div>

        {/* Size Range */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {locale === "id" ? "Ukuran" : "Size"}
          </h3>
          <div className="space-y-1.5">
            {sizeRanges.map((s) => (
              <button
                key={s.value}
                onClick={() => setFilter("size", s.value)}
                className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeSize === s.value
                    ? "text-white font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                style={
                  activeSize === s.value
                    ? { background: "linear-gradient(135deg, #01696f 0%, #019fa7 100%)" }
                    : {}
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KoiFilter
