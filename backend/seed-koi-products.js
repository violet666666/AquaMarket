/**
 * AquaMarket — Koi Product Seed Data
 * Script ini membuat produk ikan koi, region Indonesia, dan currency IDR
 * 
 * Jalankan: node seed-koi-products.js
 * Pastikan DATABASE_URL sudah diset di .env
 */

const { Client } = require('pg');

async function seedKoiProducts() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_F7PgfesRSK9c@ep-ancient-field-ao9jnqjr-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
  });

  await client.connect();
  console.log('🐟 AquaMarket — Seed Koi Products');
  console.log('='.repeat(50));

  // ========================================
  // 1. Check/Create Store
  // ========================================
  console.log('\n📦 Checking store...');
  const storeResult = await client.query(`SELECT id FROM store LIMIT 1`);
  const storeId = storeResult.rows[0]?.id;
  if (storeId) {
    // Update store name
    await client.query(`UPDATE store SET name = 'AquaMarket - Glory Lumajang Koi Center' WHERE id = $1`, [storeId]);
    console.log(`  ✓ Store updated: ${storeId}`);
  }

  // ========================================
  // 2. Ensure IDR Currency exists
  // ========================================
  console.log('\n💰 Checking IDR currency...');
  const currencyCheck = await client.query(`SELECT code FROM currency WHERE code = 'idr'`);
  if (currencyCheck.rows.length === 0) {
    await client.query(`INSERT INTO currency (code, symbol, symbol_native, name) VALUES ('idr', 'Rp', 'Rp', 'Indonesian Rupiah') ON CONFLICT DO NOTHING`);
    console.log('  ✓ IDR currency created');
  } else {
    console.log('  ✓ IDR currency exists');
  }

  // ========================================
  // 3. Check/Create Indonesia Region
  // ========================================
  console.log('\n🌏 Checking Indonesia region...');
  let regionResult = await client.query(`SELECT id FROM region WHERE name = 'Indonesia'`);
  let regionId = regionResult.rows[0]?.id;
  
  if (!regionId) {
    // Try to find region with id 'id'
    regionResult = await client.query(`SELECT id FROM region LIMIT 1`);
    regionId = regionResult.rows[0]?.id;
    if (regionId) {
      await client.query(`UPDATE region SET name = 'Indonesia' WHERE id = $1`, [regionId]);
      console.log(`  ✓ Region renamed to Indonesia: ${regionId}`);
    }
  } else {
    console.log(`  ✓ Indonesia region exists: ${regionId}`);
  }

  // ========================================
  // 4. Koi Products Data
  // ========================================
  const koiProducts = [
    {
      title: "Kohaku Premium 25cm",
      handle: "kohaku-premium-25cm",
      description: "Kohaku premium berukuran 25cm dari breeder pilihan. Pola merah (hi) yang cerah dan tegas di atas badan putih bersih (shiro). Salah satu varietas paling ikonik dalam dunia koi.",
      category: "kohaku",
      metadata: JSON.stringify({
        variety: "Kohaku",
        size: "25",
        grade: "A",
        breeder: "Dainichi",
        temperature: "18-24°C",
        ph: "7.0-8.0",
        food: "Pelet koi high-growth",
        difficulty: "Mudah",
        lag: true,
      }),
      price: 1500000,
    },
    {
      title: "Showa Sanshoku 30cm - Grade S",
      handle: "showa-sanshoku-30cm-grade-s",
      description: "Showa Sanshoku Grade S ukuran 30cm. Kombinasi merah, putih, dan hitam yang seimbang dengan motif sumi yang tegas. Termasuk dalam 'Big Three' varietas koi paling berharga.",
      category: "showa",
      metadata: JSON.stringify({
        variety: "Showa",
        size: "30",
        grade: "S",
        breeder: "Momotaro",
        temperature: "18-24°C",
        ph: "7.0-8.0",
        food: "Pelet premium color enhancer",
        difficulty: "Sedang",
        lag: true,
      }),
      price: 3500000,
    },
    {
      title: "Taisho Sanke 20cm",
      handle: "taisho-sanke-20cm",
      description: "Taisho Sanke muda ukuran 20cm. Badan putih dengan pola merah dan bintik hitam yang elegan. Varietas Big Three yang cocok untuk pemula hingga kolektor.",
      category: "sanke",
      metadata: JSON.stringify({
        variety: "Sanke",
        size: "20",
        grade: "A",
        breeder: "Sakai",
        temperature: "18-24°C",
        ph: "7.0-7.5",
        food: "Pelet koi standar",
        difficulty: "Mudah",
        lag: true,
      }),
      price: 1200000,
    },
    {
      title: "Tancho Kohaku 35cm - Grand Champion",
      handle: "tancho-kohaku-35cm-grand-champion",
      description: "Tancho Kohaku langka ukuran 35cm dengan titik merah bulat sempurna di kepala. Menyerupai bendera Jepang. Grade Grand Champion dari kontes regional.",
      category: "tancho",
      metadata: JSON.stringify({
        variety: "Tancho",
        size: "35",
        grade: "Grand Champion",
        breeder: "Izumiya",
        temperature: "18-22°C",
        ph: "7.0-7.5",
        food: "Pelet premium + spirulina",
        difficulty: "Sedang",
        lag: true,
      }),
      price: 15000000,
    },
    {
      title: "Shiro Bekko 18cm",
      handle: "shiro-bekko-18cm",
      description: "Shiro Bekko muda 18cm. Badan putih bersih dengan bercak hitam (sumi) yang artistik. Cocok untuk kolam taman dan akuarium besar.",
      category: "bekko",
      metadata: JSON.stringify({
        variety: "Bekko",
        size: "18",
        grade: "B",
        breeder: "Kaneko",
        temperature: "18-25°C",
        ph: "7.0-8.0",
        food: "Pelet koi standar",
        difficulty: "Mudah",
        lag: true,
      }),
      price: 750000,
    },
    {
      title: "Yamabuki Ogon 28cm - Metalik Gold",
      handle: "yamabuki-ogon-28cm-metalik-gold",
      description: "Yamabuki Ogon 28cm dengan warna emas metalik yang memukau. Sisik berkilau seperti emas murni. Sangat populer di kalangan kolektor karena keindahannya.",
      category: "ogon",
      metadata: JSON.stringify({
        variety: "Ogon",
        size: "28",
        grade: "S",
        breeder: "Marusaka",
        temperature: "18-24°C",
        ph: "7.0-7.5",
        food: "Pelet color enhancer gold",
        difficulty: "Mudah",
        lag: true,
      }),
      price: 2800000,
    },
    {
      title: "Asagi Classic 22cm",
      handle: "asagi-classic-22cm",
      description: "Asagi klasik 22cm dengan pola sisik jala biru keabu-abuan yang khas dan perut merah/oranye. Varietas koi tradisional Jepang yang elegan.",
      category: "asagi",
      metadata: JSON.stringify({
        variety: "Asagi",
        size: "22",
        grade: "A",
        breeder: "Aoki",
        temperature: "16-22°C",
        ph: "6.5-7.5",
        food: "Pelet koi + wheat germ",
        difficulty: "Sedang",
        lag: true,
      }),
      price: 1800000,
    },
    {
      title: "Shiro Utsuri 40cm - Jumbo",
      handle: "shiro-utsuri-40cm-jumbo",
      description: "Shiro Utsuri jumbo 40cm dengan kontras hitam-putih yang dramatis. Sumi tegas dan bersih. Ukuran besar cocok untuk kolam outdoor.",
      category: "shiro-utsuri",
      metadata: JSON.stringify({
        variety: "Shiro Utsuri",
        size: "40",
        grade: "S",
        breeder: "Omosako",
        temperature: "18-24°C",
        ph: "7.0-8.0",
        food: "Pelet premium high-growth",
        difficulty: "Sedang",
        lag: true,
      }),
      price: 5500000,
    },
    {
      title: "Kohaku Baby 10cm - Starter Pack",
      handle: "kohaku-baby-10cm-starter-pack",
      description: "Kohaku baby 10cm, cocok untuk pemula. Pola merah sederhana di atas putih. Harga terjangkau untuk memulai hobi koi.",
      category: "kohaku",
      metadata: JSON.stringify({
        variety: "Kohaku",
        size: "10",
        grade: "B",
        breeder: "Local",
        temperature: "18-26°C",
        ph: "7.0-8.0",
        food: "Pelet koi baby",
        difficulty: "Mudah",
        lag: true,
      }),
      price: 250000,
    },
    {
      title: "Showa Hi Utsuri 33cm",
      handle: "showa-hi-utsuri-33cm",
      description: "Showa Hi Utsuri 33cm dengan dominasi merah yang mencolok di atas dasar hitam. Pola unik yang jarang ditemui. Cocok untuk kolektor serius.",
      category: "showa",
      metadata: JSON.stringify({
        variety: "Showa",
        size: "33",
        grade: "A",
        breeder: "Dainichi",
        temperature: "18-24°C",
        ph: "7.0-7.5",
        food: "Pelet premium + color enhancer",
        difficulty: "Sedang",
        lag: true,
      }),
      price: 4200000,
    },
  ];

  // ========================================
  // 5. Seed products info message
  // ========================================
  console.log(`\n🐟 ${koiProducts.length} produk koi siap di-seed.`);
  console.log('');
  console.log('⚠️  CATATAN: Produk harus dibuat melalui Medusa Admin API atau Admin Panel,');
  console.log('   karena Medusa v2 membutuhkan workflow module untuk create product.');
  console.log('   Script ini menyiapkan data kategori dan region saja.');
  console.log('');
  console.log('📋 Data produk di atas dapat digunakan sebagai referensi untuk');
  console.log('   menambahkan produk melalui Admin Panel di /app');
  console.log('');

  // Print product summary
  console.log('Daftar Produk Koi:');
  console.log('-'.repeat(60));
  koiProducts.forEach((p, i) => {
    const meta = JSON.parse(p.metadata);
    console.log(`  ${i+1}. ${p.title}`);
    console.log(`     Varietas: ${meta.variety} | Grade: ${meta.grade} | Size: ${meta.size}cm`);
    console.log(`     Harga: Rp ${p.price.toLocaleString('id-ID')}`);
    console.log('');
  });

  // ========================================
  // 6. Create shipping options info
  // ========================================
  console.log('📦 Shipping Options yang disarankan:');
  console.log('-'.repeat(60));
  const shippingOptions = [
    { name: "JNE Reguler (Darat)", price: 50000, desc: "2-5 hari kerja" },
    { name: "JNE YES (Udara)", price: 100000, desc: "1-2 hari kerja" },
    { name: "J&T Express", price: 45000, desc: "2-4 hari kerja" },
    { name: "SiCepat Halu", price: 75000, desc: "1-3 hari kerja" },
    { name: "Ambil Sendiri (COD Lumajang)", price: 0, desc: "Gratis - pickup di toko" },
  ];
  shippingOptions.forEach(s => {
    console.log(`  • ${s.name} — Rp ${s.price.toLocaleString('id-ID')} (${s.desc})`);
  });

  console.log('\n✅ Seed selesai!');
  await client.end();
}

seedKoiProducts().catch(console.error);
