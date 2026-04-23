import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderFulfillmentCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string; fulfillment_id?: string; no_notification?: boolean }>) {
  // If no_notification flag is set, skip
  if (event.data?.no_notification) {
    return
  }

  const notificationService = container.resolve(Modules.NOTIFICATION)
  const orderService = container.resolve(Modules.ORDER)

  try {
    const order = await orderService.retrieveOrder(event.data.id, {
      relations: ["items", "shipping_address", "fulfillments"],
    })

    if (!order.email) {
      console.warn(`Order ${order.id} has no email. Skipping shipment notification.`)
      return
    }

    // Get the latest fulfillment
    const fulfillments = (order as any).fulfillments || []
    const latestFulfillment = fulfillments[fulfillments.length - 1] || {}
    const trackingLinks = latestFulfillment.tracking_links || []
    const trackingLink = trackingLinks[0] || {}

    await notificationService.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-shipment",
      data: {
        order,
        shipment: {
          tracking_number: trackingLink.tracking_number || latestFulfillment.tracking_number || "",
          tracking_url: trackingLink.url || "",
          provider: latestFulfillment.provider_id || "JNE/J&T/SiCepat",
        },
      },
    })
    console.log(`Successfully sent shipment notification to ${order.email}`)
  } catch (error) {
    console.error("Error sending shipment notification:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
}
