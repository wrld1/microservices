import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description:
      'Over-ear noise-cancelling headphones with 30-hour battery life and premium sound quality.',
    price: '79.99',
  },
  {
    name: 'Mechanical Keyboard',
    description:
      'Compact 75% layout mechanical keyboard with hot-swappable switches and RGB backlighting.',
    price: '129.99',
  },
  {
    name: 'Portable USB-C Hub',
    description:
      '7-in-1 USB-C hub with HDMI, SD card reader, USB 3.0 ports, and 100W power delivery.',
    price: '34.99',
  },
  {
    name: 'Ergonomic Mouse',
    description:
      'Vertical ergonomic wireless mouse with adjustable DPI and rechargeable battery.',
    price: '49.99',
  },
  {
    name: '27" 4K Monitor',
    description:
      '27-inch IPS 4K UHD monitor with 99% sRGB coverage, USB-C connectivity, and adjustable stand.',
    price: '349.99',
  },
];

async function main() {
  console.log('Seeding products...');

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
