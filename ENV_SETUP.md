# Konfigurasi Environment (.env) — AquaMarket

Dokumen ini berisi panduan setup environment variables untuk ketiga layer aplikasi (Backend, Web, Mobile). 
Gunakan panduan ini untuk menghubungkan database cloud (Railway/Neon/Upstash) ke aplikasi Anda.

---

## 1. Persiapan Database (Cloud - Free Tier ke Production)

Rekomendasi setup paling mulus tanpa perlu migrasi data saat pindah ke production adalah menggunakan **Railway.app** atau kombinasi **Neon.tech (Postgres) + Upstash (Redis)**.

### Cara Mendapatkan URL Database:
1. **PostgreSQL (Neon.tech atau Railway):**
   - Buat project baru.
   - Copy `Connection String` (format: `postgresql://user:password@host:port/dbname?sslmode=require`).
2. **Redis (Upstash atau Railway):**
   - Buat database Redis.
   - Copy `Redis URL` (format: `rediss://default:password@host:port`).

---

## 2. Backend (Medusa.js v2)
Buat file `.env` di dalam folder `/backend`.

```env
# --- DATABASE & CACHE ---
# Ganti dengan URL dari Neon/Railway
DATABASE_URL=postgresql://[user]:[password]@[host]/[dbname]?sslmode=require

# Ganti dengan URL dari Upstash/Railway
REDIS_URL=rediss://default:[password]@[host]:[port]

# --- SECRETS (Wajib diganti untuk production) ---
# Generate random string rahasia (contoh: gunakan `openssl rand -base64 32` di terminal)
JWT_SECRET=super_secret_jwt_key_aquamarket_2026
COOKIE_SECRET=super_secret_cookie_key_aquamarket_2026

# --- CORS (Cross-Origin Resource Sharing) ---
# Sesuaikan dengan URL Web dan Admin Anda nantinya
STORE_CORS=http://localhost:8000,https://aquamarket.com
ADMIN_CORS=http://localhost:9000,http://localhost:5173,https://admin.aquamarket.com
AUTH_CORS=http://localhost:8000,http://localhost:9000,https://aquamarket.com

# --- STRIPE / MIDTRANS (Payment Gateway) ---
# Tambahkan nanti saat implementasi Phase 4
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxx
MIDTRANS_IS_PRODUCTION=false
```

---

## 3. Web Storefront (Next.js)
Buat file `.env.local` di dalam folder `/web`.

```env
# --- KONEKSI KE BACKEND MEDUSA ---
# URL backend Medusa (ganti dengan URL Railway saat production)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# --- PAYMENT GATEWAY ---
# Digunakan oleh frontend untuk memanggil popup Midtrans Snap
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxx
```

---

## 4. Mobile App (Expo / React Native)
Buat file `.env` di dalam folder `/mobile`.

```env
# --- KONEKSI KE BACKEND MEDUSA ---
# Catatan: Saat testing di HP fisik menggunakan jaringan Wi-Fi lokal, 
# ganti localhost dengan IP lokal laptop Anda (contoh: http://192.168.1.15:9000)
# Saat production, ganti dengan URL backend Railway Anda.
EXPO_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# --- PAYMENT GATEWAY ---
EXPO_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxx
```

---

## 💡 Best Practice Transisi ke Production
1. **Jangan pernah commit file `.env` ke GitHub.** Pastikan `.env` ada di dalam file `.gitignore`.
2. Saat mendeploy backend ke Railway, Anda tidak mengunggah file `.env`, melainkan memasukkan variabel-variabel di atas ke menu **"Variables"** di dashboard Railway.
3. Hal yang sama berlaku untuk Vercel (Web). Masukkan `NEXT_PUBLIC_MEDUSA_BACKEND_URL` di dashboard Vercel.
