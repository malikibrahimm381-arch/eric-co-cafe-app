"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { cafeCategories, formatCurrency } from "@/app/components/ui";
import { Banknote, CreditCard, Minus, Plus, Printer, ReceiptText, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function CashierPage() {
  return (
    <AuthGuard roles={["cashier", "admin", "developer"]}>
      {(user) => <CashierWorkspace user={user} />}
    </AuthGuard>
  );
}

function CashierWorkspace({ user }) {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [orderType, setOrderType] = useState("dine_in");
  const [tableNumber, setTableNumber] = useState("06");
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
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;
  const cashValue = method === "cashless" ? total : Number(paidAmount || 0);
  const change = Math.max(0, cashValue - total);
  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory = category === "Semua" || item.category === category;
    return matchesCategory && `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase());
  });

  const categories = useMemo(() => {
    const unique = new Set([...cafeCategories, ...menuItems.map((item) => item.category)]);
    return [...unique];
  }, [menuItems]);

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

  function resetCart() {
    setCart([]);
    setPaidAmount("");
    setCustomerName("Walk-in");
    setMessage("");
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
          paidAmount: method === "cashless" ? subtotal : Math.max(0, cashValue - tax)
        })
      });
      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok) throw new Error(paymentData.error || "Pembayaran gagal disimpan.");

      setMessage(`Order #INV-250625-${String(orderData.order.id).padStart(3, "0")} lunas. Kembalian ${formatCurrency(paymentData.payment.changeAmount)}.`);
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
    <CafeShell
      user={user}
      title="POS Cepat"
      subtitle="Pesanan kasir, hitung total, dan pembayaran dalam satu layar"
      actions={
        <button type="button" onClick={() => window.print()} className="icon-button bg-white px-4 text-[#0e1713]">
          <Printer size={17} />
          <span>Cetak Struk</span>
        </button>
      }
    >
      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="cafe-card p-5">
          <div className="grid gap-3 lg:grid-cols-[160px_160px_1fr]">
            <select className="field" value={orderType} onChange={(event) => setOrderType(event.target.value)}>
              <option value="dine_in">Meja</option>
              <option value="take_away">Take Away</option>
            </select>
            <select className="field" value={tableNumber} disabled={orderType === "take_away"} onChange={(event) => setTableNumber(event.target.value)}>
              {["01", "02", "03", "05", "06", "07", "08", "12"].map((table) => (
                <option key={table} value={table}>Meja {table}</option>
              ))}
            </select>
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#607066]" size={17} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="field pl-10" placeholder="Cari menu..." />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-lg px-4 py-2 text-xs font-black ${
                  category === item ? "bg-[#0b3b28] text-white" : "bg-[#eef4ee] text-[#607066] hover:bg-[#dfe9df]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredMenu.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => addToCart(item)}
                className="group animate__animated animate__fadeIn rounded-lg border border-[#0b22180f] bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                style={{ animationDelay: `${Math.min(index * 25, 260)}ms` }}
              >
                <div className="relative">
                  <img src={item.thumbnail} alt={item.name} className="h-28 w-full rounded-md object-cover" />
                  <span className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-full bg-[#0b3b28] text-white">
                    <Plus size={16} />
                  </span>
                </div>
                <h2 className="mt-3 min-h-10 text-sm font-black leading-tight">{item.name}</h2>
                <p className="mt-1 text-xs font-bold text-[#607066]">{formatCurrency(item.price)}</p>
              </button>
            ))}
          </div>
        </div>

        <aside className="cafe-card p-5 xl:sticky xl:top-24 xl:self-start">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-black">Daftar Pesanan</h2>
            <button type="button" onClick={resetCart} className="rounded-lg bg-[#ffe0e0] px-3 py-2 text-xs font-black text-[#bc3131]">
              Reset
            </button>
          </div>

          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="field mb-3" placeholder="Nama pelanggan" />

          <div className="thin-scrollbar max-h-[320px] space-y-2 overflow-auto pr-1">
            {cart.length ? (
              cart.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 rounded-lg bg-[#f7f6f1] p-3 text-sm">
                  <div>
                    <p className="font-black">{item.name}</p>
                    <p className="text-xs font-bold text-[#607066]">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid size-7 place-items-center rounded-md bg-white">
                      <Minus size={14} />
                    </button>
                    <span className="w-7 text-center font-black">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid size-7 place-items-center rounded-md bg-[#0b3b28] text-white">
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-black">{formatCurrency(item.price * item.quantity)}</p>
                  <button type="button" onClick={() => updateQuantity(item.id, 0)} className="grid size-8 place-items-center rounded-md bg-[#ffe0e0] text-[#bc3131]">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-[#0b221820] bg-[#f7f6f1] p-6 text-center text-sm font-bold text-[#607066]">
                Pilih menu untuk mulai transaksi.
              </div>
            )}
          </div>

          <div className="mt-5 space-y-2 border-t border-[#0b22180f] pt-4 text-sm">
            <div className="flex justify-between">
              <span className="font-bold text-[#607066]">Subtotal</span>
              <span className="font-black">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-[#607066]">Pajak (10%)</span>
              <span className="font-black">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between pt-2 text-xl font-black">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
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
                className={`icon-button justify-center px-3 ${method === value ? "bg-[#0b3b28] text-white" : "bg-[#eef4ee] text-[#0e1713]"}`}
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
          <div className="mt-3 rounded-lg bg-[#fff8e7] p-3">
            <div className="flex justify-between text-sm font-bold text-[#8b5b00]">
              <span>Dibayar</span>
              <span>{formatCurrency(cashValue)}</span>
            </div>
            <div className="mt-1 flex justify-between text-base font-black">
              <span>Kembalian</span>
              <span>{formatCurrency(change)}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setMessage("Pesanan disimpan sementara di kasir.")} className="icon-button bg-[#eef4ee] text-[#0e1713]">
              Simpan
            </button>
            <button
              type="button"
              onClick={checkout}
              disabled={!cart.length || loading || cashValue < total}
              className="icon-button bg-[#0b3b28] text-white shadow-lg shadow-[#0b3b2824]"
            >
              <ReceiptText size={17} />
              <span>{loading ? "Menyimpan" : "Bayar"}</span>
            </button>
          </div>
          {message ? <p className="mt-3 rounded-lg bg-[#e3f4ea] p-3 text-sm font-bold text-[#0b3b28]">{message}</p> : null}
        </aside>
      </section>
    </CafeShell>
  );
}
