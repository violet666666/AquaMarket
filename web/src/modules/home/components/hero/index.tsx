"use client"

import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useLanguage } from "@lib/context/language-context"

const Hero = () => {
  const { t } = useLanguage()

  return (
    <div className="w-full">
      {/* Main Hero */}
      <div className="relative w-full overflow-hidden" style={{
        background: "linear-gradient(135deg, #014d52 0%, #01696f 30%, #019fa7 60%, #01b8c0 100%)",
        minHeight: "75vh",
      }}>
        {/* Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #ffd700 0%, transparent 70%)" }} />

        {/* Fish Silhouette Decorations */}
        <div className="absolute top-16 right-10 text-white/10 text-8xl select-none hidden small:block" style={{ transform: "rotate(-15deg)" }}>🐟</div>
        <div className="absolute bottom-20 left-10 text-white/10 text-6xl select-none hidden small:block" style={{ transform: "rotate(20deg)" }}>🐠</div>
        <div className="absolute top-1/3 right-1/3 text-white/5 text-9xl select-none hidden small:block">🎏</div>

        {/* Wave Pattern Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full" fill="white">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1200,75,1200,75,1200,75L1200,120L0,120Z" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 small:py-32 gap-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
          }}>
            <span>🏆</span>
            <span>Glory Lumajang Koi Center — Trusted Since Day One</span>
          </div>

          {/* Main Heading */}
          <Heading
            level="h1"
            className="text-4xl small:text-5xl medium:text-6xl leading-tight font-bold text-white tracking-tight"
          >
            {t("hero", "tagline")}{" "}
          </Heading>

          {/* Tagline */}
          <p className="text-lg small:text-xl text-white/85 max-w-2xl leading-relaxed">
            {t("hero", "subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col small:flex-row gap-4 mt-4">
            <LocalizedClientLink href="/store">
              <Button
                variant="secondary"
                className="!px-8 !py-3 !text-base !font-semibold !rounded-lg shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: "white",
                  color: "#01696f",
                }}
              >
                🐟 {t("hero", "cta")}
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/categories">
              <Button
                variant="secondary"
                className="!px-8 !py-3 !text-base !font-semibold !rounded-lg transition-all"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {t("hero", "ctaSecondary")}
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Trust Badges Section */}
      <div className="w-full bg-white py-10 border-b border-ui-border-base">
        <div className="content-container">
          <div className="grid grid-cols-1 small:grid-cols-3 gap-8">
            {/* Badge 1: LAG */}
            <div className="flex items-center gap-4 justify-center small:justify-start">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{
                background: "linear-gradient(135deg, #e8f8f5 0%, #d1f2eb 100%)",
              }}>
                🛡️
              </div>
              <div>
                <h3 className="font-semibold text-sm text-ui-fg-base">{t("hero", "badge1")}</h3>
                <p className="text-xs text-ui-fg-subtle mt-0.5">
                  {t("hero", "badge1") === "🐟 Live Arrival Guarantee"
                    ? "Jaminan ikan sampai dalam kondisi hidup & sehat"
                    : "Fish guaranteed to arrive alive & healthy"}
                </p>
              </div>
            </div>

            {/* Badge 2: Pengiriman Aman */}
            <div className="flex items-center gap-4 justify-center small:justify-start">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{
                background: "linear-gradient(135deg, #e8f4fd 0%, #d1e9fa 100%)",
              }}>
                ✈️
              </div>
              <div>
                <h3 className="font-semibold text-sm text-ui-fg-base">{t("hero", "badge2")}</h3>
                <p className="text-xs text-ui-fg-subtle mt-0.5">
                  {t("hero", "badge2") === "📦 Pengiriman Aman"
                    ? "Packing khusus ikan hias, ke seluruh Indonesia"
                    : "Special fish packaging, shipped across Indonesia"}
                </p>
              </div>
            </div>

            {/* Badge 3: Koi Bersertifikat */}
            <div className="flex items-center gap-4 justify-center small:justify-start">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{
                background: "linear-gradient(135deg, #fef9e7 0%, #fdebd0 100%)",
              }}>
                📜
              </div>
              <div>
                <h3 className="font-semibold text-sm text-ui-fg-base">{t("hero", "badge3")}</h3>
                <p className="text-xs text-ui-fg-subtle mt-0.5">
                  {t("hero", "badge3") === "🏆 Koi Bersertifikat"
                    ? "Lengkap dengan info jenis, grade, & asal breeder"
                    : "Complete with variety, grade, & breeder origin info"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
