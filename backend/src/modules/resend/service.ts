import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import { ProviderSendNotificationDTO, ProviderSendNotificationResultsDTO } from "@medusajs/types"
import { Resend } from "resend"

type InjectedDependencies = {}

type Options = {
  api_key: string
  from: string
}

// ========================================
// HTML Email Template Builder
// ========================================
function emailLayout(content: string, preheader: string = ""): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>AquaMarket</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f7f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #014d52 0%, #01696f 50%, #019fa7 100%); padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: 1px; }
    .header p { color: rgba(255,255,255,0.8); font-size: 13px; margin: 8px 0 0; }
    .content { padding: 32px 24px; color: #333333; font-size: 15px; line-height: 1.6; }
    .content h2 { color: #01696f; font-size: 20px; margin: 0 0 16px; }
    .info-box { background: #f0fafa; border-left: 4px solid #01696f; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
    .info-box p { margin: 4px 0; }
    .info-box strong { color: #014d52; }
    .badge { display: inline-block; background: linear-gradient(135deg, #01696f 0%, #019fa7 100%); color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #01696f 0%, #019fa7 100%); color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin: 16px 0; }
    .footer { background: #f4f7f6; padding: 24px; text-align: center; color: #888888; font-size: 12px; border-top: 1px solid #e5e5e5; }
    .footer a { color: #01696f; text-decoration: none; }
    .lag-badge { background: linear-gradient(135deg, #e8f8f5 0%, #d1f2eb 100%); border: 1px solid #a3e4d7; padding: 12px 16px; border-radius: 8px; margin: 16px 0; text-align: center; }
    .lag-badge span { font-size: 20px; }
    .divider { border: 0; border-top: 1px solid #eee; margin: 24px 0; }
    @media (max-width: 600px) {
      .content { padding: 24px 16px; }
      .header { padding: 24px 16px; }
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#f4f7f6;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>
  <div class="wrapper">
    <div class="header">
      <h1>🐟 AquaMarket</h1>
      <p>Glory Lumajang Koi Center</p>
    </div>
    ${content}
    <div class="footer">
      <p>© ${new Date().getFullYear()} AquaMarket — Glory Lumajang Koi Center</p>
      <p>Ikan koi premium dengan Live Arrival Guarantee</p>
      <p><a href="#">Kunjungi Toko</a> • <a href="#">Hubungi Kami</a></p>
    </div>
  </div>
</body>
</html>`
}

function orderPlacedTemplate(order: any): string {
  const items = order?.items?.map((item: any) =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${item.title || item.product_title || 'Item'}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">Rp ${((item.unit_price || 0) / 100).toLocaleString('id-ID')}</td>
    </tr>`
  ).join('') || ''

  const total = order?.total ? `Rp ${(order.total / 100).toLocaleString('id-ID')}` : '-'

  return emailLayout(`
    <div class="content">
      <h2>✅ Pesanan Anda Berhasil!</h2>
      <p>Halo <strong>${order?.shipping_address?.first_name || 'Pelanggan'}</strong>,</p>
      <p>Terima kasih telah berbelanja di AquaMarket. Pesanan Anda telah kami terima dan sedang diproses.</p>
      
      <div class="info-box">
        <p><strong>Nomor Pesanan:</strong> #${order?.display_id || order?.id || '-'}</p>
        <p><strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
        <p><strong>Status:</strong> <span class="badge">Sedang Diproses</span></p>
      </div>

      ${items ? `
      <h3 style="color:#01696f;margin-top:24px;">Detail Pesanan</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="border-bottom:2px solid #01696f;">
            <th style="padding:8px 0;text-align:left;color:#01696f;">Produk</th>
            <th style="padding:8px 0;text-align:center;color:#01696f;">Qty</th>
            <th style="padding:8px 0;text-align:right;color:#01696f;">Harga</th>
          </tr>
        </thead>
        <tbody>${items}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px 0;font-weight:700;color:#014d52;">Total</td>
            <td style="padding:12px 0;text-align:right;font-weight:700;color:#014d52;font-size:16px;">${total}</td>
          </tr>
        </tfoot>
      </table>` : ''}

      <div class="lag-badge">
        <span>🛡️</span>
        <p style="margin:8px 0 0;color:#014d52;font-weight:600;">Live Arrival Guarantee Aktif</p>
        <p style="margin:4px 0 0;color:#666;font-size:13px;">Ikan koi Anda dijamin sampai dalam kondisi hidup & sehat</p>
      </div>

      <hr class="divider">
      <p style="font-size:13px;color:#666;">Kami akan mengirimkan email notifikasi lagi saat pesanan Anda dikirim beserta nomor resi.</p>
    </div>
  `, `Pesanan #${order?.display_id || ''} berhasil diterima`)
}

function customerWelcomeTemplate(customer: any): string {
  return emailLayout(`
    <div class="content">
      <h2>🎉 Selamat Datang di AquaMarket!</h2>
      <p>Halo <strong>${customer?.first_name || 'Pecinta Koi'}</strong>,</p>
      <p>Selamat bergabung di <strong>Glory Lumajang Koi Center</strong>. Kami senang Anda menjadi bagian dari keluarga pecinta ikan koi kami.</p>
      
      <div class="info-box">
        <p>🐟 <strong>Koleksi Premium</strong> — Varietas unggulan dari breeder terbaik</p>
        <p>🛡️ <strong>Live Arrival Guarantee</strong> — Jaminan ikan sampai hidup</p>
        <p>✈️ <strong>Pengiriman Aman</strong> — Packing khusus ke seluruh Indonesia</p>
        <p>📜 <strong>Bersertifikat</strong> — Info lengkap jenis, grade, & breeder</p>
      </div>

      <p style="text-align:center;">
        <a href="#" class="cta-button">Jelajahi Koleksi Koi</a>
      </p>

      <hr class="divider">
      <p style="font-size:13px;color:#666;">Jika ada pertanyaan, jangan ragu untuk menghubungi kami. Selamat berbelanja!</p>
    </div>
  `, `Selamat datang di AquaMarket, ${customer?.first_name || 'Pelanggan'}!`)
}

function orderShipmentTemplate(order: any, shipment: any): string {
  return emailLayout(`
    <div class="content">
      <h2>📦 Pesanan Anda Dalam Perjalanan!</h2>
      <p>Halo <strong>${order?.shipping_address?.first_name || 'Pelanggan'}</strong>,</p>
      <p>Kabar baik! Pesanan Anda telah dikirim. Ikan koi Anda sedang dalam perjalanan ke alamat tujuan.</p>
      
      <div class="info-box">
        <p><strong>Nomor Pesanan:</strong> #${order?.display_id || order?.id || '-'}</p>
        <p><strong>Ekspedisi:</strong> ${shipment?.provider || 'N/A'}</p>
        <p><strong>Nomor Resi:</strong> <span style="font-family:monospace;font-size:16px;color:#01696f;font-weight:700;">${shipment?.tracking_number || 'N/A'}</span></p>
        ${shipment?.tracking_url ? `<p><a href="${shipment.tracking_url}" style="color:#01696f;font-weight:600;">🔍 Lacak Paket Anda →</a></p>` : ''}
      </div>

      <div class="lag-badge">
        <span>🛡️</span>
        <p style="margin:8px 0 0;color:#014d52;font-weight:600;">Live Arrival Guarantee Aktif</p>
        <p style="margin:4px 0 0;color:#666;font-size:13px;">Jika ikan tidak sampai dalam kondisi hidup, hubungi kami dalam 1x24 jam setelah penerimaan</p>
      </div>

      <h3 style="color:#01696f;">📋 Tips Penerimaan Ikan Koi</h3>
      <ol style="font-size:14px;color:#555;line-height:1.8;">
        <li>Buka paket segera setelah diterima</li>
        <li>Aklimatisasi suhu: rendam kantong ikan di kolam selama 15-20 menit</li>
        <li>Pindahkan ikan secara perlahan ke kolam</li>
        <li>Jangan beri makan ikan dalam 24 jam pertama</li>
        <li>Foto/video saat membuka paket sebagai dokumentasi</li>
      </ol>

      <hr class="divider">
      <p style="font-size:13px;color:#666;">Terima kasih telah berbelanja di Glory Lumajang Koi Center!</p>
    </div>
  `, `Pesanan #${order?.display_id || ''} sedang dikirim!`)
}

// ========================================
// Resend Service
// ========================================
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
    
    let subject = "Notifikasi dari AquaMarket"
    let html = "<p>Anda menerima notifikasi dari AquaMarket.</p>"

    const templateData = data || {}

    if (template === "order-placed") {
      subject = "✅ Pesanan Berhasil — AquaMarket"
      const orderData = (templateData as any).order as any
      html = orderPlacedTemplate(orderData)
    } else if (template === "customer-welcome") {
      subject = "🎉 Selamat Datang di AquaMarket!"
      const customerData = (templateData as any).customer as any
      html = customerWelcomeTemplate(customerData)
    } else if (template === "order-shipment") {
      subject = "📦 Pesanan Anda Dikirim — AquaMarket"
      const shipmentData = (templateData as any).shipment as any
      const orderData = (templateData as any).order as any
      html = orderShipmentTemplate(orderData, shipmentData)
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
