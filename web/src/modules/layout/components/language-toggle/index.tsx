"use client"

import { useLanguage } from "@lib/context/language-context"

const LanguageToggle = () => {
  const { locale, toggleLocale } = useLanguage()

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        background: locale === "id"
          ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
          : "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
      title={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      aria-label={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      data-testid="language-toggle"
    >
      <span className="text-sm leading-none">
        {locale === "id" ? "🇮🇩" : "🇬🇧"}
      </span>
      <span>{locale === "id" ? "ID" : "EN"}</span>
    </button>
  )
}

export default LanguageToggle
