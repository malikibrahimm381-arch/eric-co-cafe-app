const adminHash = "$2b$10$jdmKwkBoDAi498UewtrHUe5SxjcF1mIa/.mx8gltC5c29yuYR00ha";
const cashierHash = "$2b$10$ZUAAxA8pWiUSjQNEvlQtHuHQMc447ZmRRyn9BUf87hQd0BwG0QOQa";
const developerHash = "$2b$10$S/aWkORKUnXUWlNacZXe7Oe.5uvlR1WCD6bv07HLzDZGE0SPid3fG";

export const sampleUsers = [
  {
    id: 1,
    name: "Admin Cafe",
    username: "admin",
    role: "admin",
    passwordHash: adminHash
  },
  {
    id: 2,
    name: "Kasir Cafe",
    username: "kasir",
    role: "cashier",
    passwordHash: cashierHash
  },
  {
    id: 3,
    name: "Developer",
    username: "developer",
    role: "developer",
    passwordHash: developerHash
  }
];

export const sampleMenuItems = [
  {
    id: 1,
    name: "Chicken Katsu",
    category: "Makanan",
    price: 35000,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFQztr0w0a1Vh1Qwia3bkJVp2FR_D1wq-0zA&s",
    description: "Chicken katsu crispy",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Croissant",
    category: "Makanan",
    price: 22000,
    thumbnail: "https://asset.kompas.com/crops/QzJ7mkzUuw8Xo1yZf0gpBGxUuAI=/15x9:895x596/1200x800/data/photo/2023/02/01/63d9fbce5a2d2.jpg",
    description: "Croissant Prancis",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "French Fries",
    category: "Makanan",
    price: 20000,
    thumbnail: "https://images.themodernproper.com/production/posts/2022/Homemade-French-Fries_8.jpg?w=960&h=960&q=82&fm=jpg&fit=crop&dm=1662474181&s=50bccc38a736ef0e0a6e261ad23378f4",
    description: "Kentang goreng renyah",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Mie Goreng",
    category: "Makanan",
    price: 25000,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQECDWd5uz2t0QErli92w2apL9JcLU9U-ZlmA&s",
    description: "Mie goreng dengan telur",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Nasi Goreng",
    category: "Makanan",
    price: 30000,
    thumbnail: "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2025/03/11082616/5-Resep-Nasi-Goreng-Sederhana-hingga-Spesial-Mudah-dan-Praktis.jpg",
    description: "Nasi goreng spesial",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    name: "Spaghetti Bolognese",
    category: "Makanan",
    price: 32000,
    thumbnail: "https://www.preciouscore.com/wp-content/uploads/2024/06/Spaghetti-Bolognese-Chicken.jpg",
    description: "Spaghetti dengan saus daging",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 7,
    name: "Cafe Latte",
    category: "Minuman",
    price: 25000,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbeTrexIYpCCSK6QSKlS283rUBtdQ7hpjIw&s",
    description: "Espresso dengan susu steamed",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    name: "Espresso",
    category: "Minuman",
    price: 15000,
    thumbnail: "https://islandsunindonesia.com/wp-content/uploads/2022/01/espresso.jpg",
    description: "Espresso murni",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 9,
    name: "Jus Jeruk",
    category: "Minuman",
    price: 18000,
    thumbnail: "https://rri-portal-app-assets.obs.ap-southeast-4.myhuaweicloud.com/upload/berita/image/bukittinggi/1777464925702232_8da3810820_berita_bukittinggi.webp",
    description: "Jus jeruk segar",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 10,
    name: "Kopi Hitam",
    category: "Minuman",
    price: 15000,
    thumbnail: "https://awsimages.detik.net.id/community/media/visual/2022/11/15/sama-sama-kopi-hitam-apa-bedanya-americano-long-black-dan-kopi-tubruk_169.jpeg?w=600&q=90",
    description: "Kopi hitam pilihan",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 11,
    name: "Mango Smoothie",
    category: "Minuman",
    price: 26000,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKslKWi8UpfQ5JgRvXS9Nx6-oxvsOuGckjJg&s",
    description: "Smoothie mangga segar",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 12,
    name: "Matcha Latte",
    category: "Minuman",
    price: 28000,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTQdGZiR3vS7PS4CxexJkZ_sGJvCC349BRzw&s",
    description: "Matcha asli Jepang",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

function dayOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(10 + Math.abs(days), 15, 0, 0);
  return date.toISOString();
}

const seedOrders = [
  {
    id: 1,
    orderType: "dine_in",
    tableNumber: "A3",
    customerName: "Rani",
    source: "qr",
    status: "paid",
    subtotal: 57000,
    createdBy: null,
    createdAt: dayOffset(-4),
    items: [
      { id: 1, menuItemId: 1, menuName: "Chicken Katsu", quantity: 1, price: 35000 },
      { id: 2, menuItemId: 2, menuName: "Croissant", quantity: 1, price: 22000 }
    ]
  },
  {
    id: 2,
    orderType: "take_away",
    tableNumber: "",
    customerName: "Bima",
    source: "cashier",
    status: "paid",
    subtotal: 60000,
    createdBy: 2,
    createdAt: dayOffset(-3),
    items: [
      { id: 3, menuItemId: 5, menuName: "Nasi Goreng", quantity: 2, price: 30000 }
    ]
  },
  {
    id: 3,
    orderType: "dine_in",
    tableNumber: "B1",
    customerName: "Salsa",
    source: "cashier",
    status: "paid",
    subtotal: 60000,
    createdBy: 2,
    createdAt: dayOffset(-1),
    items: [
      { id: 4, menuItemId: 6, menuName: "Spaghetti Bolognese", quantity: 1, price: 32000 },
      { id: 5, menuItemId: 12, menuName: "Matcha Latte", quantity: 1, price: 28000 }
    ]
  }
];

const seedPayments = [
  {
    id: 1,
    orderId: 1,
    method: "cashless",
    total: 57000,
    paidAmount: 57000,
    changeAmount: 0,
    cashierId: 2,
    paidAt: dayOffset(-4)
  },
  {
    id: 2,
    orderId: 2,
    method: "cash",
    total: 60000,
    paidAmount: 100000,
    changeAmount: 40000,
    cashierId: 2,
    paidAt: dayOffset(-3)
  },
  {
    id: 3,
    orderId: 3,
    method: "cashless",
    total: 60000,
    paidAmount: 60000,
    changeAmount: 0,
    cashierId: 2,
    paidAt: dayOffset(-1)
  }
];

export function getStore() {
  if (!globalThis.__CAFE_SOFT_POS_STORE__) {
    globalThis.__CAFE_SOFT_POS_STORE__ = {
      users: structuredClone(sampleUsers),
      menuItems: structuredClone(sampleMenuItems),
      orders: structuredClone(seedOrders),
      payments: structuredClone(seedPayments),
      counters: {
        user: sampleUsers.length + 1,
        menu: sampleMenuItems.length + 1,
        order: seedOrders.length + 1,
        orderItem: 6,
        payment: seedPayments.length + 1
      }
    };
  }

  return globalThis.__CAFE_SOFT_POS_STORE__;
}
