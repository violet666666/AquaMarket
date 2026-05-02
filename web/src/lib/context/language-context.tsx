"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { Locale, translations } from "@lib/i18n/translations"

type LanguageContextType = {
  locale: Locale
  toggleLocale: () => void
  t: (section: string, key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "id",
  toggleLocale: () => {},
  t: () => "",
})

const STORAGE_KEY = "aquamarket-locale"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("id")

  // Load saved preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale
      if (saved === "id" || saved === "en") {
        setLocale(saved)
      }
    } catch {
      // localStorage not available (SSR)
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "id" ? "en" : "id"
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // localStorage not available
      }
      return next
    })
  }, [])

  /**
   * Translation function
   * Usage: t("nav", "home") → "Beranda" (id) or "Home" (en)
   */
  const t = useCallback(
    (section: string, key: string): string => {
      try {
        const sectionObj = (translations as any)[section]
        if (!sectionObj) return key
        const entry = sectionObj[key]
        if (!entry) return key
        return entry[locale] || entry["id"] || key
      } catch {
        return key
      }
    },
    [locale]
  )

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook to access language context
 * 
 * Usage:
 * ```tsx
 * const { locale, toggleLocale, t } = useLanguage()
 * return <span>{t("nav", "home")}</span>
 * ```
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
