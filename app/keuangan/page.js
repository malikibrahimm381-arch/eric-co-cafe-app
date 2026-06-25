"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { formatCurrency } from "@/app/components/ui";
import { WalletCards } from "lucide-react";
import { useEffect, useState } from "react";

export default function FinancePage() {
  return (
    <AuthGuard roles={["admin", "developer"]}>
      {(user) => <FinanceWorkspace user={user} />}
    </AuthGuard>
  );
}

function FinanceWorkspace({ user }) {
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    fetch("/api/payments")
      .then((response) => response.json())
      .then((data) => setPayments(data.payments || []));
  }, []);

  const total = payments.reduce((sum, payment) => sum + payment.total, 0);

  return (
    <CafeShell user={user} title="Keuangan" subtitle="Ringkasan pembayaran tunai dan non-tunai">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Total Masuk", formatCurrency(total)],
          ["Tunai", formatCurrency(payments.filter((p) => p.method === "cash").reduce((s, p) => s + p.total, 0))],
          ["Non Tunai", formatCurrency(payments.filter((p) => p.method === "cashless").reduce((s, p) => s + p.total, 0))]
        ].map(([label, value]) => (
          <article key={label} className="cafe-card p-5">
            <WalletCards className="text-[#1f8a58]" size={24} />
            <p className="mt-4 text-sm font-bold text-[#607066]">{label}</p>
            <h2 className="mt-2 text-2xl font-black">{value}</h2>
          </article>
        ))}
      </section>

      <section className="cafe-card mt-5 p-5">
        <h2 className="mb-4 text-lg font-black">Transaksi Terakhir</h2>
        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={payment.id} className="grid gap-2 rounded-lg bg-[#f7f6f1] p-3 text-sm md:grid-cols-[1fr_auto_auto]">
              <p className="font-black">Payment #{payment.id} - Order #{payment.orderId}</p>
              <p className="font-bold text-[#607066]">{payment.method === "cash" ? "Tunai" : "Non Tunai"}</p>
              <p className="font-black text-[#0b3b28]">{formatCurrency(payment.total)}</p>
            </div>
          ))}
        </div>
      </section>
    </CafeShell>
  );
}
