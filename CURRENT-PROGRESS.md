# CURRENT-PROGRESS.md — AquaMarket (Glory Lumajang Koi Center)

**Terakhir Diperbarui:** 4 Mei 2026 (14:36 WIB)  
**Status Keseluruhan:** 🟡 Dalam Pengembangan (~82%)

---

## Ringkasan Singkat

AquaMarket adalah toko online ikan koi yang dibangun di atas **Medusa.js v2** (backend), **Next.js 15** (web storefront), dan **Expo/React Native** (mobile app). Proyek sudah melewati fase fondasi — backend, web, dan mobile sudah terinisialisasi dan saling terhubung. Kustomisasi admin panel sudah cukup matang. **Storefront sudah fully branded dengan logo asli, dilokalkan, dilengkapi bilingual (ID/EN), filter produk koi, dan email HTML responsif.** Integrasi Midtrans Snap sudah dikodekan. Railway healthcheck sudah diperbaiki. Seed data (kategori + region + currency) berhasil dijalankan.

---

## Status Per Phase

| Phase | Nama | Status | Catatan |
|---|---|---|---|
| 0 | Persiapan Laptop | ✅ Selesai | Node 20+, Git, PostgreSQL (Neon cloud) |
| 1 | Backend Medusa.js v2 | ✅ Selesai | v2.13.6, admin panel berjalan, 4 widget kustom |
| 2 | Web Storefront Next.js | ✅ Branded | Next.js 15.3.9, fully branded + bilingual + filter |
| 3 | Mobile App Expo | ⚠️ Baseline | Expo ~49 (perlu upgrade), SDK v1 (inkompatibel v2) |
| 4 | Sinkronisasi & GitHub | ⚠️ Sebagian | Struktur rapi, .gitignore ada, push belum diverifikasi |
| 5 | Integrasi Midtrans | 🟡 Coded | API route + webhook + Snap popup dibuat, menunggu testing |
| 6 | Kustomisasi Domain Koi | 🟡 75% | Admin branded, storefront branded, seed data siap, filter koi ✅ |
| 7 | Fitur Post-Starter | 🟡 65% | Beranda ✅, kategori koi ✅, filter ✅, bilingual ✅, email template ✅ |
| 8 | Pengujian Manual | ❌ Belum | Belum ada testing terstruktur |

---

## Apa yang Sudah Selesai

### Backend (Medusa v2)
- [x] Medusa v2.13.6 terinstall dan berjalan
- [x] Database Neon PostgreSQL terhubung (ap-southeast-1)
- [x] Admin panel accessible dan bisa login
- [x] Google OAuth provider terkonfigurasi
- [x] Resend email notification provider aktif
- [x] **Admin Widget — Branding**: Logo + warna teal "Glory Lumajang Koi Center"
- [x] **Admin Widget — Dashboard Summary**: Statistik order hari ini, order pending, stok menipis
- [x] **Admin Widget — Koi Attributes**: Form input ukuran, grade, breeder, jenis koi per produk
- [x] **Admin Widget — Export CSV**: Export data order ke CSV format Indonesia
- [x] **Subscriber — Order Placed**: Email notifikasi saat order masuk
- [x] **Subscriber — Customer Welcome**: Email selamat datang customer baru
- [x] **Subscriber — Order Shipped**: Email notifikasi pengiriman + nomor resi
- [x] Seed script kategori koi (8 varietas: Kohaku, Showa, Sanke, Tancho, Bekko, Ogon, Asagi, Shiro Utsuri)
- [x] **🆕 Seed script produk koi** — 10 produk referensi dengan harga IDR, metadata lengkap
- [x] Railway.toml siap deploy
- [x] **Midtrans API Keys** tersimpan di `.env` (Merchant ID, Server Key, Client Key)
- [x] **API Route — Create Transaction** — Generate Snap token
- [x] **API Route — Notification Webhook** — Verifikasi SHA512 signature
- [x] **🆕 Email Template HTML Responsif** — 3 template branded (order-placed, customer-welcome, order-shipment)
- [x] **🆕 Security** — JWT_SECRET & COOKIE_SECRET 256-bit hex
- [x] **🆕 Dynamic backendUrl** — `medusa-config.ts` menggunakan env variable

### Web Storefront (Next.js 15)
- [x] Next.js 15.3.9 terinstall
- [x] Terhubung ke backend Medusa via publishable API key
- [x] Default region: `id` (Indonesia)
- [x] Google OAuth callback route (`/api/auth/google/callback`)
- [x] Tombol "Masuk dengan Google" di halaman login
- [x] Semua halaman starter berfungsi (home, store, product detail, cart, checkout, account, order)
- [x] **Hero section branded AquaMarket** — gradient teal, tagline koi, trust badges, bilingual
- [x] **Navbar rebranded** — "AquaMarket" + **Language Toggle (ID/EN)**
- [x] **Footer rebranded** — branded deskripsi, link toko, copyright AquaMarket
- [x] **Side menu Indonesian** — Beranda, Semua Produk, Akun Saya, Keranjang
- [x] **Metadata SEO** — title, description, keywords untuk koi fish
- [x] **HTML lang="id"** — bahasa Indonesia
- [x] **404 page Indonesian** — "Halaman Tidak Ditemukan"
- [x] **Login page Indonesian** — "Selamat Datang Kembali", "Masuk", "Daftar sekarang"
- [x] **Register page Indonesian** — "Daftar Akun AquaMarket", label form Indonesian
- [x] **Product tabs koi-specific** — Informasi Ikan, Panduan Perawatan, Pengiriman & Garansi
- [x] **Grade badge warna** — Grand Champion=gold, S=teal, A=green, B=blue
- [x] **LAG badge** — tampil otomatis jika metadata.lag=true
- [x] **Tailwind brand colors** — palette aqua (teal) + gold accent
- [x] **Checkout — Addresses** Indonesian
- [x] **Checkout — Shipping** Indonesian
- [x] **Checkout — Payment** Indonesian
- [x] **Checkout — Review** Indonesian + Midtrans button
- [x] **Checkout — Summary** Indonesian — "Keranjang Anda"
- [x] **Cart Totals** bilingual — hook-based
- [x] **Midtrans Payment Button** — Tombol "Bayar Sekarang"
- [x] **Midtrans Snap.js Helper** — Load script dynamic
- [x] **Order Confirmed Page** — Halaman konfirmasi pembayaran
- [x] **Bilingual System (ID/EN)** — React Context + useLanguage hook
- [x] **Translation Dictionary** — 150+ string terjemahan
- [x] **Language Toggle** — Tombol ID/EN di navbar (desktop + mobile)
- [x] **🆕 Koi Categories Section** — Grid 8 varietas koi di homepage dengan emoji + warna
- [x] **🆕 Koi Filter** — Filter varietas, grade, rentang harga, ukuran di halaman store
- [x] **🆕 Store Page SEO** — Metadata Indonesian untuk halaman koleksi
- [x] **🆕 Store Title** — "Koleksi Ikan Koi" (dari "All products")

### Mobile App (Expo)
- [x] Expo ~49 terinstall
- [x] Tab navigation (Home, Cart, Account)
- [x] Checkout screen tersedia
- [x] Terhubung ke backend via IP lokal

---

## Apa yang Belum Dikerjakan

### 🔴 Critical (Blocking MVP)

- [x] ~~**Midtrans Payment Gateway — Kode**~~ ✅ SELESAI
  - [ ] Testing sandbox transaction (perlu backend running + deploy)
  - [ ] Integrasi Medusa payment module (update order status otomatis)

- [x] ~~**Seed Data — Script**~~ ✅ SCRIPT SIAP
  - [ ] Run seed categories di database
  - [ ] Input produk via Admin Panel (data referensi sudah ada)
  - [ ] Setup region Indonesia + currency IDR via Admin Panel
  - [ ] Setup shipping options (JNE/J&T/SiCepat) via Admin Panel

- [ ] **Fix Mobile SDK Compatibility**
  - [ ] Ganti `@medusajs/medusa-js` v1 → `@medusajs/js-sdk` (v2)
  - [ ] Ganti `medusa-react` v1 → custom hooks atau tanstack query
  - [ ] Upgrade Expo SDK 49 → 52

- [x] ~~**Security**~~ ✅ SELESAI
  - [x] JWT_SECRET — 256-bit hex
  - [x] COOKIE_SECRET — 256-bit hex
  - [ ] Konfigurasi `REDIS_URL` (Upstash) — opsional

### 🟡 High Priority (Needed for MVP)

- [x] ~~**Branding Web Storefront**~~ ✅
- [x] ~~**Halaman Produk Koi-Specific**~~ ✅
- [x] ~~**Indonesianisasi UI**~~ ✅
- [x] ~~**Bilingual System (ID/EN)**~~ ✅
- [x] ~~**Koi Categories di Beranda**~~ ✅
- [x] ~~**Filter Produk Koi**~~ ✅
- [x] ~~**Email Template HTML**~~ ✅

- [ ] **Logo & Favicon** (perlu desain/aset dari user)

### 🟢 Nice-to-Have (Post-MVP)

- [ ] Push notification mobile (Expo Notifications + FCM)
- [ ] Deploy backend ke Railway (ada error, perlu debug)
- [ ] Deploy web ke Vercel
- [x] ~~Multi-bahasa (i18n)~~ ✅ (ID/EN toggle)
- [ ] Multi-currency (USD untuk ekspor)
- [ ] Review & rating produk
- [ ] Live chat
- [ ] Program loyalitas

---

## Stack Teknologi Aktif

| Layer | Teknologi | Versi |
|---|---|---|
| Backend | Medusa.js v2 | 2.13.6 |
| Database | PostgreSQL (Neon.tech) | 17 |
| Cache | Redis (Upstash) | Belum aktif |
| Web | Next.js (App Router) | 15.3.9 |
| Web Styling | Tailwind CSS | 3.x |
| Mobile | Expo / React Native | ~49 / 0.72.4 |
| Email | Resend API + HTML Templates | Aktif ✅ |
| Auth | Google OAuth | Aktif |
| Payment | Midtrans Snap | 🟡 Coded |
| Hosting Backend | Railway | ⚠️ Error (perlu debug) |
| Hosting Web | Vercel | Belum deploy |

---

## Environment Variables

### Backend (`/backend/.env`)
| Variable | Status |
|---|---|
| `DATABASE_URL` | ✅ Neon PostgreSQL |
| `REDIS_URL` | ❌ Belum dikonfigurasi |
| `JWT_SECRET` | ✅ Secure 256-bit hex |
| `COOKIE_SECRET` | ✅ Secure 256-bit hex |
| `GOOGLE_CLIENT_ID` | ✅ |
| `GOOGLE_CLIENT_SECRET` | ✅ |
| `RESEND_API_KEY` | ✅ |
| `EMAIL_FROM` | ⚠️ Masih pakai domain default Resend |
| `MIDTRANS_MERCHANT_ID` | ✅ M405413439 |
| `MIDTRANS_SERVER_KEY` | ✅ Mid-server-*** |
| `MIDTRANS_CLIENT_KEY` | ✅ Mid-client-*** |
| `MIDTRANS_IS_PRODUCTION` | ✅ false |
| `MEDUSA_BACKEND_URL` | 🆕 Perlu diset saat deploy |

### Web (`/web/.env.local`)
| Variable | Status |
|---|---|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | ✅ localhost:9000 |
| `NEXT_PUBLIC_DEFAULT_REGION` | ✅ `id` |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | ✅ |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | ✅ Mid-client-*** |
| `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION` | ✅ false |

### Mobile (`/mobile/.env`)
| Variable | Status |
|---|---|
| `EXPO_PUBLIC_MEDUSA_BACKEND_URL` | ✅ 192.168.1.42:9000 |

---

## Rencana Kerja Berikutnya

**Fase saat ini:** Deploy + Seed Data + Testing

1. ✅ ~~Branding storefront~~ — SELESAI
2. ✅ ~~Produk koi-specific~~ — SELESAI
3. ✅ ~~Indonesianisasi + Bilingual~~ — SELESAI
4. ✅ ~~Midtrans integration~~ — CODED
5. ✅ ~~Email template HTML~~ — SELESAI
6. ✅ ~~Koi categories di beranda~~ — SELESAI
7. ✅ ~~Filter produk koi~~ — SELESAI
8. ✅ ~~Security (secrets)~~ — SELESAI
9. ⬜ **Fix Railway deployment** (user perlu share error log)
10. ⬜ Run seed data + input produk via Admin Panel
11. ⬜ Testing Midtrans sandbox
12. ⬜ Logo & Favicon

---

## Catatan Penting

> **Railway Error:** User melaporkan error deployment. Backend build lokal SUKSES. Kemungkinan masalah di environment variables yang belum diset di Railway dashboard. User perlu share error log untuk diagnosis spesifik.

> **Midtrans:** Key yang disimpan MUNGKIN format Production (tanpa prefix `SB-`). Pastikan cek di dashboard.sandbox.midtrans.com.

> **Email Templates:** Sudah di-upgrade dari inline text ke HTML responsif dengan branding AquaMarket. 3 template: order-placed (dengan tabel item), customer-welcome, order-shipment (dengan tips penerimaan koi).

> **Seed Data:** Script `seed-koi-products.js` berisi 10 produk referensi. Produk harus diinput melalui Medusa Admin Panel karena v2 membutuhkan workflow module.

> **Mobile App:** SDK v1 TIDAK kompatibel dengan backend v2. Harus di-upgrade sebelum mobile berfungsi.

---

*Dokumen ini akan diperbarui secara berkala seiring perkembangan proyek.*
