export function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function roleLabel(role) {
  return {
    cashier: "Kasir",
    admin: "Admin",
    developer: "Developer"
  }[role] || role;
}

export function statusLabel(status) {
  return {
    open: "Baru",
    processing: "Proses",
    ready: "Siap Saji",
    paid: "Selesai",
    cancelled: "Dibatalkan"
  }[status] || status;
}

export function statusTone(status) {
  return {
    open: "bg-[#dff0ff] text-[#16639a]",
    processing: "bg-[#fff1d8] text-[#c46600]",
    ready: "bg-[#e3f4ea] text-[#096b3c]",
    paid: "bg-[#e3f4ea] text-[#096b3c]",
    cancelled: "bg-[#ffe0e0] text-[#bc3131]"
  }[status] || "bg-[#eef1ef] text-[#607066]";
}

export const thumbnailOptions = [
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1587985782608-20062892559d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFQztr0w0a1Vh1Qwia3bkJVp2FR_D1wq-0zA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ3rzkU-v0XnFfQYRfHzBMZe6HDAe3e0NNjw&s",
  "https://images.themodernproper.com/production/posts/2022/Homemade-French-Fries_8.jpg?w=960&h=960&q=82&fm=jpg&fit=crop&dm=1662474181&s=50bccc38a736ef0e0a6e261ad23378f4",
  "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTQdGZiR3vS7PS4CxexJkZ_sGJvCC349BRzw&s",
  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80"
];

export const cafeCategories = ["Semua", "Minuman", "Makanan", "Snack", "Dessert"];

export const heroCoffeeImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1800&q=88";

export const cafeInteriorImage =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=86";
