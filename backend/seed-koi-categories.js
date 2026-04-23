const { Client } = require('pg');

async function seedKoiCategories() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_F7PgfesRSK9c@ep-ancient-field-ao9jnqjr-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
  });

  await client.connect();

  const categories = [
    { name: 'Kohaku', handle: 'kohaku', description: 'Koi putih dengan pola merah. Salah satu varietas paling populer dan bernilai tinggi.' },
    { name: 'Showa', handle: 'showa', description: 'Koi hitam dengan pola merah dan putih. Termasuk dalam "Big Three" koi.' },
    { name: 'Sanke', handle: 'sanke', description: 'Koi putih dengan pola merah dan hitam. Salah satu dari "Big Three".' },
    { name: 'Tancho', handle: 'tancho', description: 'Koi dengan satu titik merah bulat di kepala, mirip bendera Jepang.' },
    { name: 'Bekko', handle: 'bekko', description: 'Koi dengan badan putih, merah, atau kuning dengan bercak hitam.' },
    { name: 'Ogon', handle: 'ogon', description: 'Koi metalik satu warna — emas, platinum, atau oranye.' },
    { name: 'Asagi', handle: 'asagi', description: 'Koi biru keabu-abuan dengan pola sisik jala dan perut merah/oranye.' },
    { name: 'Shiro Utsuri', handle: 'shiro-utsuri', description: 'Koi hitam dengan pola putih. Kontras tinggi yang sangat menarik.' },
  ];

  console.log('Seeding koi categories...');

  for (const cat of categories) {
    const id = `pcat_${cat.handle.replace('-', '_')}`;
    try {
      // Check if category already exists
      const existing = await client.query(
        `SELECT id FROM product_category WHERE handle = $1`,
        [cat.handle]
      );

      if (existing.rows.length > 0) {
        console.log(`  ✓ Category "${cat.name}" already exists, skipping.`);
        continue;
      }

      await client.query(
        `INSERT INTO product_category (id, name, handle, description, is_active, is_internal, rank, mpath, created_at, updated_at)
         VALUES ($1, $2, $3, $4, true, false, $5, $1, NOW(), NOW())`,
        [id, cat.name, cat.handle, cat.description, categories.indexOf(cat)]
      );
      console.log(`  ✓ Created category: ${cat.name}`);
    } catch (err) {
      console.error(`  ✗ Error creating "${cat.name}":`, err.message);
    }
  }

  console.log('Done seeding categories!');
  await client.end();
}

seedKoiCategories().catch(console.error);
