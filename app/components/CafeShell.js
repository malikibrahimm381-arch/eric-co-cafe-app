"use client";

import BrandLogo from "@/app/components/BrandLogo";
import { roleLabel } from "@/app/components/ui";
import {
  BadgePercent,
  BarChart3,
  Bell,
  CalendarDays,
  ClipboardList,
  Coffee,
  CreditCard,
  DatabaseBackup,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Package,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Soup,
  Table2,
  UsersRound,
  WalletCards
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const mainLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kasir", label: "POS / Kasir", icon: ReceiptText },
  { href: "/pesanan", label: "Pesanan", icon: ClipboardList },
  { href: "/reservasi", label: "Reservasi", icon: CalendarDays },
  { href: "/meja", label: "Meja", icon: Table2 },
  { href: "/admin", label: "Menu", icon: Coffee },
  { href: "/dapur", label: "Dapur", icon: Soup, badge: "Baru" },
  { href: "/stok", label: "Produk (Stok)", icon: Package },
  { href: "/pelanggan", label: "Pelanggan", icon: UsersRound },
  { href: "/loyalty", label: "Loyalty Program", icon: BadgePercent },
  { href: "/promosi", label: "Promosi", icon: ShoppingBag },
  { href: "/laporan", label: "Laporan", icon: BarChart3 }
];

const managementLinks = [
  { href: "/pegawai", label: "Pegawai", icon: UsersRound },
  { href: "/keuangan", label: "Keuangan", icon: WalletCards },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
  { href: "/backup", label: "Backup & Restore", icon: DatabaseBackup }
];

const dockItems = [
  { title: "Manajemen Pesanan", desc: "Kelola pesanan dengan mudah", icon: ClipboardList },
  { title: "Dapur (Kitchen Display)", desc: "Monitor pesanan real-time", icon: Soup },
  { title: "Reservasi Online", desc: "Kelola reservasi & jadwal meja", icon: CalendarDays },
  { title: "Manajemen Meja", desc: "Status meja real-time", icon: Table2 },
  { title: "Manajemen Menu & Stok", desc: "Kelola menu & inventori", icon: Package },
  { title: "Laporan & Analitik", desc: "Laporan penjualan lengkap", icon: BarChart3 },
  { title: "Multi Payment", desc: "Tunai, QRIS, E-Wallet, Kartu", icon: CreditCard },
  { title: "Pengaturan", desc: "Atur profil & sistem cafe", icon: Settings }
];

function formatDisplayDate() {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());
}

function NavLink({ item }) {
  const pathname = usePathname();
  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`group flex min-h-11 items-center justify-between gap-3 rounded-md px-3 text-sm font-bold transition ${
        active ? "bg-white/12 text-white shadow-inner" : "text-white/78 hover:bg-white/8 hover:text-white"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <Icon size={18} className={active ? "text-[#8bd46c]" : "text-white/72 group-hover:text-[#8bd46c]"} />
        <span className="truncate">{item.label}</span>
      </span>
      {item.badge ? <span className="rounded bg-[#8bd46c] px-1.5 py-0.5 text-[10px] font-black text-[#082418]">{item.badge}</span> : null}
    </Link>
  );
}

function CafeProfileLogo({ small = false }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full border border-[#8bd46c33] bg-[#0b3b28] text-[#8bd46c] shadow-inner shadow-white/10 ${
        small ? "size-9" : "size-12"
      }`}
      aria-label="Logo profil MAUL.CE"
      title="Logo MAUL.CE"
    >
      <Leaf size={small ? 18 : 23} />
    </span>
  );
}

export default function CafeShell({ user, title, subtitle, actions, children, dock = true }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f7f6f1] text-[#0e1713] lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="dark-glass no-print sticky top-0 z-40 hidden h-screen flex-col overflow-y-auto px-5 py-6 text-white lg:flex">
        <BrandLogo dark />
        <div className="mt-7 flex items-center gap-3 rounded-lg border border-white/10 bg-white/8 p-3">
          <CafeProfileLogo />
          <div className="min-w-0">
            <p className="truncate font-black">{user?.name || "Riski Maulana"}</p>
            <p className="text-xs font-bold text-[#8bd46c]">{roleLabel(user?.role || "admin")}</p>
          </div>
        </div>

        <nav className="mt-7 space-y-6">
          <div>
            <p className="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/52">Menu Utama</p>
            <div className="space-y-1">
              {mainLinks.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/52">Pengelolaan</p>
            <div className="space-y-1">
              {managementLinks.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-8">
          <button type="button" onClick={logout} className="icon-button w-full bg-white/10 text-white hover:bg-white/16">
            <LogOut size={17} />
            <span>Logout</span>
          </button>
          <p className="mt-5 text-center text-xs font-semibold text-white/58">MAUL.CE Cafe © 2026</p>
          <p className="mt-1 text-center text-xs font-semibold text-white/40">v2.0.0</p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="no-print sticky top-0 z-30 border-b border-[#0b22180f] bg-white/92 backdrop-blur-xl">
          <div className="flex min-h-16 items-center gap-4 px-4 lg:px-6">
            <Link href="/dashboard" className="grid size-10 place-items-center rounded-lg hover:bg-[#eef4ee] lg:hidden">
              <Menu size={21} />
            </Link>
            <label className="relative mx-auto hidden w-full max-w-xl sm:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#607066]" size={18} />
              <input
                className="field h-11 rounded-lg pl-11"
                placeholder="Cari menu, pesanan, pelanggan, reservasi..."
                onKeyDown={(event) => {
                  if (event.key === "Enter") router.push(`/pesanan?search=${encodeURIComponent(event.currentTarget.value)}`);
                }}
              />
            </label>
            <button type="button" className="relative grid size-10 place-items-center rounded-lg border border-[#0b22180f] bg-white text-[#0e1713]">
              <Bell size={18} />
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#0b3b28] text-[10px] font-black text-white">12</span>
            </button>
            <div className="hidden items-center gap-3 rounded-lg px-2 py-1.5 md:flex">
              <CafeProfileLogo small />
              <div className="leading-tight">
                <p className="text-sm font-black">{user?.name || "Riski Maulana"}</p>
                <p className="text-xs font-bold text-[#1f8a58]">{roleLabel(user?.role || "admin")}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-5 lg:px-6">
          <section className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-normal text-[#0e1713]">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm font-semibold text-[#607066]">{subtitle}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#0b22180f] bg-white px-4 text-sm font-black text-[#0e1713]">
                <CalendarDays size={17} className="text-[#1f8a58]" />
                {formatDisplayDate()}
              </div>
              {actions}
            </div>
          </section>

          {children}

          {dock ? (
            <section className="no-print mt-6 rounded-lg bg-[#062419] p-4 text-white shadow-2xl shadow-[#06241926]">
              <div className="grid gap-3 md:grid-cols-[150px_1fr] md:items-center">
                <div className="flex items-center gap-3 border-white/10 md:border-r">
                  <span className="grid size-14 place-items-center rounded-full bg-[#8bd46c] text-[#062419]">
                    <ShieldCheck size={28} />
                  </span>
                  <h2 className="text-xl font-black leading-tight">Fitur<br />Lengkap</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {dockItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <article key={item.title} className="flex min-w-0 items-center gap-3 rounded-lg bg-white/7 p-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10 text-[#d6a64a]">
                          <Icon size={19} />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black">{item.title}</p>
                          <p className="truncate text-xs font-semibold text-white/58">{item.desc}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
