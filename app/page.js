import Header from "@/app/components/Header";
import { formatCurrency, heroCoffeeImage, cafeInteriorImage } from "@/app/components/ui";
import { ArrowRight, CalendarDays, Coffee, MapPin, Phone, QrCode, Star, Utensils } from "lucide-react";
import Link from "next/link";

const favorites = [
  {
    name: "Caramel Macchiato",
    price: 28000,
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1587985782608-20062892559d?auto=format&fit=crop&w=700&q=80"
  },
  {
    name: "Chicken Katsu",
    price: 35000,
    rating: "4.7",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFQztr0w0a1Vh1Qwia3bkJVp2FR_D1wq-0zA&s"
  },
  {
    name: "Beef Burger",
    price: 40000,
    rating: "4.6",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ3rzkU-v0XnFfQYRfHzBMZe6HDAe3e0NNjw&s"
  },
  {
    name: "Matcha Latte",
    price: 27000,
    rating: "4.8",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTQdGZiR3vS7PS4CxexJkZ_sGJvCC349BRzw&s"
  }
];

const gallery = [
  heroCoffeeImage,
  cafeInteriorImage,
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=82"
];

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f7f6f1]">
        <section className="relative min-h-[620px] overflow-hidden bg-[#020d09] text-white">
          <img src={heroCoffeeImage} alt="Kopi latte premium" className="absolute inset-0 h-full w-full object-cover opacity-64" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/58 to-black/16" />
          <div className="app-shell relative grid min-h-[620px] items-center py-16">
            <div className="max-w-2xl animate__animated animate__fadeInLeft">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#8bd46c]">
                <Coffee size={15} />
                Premium Cafe Experience
              </p>
              <h1 className="max-w-2xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl">
                Good Coffee, <span className="block font-serif italic text-[#d6a64a]">Great Moments</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/78">
                Nikmati pengalaman terbaik dengan kopi pilihan, menu favorit, reservasi meja, dan pemesanan digital yang cepat.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/customer" className="icon-button min-h-12 bg-[#0b3b28] px-7 text-white shadow-2xl shadow-[#0b3b2840]">
                  <Utensils size={18} />
                  <span>Lihat Menu</span>
                </Link>
                <Link href="/reservasi" className="icon-button min-h-12 border border-white/24 bg-white/8 px-7 text-white">
                  <CalendarDays size={18} />
                  <span>Reservasi Meja</span>
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-3">
                <span className="size-2 rounded-full bg-white" />
                <span className="size-2 rounded-full bg-white/32" />
                <span className="size-2 rounded-full bg-white/32" />
              </div>
            </div>
          </div>
        </section>

        <section id="menu" className="app-shell py-16">
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-[#d6a64a]" />
            <h2 className="text-center text-2xl font-black text-[#0e1713]">Menu Favorit Kami</h2>
            <span className="h-px w-16 bg-[#d6a64a]" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((item, index) => (
              <article
                key={item.name}
                className="cafe-card animate__animated animate__fadeInUp overflow-hidden"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <img src={item.image} alt={item.name} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-black text-[#0e1713]">{item.name}</h3>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-[#0b3b28]">{formatCurrency(item.price)}</p>
                    <p className="inline-flex items-center gap-1 text-sm font-black text-[#d18a00]">
                      <Star size={15} fill="currentColor" />
                      {item.rating}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/customer" className="icon-button min-h-12 bg-[#0b3b28] px-8 text-white">
              <span>Lihat Semua Menu</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <section id="tentang" className="bg-white py-16">
          <div className="app-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1f8a58]">Tentang MAUL.CE</p>
              <h2 className="mt-3 text-4xl font-black leading-tight text-[#0e1713]">Cafe modern untuk order, reservasi, kasir, dan laporan.</h2>
              <p className="mt-4 leading-8 text-[#607066]">
                Sistem ini dirancang seperti aplikasi operasional cafe profesional: customer bisa pesan dari katalog, kasir memproses pembayaran,
                dapur memantau pesanan, admin mengelola menu, dan owner melihat laporan.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["12+", "Menu Aktif"],
                  ["20", "Meja Cafe"],
                  ["24/7", "Data Online"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-[#0b22180f] bg-[#f7f6f1] p-4">
                    <p className="text-2xl font-black text-[#0b3b28]">{value}</p>
                    <p className="mt-1 text-sm font-bold text-[#607066]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <img src={cafeInteriorImage} alt="Interior cafe" className="h-[420px] w-full rounded-lg object-cover shadow-2xl shadow-[#06241924]" />
          </div>
        </section>

        <section id="galeri" className="app-shell py-16">
          <div className="grid gap-4 md:grid-cols-3">
            {gallery.map((image, index) => (
              <img key={image} src={image} alt={`Galeri cafe ${index + 1}`} className="h-72 w-full rounded-lg object-cover shadow-lg shadow-[#06241912]" />
            ))}
          </div>
        </section>

        <section id="kontak" className="bg-[#062419] py-14 text-white">
          <div className="app-shell grid gap-6 md:grid-cols-[1fr_auto_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-black">Siap pesan atau reservasi meja?</h2>
              <p className="mt-2 text-white/68">Gunakan menu digital, QR meja, atau login sebagai staff untuk mengelola operasional.</p>
            </div>
            <p className="flex items-center gap-2 font-bold text-white/80">
              <MapPin size={18} className="text-[#d6a64a]" />
              Jakarta, Indonesia
            </p>
            <p className="flex items-center gap-2 font-bold text-white/80">
              <Phone size={18} className="text-[#d6a64a]" />
              (021) 1234-5678
            </p>
          </div>
        </section>
      </main>
      <Link
        href="/customer?scan=1"
        className="no-print fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#0b3b28] text-white shadow-2xl shadow-[#06241940]"
        title="Scan QR"
      >
        <QrCode size={24} />
      </Link>
    </>
  );
}
