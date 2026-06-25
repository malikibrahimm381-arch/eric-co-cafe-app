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
    name: "Americano",
    category: "Minuman",
    price: 26000,
    thumbnail: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    description: "Kopi hitam espresso dengan karakter bersih",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Cappuccino",
    category: "Minuman",
    price: 25000,
    thumbnail: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80",
    description: "Espresso, steamed milk, dan foam lembut",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Caramel Macchiato",
    category: "Minuman",
    price: 28000,
    thumbnail: "https://images.unsplash.com/photo-1587985782608-20062892559d?auto=format&fit=crop&w=800&q=80",
    description: "Kopi susu dengan sentuhan karamel",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Latte",
    category: "Minuman",
    price: 23000,
    thumbnail: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
    description: "Latte klasik creamy untuk teman kerja",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Chicken Katsu",
    category: "Makanan",
    price: 35000,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFQztr0w0a1Vh1Qwia3bkJVp2FR_D1wq-0zA&s",
    description: "Chicken katsu crispy dengan salad segar",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    name: "Beef Burger",
    category: "Makanan",
    price: 40000,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ3rzkU-v0XnFfQYRfHzBMZe6HDAe3e0NNjw&s",
    description: "Burger sapi juicy dengan saus signature",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 7,
    name: "French Fries",
    category: "Snack",
    price: 23000,
    thumbnail: "https://images.themodernproper.com/production/posts/2022/Homemade-French-Fries_8.jpg?w=960&h=960&q=82&fm=jpg&fit=crop&dm=1662474181&s=50bccc38a736ef0e0a6e261ad23378f4",
    description: "Kentang goreng renyah dengan saus pilihan",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    name: "Cheesecake",
    category: "Dessert",
    price: 30000,
    thumbnail: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    description: "Cheesecake lembut dengan base buttery",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 9,
    name: "Matcha Latte",
    category: "Minuman",
    price: 27000,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTQdGZiR3vS7PS4CxexJkZ_sGJvCC349BRzw&s",
    description: "Matcha latte earthy dan creamy",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 10,
    name: "Lemon Tea",
    category: "Minuman",
    price: 18000,
    thumbnail: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    description: "Teh lemon segar dingin atau hangat",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 11,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 25000,
    thumbnail: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    description: "Cake coklat rich dan lembap",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 12,
    name: "Red Velvet",
    category: "Dessert",
    price: 32000,
    thumbnail: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80",
    description: "Red velvet slice dengan cream cheese",
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
    subtotal: 58000,
    createdBy: null,
    createdAt: dayOffset(-4),
    items: [
      { id: 1, menuItemId: 5, menuName: "Chicken Katsu", quantity: 1, price: 35000 },
      { id: 2, menuItemId: 7, menuName: "French Fries", quantity: 1, price: 23000 }
    ]
  },
  {
    id: 2,
    orderType: "take_away",
    tableNumber: "",
    customerName: "Bima",
    source: "cashier",
    status: "paid",
    subtotal: 80000,
    createdBy: 2,
    createdAt: dayOffset(-3),
    items: [
      { id: 3, menuItemId: 6, menuName: "Beef Burger", quantity: 2, price: 40000 }
    ]
  },
  {
    id: 3,
    orderType: "dine_in",
    tableNumber: "12",
    customerName: "Salsa",
    source: "cashier",
    status: "paid",
    subtotal: 67000,
    createdBy: 2,
    createdAt: dayOffset(-1),
    items: [
      { id: 4, menuItemId: 6, menuName: "Beef Burger", quantity: 1, price: 40000 },
      { id: 5, menuItemId: 9, menuName: "Matcha Latte", quantity: 1, price: 27000 }
    ]
  },
  {
    id: 4,
    orderType: "dine_in",
    tableNumber: "07",
    customerName: "Andi",
    source: "qr",
    status: "open",
    subtotal: 108000,
    createdBy: null,
    createdAt: dayOffset(0),
    items: [
      { id: 6, menuItemId: 6, menuName: "Beef Burger", quantity: 1, price: 40000 },
      { id: 7, menuItemId: 7, menuName: "French Fries", quantity: 1, price: 23000 },
      { id: 8, menuItemId: 10, menuName: "Lemon Tea", quantity: 1, price: 18000 },
      { id: 9, menuItemId: 9, menuName: "Matcha Latte", quantity: 1, price: 27000 }
    ]
  },
  {
    id: 5,
    orderType: "dine_in",
    tableNumber: "03",
    customerName: "Siti",
    source: "cashier",
    status: "processing",
    subtotal: 86000,
    createdBy: 2,
    createdAt: dayOffset(0),
    items: [
      { id: 10, menuItemId: 5, menuName: "Chicken Katsu", quantity: 1, price: 35000 },
      { id: 11, menuItemId: 1, menuName: "Americano", quantity: 1, price: 26000 },
      { id: 12, menuItemId: 11, menuName: "Chocolate Cake", quantity: 1, price: 25000 }
    ]
  },
  {
    id: 6,
    orderType: "dine_in",
    tableNumber: "02",
    customerName: "Dwi",
    source: "qr",
    status: "ready",
    subtotal: 55000,
    createdBy: null,
    createdAt: dayOffset(0),
    items: [
      { id: 13, menuItemId: 2, menuName: "Cappuccino", quantity: 1, price: 25000 },
      { id: 14, menuItemId: 8, menuName: "Cheesecake", quantity: 1, price: 30000 }
    ]
  }
];

const seedPayments = [
  {
    id: 1,
    orderId: 1,
    method: "cashless",
    total: 58000,
    paidAmount: 58000,
    changeAmount: 0,
    cashierId: 2,
    paidAt: dayOffset(-4)
  },
  {
    id: 2,
    orderId: 2,
    method: "cash",
    total: 80000,
    paidAmount: 100000,
    changeAmount: 20000,
    cashierId: 2,
    paidAt: dayOffset(-3)
  },
  {
    id: 3,
    orderId: 3,
    method: "cashless",
    total: 67000,
    paidAmount: 67000,
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
        orderItem: 15,
        payment: seedPayments.length + 1
      }
    };
  }

  return globalThis.__CAFE_SOFT_POS_STORE__;
}
