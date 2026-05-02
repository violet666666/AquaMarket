"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const metadata = (product as any).metadata || {}
  const hasKoiAttributes = metadata.koi_size || metadata.koi_grade || metadata.koi_breeder || metadata.koi_type

  const tabs = [
    {
      label: "Informasi Ikan",
      component: <ProductInfoTab product={product} />,
    },
    ...(hasKoiAttributes
      ? [
          {
            label: "Panduan Perawatan",
            component: <CareGuideTab metadata={metadata} />,
          },
        ]
      : []),
    {
      label: "Pengiriman & Garansi",
      component: <ShippingInfoTab metadata={metadata} />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const metadata = (product as any).metadata || {}

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          {/* Koi-Specific Attributes */}
          {metadata.koi_type && (
            <div>
              <span className="font-semibold">Jenis Koi</span>
              <p>{metadata.koi_type}</p>
            </div>
          )}
          {metadata.koi_size && (
            <div>
              <span className="font-semibold">Ukuran</span>
              <p>{metadata.koi_size}</p>
            </div>
          )}
          {metadata.koi_grade && (
            <div>
              <span className="font-semibold">Grade</span>
              <p className="inline-flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{
                  background: metadata.koi_grade === "Grand Champion" ? "#ffd700" :
                             metadata.koi_grade === "S" ? "#01696f" :
                             metadata.koi_grade === "A" ? "#16a34a" :
                             metadata.koi_grade === "B" ? "#2563eb" : "#6b7280",
                  color: "white",
                }}>
                  {metadata.koi_grade}
                </span>
              </p>
            </div>
          )}
          {metadata.koi_breeder && (
            <div>
              <span className="font-semibold">Asal Breeder</span>
              <p>{metadata.koi_breeder}</p>
            </div>
          )}
          {/* Standard Medusa Fields */}
          {product.origin_country && (
            <div>
              <span className="font-semibold">Negara Asal</span>
              <p>{product.origin_country}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-y-4">
          {product.material && (
            <div>
              <span className="font-semibold">Material</span>
              <p>{product.material}</p>
            </div>
          )}
          {product.weight && (
            <div>
              <span className="font-semibold">Berat</span>
              <p>{product.weight} g</p>
            </div>
          )}
          {product.type && (
            <div>
              <span className="font-semibold">Tipe</span>
              <p>{product.type.value}</p>
            </div>
          )}
          {product.length && product.width && product.height && (
            <div>
              <span className="font-semibold">Dimensi</span>
              <p>{product.length}L x {product.width}W x {product.height}H</p>
            </div>
          )}
        </div>
      </div>

      {/* LAG Badge */}
      {(metadata.lag === "true" || metadata.lag === true) && (
        <div className="mt-6 flex items-center gap-3 p-4 rounded-lg" style={{
          background: "linear-gradient(135deg, #e8f8f5 0%, #d1f2eb 100%)",
          border: "1px solid #a7f3d0",
        }}>
          <span className="text-2xl">🛡️</span>
          <div>
            <span className="font-semibold text-sm" style={{ color: "#01696f" }}>Live Arrival Guarantee</span>
            <p className="text-xs text-ui-fg-subtle mt-0.5">Ikan ini dijamin sampai dalam kondisi hidup dan sehat.</p>
          </div>
        </div>
      )}
    </div>
  )
}

const CareGuideTab = ({ metadata }: { metadata: Record<string, any> }) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex items-start gap-x-3">
          <span className="text-xl">🌡️</span>
          <div>
            <span className="font-semibold">Suhu Air Ideal</span>
            <p>{metadata.care_temperature || "20°C - 28°C"}</p>
          </div>
        </div>
        <div className="flex items-start gap-x-3">
          <span className="text-xl">💧</span>
          <div>
            <span className="font-semibold">pH Air</span>
            <p>{metadata.care_ph || "6.5 - 8.0"}</p>
          </div>
        </div>
        <div className="flex items-start gap-x-3">
          <span className="text-xl">🍽️</span>
          <div>
            <span className="font-semibold">Jenis Pakan</span>
            <p>{metadata.care_food || "Pelet koi premium, cacing sutra, udang kecil"}</p>
          </div>
        </div>
        <div className="flex items-start gap-x-3">
          <span className="text-xl">📏</span>
          <div>
            <span className="font-semibold">Volume Kolam Minimal</span>
            <p>{metadata.care_pond_size || "Minimal 1.000 liter per ekor"}</p>
          </div>
        </div>
        <div className="flex items-start gap-x-3">
          <span className="text-xl">⚡</span>
          <div>
            <span className="font-semibold">Tingkat Kesulitan</span>
            <p>{metadata.care_difficulty || "Menengah"}</p>
          </div>
        </div>
        <div className="flex items-start gap-x-3">
          <span className="text-xl">🐟</span>
          <div>
            <span className="font-semibold">Kompatibilitas Tank Mate</span>
            <p>{metadata.care_tankmate || "Cocok dengan koi varietas lain"}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 rounded-lg bg-ui-bg-subtle border border-ui-border-base">
        <p className="text-xs text-ui-fg-subtle">
          <strong>💡 Tips:</strong> Pastikan sistem filtrasi dan aerasi kolam berjalan baik. Lakukan pergantian air 10-20% setiap minggu untuk menjaga kualitas air optimal.
        </p>
      </div>
    </div>
  )
}

const ShippingInfoTab = ({ metadata }: { metadata: Record<string, any> }) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Pengiriman Khusus Ikan Hias</span>
            <p className="max-w-sm">
              Ikan dikemas dalam packing khusus beroksigen dengan styrofoam box untuk menjaga suhu stabil selama perjalanan. Estimasi pengiriman 1-3 hari kerja.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Live Arrival Guarantee (LAG)</span>
            <p className="max-w-sm">
              {(metadata.lag === "true" || metadata.lag === true)
                ? "Produk ini dilindungi LAG. Jika ikan mati saat tiba, hubungi kami dalam 2 jam setelah penerimaan beserta foto/video unboxing."
                : "Kami menjamin kualitas ikan saat pengiriman. Hubungi kami jika ada masalah saat penerimaan."}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Kebijakan Klaim</span>
            <p className="max-w-sm">
              Klaim wajib disertai video unboxing tanpa jeda. Penggantian atau refund diproses dalam 1-3 hari kerja setelah klaim disetujui.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
