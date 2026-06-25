"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { formatCurrency, statusLabel, statusTone } from "@/app/components/ui";
import { CheckCircle2, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function OrdersPage() {
  return (
    <AuthGuard roles={["cashier", "admin", "developer"]}>
      {(user) => <OrdersWorkspace user={user} />}
    </AuthGuard>
  );
}

function OrdersWorkspace({ user }) {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  async function loadOrders() {
    const response = await fetch("/api/orders");
    const data = await response.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id, status) {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Status gagal diubah.");
      return;
    }
    setMessage(`Status pesanan #${id} berhasil diubah.`);
    loadOrders();
  }

  async function deleteOrder(id) {
    const response = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Pesanan gagal dihapus.");
      return;
    }
    setMessage(`Pesanan #${id} dihapus.`);
    loadOrders();
  }

  const filteredOrders = useMemo(() => {
    const clean = query.toLowerCase();
    return orders.filter((order) => `${order.id} ${order.customerName} ${order.tableNumber} ${order.status}`.toLowerCase().includes(clean));
  }, [orders, query]);

  return (
    <CafeShell user={user} title="Pesanan" subtitle="Pantau pesanan dari QR, kasir, dan dapur">
      <section className="cafe-card mb-4 p-4">
        <label className="relative block max-w-lg">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#607066]" size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="field pl-10" placeholder="Cari nomor pesanan, pelanggan, meja..." />
        </label>
      </section>

      {message ? <p className="mb-4 rounded-lg bg-[#e3f4ea] p-4 text-sm font-black text-[#0b3b28]">{message}</p> : null}

      <section className="space-y-3">
        {filteredOrders.map((order) => (
          <article key={order.id} className="cafe-card p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black">#INV-250625-{String(order.id).padStart(3, "0")}</h2>
                  <span className={`status-pill ${statusTone(order.status)}`}>{statusLabel(order.status)}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-[#607066]">
                  {order.customerName} - {order.orderType === "dine_in" ? `Meja ${order.tableNumber || "-"}` : "Take Away"} - {order.items.length} item
                </p>
                <p className="mt-2 text-sm font-bold text-[#0b3b28]">{order.items.map((item) => `${item.quantity}x ${item.menuName}`).join(", ")}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <p className="mr-2 text-lg font-black">{formatCurrency(order.subtotal)}</p>
                <button type="button" onClick={() => updateStatus(order.id, "processing")} className="rounded-lg bg-[#fff1d8] px-3 py-2 text-xs font-black text-[#c46600]">
                  Proses
                </button>
                <button type="button" onClick={() => updateStatus(order.id, "ready")} className="rounded-lg bg-[#e3f4ea] px-3 py-2 text-xs font-black text-[#096b3c]">
                  Siap
                </button>
                <button type="button" onClick={() => updateStatus(order.id, "paid")} className="grid size-9 place-items-center rounded-lg bg-[#0b3b28] text-white" title="Selesai">
                  <CheckCircle2 size={17} />
                </button>
                <button type="button" onClick={() => deleteOrder(order.id)} className="grid size-9 place-items-center rounded-lg bg-[#ffe0e0] text-[#bc3131]" title="Hapus">
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </CafeShell>
  );
}
