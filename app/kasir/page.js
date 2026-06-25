"use client";

import AuthGuard from "@/app/components/AuthGuard";
import Header from "@/app/components/Header";
import { formatCurrency } from "@/app/components/ui";
import { Banknote, CreditCard, Minus, Plus, Printer, ReceiptText, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function CashierPage() {
  return (
    <>
      <Header />
      <AuthGuard roles={["cashier", "admin", "developer"]}>
        {(user) => <CashierWorkspace user={user} />}
      </AuthGuard>
    </>
  );
}

function CashierWorkspace() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [orderType, setOrderType] = useState("dine_in");
  const [tableNumber, setTableNumber] = useState("A1");
  const [customerName, setCustomerName] = useState("Walk-in");
  const [method, setMethod] = useState("cash");
  const [paidAmount, setPaidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/menu?active=1")
      .then((response) => response.json())
      .then((data) => setMenuItems(data.items || []));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cashValue = method === "cashless" ? subtotal : Number(paidAmount || 0);
  const change = Math.max(0, cashValue - subtotal);
  const categories = useMemo(() => ["Semua", ...new Set(menuItems.map((item) => item.category))], [menuItems]);
  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory = category === "Semua" || item.category === category;
    return matchesCategory && `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase());
  });

  function addToCart(item) {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  }

  function updateQuantity(id, quantity) {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  async function checkout() {
    setMessage("");
    setLoading(true);

    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          tableNumber,
          customerName,
          source: "cashier",
          items: cart.map((item) => ({ menuItemId: item.id, quantity: item.quantity }))
        })
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.error || "Order gagal disimpan.");

      const paymentResponse = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.order.id,
          method,
          paidAmount: cashValue
        })
      });
      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok) throw new Error(paymentData.error || "Pembayaran gagal disimpan.");

      setMessage(`Order #${orderData.order.id} lunas. Kembalian ${formatCurrency(paymentData.payment.changeAmount)}.`);
      setCart([]);
      setPaidAmount("");
      setCustomerName("Walk-in");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell py-7">
      <section className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#253431]">Kasir</h1>
          <p className="mt-1 text-sm font-semibold text-[#69736e]">Transaksi langsung dari meja kasir.</p>
        </div>
        <button type="button" onClick={() => window.print()} className="icon-button bg-white text-[#31413d] shadow-sm">
          <Printer size={18} />
          <span>Cetak</span>
        </button>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-5">
          <div className="soft-panel rounded-lg p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_190px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7c8580]" size={18} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} className="field pl-10" placeholder="Cari menu" />
              </label>
              <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMenu.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => addToCart(item)}
                className="animate__animated animate__fadeIn rounded-lg border border-[#31413d12] bg-white/84 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <img src={item.thumbnail} alt={item.name} className="h-32 w-full rounded-md object-cover" />
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-[#d56552]">{item.category}</p>
                    <h2 className="mt-1 font-black text-[#253431]">{item.name}</h2>
                  </div>
                  <Plus className="shrink-0 text-[#2f6f66]" size={18} />
                </div>
                <p className="mt-2 text-sm font-black text-[#6b4a1f]">{formatCurrency(item.price)}</p>
              </button>
            ))}
          </div>
        </div>

        <aside className="soft-panel rounded-lg p-5 lg:sticky lg:top-24 lg:self-start">
          <h2 className="flex items-center gap-2 text-xl font-black text-[#253431]">
            <ReceiptText size={22} />
            Pembayaran
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-[#f7f1e7] p-1">
            {[
              ["dine_in", "Dine In"],
              ["take_away", "Take Away"]
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setOrderType(value)}
                className={`rounded-md px-3 py-2 text-sm font-black ${
                  orderType === value ? "bg-white text-[#2f6f66] shadow-sm" : "text-[#69736e]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="field" placeholder="Customer" />
            <input
              value={tableNumber}
              onChange={(event) => setTableNumber(event.target.value)}
              className="field"
              placeholder="Meja"
              disabled={orderType === "take_away"}
            />
          </div>

          <div className="mt-4 max-h-[265px] space-y-3 overflow-auto pr-1">
            {cart.length ? (
              cart.map((item) => (
                <div key={item.id} className="rounded-lg bg-white/76 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black">{item.name}</h3>
                      <p className="text-sm font-semibold text-[#69736e]">{formatCurrency(item.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 0)}
                      className="grid size-8 place-items-center rounded-md bg-[#f2d7d2] text-[#7c2f25]"
                      title="Hapus item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="grid size-8 place-items-center rounded-md bg-[#f6ead7] text-[#6b4a1f]"
                        title="Kurangi"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="w-8 text-center font-black">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="grid size-8 place-items-center rounded-md bg-[#e4f0ec] text-[#2f6f66]"
                        title="Tambah"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-[#31413d25] bg-white/64 p-5 text-center text-sm font-semibold text-[#69736e]">
                Belum ada item
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-[#31413d14] pt-4">
            <div className="flex items-center justify-between text-lg font-black">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                ["cash", "Tunai", Banknote],
                ["cashless", "Non Tunai", CreditCard]
              ].map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMethod(value)}
                  className={`icon-button justify-center px-3 ${
                    method === value ? "bg-[#2f6f66] text-white" : "bg-white text-[#31413d]"
                  }`}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <input
              value={paidAmount}
              onChange={(event) => setPaidAmount(event.target.value)}
              className="field mt-3"
              type="number"
              min="0"
              placeholder="Uang diterima"
              disabled={method === "cashless"}
            />

            <div className="mt-3 rounded-lg bg-[#fff7e8] p-3">
              <div className="flex justify-between text-sm font-bold text-[#6d4611]">
                <span>Dibayar</span>
                <span>{formatCurrency(cashValue)}</span>
              </div>
              <div className="mt-1 flex justify-between text-base font-black text-[#253431]">
                <span>Kembalian</span>
                <span>{formatCurrency(change)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={checkout}
              disabled={!cart.length || loading || cashValue < subtotal}
              className="icon-button mt-4 w-full bg-[#d56552] text-white shadow-lg shadow-[#d5655224]"
            >
              <ReceiptText size={18} />
              <span>{loading ? "Menyimpan" : "Simpan Pembayaran"}</span>
            </button>

            {message ? <p className="mt-3 rounded-lg bg-[#e4f0ec] p-3 text-sm font-bold text-[#2f6f66]">{message}</p> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
