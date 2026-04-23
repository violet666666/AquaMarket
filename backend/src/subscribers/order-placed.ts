import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const orderService = container.resolve(Modules.ORDER)

  try {
    const order = await orderService.retrieveOrder(event.data.id, {
      relations: ["items", "shipping_address"],
    })

    if (!order.email) {
      console.warn(`Order ${order.id} has no email associated. Skipping notification.`)
      return
    }

    await notificationService.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-placed",
      data: {
        order,
      },
    })
    console.log(`Successfully sent order.placed notification to ${order.email}`)
  } catch (error) {
    console.error("Error sending order.placed notification:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
