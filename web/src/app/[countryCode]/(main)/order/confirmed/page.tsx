import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pesanan Dikonfirmasi | AquaMarket",
  description: "Pembayaran Anda telah berhasil diproses.",
}

type Props = {
  searchParams: Promise<{
    order_id?: string
    transaction_status?: string
  }>
}

export default async function OrderConfirmedPage({ searchParams }: Props) {
  const params = await searchParams
  const orderId = params.order_id || "-"
  const status = params.transaction_status || "unknown"

  const isPending = status === "pending"
  const isSuccess = status === "settlement" || status === "capture"

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: isSuccess
              ? "linear-gradient(135deg, #d1f2eb 0%, #a3e4d7 100%)"
              : isPending
                ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                : "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
          }}
        >
          <span className="text-4xl">
            {isSuccess ? "✅" : isPending ? "⏳" : "❌"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-ui-fg-base mb-2">
          {isSuccess
            ? "Pembayaran Berhasil!"
            : isPending
              ? "Menunggu Pembayaran"
              : "Status Pembayaran"}
        </h1>

        {/* Description */}
        <p className="text-ui-fg-subtle mb-6">
          {isSuccess
            ? "Terima kasih! Pesanan Anda sedang diproses. Kami akan segera mempersiapkan ikan koi pilihan Anda dengan packaging aman."
            : isPending
              ? "Pembayaran Anda sedang diproses. Silakan selesaikan pembayaran sesuai instruksi yang diberikan."
              : "Silakan periksa status pembayaran Anda atau hubungi kami jika ada kendala."}
        </p>

        {/* Order ID */}
        <div className="p-4 rounded-lg mb-6" style={{ background: "#f3f4f6" }}>
          <p className="text-sm text-ui-fg-muted mb-1">ID Pesanan</p>
          <p className="text-lg font-mono font-semibold text-ui-fg-base">
            {orderId}
          </p>
        </div>

        {/* Info Box untuk pembayaran pending */}
        {isPending && (
          <div className="p-4 rounded-lg mb-6 text-left" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
            <p className="text-sm font-semibold mb-2" style={{ color: "#92400e" }}>
              📋 Instruksi Pembayaran
            </p>
            <ul className="text-sm space-y-1" style={{ color: "#78350f" }}>
              <li>• Selesaikan pembayaran sebelum waktu kadaluarsa</li>
              <li>• Simpan bukti pembayaran Anda</li>
              <li>• Status pesanan akan otomatis diperbarui setelah pembayaran terverifikasi</li>
            </ul>
          </div>
        )}

        {/* Info Box untuk pembayaran sukses */}
        {isSuccess && (
          <div className="p-4 rounded-lg mb-6 text-left" style={{ background: "#e8f8f5", border: "1px solid #a3e4d7" }}>
            <p className="text-sm font-semibold mb-2" style={{ color: "#014d52" }}>
              🐟 Informasi Pengiriman
            </p>
            <ul className="text-sm space-y-1" style={{ color: "#01696f" }}>
              <li>• Ikan koi Anda akan dikemas dalam styrofoam box dengan oksigen</li>
              <li>• Estimasi pengiriman: 1-2 hari kerja</li>
              <li>• Live Arrival Guarantee aktif — ikan dijamin hidup sampai tujuan</li>
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <a
            href="/id/store"
            className="inline-block w-full py-3 px-6 rounded-lg text-white font-semibold text-center transition-all"
            style={{
              background: "linear-gradient(135deg, #01696f 0%, #019fa7 100%)",
            }}
          >
            Lanjut Belanja
          </a>
          <a
            href="/id/account"
            className="inline-block w-full py-3 px-6 rounded-lg font-semibold text-center transition-all"
            style={{
              background: "white",
              border: "1px solid #d1d5db",
              color: "#374151",
            }}
          >
            Lihat Akun Saya
          </a>
        </div>
      </div>
    </div>
  )
}
