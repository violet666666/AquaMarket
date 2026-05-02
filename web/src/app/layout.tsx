import { getBaseURL } from "@lib/util/env"
import { LanguageProvider } from "@lib/context/language-context"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "AquaMarket — Glory Lumajang Koi Center",
    template: "%s | AquaMarket",
  },
  description: "Toko online ikan koi premium. Koleksi lengkap Kohaku, Showa, Sanke, dan varietas koi terbaik dengan Live Arrival Guarantee.",
  keywords: ["ikan koi", "koi premium", "beli koi online", "Glory Lumajang", "Kohaku", "Showa", "Sanke", "aquamarket"],
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="id" data-mode="light">
      <body>
        <LanguageProvider>
          <main className="relative">{props.children}</main>
        </LanguageProvider>
      </body>
    </html>
  )
}

