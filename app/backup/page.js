"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { DatabaseBackup, Download, Upload } from "lucide-react";
import { useState } from "react";

export default function BackupPage() {
  return (
    <AuthGuard roles={["admin", "developer"]}>
      {(user) => <BackupWorkspace user={user} />}
    </AuthGuard>
  );
}

function BackupWorkspace({ user }) {
  const [message, setMessage] = useState("");

  return (
    <CafeShell user={user} title="Backup & Restore" subtitle="Simulasi backup database dan konfigurasi sistem">
      <section className="grid gap-4 md:grid-cols-2">
        <article className="cafe-card p-6">
          <DatabaseBackup size={30} className="text-[#1f8a58]" />
          <h2 className="mt-4 text-xl font-black">Backup Data</h2>
          <p className="mt-2 text-sm font-semibold text-[#607066]">Unduh arsip SQL dan konfigurasi demo untuk dokumentasi project.</p>
          <button onClick={() => setMessage("Backup demo berhasil dibuat: maul-ce-backup.sql")} className="icon-button mt-5 bg-[#0b3b28] px-5 text-white">
            <Download size={17} />
            Buat Backup
          </button>
        </article>
        <article className="cafe-card p-6">
          <Upload size={30} className="text-[#d6a64a]" />
          <h2 className="mt-4 text-xl font-black">Restore Data</h2>
          <p className="mt-2 text-sm font-semibold text-[#607066]">Mode demo: proses restore ditampilkan sebagai simulasi aman.</p>
          <button onClick={() => setMessage("Restore demo berhasil diproses.")} className="icon-button mt-5 bg-[#fff1d8] px-5 text-[#8b5b00]">
            <Upload size={17} />
            Restore Demo
          </button>
        </article>
      </section>
      {message ? <p className="mt-5 rounded-lg bg-[#e3f4ea] p-4 text-sm font-black text-[#0b3b28]">{message}</p> : null}
    </CafeShell>
  );
}
