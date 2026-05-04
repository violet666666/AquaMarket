import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"

const BrandingWidget = () => {
  useEffect(() => {
    // Override page title
    document.title = "Glory Lumajang Koi Center — Admin"

    // Inject custom CSS for teal accent + koi branding
    const styleId = "glkc-branding-css"
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style")
      style.id = styleId
      style.textContent = `
        /* GLKC Branding Overrides */
        :root {
          --fg-interactive: #01696f !important;
          --fg-interactive-hover: #015258 !important;
          --bg-interactive: #01696f !important;
          --bg-interactive-hover: #015258 !important;
          --border-interactive: #01696f !important;
        }

        /* Primary buttons */
        button[class*="btn-primary"],
        .bg-ui-bg-interactive,
        [class*="bg-interactive"] {
          background-color: #01696f !important;
        }
        button[class*="btn-primary"]:hover,
        .bg-ui-bg-interactive:hover,
        [class*="bg-interactive"]:hover {
          background-color: #015258 !important;
        }

        /* Focus rings */
        [class*="ring-interactive"],
        *:focus-visible {
          --tw-ring-color: #01696f !important;
        }

        /* Text interactive */
        .text-ui-fg-interactive,
        [class*="fg-interactive"] {
          color: #01696f !important;
        }

        /* Sidebar active */
        [class*="bg-ui-bg-subtle-pressed"] {
          background-color: rgba(1, 105, 111, 0.1) !important;
        }

        /* Replace sidebar logo */
        .glkc-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 13px;
          color: #01696f;
          letter-spacing: -0.02em;
          padding: 4px 0;
        }
        .glkc-logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #01696f 0%, #019fa7 50%, #d4a017 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(1, 105, 111, 0.3);
        }
        .glkc-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .glkc-logo-name {
          font-weight: 800;
          font-size: 13px;
          color: #01696f;
        }
        .glkc-logo-sub {
          font-weight: 400;
          font-size: 10px;
          color: #6b7280;
        }
      `
      document.head.appendChild(style)
    }

    // Override sidebar branding with koi logo
    const observer = new MutationObserver(() => {
      // Find sidebar logo/title and replace
      const sidebarLinks = document.querySelectorAll("a[href='/app']")
      sidebarLinks.forEach((link) => {
        if (!link.querySelector(".glkc-logo")) {
          // Check if it's the sidebar brand link (not a nav link)
          const text = link.textContent || ""
          if (text.includes("Medusa") || text.trim().length < 20) {
            link.innerHTML = `
              <div class="glkc-logo">
                <div class="glkc-logo-icon">🐟</div>
                <div class="glkc-logo-text">
                  <span class="glkc-logo-name">Glory Koi Center</span>
                  <span class="glkc-logo-sub">AquaMarket Admin</span>
                </div>
              </div>
            `
          }
        }
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  // This widget renders nothing visible — it only injects branding
  return null
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default BrandingWidget
