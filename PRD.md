# PRD — AquaMarket: Toko Online Ikan Hias

**Versi:** 1.0  
**Tanggal:** 20 April 2026  
**Status:** Draft — Siap untuk Development  
**Platform Target:** Web (Next.js) + Mobile (Expo / React Native)

---

## 1. Nama Project

**AquaMarket** — Toko Online Ikan Hias Premium

Tagline: *"Temukan Ikan Impianmu, Diantarkan ke Pintu Rumahmu"*

---

## 2. Problem Statement

Penjual ikan hias di Indonesia (termasuk eksportir) tidak memiliki toko online branded sendiri yang:
- Memiliki pengalaman belanja modern di **web dan mobile** secara bersamaan
- Mendukung pembayaran lengkap (QRIS, transfer bank, kartu kredit) via payment gateway terpercaya
- Mampu menampilkan informasi spesifik ikan hias (spesies, panduan perawatan, Live Arrival Guarantee)
- Siap untuk ekspansi pasar internasional

Pembeli (lokal maupun mancanegara) terpaksa memesan via WhatsApp, marketplace umum (Tokopedia/Shopee), atau media sosial yang tidak memberikan pengalaman belanja yang profesional dan terstruktur.

---

## 3. Goal

### Goal Bisnis
- Membangun toko online resmi dan branded untuk penjualan ikan hias
- Meningkatkan konversi penjualan dengan UX checkout yang mulus
- Memperluas jangkauan pasar ke skala internasional (fase berikutnya)
- Membangun kepercayaan pembeli dengan informasi produk yang lengkap dan transparan

### Goal Teknis
- Satu backend (Medusa.js v2) yang melayani web dan mobile sekaligus
- Payment gateway Midtrans Snap yang mendukung semua metode bayar populer di Indonesia
- Admin panel built-in untuk manajemen produk dan order tanpa coding

---

## 4. Target User

- **User Utama (Pembeli Lokal):** Hobbyist akuarium, kolektor ikan hias, pecinta akuarium rumahan di Indonesia; usia 20–45 tahun; terbiasa belanja online via mobile
- **User Sekunder (Pembeli Internasional):** Importir ikan hias, kolektor luar negeri; menggunakan web; membutuhkan informasi spesies lengkap dan prosedur ekspor
- **Admin/Owner (Seller):** Pemilik toko (1 orang atau tim kecil); mengelola produk, stok, dan order via Medusa Admin dashboard
- **Level Teknis User:** Non-teknis — UI harus intuitif, checkout maksimal 4 langkah

---

## 5. Core Workflow (Happy Path)

### Alur Pembeli (Guest & Login)
1. Pembeli membuka web/app → melihat halaman beranda dengan featured products dan kategori
2. Browse katalog → gunakan filter (jenis air, spesies, harga, ukuran)
3. Klik produk → lihat foto, deskripsi, panduan perawatan, badge LAG, stok tersedia
4. Klik "Tambah ke Keranjang" → review keranjang
5. Checkout → isi nama, email, nomor HP, alamat lengkap
6. Pilih jasa pengiriman → lihat estimasi ongkos kirim dan estimasi tiba
7. Pilih metode bayar → klik "Bayar Sekarang" → Midtrans Snap popup
8. Selesaikan pembayaran (QRIS scan / transfer bank / kartu kredit)
9. Halaman konfirmasi order → terima email/notifikasi konfirmasi
10. Pantau status order (pending → processing → shipped → delivered)

### Alur Admin (Owner)
1. Login ke Medusa Admin Panel (`/app`)
2. Tambah/edit/hapus produk dengan foto, field spesies, dan panduan perawatan
3. Lihat order masuk → konfirmasi → input nomor resi pengiriman
4. Monitor stok, laporan penjualan, dan daftar customer

---

## 6. Fitur Utama

### 🏠 Beranda
- Hero banner dengan featured product atau promo
- Seksi kategori: Air Tawar / Air Laut / Aksesoris Akuarium
- Grid "Produk Terbaru" dan "Produk Populer"
- Banner informasi: Live Arrival Guarantee, Pengiriman Aman, Hewan Bersertifikat

### 📦 Katalog & Produk
- Grid produk responsif dengan gambar, nama, harga, badge stok
- Filter: jenis air (tawar/laut/payau), rentang harga, ukuran ikan (cm), ketersediaan stok
- Search produk by nama atau nama spesies (Latin/umum)
- Halaman detail produk:
  - Galeri foto (min. 3 foto)
  - Nama produk + nama spesies Latin
  - Harga + stok tersisa
  - Badge "Live Arrival Guarantee" (jika berlaku)
  - Tab: Deskripsi | Panduan Perawatan | Info Pengiriman
  - Panduan perawatan: suhu air, pH, makanan, kompatibilitas, tingkat kesulitan

### 🛒 Keranjang & Checkout
- Tambah/kurangi/hapus item dari keranjang
- Checkout form: nama lengkap, email, nomor HP, alamat (provinsi, kota, kecamatan, kode pos, detail)
- Kalkulasi ongkir otomatis berdasarkan berat dan tujuan
- Ringkasan order sebelum pembayaran
- Integrasi Midtrans Snap:
  - QRIS
  - Transfer bank (BCA, BNI, BRI, Mandiri, Permata)
  - Kartu kredit / debit
  - GoPay, OVO, ShopeePay (opsional)

### 📋 Manajemen Order
- Halaman riwayat order (login required)
- Status order real-time: Menunggu Pembayaran → Diproses → Dikirim → Selesai → Dibatalkan
- Nomor resi + link tracking pengiriman
- Email konfirmasi otomatis di setiap perubahan status

### 🔔 Notifikasi
- Email otomatis: konfirmasi order, pembayaran berhasil, pesanan dikirim
- Push notification mobile: update status order (via Expo Notifications + FCM)

### 🛠️ Admin Panel (Medusa Admin)
- Manajemen produk: tambah/edit/hapus, upload foto, atur stok
- Custom metadata produk: spesies, jenis air, ukuran, tingkat perawatan, LAG
- Manajemen order: lihat detail, update status, input nomor resi
- Manajemen customer: daftar pembeli, riwayat order
- Laporan penjualan dasar: total order, total revenue, produk terlaris

---

## 7. Out of Scope (Tidak Masuk MVP)

- Multi-seller / marketplace (hanya 1 seller: owner)
- Multi-bahasa (Bahasa Indonesia saja untuk MVP; siapkan i18n struktur untuk fase berikutnya)
- Multi-currency (IDR saja untuk MVP; USD menyusul untuk ekspor)
- Live auction / lelang ikan
- Forum komunitas / edukasi konten
- Program loyalitas / poin reward
- Integrasi API ekspedisi real-time (JNE, SiCepat, J&T) — ongkir manual dulu
- Review & rating produk
- Fitur live chat

---

## 8. Constraints

| Aspek | Detail |
|---|---|
| **Platform** | Web (Next.js 15) + Mobile (Expo SDK 52 / React Native) |
| **Backend** | Medusa.js v2 — self-hosted, Node.js 20+ |
| **Database** | PostgreSQL 15+ + Redis 7+ |
| **Payment** | Midtrans Snap (IDR) — akun sandbox tersedia gratis |
| **Deployment Awal** | Vercel (web) + Railway (backend + DB) — free tier |
| **Bahasa UI** | Bahasa Indonesia (MVP); struktur siap i18n |
| **Browser Support** | Chrome, Firefox, Safari — 2 versi terakhir |
| **Mobile OS** | Android 10+ / iOS 15+ |
| **Security** | HTTPS wajib, Midtrans signature key verification server-side, tidak ada kredensial di client-side |
| **Gambar Produk** | WebP, lazy loading, Next.js Image Optimization |

---

## 9. Success Criteria

- [ ] Pembeli dapat menyelesaikan checkout dari beranda hingga pembayaran dalam < 5 menit
- [ ] Midtrans Snap berhasil memproses transaksi di environment sandbox dan production
- [ ] Admin dapat menambah produk baru dan order otomatis muncul tanpa coding
- [ ] Mobile app (Expo) berjalan di Android dan iOS dengan flow yang identik dengan web
- [ ] Semua halaman load di bawah 3 detik pada koneksi 4G
- [ ] Tidak ada data payment / credential yang ter-expose di sisi client

---

## 10. Acceptance Criteria

### AC-01: Checkout Berhasil
- **Given** pembeli memilih produk dan mengisi form checkout
- **When** pembeli menyelesaikan pembayaran via Midtrans Snap
- **Then** status order berubah menjadi "Diproses" dan email konfirmasi terkirim

### AC-02: Admin Update Status Order
- **Given** admin login ke Medusa Admin Panel
- **When** admin mengubah status order dan menginput nomor resi
- **Then** pembeli menerima notifikasi email dengan nomor resi pengiriman

### AC-03: Filter Produk Berfungsi
- **Given** pembeli berada di halaman katalog
- **When** pembeli memilih filter "Air Laut" dan rentang harga "Rp50.000 – Rp200.000"
- **Then** hanya produk yang sesuai filter yang ditampilkan, tanpa page reload (client-side filtering)

### AC-04: Mobile App Sinkron dengan Web
- **Given** admin menambah produk baru di Medusa Admin
- **When** pembeli membuka app mobile atau web
- **Then** produk baru langsung muncul di kedua platform tanpa perlu update app

### AC-05: Guest Checkout
- **Given** pembeli tidak memiliki akun
- **When** pembeli melakukan checkout sebagai tamu (isi email + alamat)
- **Then** order berhasil dibuat dan email konfirmasi dikirim ke email yang diisi

---

## 11. Referensi & Inspirasi

- **mollyjaya.id** — contoh flow checkout single-seller ikan hias lokal
- **alfagift.id** — referensi UX single-brand store dengan checkout modern
- **medusajs.com** — backend engine yang digunakan
- **github.com/medusajs/nextjs-starter-medusa** — base template web (⭐ 2,723 stars)
- **github.com/bidah/mobile-medusa** — base template mobile (⭐ 119 stars)

---

*Dokumen ini adalah PRD Lite. Untuk detail teknis implementasi, lihat: `TASKS.md` dan `MASTER_PROMPT.md`*
