# CURRENT-PROGRESS.md — AquaMarket (Glory Lumajang Koi Center)

**Terakhir Diperbarui:** 3 Mei 2026 (06:35 WIB)  
**Status Keseluruhan:** 🟡 Dalam Pengembangan (~70%)

---

## Ringkasan Singkat

AquaMarket adalah toko online ikan koi yang dibangun di atas **Medusa.js v2** (backend), **Next.js 15** (web storefront), dan **Expo/React Native** (mobile app). Proyek sudah melewati fase fondasi — backend, web, dan mobile sudah terinisialisasi dan saling terhubung. Kustomisasi admin panel sudah cukup matang. **Storefront sudah fully branded dan dilokalkan ke Bahasa Indonesia.** Integrasi Midtrans Snap sudah dikodekan (API route + webhook + frontend component), tinggal menunggu testing sandbox.

---

## Status Per Phase

| Phase | Nama | Status | Catatan |
|---|---|---|---|
| 0 | Persiapan Laptop | ✅ Selesai | Node 20+, Git, PostgreSQL (Neon cloud) |
| 1 | Backend Medusa.js v2 | ✅ Selesai | v2.13.6, admin panel berjalan, 4 widget kustom |
| 2 | Web Storefront Next.js | ✅ Branded | Next.js 15.3.9, fully branded + bilingual |
| 3 | Mobile App Expo | ⚠️ Baseline | Expo ~49 (perlu upgrade), SDK v1 (inkompatibel v2) |
| 4 | Sinkronisasi & GitHub | ⚠️ Sebagian | Struktur rapi, .gitignore ada, push belum diverifikasi |
| 5 | Integrasi Midtrans | 🟡 Coded | API route + webhook + Snap popup sudah dibuat, menunggu testing |
| 6 | Kustomisasi Domain Koi | ⚠️ Progressing | Admin branded, storefront branded, seed data belum |
| 7 | Fitur Post-Starter | 🟡 Progressing | Beranda ✅, product tabs ✅, bilingual ✅, filter belum |
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
- [x] Railway.toml siap deploy
- [x] **Midtrans API Keys** tersimpan di `.env` (Merchant ID, Server Key, Client Key)
- [x] **API Route — Create Transaction** (`/store/custom/midtrans/create-transaction`) — Generate Snap token
- [x] **API Route — Notification Webhook** (`/store/custom/midtrans/notification`) — Terima & verifikasi notifikasi pembayaran dengan SHA512 signature

### Web Storefront (Next.js 15)
- [x] Next.js 15.3.9 terinstall
- [x] Terhubung ke backend Medusa via publishable API key
- [x] Default region: `id` (Indonesia)
- [x] Google OAuth callback route (`/api/auth/google/callback`)
- [x] Tombol "Masuk dengan Google" di halaman login
- [x] Semua halaman starter berfungsi (home, store, product detail, cart, checkout, account, order)
- [x] **Hero section branded AquaMarket** — gradient teal, tagline koi, trust badges (LAG, Pengiriman Aman, Koi Bersertifikat)
- [x] **Navbar rebranded** — "Medusa Store" → "AquaMarket" + **Language Toggle (ID/EN)**
- [x] **Footer rebranded** — branded deskripsi, link toko, copyright AquaMarket
- [x] **Side menu Indonesian** — Beranda, Semua Produk, Akun Saya, Keranjang
- [x] **Metadata SEO** — title, description, keywords untuk koi fish di root layout
- [x] **HTML lang="id"** — bahasa Indonesia
- [x] **404 page Indonesian** — "Halaman Tidak Ditemukan"
- [x] **Login page Indonesian** — "Selamat Datang Kembali", "Masuk", "Daftar sekarang"
- [x] **Register page Indonesian** — "Daftar Akun AquaMarket", label form Indonesian
- [x] **Product tabs koi-specific** — Informasi Ikan, Panduan Perawatan, Pengiriman & Garansi
- [x] **Grade badge warna** — tampilkan grade koi (Grand Champion=gold, S=teal, A=green, B=blue)
- [x] **LAG badge** — tampil otomatis jika metadata.lag=true
- [x] **Tailwind brand colors** — palette aqua (teal) + gold accent
- [x] **Checkout — Addresses** Indonesian — "Alamat Pengiriman", "Alamat Penagihan", "Lanjut ke Pengiriman"
- [x] **Checkout — Shipping** Indonesian — "Pengiriman", "Metode pengiriman", "Lanjut ke Pembayaran"
- [x] **Checkout — Payment** Indonesian — "Pembayaran", "Metode pembayaran", "Lanjut ke Tinjauan"
- [x] **Checkout — Review** Indonesian — "Tinjauan & Pembayaran" + Midtrans button
- [x] **Checkout — Summary** Indonesian — "Keranjang Anda"
- [x] **Cart Totals** bilingual — Subtotal, Ongkir, Diskon, Pajak, Total (hook-based)
- [x] **Midtrans Payment Button** — Tombol "Bayar Sekarang" di review step
- [x] **Midtrans Snap.js Helper** — Load script Snap.js secara dynamic
- [x] **Order Confirmed Page** — Halaman konfirmasi sukses/pending/error dengan info koi
- [x] **🆕 Bilingual System (ID/EN)** — React Context + useLanguage hook
- [x] **🆕 Translation Dictionary** — 150+ string terjemahan untuk semua section UI
- [x] **🆕 Language Toggle** — Tombol ID/EN di navbar (desktop + mobile) dengan localStorage persistence

### Mobile App (Expo)
- [x] Expo ~49 terinstall
- [x] Tab navigation (Home, Cart, Account)
- [x] Checkout screen tersedia
- [x] Terhubung ke backend via IP lokal

---

## Apa yang Belum Dikerjakan

### 🔴 Critical (Blocking MVP)

- [x] ~~**Midtrans Payment Gateway — Kode**~~ ✅ SELESAI
  - [x] ~~Simpan Server Key & Client Key ke `.env`~~
  - [x] ~~Buat API route untuk create Midtrans transaction~~
  - [x] ~~Implementasi Snap popup di web checkout~~
  - [x] ~~Handle callback/webhook dari Midtrans~~
  - [ ] Testing sandbox transaction (perlu backend running)
  - [ ] Update status order otomatis berdasarkan hasil pembayaran (Medusa payment module integration)

- [ ] **Update Seed Data**
  - [ ] Ganti produk demo (T-Shirt, Sweatshirt) → produk ikan koi
  - [ ] Ganti region Europe → Indonesia
  - [ ] Ganti currency EUR/USD → IDR
  - [ ] Tambahkan shipping option Indonesia (JNE/J&T/SiCepat manual)

- [ ] **Fix Mobile SDK Compatibility**
  - [ ] Ganti `@medusajs/medusa-js` v1 → `@medusajs/js-sdk` (v2)
  - [ ] Ganti `medusa-react` v1 → custom hooks atau tanstack query
  - [ ] Upgrade Expo SDK 49 → 52

- [ ] **Security**
  - [ ] Ganti `JWT_SECRET` dari "supersecret" → random string
  - [ ] Ganti `COOKIE_SECRET` dari "supersecret" → random string
  - [ ] Konfigurasi `REDIS_URL` (Upstash)

### 🟡 High Priority (Needed for MVP)

- [x] ~~**Branding Web Storefront**~~ ✅ SELESAI
- [x] ~~**Halaman Produk Koi-Specific**~~ ✅ SELESAI
- [x] ~~**Indonesianisasi UI**~~ ✅ SELESAI
- [x] ~~**Bilingual System (ID/EN)**~~ ✅ SELESAI

- [ ] **Logo & Favicon** (perlu desain/aset dari user)
- [ ] Tampilkan kategori koi di halaman beranda (perlu data)

- [ ] **Filter Produk**
  - [ ] Filter jenis koi (varietas)
  - [ ] Filter rentang harga
  - [ ] Filter ukuran ikan
  - [ ] Filter grade

- [ ] **Email Template**
  - [ ] Buat template HTML responsif (ganti inline string saat ini)
  - [ ] Custom domain email (ganti `onboarding@resend.dev`)

### 🟢 Nice-to-Have (Post-MVP)

- [ ] Push notification mobile (Expo Notifications + FCM)
- [ ] Deploy backend ke Railway
- [ ] Deploy web ke Vercel
- [x] ~~Multi-bahasa (i18n)~~ ✅ SELESAI (ID/EN toggle)
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
| Email | Resend API | Aktif |
| Auth | Google OAuth | Aktif |
| Payment | Midtrans Snap | 🟡 Coded (belum tested) |
| Hosting Backend | Railway | Belum deploy |
| Hosting Web | Vercel | Belum deploy |

---

## Environment Variables

### Backend (`/backend/.env`)
| Variable | Status |
|---|---|
| `DATABASE_URL` | ✅ Neon PostgreSQL |
| `REDIS_URL` | ❌ Belum dikonfigurasi |
| `JWT_SECRET` | ⚠️ Masih "supersecret" |
| `COOKIE_SECRET` | ⚠️ Masih "supersecret" |
| `GOOGLE_CLIENT_ID` | ✅ |
| `GOOGLE_CLIENT_SECRET` | ✅ |
| `RESEND_API_KEY` | ✅ |
| `EMAIL_FROM` | ⚠️ Masih pakai domain default Resend |
| `MIDTRANS_MERCHANT_ID` | ✅ M405413439 |
| `MIDTRANS_SERVER_KEY` | ✅ Mid-server-*** |
| `MIDTRANS_CLIENT_KEY` | ✅ Mid-client-*** |
| `MIDTRANS_IS_PRODUCTION` | ✅ false |

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

## File Baru Dibuat Sesi Ini

| File | Fungsi |
|---|---|
| `backend/src/api/store/custom/midtrans/create-transaction/route.ts` | API: generate Snap token |
| `backend/src/api/store/custom/midtrans/notification/route.ts` | Webhook: terima notif pembayaran |
| `web/src/lib/midtrans.ts` | Helper: load Snap.js dynamic |
| `web/src/lib/i18n/translations.ts` | Dictionary: 150+ string ID/EN |
| `web/src/lib/context/language-context.tsx` | Context: LanguageProvider + useLanguage hook |
| `web/src/modules/checkout/components/midtrans-payment/index.tsx` | UI: Tombol "Bayar Sekarang" |
| `web/src/modules/layout/components/language-toggle/index.tsx` | UI: Tombol toggle ID/EN di navbar |
| `web/src/app/[countryCode]/(main)/order/confirmed/page.tsx` | Page: Konfirmasi pembayaran |

---

## Rencana Kerja Berikutnya

**Fase saat ini:** Testing Midtrans + Seed Data Koi

1. ✅ ~~Branding storefront (title, hero, warna teal)~~ — SELESAI
2. ✅ ~~Halaman produk koi-specific (atribut, perawatan, LAG badge)~~ — SELESAI
3. ✅ ~~Indonesianisasi UI (login, menu, footer, 404, checkout)~~ — SELESAI
4. ✅ ~~Midtrans integration (API + Webhook + Snap popup)~~ — CODED
5. ✅ ~~Bilingual system (ID/EN toggle di navbar)~~ — SELESAI
6. ⬜ Testing Midtrans sandbox end-to-end
7. ⬜ Update seed data → produk koi + region Indonesia + IDR
8. ⬜ Buat/pasang logo dan favicon
9. ⬜ Tampilkan kategori koi di beranda

---

## Catatan Penting

> **Midtrans:** Key yang disimpan MUNGKIN format Production (tanpa prefix `SB-`). Untuk testing sandbox, user perlu cek di dashboard.sandbox.midtrans.com dan ambil key sandbox jika tersedia. Kode sudah set `MIDTRANS_IS_PRODUCTION=false` sehingga akan mengarah ke endpoint sandbox.

> **Bilingual:** Sistem i18n menggunakan React Context + localStorage persistence. User bisa toggle ID/EN kapan saja di navbar. Saat ini cart-totals sudah fully hook-based; komponen lain masih menggunakan hardcoded Indonesian text yang bisa di-migrate ke hook secara bertahap.

> **Mobile App:** Library `@medusajs/medusa-js` dan `medusa-react` yang dipakai saat ini adalah versi Medusa v1 dan TIDAK kompatibel dengan backend Medusa v2. Ini harus di-upgrade sebelum mobile app bisa berfungsi dengan benar.

> **Security:** `JWT_SECRET` dan `COOKIE_SECRET` WAJIB diganti sebelum deploy ke production. Nilai saat ini ("supersecret") hanya untuk development lokal.

---

*Dokumen ini akan diperbarui secara berkala seiring perkembangan proyek.*
