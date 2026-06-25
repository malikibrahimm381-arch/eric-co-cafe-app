"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { formatCurrency } from "@/app/components/ui";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Filter, Printer } from "lucide-react";

const Flatpickr = dynamic(() => import("react-flatpickr"), { ssr: false });

const pieData = [
  { name: "Minuman", value: 45, color: "#1683a7" },
  { name: "Makanan", value: 35, color: "#1f8a58" },
  { name: "Snack", value: 15, color: "#f08b19" },
  { name: "Dessert", value: 5, color: "#d6a64a" }
];

function formatDate(date) {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

export default function ReportPage() {
  return (
    <AuthGuard roles={["cashier", "admin", "developer"]}>
      {(user) => <ReportWorkspace user={user} />}
    </AuthGuard>
  );
}

function ReportWorkspace({ user }) {
  const [dates, setDates] = useState([new Date(Date.now() - 6 * 86400000), new Date()]);
  const [dashboard, setDashboard] = useState(null);
  const from = dates[0] ? formatDate(dates[0]) : "";
  const to = dates[1] ? formatDate(dates[1]) : from;

  useEffect(() => {
    if (!from || !to) return;
    fetch(`/api/dashboard?from=${from}&to=${to}`)
      .then((response) => response.json())
      .then((data) => setDashboard(data));
  }, [from, to]);

  const totals = dashboard?.totals || {};
  const series = dashboard?.series || [];

  return (
    <CafeShell
      user={user}
      title="Laporan Penjualan"
      subtitle="Grafik pendapatan, kategori, dan ringkasan transaksi"
      actions={
        <>
          <label className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#0b22180f] bg-white px-3 text-sm font-black">
            <Filter size={17} />
            <Flatpickr
              value={dates}
              onChange={(value) => setDates(value.length === 1 ? [value[0], value[0]] : value)}
              options={{ mode: "range", dateFormat: "Y-m-d" }}
              className="w-40 bg-transparent outline-none"
            />
          </label>
          <button type="button" onClick={() => window.print()} className="icon-button bg-white px-4 text-[#0e1713]">
            <Printer size={17} />
            <span>Cetak</span>
          </button>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Total Pendapatan", formatCurrency(totals.revenue || 156430000)],
          ["Total Pesanan", totals.orders || 3245],
          ["Rata-rata per Hari", formatCurrency(totals.averageOrder || 5214333)],
          ["Produk Terjual", 8432]
        ].map(([label, value]) => (
          <article key={label} className="cafe-card p-5">
            <p className="text-sm font-bold text-[#607066]">{label}</p>
            <h2 className="mt-2 text-2xl font-black">{value}</h2>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="cafe-card p-5">
          <h2 className="mb-4 text-lg font-black">Grafik Penjualan</h2>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid stroke="#e7ece7" />
                <XAxis dataKey="label" tick={{ fill: "#607066", fontSize: 12 }} />
                <YAxis tick={{ fill: "#607066", fontSize: 12 }} tickFormatter={(value) => `${Math.round(value / 1000000)}M`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#1f8a58" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="cafe-card p-5">
          <h2 className="mb-4 text-lg font-black">Penjualan per Kategori</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm font-bold">
                <span className="flex items-center gap-2"><span className="size-3 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>
                <span>{item.value}%</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </CafeShell>
  );
}
