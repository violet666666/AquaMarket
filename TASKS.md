# TASKS.md — AquaMarket

Versi: 1.1  
Tanggal: 20 April 2026  
Project: AquaMarket — Single-Seller Ornamental Fish Store  
Stack utama: Medusa.js v2 + Next.js storefront + Expo/React Native mobile

---

## 1. Tujuan dokumen

Dokumen ini adalah panduan kerja bertahap dari nol sampai siap development untuk:
- menyiapkan backend Medusa.js v2,
- menyiapkan web storefront berbasis Next.js,
- menyiapkan mobile app berbasis Expo/React Native,
- menyambungkan semuanya ke satu backend,
- lalu melanjutkan kustomisasi tema khusus penjualan ikan hias.

Dokumen ini dibuat agar bisa langsung dipakai di Antigravity, Claude Code, Gemini Agent Mode, atau editor AI lain sebagai execution brief.

---

## 2. Konfirmasi dasar teknis

Pilihan stack ini sudah valid untuk kebutuhan Anda:
- Medusa punya panduan instalasi resmi untuk backend [web:71]
- Medusa juga punya panduan resmi implementasi mobile app dengan React Native + Expo [web:76]
- Repo `mobile-medusa` tersedia publik di GitHub sebagai referensi starter mobile yang terhubung ke ekosistem Medusa [web:78]
- Workflow proyek bertahap seperti clarify → define → plan → execute juga selaras dengan workflow Space ini [file:2]

Catatan penting:
- `mobile-medusa` adalah referensi starter yang sangat berguna, tetapi tetap perlu Anda cek versi dependency dan env yang dipakai saat cloning.
- Untuk web storefront, basis paling aman tetap memakai starter resmi Medusa + Next.js.
- Untuk payment Indonesia, Midtrans tetap dipasang sebagai integrasi kustom pada fase checkout.

---

## 3. Struktur repo yang disarankan

Gunakan struktur kerja berikut sejak awal:

```txt
/aquamarket
  /backend        -> Medusa.js v2
  /web            -> Next.js storefront
  /mobile         -> Expo / React Native app
  /docs           -> PRD, TASKS, MASTER_PROMPT, checklist
```

Alasan:
- mudah dipisah saat debugging,
- mudah push ke GitHub,
- mudah deploy terpisah,
- tetap 1 project untuk web dan mobile.

---

## 4. Phase 0 — Persiapan laptop

### 4.1 Install software dasar

Pastikan software berikut sudah ada:
- Node.js 20 LTS
- Git
- PostgreSQL 15+
- Redis 7+
- Yarn atau pnpm
- Expo Go di HP, atau Android Emulator / iOS Simulator

### 4.2 Verifikasi versi

Jalankan:

```bash
node -v
git --version
psql --version
redis-server --version
```

Checklist hasil:
- [ ] Node.js terpasang
- [ ] Git terpasang
- [ ] PostgreSQL terpasang
- [ ] Redis terpasang

### 4.3 Buat folder project

```bash
mkdir aquamarket
cd aquamarket
mkdir docs
```

Simpan dokumen `PRD.md` dan `TASKS.md` di folder `docs/`.

---

## 5. Phase 1 — Inisialisasi backend Medusa.js v2

### 5.1 Siapkan PostgreSQL database

Masuk ke PostgreSQL lalu buat database baru:

```bash
psql -U postgres
```

Di dalam prompt PostgreSQL:

```sql
CREATE DATABASE aquamarket_medusa;
```

Opsional buat user khusus:

```sql
CREATE USER aquamarket_user WITH PASSWORD 'ganti_password_aman';
GRANT ALL PRIVILEGES ON DATABASE aquamarket_medusa TO aquamarket_user;
```

### 5.2 Buat project backend Medusa

Di folder root project:

```bash
npx create-medusa-app@latest backend
```

Saat wizard berjalan:
- pilih starter backend default,
- isi koneksi database PostgreSQL,
- lanjutkan instalasi dependency,
- biarkan proses setup selesai penuh.

Referensi instalasi backend resmi tersedia di dokumentasi Medusa [web:71].

### 5.3 Jalankan backend

```bash
cd backend
npm run dev
```

Atau jika project memakai yarn:

```bash
yarn dev
```

Expected result:
- API backend aktif di localhost sesuai output terminal
- admin app Medusa bisa dibuka dari URL yang ditampilkan terminal

### 5.4 Verifikasi backend berhasil

Checklist:
- [ ] Terminal tidak error saat boot
- [ ] Endpoint health/backend bisa diakses
- [ ] Admin panel terbuka
- [ ] Bisa login ke admin panel

### 5.5 Commit awal backend

```bash
git init
git add .
git commit -m "chore: initialize aquamarket workspace"
```

---

## 6. Phase 2 — Inisialisasi web storefront Next.js

### 6.1 Buat folder web dari starter resmi

Kembali ke root project:

```bash
cd ..
```

Lalu generate storefront:

```bash
npx create-next-app -e https://github.com/medusajs/nextjs-starter-medusa web
```

Catatan:
- Ini memakai starter resmi Next.js storefront Medusa.
- Ini adalah opsi paling aman untuk baseline web karena lebih dekat ke arsitektur resmi Medusa.

### 6.2 Setup environment web

Masuk ke folder web lalu cek file env template:

```bash
cd web
ls -la
```

Jika tersedia file template env, duplikasi sesuai kebutuhan project. Contoh umum:

```bash
cp .env.template .env.local
```

Isi URL backend lokal Anda, misalnya:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### 6.3 Jalankan web

```bash
npm install
npm run dev
```

Atau:

```bash
yarn install
yarn dev
```

### 6.4 Verifikasi web terhubung ke backend

Checklist:
- [ ] Halaman storefront tampil
- [ ] Data produk sample dari Medusa muncul
- [ ] Tidak ada error CORS
- [ ] Request ke backend berhasil di browser devtools

### 6.5 Kustomisasi awal branding AquaMarket

Task awal setelah web berhasil jalan:
- [ ] ganti title situs menjadi AquaMarket
- [ ] ganti warna utama menjadi aqua/teal
- [ ] ganti hero dengan tema ikan hias
- [ ] ganti placeholder copy menjadi konteks ornamental fish
- [ ] siapkan kategori: ikan air tawar, ikan air laut, tanaman air, aksesoris

---

## 7. Phase 3 — Inisialisasi mobile app Expo/React Native

Panduan resmi Medusa untuk React Native + Expo tersedia dan relevan untuk arsitektur ini [web:76]. Repo `mobile-medusa` juga tersedia publik sebagai basis referensi implementasi [web:78].

### 7.1 Clone starter mobile

Dari root project:

```bash
cd ..
git clone https://github.com/bidah/mobile-medusa.git mobile
```

### 7.2 Install dependency mobile

```bash
cd mobile
npm install
```

Atau:

```bash
yarn install
```

### 7.3 Setup env mobile

Cek apakah repo menyediakan file env example. Jika tidak, buat file `.env` atau gunakan pola env sesuai repo.

Contoh nilai yang biasanya dibutuhkan:

```env
EXPO_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### 7.4 Jalankan Expo

```bash
npx expo start
```

Lalu pilih salah satu:
- tekan `a` untuk Android emulator
- tekan `i` untuk iOS simulator
- scan QR dengan Expo Go di HP

### 7.5 Verifikasi mobile terkoneksi backend

Checklist:
- [ ] App terbuka di emulator/HP
- [ ] Home screen tampil
- [ ] Produk sample bisa dimuat
- [ ] Tidak ada error network ke backend lokal

### 7.6 Catatan penting untuk koneksi lokal mobile

Sering kali emulator/HP tidak bisa membaca `localhost` langsung. Jika itu terjadi:
- gunakan IP lokal laptop Anda, misalnya `http://192.168.1.xxx:9000`
- pastikan HP dan laptop satu jaringan Wi-Fi
- buka port firewall jika perlu

---

## 8. Phase 4 — Sinkronisasi monorepo dan GitHub

### 8.1 Rapikan struktur final

Pastikan posisi folder seperti ini:

```txt
aquamarket/
  backend/
  web/
  mobile/
  docs/
```

### 8.2 Buat .gitignore root

Tambahkan ignore untuk:
- `node_modules`
- `.env`
- `.env.local`
- `.expo`
- `.next`
- `dist`
- `build`

### 8.3 Push ke GitHub

```bash
git remote add origin <URL_REPO_GITHUB_ANDA>
git branch -M main
git push -u origin main
```

Checklist:
- [ ] backend ter-push
- [ ] web ter-push
- [ ] mobile ter-push
- [ ] docs ter-push

---

## 9. Phase 5 — Integrasi payment Midtrans

Untuk kebutuhan Indonesia, Midtrans adalah opsi yang aman dan populer untuk QRIS, transfer bank, dan metode pembayaran lokal. Pada fase ini fokusnya adalah menghubungkan checkout web dan mobile ke flow pembayaran yang konsisten.

### 9.1 Buat akun Midtrans

- [ ] daftar akun Midtrans
- [ ] aktifkan mode sandbox
- [ ] simpan Server Key dan Client Key

### 9.2 Tentukan strategi integrasi

Rekomendasi implementasi awal:
- server-side token creation di backend/API route
- client-side membuka Snap payment UI
- callback/notification diverifikasi di server

### 9.3 Tambahkan env

Backend / web akan butuh nilai seperti:

```env
MIDTRANS_SERVER_KEY=...
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=...
MIDTRANS_IS_PRODUCTION=false
```

### 9.4 Task implementasi

- [ ] buat route server untuk membuat transaksi Midtrans
- [ ] kirim order summary dari checkout ke route tersebut
- [ ] terima snap token
- [ ] buka UI Midtrans Snap
- [ ] simpan hasil transaksi ke order Medusa
- [ ] tangani callback sukses, pending, gagal, expire

### 9.5 Acceptance check

- [ ] transaksi sandbox berhasil
- [ ] status order berubah sesuai hasil pembayaran
- [ ] callback tervalidasi server-side
- [ ] tidak ada secret key di frontend

---

## 10. Phase 6 — Kustomisasi domain ikan hias

Di fase ini template generik diubah menjadi toko ikan hias yang benar-benar relevan.

### 10.1 Katalog produk khusus ikan hias

Tambahkan atribut/domain berikut ke produk:
- nama umum
- nama latin / spesies
- jenis air: tawar / laut / payau
- ukuran ikan
- tingkat kesulitan perawatan
- suhu ideal
- pH ideal
- jenis pakan
- kompatibilitas tank mate
- live arrival guarantee

### 10.2 Konten halaman produk

Setiap halaman produk minimal punya:
- galeri foto yang jelas
- deskripsi ikan
- panduan perawatan
- informasi pengiriman aman
- catatan garansi kedatangan hidup
- CTA beli sekarang

### 10.3 Tema visual AquaMarket

Arah desain:
- nuansa aqua / laut / premium
- warna utama teal, cyan lembut, putih, aksen emas ringan
- foto produk harus dominan, bukan dekorasi generik
- hindari gaya template SaaS yang terlalu abstrak

### 10.4 Task branding

- [ ] logo AquaMarket
- [ ] favicon
- [ ] hero image ikan hias
- [ ] section keunggulan pengiriman aman
- [ ] section edukasi singkat perawatan
- [ ] badge live arrival guarantee

---

## 11. Phase 7 — Fitur yang dikerjakan setelah starter hidup

Urutan implementasi disarankan:

1. Beranda web
2. Katalog produk web
3. Detail produk web
4. Cart web
5. Checkout web
6. Midtrans web
7. Sinkronisasi data mobile
8. Home mobile
9. Product list mobile
10. Product detail mobile
11. Cart mobile
12. Checkout mobile
13. Push notification mobile
14. Admin content cleanup

Aturan eksekusi ini sejalan dengan prinsip kerja bertahap dan modular dari workflow Space [file:2][file:7][file:8].

---

## 12. Phase 8 — Pengujian manual minimum

### 12.1 Backend
- [ ] backend boot normal
- [ ] admin login normal
- [ ] create/edit product berhasil
- [ ] order tercatat

### 12.2 Web
- [ ] home tampil normal desktop
- [ ] home tampil normal mobile
- [ ] produk bisa dibuka
- [ ] cart bekerja
- [ ] checkout bisa submit
- [ ] pembayaran sandbox berjalan

### 12.3 Mobile
- [ ] app jalan di Android
- [ ] app jalan di iOS simulator bila tersedia
- [ ] produk termuat
- [ ] cart bekerja
- [ ] checkout terkoneksi

---

## 13. Risiko teknis awal

- `mobile-medusa` mungkin membutuhkan penyesuaian dependency karena repo publik bisa berubah seiring waktu.
- Koneksi backend lokal ke HP sering menjadi hambatan pertama; biasanya selesai dengan mengganti `localhost` ke IP lokal.
- Midtrans perlu implementasi callback yang disiplin agar status order tidak salah.
- Data model ikan hias hampir pasti perlu custom field tambahan di Medusa.

---

## 14. Output yang harus diminta ke AI agent per fase

Untuk setiap fase, minta AI agent mengembalikan format berikut:

1. Ringkasan task
2. File yang akan diubah
3. Command yang harus dijalankan
4. Patch/kode
5. Cara verifikasi
6. Risiko / asumsi

Format ini selaras dengan universal project rules di Space [file:3].

---

## 15. Prompt eksekusi fase pertama

Gunakan ini sebagai prompt pertama di Antigravity:

```md
Baca PRD.md dan TASKS.md terlebih dahulu.

Kita akan mulai dari Phase 1 saja.
Tugas Anda:
1. Siapkan backend Medusa.js v2 dari nol di folder /backend.
2. Tulis command yang harus saya jalankan satu per satu.
3. Setelah itu bantu verifikasi backend benar-benar hidup.
4. Jangan lanjut ke web atau mobile dulu.
5. Jika ada keputusan versi package, pilih yang paling stabil dan jelaskan alasan singkat.
6. Jangan lompat fase.

Output wajib:
- langkah terminal berurutan,
- penjelasan singkat setiap langkah,
- expected result,
- troubleshooting umum jika gagal.
```

---

## 16. Definisi selesai untuk fase awal

Fase awal dianggap selesai jika:
- backend Medusa hidup,
- web starter hidup dan terhubung ke backend,
- mobile starter hidup dan bisa mengambil data dari backend,
- struktur repo sudah rapi,
- semuanya sudah masuk GitHub.
