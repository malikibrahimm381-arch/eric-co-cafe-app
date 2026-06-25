"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { BadgePercent, Gift, Plus } from "lucide-react";
import { useState } from "react";

export default function LoyaltyPage() {
  return (
    <AuthGuard roles={["cashier", "admin", "developer"]}>
      {(user) => <LoyaltyWorkspace user={user} />}
    </AuthGuard>
  );
}

function LoyaltyWorkspace({ user }) {
  const [programs, setPrograms] = useState(["Stamp 10 kopi gratis 1", "Diskon ulang tahun 15%", "Poin member setiap transaksi"]);
  return (
    <CafeShell user={user} title="Loyalty Program" subtitle="Program member dan poin pelanggan" actions={<button onClick={() => setPrograms((c) => [...c, `Program member ${c.length + 1}`])} className="icon-button bg-[#0b3b28] px-4 text-white"><Plus size={17} />Tambah Program</button>}>
      <section className="grid gap-4 md:grid-cols-3">
        {programs.map((program, index) => (
          <article key={program} className="cafe-card p-5">
            <span className="grid size-12 place-items-center rounded-lg bg-[#fff1d8] text-[#c46600]">{index === 0 ? <Gift size={22} /> : <BadgePercent size={22} />}</span>
            <h2 className="mt-4 text-lg font-black">{program}</h2>
            <p className="mt-2 text-sm font-semibold text-[#607066]">Aktif untuk pelanggan terdaftar dan bisa dipakai di kasir.</p>
            <span className="status-pill mt-4 bg-[#e3f4ea] text-[#096b3c]">Aktif</span>
          </article>
        ))}
      </section>
    </CafeShell>
  );
}
