import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import { ProviderSendNotificationDTO, ProviderSendNotificationResultsDTO } from "@medusajs/types"
import { Resend } from "resend"

type InjectedDependencies = {}

type Options = {
  api_key: string
  from: string
}

export class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "resend"
  
  protected resend_: Resend
  protected options_: Options

  constructor(container: InjectedDependencies, options: Options) {
    super()
    this.options_ = options
    this.resend_ = new Resend(options.api_key)
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const { to, template, data } = notification
    
    let subject = "Notification from AquaMarket"
    let html = "<p>Notification received.</p>"

    const templateData = data || {}

    if (template === "order-placed") {
      subject = "Pesanan Anda Berhasil - Glory Lumajang Koi Center"
      const orderData = (templateData as any).order as any
      html = `<p>Terima kasih atas pesanan Anda (Order #${orderData?.display_id || ""})!</p>
              <p>Kami akan segera memproses pesanan ikan koi Anda.</p>
              <p>Silakan login ke akun Anda untuk melihat detail dan status pesanan.</p>`
    } else if (template === "customer-welcome") {
      subject = "Selamat Datang di Glory Lumajang Koi Center!"
      const customerData = (templateData as any).customer as any
      html = `<p>Halo ${customerData?.first_name || "Pelanggan Baru"},</p>
              <p>Selamat bergabung di AquaMarket - Glory Lumajang Koi Center.</p>
              <p>Temukan ikan koi idaman Anda sekarang!</p>`
    } else if (template === "order-shipment") {
      subject = "Pesanan Anda Sedang Dikirim - Glory Lumajang Koi Center"
      const shipmentData = (templateData as any).shipment as any
      const orderData = (templateData as any).order as any
      html = `<p>Pesanan Anda (Order #${orderData?.display_id || ""}) telah dikirim!</p>
              <p><strong>Ekspedisi:</strong> ${shipmentData?.provider || "N/A"}</p>
              <p><strong>No. Resi:</strong> ${shipmentData?.tracking_number || "N/A"}</p>
              ${shipmentData?.tracking_url ? `<p><a href="${shipmentData.tracking_url}">Lacak Paket Anda</a></p>` : ""}
              <p>Terima kasih telah berbelanja di Glory Lumajang Koi Center!</p>`
    }

    try {
      const { data: resendData, error } = await this.resend_.emails.send({
        from: this.options_.from,
        to: to,
        subject,
        html,
      })

      if (error) {
        console.error("Resend API error:", error)
        throw new Error(error.message)
      }

      return { id: resendData?.id || "unknown" }
    } catch (e: any) {
      console.error("Failed to send Resend email:", e)
      return { id: "failed" }
    }
  }
}
