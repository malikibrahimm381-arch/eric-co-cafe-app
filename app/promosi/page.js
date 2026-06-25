"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { BadgePercent, Plus } from "lucide-react";
import { useState } from "react";

export default function PromoPage() {
  return (
    <AuthGuard roles={["admin", "developer"]}>
      {(user) => <PromoWorkspace user={user} />}
    </AuthGuard>
  );
}

function PromoWorkspace({ user }) {
  const [promos, setPromos] = useState(["Happy Hour Coffee 17:00-19:00", "Bundle Katsu + Lemon Tea", "Dessert Weekend"]);
  return (
    <CafeShell user={user} title="Promosi" subtitle="Kelola campaign dan voucher cafe" actions={<button onClick={() => setPromos((c) => [...c, `Promo Baru ${c.length + 1}`])} className="icon-button bg-[#0b3b28] px-4 text-white"><Plus size={17} />Tambah Promo</button>}>
      <section className="grid gap-4 md:grid-cols-3">
        {promos.map((promo, index) => (
          <article key={promo} className="cafe-card p-5">
            <span className="grid size-12 place-items-center rounded-lg bg-[#e3f4ea] text-[#0b3b28]"><BadgePercent size={22} /></span>
            <h2 className="mt-4 text-lg font-black">{promo}</h2>
            <p className="mt-2 text-sm font-semibold text-[#607066]">Kode: MAUL{index + 1}0 - Berlaku bulan ini.</p>
            <button className="icon-button mt-4 min-h-9 bg-[#eef4ee] px-3 text-xs text-[#0b3b28]">Aktifkan</button>
          </article>
        ))}
      </section>
    </CafeShell>
  );
}
