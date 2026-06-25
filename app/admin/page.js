"use client";

import AuthGuard from "@/app/components/AuthGuard";
import Header from "@/app/components/Header";
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
    <>
      <Header />
      <AuthGuard roles={["admin", "developer"]}>
        {() => <AdminWorkspace />}
      </AuthGuard>
    </>
  );
}

function AdminWorkspace() {
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
    <main className="app-shell py-7">
      <section className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#253431]">Admin Menu</h1>
          <p className="mt-1 text-sm font-semibold text-[#69736e]">Kelola makanan, minuman, dan katalog cetak.</p>
        </div>
        <Link href="/catalog" className="icon-button bg-white text-[#31413d] shadow-sm">
          <Printer size={18} />
          <span>Cetak Katalog</span>
        </Link>
      </section>

      <section className="grid gap-6 lg:grid-cols-[390px_1fr]">
        <form onSubmit={saveMenu} className="soft-panel rounded-lg p-5 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-xl font-black text-[#253431]">
              <CirclePlus size={22} />
              {editingId ? "Edit Menu" : "Input Menu"}
            </h2>
            {editingId ? (
              <button type="button" onClick={resetForm} className="grid size-9 place-items-center rounded-md bg-[#f2d7d2] text-[#7c2f25]" title="Batal edit">
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
            <p className="mb-2 text-sm font-black text-[#31413d]">Thumbnail</p>
            <div className="grid grid-cols-4 gap-2">
              {thumbnailOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setField("thumbnail", option)}
                  className={`overflow-hidden rounded-md border-2 bg-white ${
                    form.thumbnail === option ? "border-[#2f6f66]" : "border-transparent"
                  }`}
                  title={option.split("/").pop()}
                >
                  <img src={option} alt="" className="h-16 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <label className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-white/70 p-3 font-bold text-[#31413d]">
            <span>Aktif di katalog</span>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setField("isActive", event.target.checked)}
              className="size-5 accent-[#2f6f66]"
            />
          </label>

          <button type="submit" disabled={loading} className="icon-button mt-4 w-full bg-[#2f6f66] text-white shadow-lg shadow-[#2f6f6626]">
            <Save size={18} />
            <span>{loading ? "Menyimpan" : "Simpan Menu"}</span>
          </button>
          {message ? <p className="mt-3 rounded-lg bg-[#fff7e8] p-3 text-sm font-bold text-[#6d4611]">{message}</p> : null}
        </form>

        <div className="space-y-3">
          {menuItems.map((item) => (
            <article key={item.id} className="animate__animated animate__fadeInUp rounded-lg border border-[#31413d14] bg-white/82 p-3 shadow-sm">
              <div className="grid gap-4 md:grid-cols-[112px_1fr_auto] md:items-center">
                <img src={item.thumbnail} alt={item.name} className="h-28 w-full rounded-md object-cover md:w-28" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#f6ead7] px-2 py-1 text-xs font-black uppercase text-[#6b4a1f]">{item.category}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-black ${
                        item.isActive ? "bg-[#e4f0ec] text-[#2f6f66]" : "bg-[#f2d7d2] text-[#7c2f25]"
                      }`}
                    >
                      {item.isActive ? <Check size={13} /> : <X size={13} />}
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-black text-[#253431]">{item.name}</h2>
                  <p className="mt-1 text-sm leading-5 text-[#69736e]">{item.description}</p>
                  <p className="mt-2 font-black text-[#6b4a1f]">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex gap-2 md:flex-col">
                  <button type="button" onClick={() => editItem(item)} className="icon-button bg-[#ffe0a8] px-3 text-[#6d4611]" title="Edit">
                    <Pencil size={17} />
                    <span>Edit</span>
                  </button>
                  <button type="button" onClick={() => deleteItem(item.id)} className="icon-button bg-[#f2d7d2] px-3 text-[#7c2f25]" title="Hapus">
                    <Trash2 size={17} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
