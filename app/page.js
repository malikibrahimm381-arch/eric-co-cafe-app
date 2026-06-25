import Header from "@/app/components/Header";
import { ArrowRight, BarChart3, CreditCard, LockKeyhole, Printer, QrCode, ReceiptText, Sparkles } from "lucide-react";
import Link from "next/link";

const heroItems = [
  {
    name: "Cafe Latte",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbeTrexIYpCCSK6QSKlS283rUBtdQ7hpjIw&s"
  },
  {
    name: "Nasi Goreng",
    src: "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2025/03/11082616/5-Resep-Nasi-Goreng-Sederhana-hingga-Spesial-Mudah-dan-Praktis.jpg"
  },
  {
    name: "Croissant",
    src: "https://asset.kompas.com/crops/QzJ7mkzUuw8Xo1yZf0gpBGxUuAI=/15x9:895x596/1200x800/data/photo/2023/02/01/63d9fbce5a2d2.jpg"
  },
  {
    name: "Spaghetti",
    src: "https://www.preciouscore.com/wp-content/uploads/2024/06/Spaghetti-Bolognese-Chicken.jpg"
  }
];

const stats = [
  ["12+", "Menu Variasi"],
  ["100+", "Pelanggan"],
  ["5", "Rating"]
];

const features = [
  {
    title: "Pesan Mudah",
    text: "Lihat menu lengkap dengan gambar dan pesan langsung dari meja Anda.",
    icon: ReceiptText
  },
  {
    title: "Bayar Fleksibel",
    text: "Tunai atau non-tunai, hitung kembalian otomatis.",
    icon: CreditCard
  },
  {
    title: "Dashboard Real-time",
    text: "Pantau penjualan dengan grafik interaktif dan filter tanggal.",
    icon: BarChart3
  },
  {
    title: "QR Code Meja",
    text: "Scan QR Code meja untuk pesan tanpa antre.",
    icon: QrCode
  },
  {
    title: "Aman & Terpercaya",
    text: "Login aman dengan enkripsi bcrypt untuk setiap role.",
    icon: LockKeyhole
  },
  {
    title: "Cetak Katalog",
    text: "Cetak katalog menu kapan saja dengan satu klik.",
    icon: Printer
  }
];

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="bg-[#fff8f0]">
        <section className="bg-[#281b16] text-white">
          <div className="app-shell grid min-h-[calc(100vh-76px)] items-center gap-10 py-12 lg:grid-cols-[1fr_0.95fr]">
            <div className="animate__animated animate__fadeInLeft">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#3b281f] px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#d6a265]">
                <Sparkles size={15} />
                Premium Cafe Experience
              </p>
              <h1 className="mt-7 max-w-2xl text-5xl font-black leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
                Where Every Sip <span className="block text-[#d6a265]">Tells a Story</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#d8cabe]">
                Pesan makanan dan minuman favorit Anda secara digital. Cepat, mudah, dan nyaman. Tersedia Dine In dan Take Away.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/customer" className="icon-button min-h-14 bg-[#d6a265] px-8 text-[#1a0f0a] shadow-2xl shadow-[#d6a26533]">
                  <ReceiptText size={20} />
                  <span>Lihat Menu</span>
                </Link>
                <Link href="/customer?scan=1" className="icon-button min-h-14 border border-white/20 bg-transparent px-8 text-[#f2e7dc]">
                  <QrCode size={20} />
                  <span>Scan QR</span>
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/12 pt-8">
                {stats.map(([value, label]) => (
                  <div key={label}>
                    <p className="text-3xl font-black text-[#d6a265]">{value}</p>
                    <p className="mt-1 text-sm font-semibold text-[#c8b7a6]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate__animated animate__fadeInRight relative">
              <div className="rounded-[28px] border border-[#d6a26533] bg-[#3a261e]/82 p-6 shadow-2xl shadow-black/20">
                <div className="grid grid-cols-2 gap-4">
                  {heroItems.map((item, index) => (
                    <div
                      key={item.name}
                      className={`overflow-hidden rounded-2xl bg-[#fff8f0] shadow-xl shadow-black/20 ${index === 3 ? "col-span-2 mx-auto w-1/2 min-w-44" : ""}`}
                    >
                      <img src={item.src} alt={item.name} className="h-32 w-full object-cover sm:h-40" />
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end">
                  <Link href="/customer" className="icon-button bg-[#d6a265] text-[#1a0f0a] shadow-lg shadow-[#d6a26533]">
                    <Sparkles size={18} />
                    <span>Pesan Online Saja!</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="app-shell py-16">
          <div className="text-center">
            <p className="font-black uppercase tracking-[0.18em] text-[#9a6d3c]">Mengapa ERIC.CO</p>
            <h2 className="mt-3 text-4xl font-black text-[#1a0f0a]">The Perfect Experience</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="animate__animated animate__fadeInUp rounded-2xl border border-[#5c3b2512] bg-white p-6 shadow-sm"
                  style={{ animationDelay: `${index * 55}ms` }}
                >
                  <div className="mb-5 grid size-12 place-items-center rounded-xl bg-[#fff1df] text-[#9a6d3c]">
                    <Icon size={23} />
                  </div>
                  <h3 className="text-xl font-black text-[#1a0f0a]">{feature.title}</h3>
                  <p className="mt-2 leading-7 text-[#786a5d]">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="app-shell pb-16">
          <div className="rounded-[28px] bg-[#281b16] p-8 text-center text-white shadow-2xl shadow-[#281b161a]">
            <p className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#d6a265] text-[#1a0f0a]">
              <ReceiptText size={25} />
            </p>
            <h2 className="mt-5 text-3xl font-black">Siap Memesan?</h2>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-[#d8cabe]">
              Klik tombol di bawah untuk melihat menu lengkap dan mulai pesan sekarang.
            </p>
            <Link href="/customer" className="icon-button mt-6 min-h-14 bg-[#d6a265] px-8 text-[#1a0f0a]">
              <span>Mulai Pesan</span>
              <ArrowRight size={19} />
            </Link>
          </div>
        </section>
      </main>
      <footer className="bg-[#1d130f] py-10 text-[#d8cabe]">
        <div className="app-shell grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-black text-white">ERIC.CO</h3>
            <p className="mt-3 leading-7">Aplikasi manajemen cafe modern untuk pemesanan digital, pembayaran, dan laporan real-time.</p>
          </div>
          <div>
            <h4 className="font-black text-white">Fitur</h4>
            <p className="mt-3 leading-7">Pesan Online<br />QR Code Meja<br />Dashboard<br />Cetak Katalog</p>
          </div>
          <div>
            <h4 className="font-black text-white">Kontak</h4>
            <p className="mt-3 leading-7">info@eric.co.id<br />(021) 1234-5678<br />Jakarta, Indonesia</p>
          </div>
        </div>
      </footer>
    </>
  );
}
