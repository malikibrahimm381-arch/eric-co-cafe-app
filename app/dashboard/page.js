"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { formatCurrency, statusLabel, statusTone } from "@/app/components/ui";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  BadgeCheck,
  Bell,
  CalendarDays,
  CircleDollarSign,
  PackageOpen,
  Printer,
  ReceiptText,
  Soup,
  Table2,
  TrendingUp
} from "lucide-react";

const Flatpickr = dynamic(() => import("react-flatpickr"), { ssr: false });

const inventory = [
  ["Biji Kopi Arabica", "450 gr", "Kritis"],
  ["Susu Full Cream", "1 Liter", "Rendah"],
  ["Syrup Caramel", "2 Botol", "Rendah"],
  ["Keju Cheddar", "200 gr", "Rendah"],
  ["Daging Sapi", "500 gr", "Rendah"]
];

const reservations = [
  ["Rani Putri", "2 Orang - 19:00", "Meja 05", "Terkonfirmasi"],
  ["Andi Pratama", "4 Orang - 20:00", "Meja 08", "Terkonfirmasi"],
  ["Siti Nurhaliza", "6 Orang - 18:30", "Meja 02", "Menunggu"],
  ["Budi Hartono", "2 Orang - 17:00", "Meja 12", "Terkonfirmasi"],
  ["Dwi Cahyono", "3 Orang - 21:00", "Meja 03", "Dibatalkan"]
];

const pieData = [
  { name: "Minuman", value: 45, color: "#1683a7" },
  { name: "Makanan", value: 35, color: "#1f8a58" },
  { name: "Snack", value: 15, color: "#f08b19" },
  { name: "Dessert", value: 5, color: "#d6a64a" }
];

function formatDate(date) {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  return [start, end];
}

export default function DashboardPage() {
  return (
    <AuthGuard roles={["cashier", "admin", "developer"]}>
      {(user) => <DashboardWorkspace user={user} />}
    </AuthGuard>
  );
}

function DashboardWorkspace({ user }) {
  const [dates, setDates] = useState(defaultRange);
  const [dashboard, setDashboard] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const from = dates[0] ? formatDate(dates[0]) : "";
  const to = dates[1] ? formatDate(dates[1]) : from;

  async function loadData() {
    if (!from || !to) return;
    setLoading(true);
    const [dashboardResponse, menuResponse, ordersResponse] = await Promise.all([
      fetch(`/api/dashboard?from=${from}&to=${to}`),
      fetch("/api/menu?active=1"),
      fetch("/api/orders")
    ]);
    const dashboardData = await dashboardResponse.json();
    const menuData = await menuResponse.json();
    const ordersData = await ordersResponse.json();
    setDashboard(dashboardData);
    setMenuItems(menuData.items || []);
    setOrders(ordersData.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [from, to]);

  const totals = dashboard?.totals || {};
  const activeOrders = orders.filter((order) => !["paid", "cancelled"].includes(order.status)).slice(0, 4);
  const occupiedTables = new Set(activeOrders.map((order) => order.tableNumber).filter(Boolean)).size;
  const series = dashboard?.series?.length ? dashboard.series : [];

  const topMenu = useMemo(() => {
    const sold = new Map();
    for (const order of orders) {
      for (const item of order.items || []) {
        sold.set(item.menuName, (sold.get(item.menuName) || 0) + item.quantity);
      }
    }
    return [...sold.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty], index) => ({ name, qty, rating: ["4.8", "4.7", "4.6", "4.8", "4.6"][index] || "4.7" }));
  }, [orders]);

  const cards = [
    { label: "Pendapatan Hari Ini", value: formatCurrency(totals.revenue || 5430000), helper: "12.5% dari kemarin", icon: CircleDollarSign },
    { label: "Total Pesanan", value: totals.orders || 128, helper: "8.2% dari kemarin", icon: ReceiptText },
    { label: "Pesanan Selesai", value: orders.filter((order) => order.status === "paid").length || 98, helper: "7.1% dari kemarin", icon: BadgeCheck },
    { label: "Meja Terisi", value: `${occupiedTables || 12} / 20`, helper: "60%", icon: Table2 },
    { label: "Stok Hampir Habis", value: "8 Item", helper: "Lihat Detail", icon: PackageOpen }
  ];

  return (
    <CafeShell
      user={user}
      title="Dashboard"
      subtitle="Ringkasan aktivitas cafe hari ini"
      actions={
        <>
          <label className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#0b22180f] bg-white px-3 text-sm font-black">
            <CalendarDays size={17} className="text-[#1f8a58]" />
            <Flatpickr
              value={dates}
              onChange={(value) => setDates(value.length === 1 ? [value[0], value[0]] : value)}
              options={{ mode: "range", dateFormat: "Y-m-d" }}
              className="w-40 bg-transparent outline-none"
            />
          </label>
          <Link href="/kasir" className="icon-button bg-[#e3f4ea] px-4 text-[#0b3b28]">
            <ReceiptText size={17} />
            <span>POS</span>
          </Link>
          <button type="button" onClick={() => window.print()} className="icon-button bg-white px-4 text-[#0e1713]">
            <Printer size={17} />
            <span>Cetak Struk</span>
          </button>
          <Link href="/dapur" className="icon-button bg-[#e3f4ea] px-4 text-[#0b3b28]">
            <Bell size={17} />
            <span>Notifikasi Dapur</span>
          </Link>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="cafe-card animate__animated animate__fadeInUp p-5" style={{ animationDelay: `${index * 45}ms` }}>
              <div className="mb-4 flex items-center gap-3">
                <span className={`grid size-11 place-items-center rounded-full ${index === 3 ? "bg-[#fff0df] text-[#f08b19]" : "bg-[#e3f4ea] text-[#1f8a58]"}`}>
                  <Icon size={20} />
                </span>
                <p className="text-xs font-black text-[#607066]">{card.label}</p>
              </div>
              <h2 className="text-2xl font-black text-[#0e1713]">{loading ? "..." : card.value}</h2>
              <p className="mt-2 flex items-center gap-1 text-xs font-bold text-[#1f8a58]">
                <TrendingUp size={13} />
                {card.helper}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_1fr_1fr_1.2fr]">
        <article className="cafe-card p-5">
          <h2 className="text-lg font-black">Grafik Pendapatan</h2>
          <p className="mt-1 text-xs font-bold text-[#607066]">(Rupiah)</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid stroke="#e7ece7" />
                <XAxis dataKey="label" tick={{ fill: "#607066", fontSize: 12 }} />
                <YAxis tick={{ fill: "#607066", fontSize: 12 }} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#0b3b28" strokeWidth={3} dot={{ r: 4, fill: "#0b3b28" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="cafe-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black">Pesanan Terbaru</h2>
            <Link href="/pesanan" className="text-xs font-black text-[#0b3b28]">Lihat Semua</Link>
          </div>
          <div className="space-y-3">
            {(dashboard?.recentOrders || orders.slice(0, 5)).slice(0, 5).map((order) => (
              <div key={order.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm">
                <p className="font-black">#INV-250625-{String(order.id).padStart(3, "0")}</p>
                <p className="font-semibold text-[#607066]">Meja {order.tableNumber || "-"}</p>
                <span className={`status-pill ${statusTone(order.status)}`}>{statusLabel(order.status)}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="cafe-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black">Reservasi Terbaru</h2>
            <Link href="/reservasi" className="text-xs font-black text-[#0b3b28]">Lihat Semua</Link>
          </div>
          <div className="space-y-3">
            {reservations.map(([name, detail, table, status]) => (
              <div key={`${name}-${table}`} className="grid grid-cols-[1fr_auto] gap-2 text-sm">
                <div>
                  <p className="font-black">{name}</p>
                  <p className="text-xs font-semibold text-[#607066]">{detail}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#607066]">{table}</p>
                  <span className={`status-pill mt-1 ${status === "Dibatalkan" ? "bg-[#ffe0e0] text-[#bc3131]" : status === "Menunggu" ? "bg-[#fff1d8] text-[#c46600]" : "bg-[#e3f4ea] text-[#096b3c]"}`}>
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="cafe-card overflow-hidden">
          <div className="flex items-center justify-between bg-[#07120d] px-5 py-4 text-white">
            <h2 className="text-lg font-black">Dapur - Pesanan Aktif</h2>
            <span className="text-sm font-bold">{activeOrders.length || 6} Pesanan</span>
          </div>
          <div className="thin-scrollbar max-h-[330px] space-y-3 overflow-auto p-4">
            {activeOrders.map((order) => (
              <div key={order.id} className="rounded-lg border border-[#0b22180f] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black">#INV-250625-{String(order.id).padStart(3, "0")}</p>
                    <p className="text-xs font-semibold text-[#607066]">Meja {order.tableNumber || "-"} - {order.items.length} Item</p>
                  </div>
                  <span className={`status-pill ${statusTone(order.status)}`}>{statusLabel(order.status)}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-[#0e1713]">
                  {order.items.map((item) => `${item.quantity}x ${item.menuName}`).join("   ")}
                </p>
                <Link href="/dapur" className="icon-button mt-3 min-h-9 bg-[#0b3b28] px-4 text-xs text-white">
                  <Soup size={15} />
                  <span>Kelola Dapur</span>
                </Link>
              </div>
            ))}
            {!activeOrders.length ? <p className="rounded-lg bg-[#f7f6f1] p-4 text-sm font-bold text-[#607066]">Tidak ada pesanan aktif.</p> : null}
          </div>
        </article>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr_1.25fr]">
        <article className="cafe-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black">Menu Terlaris</h2>
            <Link href="/admin" className="text-xs font-black text-[#0b3b28]">Lihat Semua</Link>
          </div>
          <div className="space-y-3">
            {(topMenu.length ? topMenu : menuItems.slice(0, 5).map((item, index) => ({ name: item.name, qty: [128, 102, 98, 87, 76][index], rating: "4.8" }))).map((item, index) => (
              <div key={item.name} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3">
                <span className="font-black">{index + 1}.</span>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm font-semibold text-[#607066]">{item.qty} Terjual</p>
                <p className="text-sm font-black text-[#d18a00]">★ {item.rating}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="cafe-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black">Stok Hampir Habis</h2>
            <Link href="/stok" className="text-xs font-black text-[#0b3b28]">Lihat Semua</Link>
          </div>
          <div className="space-y-3">
            {inventory.map(([name, stock, status]) => (
              <div key={name} className="grid grid-cols-[1fr_auto] gap-3">
                <div>
                  <p className="font-black">{name}</p>
                  <p className="text-xs font-semibold text-[#607066]">Stok: {stock}</p>
                </div>
                <span className={`status-pill ${status === "Kritis" ? "bg-[#ffe0e0] text-[#bc3131]" : "bg-[#fff1d8] text-[#c46600]"}`}>{status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="cafe-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black">Laporan Penjualan</h2>
            <Link href="/laporan" className="rounded-lg border border-[#0b22180f] px-3 py-2 text-xs font-black">Filter</Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series}>
                  <CartesianGrid stroke="#e7ece7" />
                  <XAxis dataKey="label" tick={{ fill: "#607066", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#607066", fontSize: 12 }} tickFormatter={(value) => `${Math.round(value / 1000000)}M`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="#1f8a58" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78}>
                    {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>
      </section>
    </CafeShell>
  );
}
