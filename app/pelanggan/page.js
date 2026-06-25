"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { formatCurrency } from "@/app/components/ui";
import { Mail, Phone, Search, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function CustomersPage() {
  return (
    <AuthGuard roles={["cashier", "admin", "developer"]}>
      {(user) => <CustomersWorkspace user={user} />}
    </AuthGuard>
  );
}

function CustomersWorkspace({ user }) {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders || []));
  }, []);

  const customers = useMemo(() => {
    const map = new Map();
    for (const order of orders) {
      const key = order.customerName || "Customer";
      const current = map.get(key) || { name: key, orders: 0, total: 0, table: order.tableNumber || "-", last: order.createdAt };
      current.orders += 1;
      current.total += order.subtotal;
      current.last = order.createdAt;
      map.set(key, current);
    }
    return [...map.values()].filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  }, [orders, query]);

  return (
    <CafeShell user={user} title="Manajemen Pelanggan" subtitle="Data pelanggan tersimpan dari pesanan dan reservasi">
      <section className="cafe-card mb-5 p-4">
        <label className="relative block max-w-lg">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#607066]" size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="field pl-10" placeholder="Cari pelanggan..." />
        </label>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer, index) => (
          <article key={customer.name} className="cafe-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-[#e3f4ea] text-[#0b3b28]">
                <UsersRound size={22} />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-black">{customer.name}</h2>
                <p className="text-sm font-bold text-[#607066]">{customer.orders} pesanan - Meja {customer.table}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-[#f7f6f1] p-3">
                <p className="text-xs font-bold text-[#607066]">Total Belanja</p>
                <p className="font-black text-[#0b3b28]">{formatCurrency(customer.total)}</p>
              </div>
              <div className="rounded-lg bg-[#f7f6f1] p-3">
                <p className="text-xs font-bold text-[#607066]">Level</p>
                <p className="font-black">{index < 2 ? "Gold" : "Member"}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="icon-button min-h-9 bg-[#eef4ee] px-3 text-xs text-[#0b3b28]"><Phone size={15} />Hubungi</button>
              <button className="icon-button min-h-9 bg-[#eef4ee] px-3 text-xs text-[#0b3b28]"><Mail size={15} />Promo</button>
            </div>
          </article>
        ))}
      </section>
    </CafeShell>
  );
}
