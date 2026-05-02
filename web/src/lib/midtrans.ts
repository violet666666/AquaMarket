/**
 * Helper untuk load Midtrans Snap.js secara dynamic di browser.
 * Snap.js akan menambahkan window.snap object yang bisa dipakai
 * untuk memunculkan popup pembayaran.
 */

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: any) => void
          onPending?: (result: any) => void
          onError?: (result: any) => void
          onClose?: () => void
        }
      ) => void
      hide: () => void
    }
  }
}

const SNAP_JS_SANDBOX = "https://app.sandbox.midtrans.com/snap/snap.js"
const SNAP_JS_PRODUCTION = "https://app.midtrans.com/snap/snap.js"

let snapLoaded = false

export function loadSnapJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (snapLoaded && window.snap) {
      resolve()
      return
    }

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"

    if (!clientKey) {
      reject(new Error("NEXT_PUBLIC_MIDTRANS_CLIENT_KEY belum dikonfigurasi"))
      return
    }

    const scriptUrl = isProduction ? SNAP_JS_PRODUCTION : SNAP_JS_SANDBOX

    // Cek apakah script sudah ada di DOM
    const existingScript = document.querySelector(`script[src*="snap.js"]`)
    if (existingScript) {
      snapLoaded = true
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = scriptUrl
    script.setAttribute("data-client-key", clientKey)
    script.async = true

    script.onload = () => {
      snapLoaded = true
      resolve()
    }

    script.onerror = () => {
      reject(new Error("Gagal memuat Midtrans Snap.js"))
    }

    document.head.appendChild(script)
  })
}

/**
 * Buka popup Midtrans Snap menggunakan token dari backend.
 */
export function openSnapPopup(
  token: string,
  callbacks?: {
    onSuccess?: (result: any) => void
    onPending?: (result: any) => void
    onError?: (result: any) => void
    onClose?: () => void
  }
) {
  if (!window.snap) {
    throw new Error("Snap.js belum dimuat. Panggil loadSnapJs() terlebih dahulu.")
  }

  window.snap.pay(token, {
    onSuccess: callbacks?.onSuccess || ((result) => {
      console.log("[Midtrans] Payment success:", result)
    }),
    onPending: callbacks?.onPending || ((result) => {
      console.log("[Midtrans] Payment pending:", result)
    }),
    onError: callbacks?.onError || ((result) => {
      console.error("[Midtrans] Payment error:", result)
    }),
    onClose: callbacks?.onClose || (() => {
      console.log("[Midtrans] Payment popup closed")
    }),
  })
}
