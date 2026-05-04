"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useLanguage } from "@lib/context/language-context"

const koiVarieties = [
  { name: "Kohaku", handle: "kohaku", emoji: "🔴", color: "#e74c3c", desc: { id: "Putih dengan pola merah", en: "White with red pattern" } },
  { name: "Showa", handle: "showa", emoji: "⬛", color: "#2c3e50", desc: { id: "Hitam dengan merah & putih", en: "Black with red & white" } },
  { name: "Sanke", handle: "sanke", emoji: "🔶", color: "#e67e22", desc: { id: "Putih dengan merah & hitam", en: "White with red & black" } },
  { name: "Tancho", handle: "tancho", emoji: "🎌", color: "#c0392b", desc: { id: "Titik merah bulat di kepala", en: "Red circle on the head" } },
  { name: "Bekko", handle: "bekko", emoji: "🟤", color: "#8e6b47", desc: { id: "Bercak hitam pada warna dasar", en: "Black spots on base color" } },
  { name: "Ogon", handle: "ogon", emoji: "✨", color: "#f1c40f", desc: { id: "Metalik satu warna", en: "Single metallic color" } },
  { name: "Asagi", handle: "asagi", emoji: "🔵", color: "#2980b9", desc: { id: "Biru dengan perut merah", en: "Blue with red belly" } },
  { name: "Shiro Utsuri", handle: "shiro-utsuri", emoji: "⚪", color: "#7f8c8d", desc: { id: "Hitam dengan pola putih", en: "Black with white pattern" } },
]

const KoiCategories = () => {
  const { locale, t } = useLanguage()

  return (
    <div className="w-full py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold tracking-wider uppercase mb-2" style={{ color: "#01696f" }}>
            {locale === "id" ? "Varietas Unggulan" : "Premium Varieties"}
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {locale === "id" ? "Jelajahi Varietas Koi" : "Explore Koi Varieties"}
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            {locale === "id"
              ? "Koleksi lengkap varietas ikan koi dari breeder terbaik Indonesia"
              : "Complete collection of koi fish varieties from Indonesia's best breeders"}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 small:grid-cols-4 gap-4">
          {koiVarieties.map((variety) => (
            <LocalizedClientLink
              key={variety.handle}
              href={`/categories/${variety.handle}`}
              className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ borderBottom: `3px solid ${variety.color}` }}
            >
              {/* Emoji Icon */}
              <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">
                {variety.emoji}
              </div>

              {/* Name */}
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {variety.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed">
                {variety.desc[locale]}
              </p>

              {/* Hover Arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-lg" style={{ color: variety.color }}>→</span>
              </div>
            </LocalizedClientLink>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #01696f 0%, #019fa7 100%)" }}
          >
            {locale === "id" ? "Lihat Semua Koleksi" : "View All Collection"} →
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default KoiCategories
