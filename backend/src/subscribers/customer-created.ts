import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function customerCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const customerService = container.resolve(Modules.CUSTOMER)

  try {
    const customer = await customerService.retrieveCustomer(event.data.id)

    if (!customer.email) {
      console.warn(`Customer ${customer.id} has no email associated. Skipping notification.`)
      return
    }

    await notificationService.createNotifications({
      to: customer.email,
      channel: "email",
      template: "customer-welcome",
      data: {
        customer,
      },
    })
    console.log(`Successfully sent customer.created notification to ${customer.email}`)
  } catch (error) {
    console.error("Error sending customer.created notification:", error)
  }
}

export const config: SubscriberConfig = {
  event: "customer.created",
}
