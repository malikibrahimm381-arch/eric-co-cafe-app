"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { statusLabel, statusTone } from "@/app/components/ui";
import { QrCode, Table2, UsersRound } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";

const tables = ["01", "02", "03", "05", "06", "07", "08", "12", "15", "16", "18", "20"];

export default function TablesPage() {
  return (
    <AuthGuard roles={["cashier", "admin", "developer"]}>
      {(user) => <TablesWorkspace user={user} />}
    </AuthGuard>
  );
}

function TablesWorkspace({ user }) {
  const [orders, setOrders] = useState([]);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch("/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders || []));
  }, []);

  const activeByTable = useMemo(() => {
    const map = new Map();
    for (const order of orders) {
      if (!["paid", "cancelled"].includes(order.status) && order.tableNumber) {
        map.set(String(order.tableNumber).padStart(2, "0"), order);
      }
    }
    return map;
  }, [orders]);

  return (
    <CafeShell user={user} title="Manajemen Meja" subtitle="Status meja real-time dan QR code pemesanan">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tables.map((table) => {
          const order = activeByTable.get(table);
          return (
            <article key={table} className="cafe-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-black text-[#607066]">
                    <Table2 size={17} />
                    Meja {table}
                  </p>
                  <h2 className="mt-2 text-2xl font-black">{order ? "Terisi" : "Kosong"}</h2>
                </div>
                <span className={`status-pill ${order ? "bg-[#fff1d8] text-[#c46600]" : "bg-[#e3f4ea] text-[#096b3c]"}`}>
                  {order ? statusLabel(order.status) : "Tersedia"}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="rounded-lg bg-white p-2 shadow-sm">
                  {origin ? <QRCodeCanvas value={`${origin}/customer?table=${table}`} size={74} /> : null}
                </div>
                <div>
                  <p className="flex items-center gap-1 text-sm font-bold text-[#607066]">
                    <UsersRound size={15} />
                    {order?.customerName || "Belum ada tamu"}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#0b3b28]">{order ? `#INV-${String(order.id).padStart(3, "0")}` : "QR siap discan"}</p>
                </div>
              </div>
              <a href={`/customer?table=${table}`} className="icon-button mt-4 w-full bg-[#eef4ee] text-[#0b3b28]">
                <QrCode size={17} />
                <span>Buka QR Menu</span>
              </a>
            </article>
          );
        })}
      </section>
    </CafeShell>
  );
}
