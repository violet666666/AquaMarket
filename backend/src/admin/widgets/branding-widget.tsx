import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"

const BrandingWidget = () => {
  useEffect(() => {
    // Override page title
    document.title = "Glory Lumajang Koi Center — Admin"

    // Inject custom CSS for teal accent
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

        /* Replace sidebar logo text */
        .glkc-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 14px;
          color: #01696f;
          letter-spacing: -0.02em;
        }
        .glkc-logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #01696f 0%, #01898f 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 0.02em;
        }
      `
      document.head.appendChild(style)
    }

    // Override sidebar branding
    const observer = new MutationObserver(() => {
      // Find sidebar logo/title and replace
      const sidebarLinks = document.querySelectorAll("a[href='/app']")
      sidebarLinks.forEach((link) => {
        if (link.textContent?.includes("Medusa") && !link.querySelector(".glkc-logo")) {
          link.innerHTML = `
            <div class="glkc-logo">
              <div class="glkc-logo-icon">GLKC</div>
              <span>Glory Lumajang Koi Center</span>
            </div>
          `
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
