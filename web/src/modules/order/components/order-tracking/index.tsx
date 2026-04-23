import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"

type OrderTrackingProps = {
  order: HttpTypes.StoreOrder
}

// Map fulfillment status to Indonesian labels for the timeline
const TIMELINE_STEPS = [
  { key: "pending",    label: "Pesanan Diterima",  icon: "📦" },
  { key: "processing", label: "Diproses",           icon: "⚙️" },
  { key: "shipped",    label: "Dikirim",            icon: "🚚" },
  { key: "delivered",  label: "Selesai",            icon: "✅" },
]

function getActiveStep(fulfillmentStatus: string): number {
  if (fulfillmentStatus === "delivered" || fulfillmentStatus === "completed") return 3
  if (fulfillmentStatus === "shipped" || fulfillmentStatus === "fulfilled") return 2
  if (fulfillmentStatus === "processing" || fulfillmentStatus === "partially_fulfilled") return 1
  return 0
}

const OrderTracking = ({ order }: OrderTrackingProps) => {
  const fulfillmentStatus = order.fulfillment_status || "pending"
  const activeStep = getActiveStep(fulfillmentStatus)

  // Get tracking data from fulfillments
  const fulfillments = (order as any).fulfillments || []
  const latestFulfillment = fulfillments[fulfillments.length - 1] || null
  const trackingLinks = latestFulfillment?.tracking_links || []
  const trackingLink = trackingLinks[0] || null
  const trackingNumber = trackingLink?.tracking_number || latestFulfillment?.tracking_number || null
  const trackingUrl = trackingLink?.url || null

  return (
    <div data-testid="order-tracking-section">
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        Status Pengiriman
      </Heading>

      {/* Timeline */}
      <div className="flex items-start justify-between mb-8 relative">
        {/* Progress line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-ui-border-base z-0" />
        <div
          className="absolute top-5 left-5 h-0.5 bg-ui-bg-interactive z-0 transition-all duration-500"
          style={{ width: `${(activeStep / (TIMELINE_STEPS.length - 1)) * 100}%` }}
        />

        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index <= activeStep
          const isCurrent = index === activeStep
          return (
            <div key={step.key} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all
                  ${isCompleted
                    ? "bg-ui-bg-interactive border-ui-bg-interactive text-white"
                    : "bg-ui-bg-base border-ui-border-base text-ui-fg-muted"
                  }
                  ${isCurrent ? "ring-4 ring-ui-bg-interactive ring-opacity-20" : ""}
                `}
              >
                {step.icon}
              </div>
              <Text
                className={`text-xs text-center mt-2 font-medium
                  ${isCompleted ? "text-ui-fg-base" : "text-ui-fg-muted"}
                `}
              >
                {step.label}
              </Text>
            </div>
          )
        })}
      </div>

      {/* Tracking Info */}
      {trackingNumber && (
        <div className="bg-ui-bg-subtle rounded-lg p-4 mt-4">
          <Text className="txt-medium-plus text-ui-fg-base mb-3 font-semibold">
            Info Pengiriman
          </Text>
          <div className="flex flex-col gap-y-2">
            {latestFulfillment?.provider_id && (
              <div className="flex gap-x-2">
                <Text className="txt-medium text-ui-fg-subtle w-24">Ekspedisi:</Text>
                <Text className="txt-medium text-ui-fg-base font-medium uppercase">
                  {latestFulfillment.provider_id}
                </Text>
              </div>
            )}
            <div className="flex gap-x-2">
              <Text className="txt-medium text-ui-fg-subtle w-24">No. Resi:</Text>
              <Text className="txt-medium text-ui-fg-base font-medium">
                {trackingNumber}
              </Text>
            </div>
          </div>

          {trackingUrl && (
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-ui-bg-interactive text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-ui-bg-interactive-hover transition-colors"
            >
              🔍 Cek Resi / Lacak Paket
            </a>
          )}
          {trackingNumber && !trackingUrl && (
            <a
              href={`https://www.jne.co.id/id/tracking/trace?awb=${trackingNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-ui-bg-interactive text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-ui-bg-interactive-hover transition-colors"
            >
              🔍 Lacak di JNE
            </a>
          )}
        </div>
      )}

      {!trackingNumber && activeStep < 2 && (
        <div className="bg-ui-bg-subtle rounded-lg p-4 mt-4">
          <Text className="txt-medium text-ui-fg-muted">
            Nomor resi akan ditampilkan di sini setelah pesanan Anda dikirim.
          </Text>
        </div>
      )}

      <Divider className="mt-8" />
    </div>
  )
}

export default OrderTracking
