"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { Save, Settings } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  return (
    <AuthGuard roles={["admin", "developer"]}>
      {(user) => <SettingsWorkspace user={user} />}
    </AuthGuard>
  );
}

function SettingsWorkspace({ user }) {
  const [settings, setSettings] = useState({
    name: "MAUL.CE Cafe & Resto",
    phone: "(021) 1234-5678",
    tax: "10",
    service: "5"
  });
  const [message, setMessage] = useState("");

  function setField(field, value) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function save(event) {
    event.preventDefault();
    setMessage("Pengaturan berhasil disimpan untuk sesi demo.");
  }

  return (
    <CafeShell user={user} title="Pengaturan" subtitle="Atur profil cafe, pajak, dan preferensi sistem">
      <form onSubmit={save} className="cafe-card max-w-3xl p-6">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-black"><Settings size={22} />Profil Sistem</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label><span className="mb-1.5 block text-sm font-black">Nama Cafe</span><input className="field" value={settings.name} onChange={(e) => setField("name", e.target.value)} /></label>
          <label><span className="mb-1.5 block text-sm font-black">Telepon</span><input className="field" value={settings.phone} onChange={(e) => setField("phone", e.target.value)} /></label>
          <label><span className="mb-1.5 block text-sm font-black">Pajak (%)</span><input className="field" type="number" value={settings.tax} onChange={(e) => setField("tax", e.target.value)} /></label>
          <label><span className="mb-1.5 block text-sm font-black">Service (%)</span><input className="field" type="number" value={settings.service} onChange={(e) => setField("service", e.target.value)} /></label>
        </div>
        <button className="icon-button mt-5 bg-[#0b3b28] px-6 text-white"><Save size={17} />Simpan Pengaturan</button>
        {message ? <p className="mt-4 rounded-lg bg-[#e3f4ea] p-4 text-sm font-black text-[#0b3b28]">{message}</p> : null}
      </form>
    </CafeShell>
  );
}
