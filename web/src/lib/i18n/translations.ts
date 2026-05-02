/**
 * AquaMarket Bilingual Translation Dictionary
 * Supports: Indonesian (id) and English (en)
 */

export type Locale = "id" | "en"

export const translations = {
  // === NAVBAR & LAYOUT ===
  nav: {
    home: { id: "Beranda", en: "Home" },
    allProducts: { id: "Semua Produk", en: "All Products" },
    myAccount: { id: "Akun Saya", en: "My Account" },
    cart: { id: "Keranjang", en: "Cart" },
    search: { id: "Cari", en: "Search" },
    menu: { id: "Menu", en: "Menu" },
  },

  // === FOOTER ===
  footer: {
    description: {
      id: "Toko ikan koi premium dengan jaminan kualitas terbaik. Pengiriman aman ke seluruh Indonesia.",
      en: "Premium koi fish store with best quality guarantee. Safe delivery throughout Indonesia.",
    },
    quickLinks: { id: "Link Cepat", en: "Quick Links" },
    contact: { id: "Kontak", en: "Contact" },
    aboutUs: { id: "Tentang Kami", en: "About Us" },
    copyright: {
      id: "Hak cipta dilindungi.",
      en: "All rights reserved.",
    },
  },

  // === HERO ===
  hero: {
    tagline: {
      id: "Temukan Ikan Koi Impianmu",
      en: "Find Your Dream Koi Fish",
    },
    subtitle: {
      id: "Koleksi ikan koi berkualitas tinggi dari breeder terbaik Indonesia. Pengiriman aman dengan garansi hidup sampai tujuan.",
      en: "High-quality koi fish collection from Indonesia's best breeders. Safe shipping with live arrival guarantee.",
    },
    cta: { id: "Lihat Koleksi", en: "View Collection" },
    ctaSecondary: { id: "Hubungi Kami", en: "Contact Us" },
    badge1: { id: "🐟 Live Arrival Guarantee", en: "🐟 Live Arrival Guarantee" },
    badge2: { id: "📦 Pengiriman Aman", en: "📦 Safe Shipping" },
    badge3: { id: "🏆 Koi Bersertifikat", en: "🏆 Certified Koi" },
  },

  // === CHECKOUT ===
  checkout: {
    shippingAddress: { id: "Alamat Pengiriman", en: "Shipping Address" },
    billingAddress: { id: "Alamat Penagihan", en: "Billing Address" },
    delivery: { id: "Pengiriman", en: "Delivery" },
    payment: { id: "Pembayaran", en: "Payment" },
    review: { id: "Tinjauan & Pembayaran", en: "Review & Payment" },
    edit: { id: "Ubah", en: "Edit" },
    continueToDelivery: { id: "Lanjut ke Pengiriman", en: "Continue to Delivery" },
    continueToPayment: { id: "Lanjut ke Pembayaran", en: "Continue to Payment" },
    continueToReview: { id: "Lanjut ke Tinjauan", en: "Continue to Review" },
    enterCardDetails: { id: "Masukkan detail kartu", en: "Enter card details" },
    shippingMethod: { id: "Metode pengiriman", en: "Shipping method" },
    howDelivered: { id: "Bagaimana Anda ingin pesanan dikirim", en: "How would you like your order delivered" },
    pickUp: { id: "Ambil pesanan sendiri", en: "Pick up your order" },
    store: { id: "Toko", en: "Store" },
    chooseStore: { id: "Pilih toko terdekat", en: "Choose a store near you" },
    paymentMethod: { id: "Metode pembayaran", en: "Payment method" },
    paymentDetails: { id: "Detail pembayaran", en: "Payment details" },
    contact: { id: "Kontak", en: "Contact" },
    sameAddress: {
      id: "Alamat penagihan dan pengiriman sama.",
      en: "Billing and delivery address are the same.",
    },
    method: { id: "Metode", en: "Method" },
    nextStep: { id: "Langkah selanjutnya akan muncul", en: "Another step will appear" },
    termsText: {
      id: 'Dengan mengklik tombol "Bayar Sekarang", Anda mengonfirmasi bahwa Anda telah membaca, memahami, dan menerima Syarat Penggunaan, Syarat Penjualan, serta Kebijakan Pengembalian kami.',
      en: 'By clicking the "Pay Now" button, you confirm that you have read, understand and accept our Terms of Use, Terms of Sale and Returns Policy.',
    },
    orOtherMethod: { id: "atau metode lain", en: "or other method" },
  },

  // === CART ===
  cart: {
    yourCart: { id: "Keranjang Anda", en: "Your Cart" },
    inYourCart: { id: "Keranjang Anda", en: "In your Cart" },
    subtotal: { id: "Subtotal (belum termasuk ongkir & pajak)", en: "Subtotal (excl. shipping and taxes)" },
    shipping: { id: "Ongkos Kirim", en: "Shipping" },
    discount: { id: "Diskon", en: "Discount" },
    taxes: { id: "Pajak", en: "Taxes" },
    total: { id: "Total", en: "Total" },
    emptyCart: { id: "Keranjang belanja kosong", en: "Your cart is empty" },
    goToCheckout: { id: "Lanjut ke Checkout", en: "Go to Checkout" },
  },

  // === PRODUCT ===
  product: {
    addToCart: { id: "Tambahkan ke Keranjang", en: "Add to Cart" },
    fishInfo: { id: "Informasi Ikan", en: "Fish Information" },
    careGuide: { id: "Panduan Perawatan", en: "Care Guide" },
    shippingWarranty: { id: "Pengiriman & Garansi", en: "Shipping & Warranty" },
    size: { id: "Ukuran", en: "Size" },
    grade: { id: "Grade", en: "Grade" },
    breeder: { id: "Breeder", en: "Breeder" },
    variety: { id: "Jenis", en: "Variety" },
    temperature: { id: "Suhu", en: "Temperature" },
    ph: { id: "pH Air", en: "Water pH" },
    food: { id: "Pakan", en: "Food" },
    difficulty: { id: "Tingkat Kesulitan", en: "Difficulty" },
  },

  // === AUTH ===
  auth: {
    welcomeBack: { id: "Selamat Datang Kembali", en: "Welcome Back" },
    signIn: { id: "Masuk", en: "Sign In" },
    signInDesc: {
      id: "Masuk untuk mengakses akun dan riwayat pesanan Anda.",
      en: "Sign in to access your account and order history.",
    },
    signInWithGoogle: { id: "Masuk dengan Google", en: "Sign in with Google" },
    noAccount: { id: "Belum punya akun?", en: "Don't have an account?" },
    registerNow: { id: "Daftar sekarang", en: "Register now" },
    registerTitle: { id: "Daftar Akun AquaMarket", en: "Create AquaMarket Account" },
    registerDesc: {
      id: "Buat akun untuk pengalaman belanja yang lebih baik dan akses riwayat pesanan Anda.",
      en: "Create an account for a better shopping experience and access to your order history.",
    },
    firstName: { id: "Nama Depan", en: "First Name" },
    lastName: { id: "Nama Belakang", en: "Last Name" },
    phone: { id: "Telepon", en: "Phone" },
    register: { id: "Daftar", en: "Register" },
    alreadyMember: { id: "Sudah punya akun?", en: "Already have an account?" },
    signInHere: { id: "Masuk di sini", en: "Sign in here" },
    or: { id: "atau", en: "or" },
    termsAgree: {
      id: "Dengan membuat akun, Anda menyetujui",
      en: "By creating an account, you agree to",
    },
    privacyPolicy: { id: "Kebijakan Privasi", en: "Privacy Policy" },
    termsOfUse: { id: "Syarat dan Ketentuan", en: "Terms of Use" },
  },

  // === MIDTRANS PAYMENT ===
  midtrans: {
    payNow: { id: "💳 Bayar Sekarang", en: "💳 Pay Now" },
    processing: { id: "Memproses Pembayaran...", en: "Processing Payment..." },
    loadingPayment: { id: "Memuat Sistem Pembayaran...", en: "Loading Payment System..." },
    paymentInfo: {
      id: "Pembayaran diproses melalui Midtrans. Mendukung QRIS, Transfer Bank, Kartu Kredit/Debit, dan E-Wallet.",
      en: "Payment processed via Midtrans. Supports QRIS, Bank Transfer, Credit/Debit Card, and E-Wallet.",
    },
    errorLoadSnap: {
      id: "Gagal memuat sistem pembayaran. Silakan refresh halaman.",
      en: "Failed to load payment system. Please refresh the page.",
    },
    emptyCart: { id: "Keranjang belanja kosong.", en: "Shopping cart is empty." },
    paymentFailed: { id: "Pembayaran gagal. Silakan coba lagi.", en: "Payment failed. Please try again." },
  },

  // === ORDER CONFIRMED ===
  order: {
    paymentSuccess: { id: "Pembayaran Berhasil!", en: "Payment Successful!" },
    waitingPayment: { id: "Menunggu Pembayaran", en: "Waiting for Payment" },
    paymentStatus: { id: "Status Pembayaran", en: "Payment Status" },
    orderId: { id: "ID Pesanan", en: "Order ID" },
    continueShopping: { id: "Lanjut Belanja", en: "Continue Shopping" },
    viewAccount: { id: "Lihat Akun Saya", en: "View My Account" },
  },

  // === 404 ===
  notFound: {
    title: { id: "Halaman Tidak Ditemukan", en: "Page Not Found" },
    description: {
      id: "Halaman yang Anda cari tidak ada atau telah dipindahkan.",
      en: "The page you are looking for doesn't exist or has been moved.",
    },
    goHome: { id: "Kembali ke Beranda", en: "Go to Home" },
  },

  // === COMMON ===
  common: {
    loading: { id: "Memuat...", en: "Loading..." },
    error: { id: "Terjadi kesalahan", en: "An error occurred" },
    save: { id: "Simpan", en: "Save" },
    cancel: { id: "Batal", en: "Cancel" },
    delete: { id: "Hapus", en: "Delete" },
    close: { id: "Tutup", en: "Close" },
    language: { id: "🇮🇩 ID", en: "🇬🇧 EN" },
  },
} as const

/**
 * Helper type untuk mendapatkan key dari nested translations
 */
export type TranslationKey = keyof typeof translations
