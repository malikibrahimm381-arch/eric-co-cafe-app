"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { formatCurrency, thumbnailOptions } from "@/app/components/ui";
import { Check, CirclePlus, Pencil, Printer, Save, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const emptyForm = {
  name: "",
  category: "Makanan",
  price: "",
  thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFQztr0w0a1Vh1Qwia3bkJVp2FR_D1wq-0zA&s",
  description: "",
  isActive: true
};

export default function AdminPage() {
  return (
    <AuthGuard roles={["admin", "developer"]}>
      {(user) => <AdminWorkspace user={user} />}
    </AuthGuard>
  );
}

function AdminWorkspace({ user }) {
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = useMemo(
    () => ["Makanan", "Minuman", ...new Set(menuItems.map((item) => item.category).filter(Boolean))],
    [menuItems]
  );

  async function loadMenu() {
    const response = await fetch("/api/menu");
    const data = await response.json();
    setMenuItems(data.items || []);
  }

  useEffect(() => {
    loadMenu();
  }, []);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function editItem(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      thumbnail: item.thumbnail,
      description: item.description,
      isActive: item.isActive
    });
    setMessage("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveMenu(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(editingId ? `/api/menu/${editingId}` : "/api/menu", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Menu gagal disimpan.");

      await loadMenu();
      resetForm();
      setMessage(editingId ? "Menu berhasil diperbarui." : "Menu baru berhasil ditambahkan.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id) {
    setMessage("");
    const response = await fetch(`/api/menu/${id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Menu gagal dihapus.");
      return;
    }

    await loadMenu();
    setMessage("Menu berhasil dihapus.");
  }

  return (
    <CafeShell
      user={user}
      title="Manajemen Menu"
      subtitle="Kelola makanan, minuman, stok visual, dan katalog cetak"
      actions={
        <Link href="/catalog" className="icon-button bg-white text-[#0e1713] shadow-sm">
          <Printer size={18} />
          <span>Cetak Katalog</span>
        </Link>
      }
    >

      <section className="grid gap-6 lg:grid-cols-[390px_1fr]">
        <form onSubmit={saveMenu} className="cafe-card rounded-lg p-5 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-xl font-black text-[#0e1713]">
              <CirclePlus size={22} className="text-[#1f8a58]" />
              {editingId ? "Edit Menu" : "Input Menu"}
            </h2>
            {editingId ? (
              <button type="button" onClick={resetForm} className="grid size-9 place-items-center rounded-md bg-[#ffe0e0] text-[#bc3131]" title="Batal edit">
                <X size={17} />
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            <input value={form.name} onChange={(event) => setField("name", event.target.value)} className="field" placeholder="Nama menu" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.category} onChange={(event) => setField("category", event.target.value)} className="field">
                {[...new Set(categories)].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <input
                value={form.price}
                onChange={(event) => setField("price", event.target.value)}
                className="field"
                type="number"
                min="0"
                placeholder="Harga"
              />
            </div>
            <textarea
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
              className="field min-h-24 resize-none"
              placeholder="Deskripsi"
            />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-black text-[#0e1713]">Thumbnail</p>
            <div className="grid grid-cols-4 gap-2">
              {thumbnailOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setField("thumbnail", option)}
                  className={`overflow-hidden rounded-md border-2 bg-white ${
                    form.thumbnail === option ? "border-[#1f8a58]" : "border-transparent"
                  }`}
                  title={option.split("/").pop()}
                >
                  <img src={option} alt="" className="h-16 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <label className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-white/70 p-3 font-bold text-[#0e1713]">
            <span>Aktif di katalog</span>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setField("isActive", event.target.checked)}
              className="size-5 accent-[#1f8a58]"
            />
          </label>

          <button type="submit" disabled={loading} className="icon-button mt-4 w-full bg-[#0b3b28] text-white shadow-lg shadow-[#0b3b2826]">
            <Save size={18} />
            <span>{loading ? "Menyimpan" : "Simpan Menu"}</span>
          </button>
          {message ? <p className="mt-3 rounded-lg bg-[#e3f4ea] p-3 text-sm font-bold text-[#0b3b28]">{message}</p> : null}
        </form>

        <div className="space-y-3">
          {menuItems.map((item) => (
            <article key={item.id} className="cafe-card animate__animated animate__fadeInUp p-3">
              <div className="grid gap-4 md:grid-cols-[112px_1fr_auto] md:items-center">
                <img src={item.thumbnail} alt={item.name} className="h-28 w-full rounded-md object-cover md:w-28" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#e3f4ea] px-2 py-1 text-xs font-black uppercase text-[#0b3b28]">{item.category}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-black ${
                        item.isActive ? "bg-[#e3f4ea] text-[#096b3c]" : "bg-[#ffe0e0] text-[#bc3131]"
                      }`}
                    >
                      {item.isActive ? <Check size={13} /> : <X size={13} />}
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-black text-[#0e1713]">{item.name}</h2>
                  <p className="mt-1 text-sm leading-5 text-[#607066]">{item.description}</p>
                  <p className="mt-2 font-black text-[#0b3b28]">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex gap-2 md:flex-col">
                  <button type="button" onClick={() => editItem(item)} className="icon-button bg-[#fff1d8] px-3 text-[#8b5b00]" title="Edit">
                    <Pencil size={17} />
                    <span>Edit</span>
                  </button>
                  <button type="button" onClick={() => deleteItem(item.id)} className="icon-button bg-[#ffe0e0] px-3 text-[#bc3131]" title="Hapus">
                    <Trash2 size={17} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </CafeShell>
  );
}
