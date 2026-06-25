"use client";

import Header from "@/app/components/Header";
import { cafeInteriorImage } from "@/app/components/ui";
import { CalendarDays, CheckCircle2, Clock3, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

const initialReservations = [
  { name: "Budi", table: "Meja 01", time: "17:00", guests: "2 Orang", status: "Terkonfirmasi" },
  { name: "Siti", table: "Meja 03", time: "18:30", guests: "6 Orang", status: "Menunggu" },
  { name: "Rani", table: "Meja 05", time: "19:00", guests: "2 Orang", status: "Terkonfirmasi" },
  { name: "Andi", table: "Meja 08", time: "20:00", guests: "4 Orang", status: "Terkonfirmasi" },
  { name: "Dwi", table: "Meja 12", time: "21:00", guests: "3 Orang", status: "Menunggu" }
];

export default function ReservationPage() {
  const [form, setForm] = useState({
    date: "2026-06-25",
    time: "19:00",
    guests: "4 Orang",
    area: "Indoor",
    name: "",
    phone: "",
    note: ""
  });
  const [reservations, setReservations] = useState(initialReservations);
  const [message, setMessage] = useState("");

  const reservationCode = useMemo(() => `RSV-${new Date().getFullYear()}-${String(reservations.length + 1).padStart(3, "0")}`, [reservations.length]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitReservation(event) {
    event.preventDefault();
    const name = form.name.trim() || "Tamu";
    setReservations((current) => [
      ...current,
      { name, table: form.area === "Outdoor" ? "Meja 12" : "Meja 05", time: form.time, guests: form.guests, status: "Menunggu" }
    ]);
    setMessage(`${reservationCode} berhasil dibuat. Staff akan mengonfirmasi reservasi ${name}.`);
    setForm((current) => ({ ...current, name: "", phone: "", note: "" }));
  }

  return (
    <>
      <Header />
      <main className="bg-[#f7f6f1]">
        <section className="bg-[#062419] py-12 text-white">
          <div className="app-shell">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#8bd46c]">Reservasi Online</p>
            <h1 className="mt-2 text-4xl font-black">Reservasi Meja</h1>
            <p className="mt-2 max-w-2xl text-white/68">Pesan meja untuk pengalaman terbaik Anda di MAUL.CE.</p>
          </div>
        </section>

        <section className="app-shell grid gap-6 py-8 xl:grid-cols-[1fr_430px]">
          <form onSubmit={submitReservation} className="cafe-card p-6">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-lg bg-[#e3f4ea] text-[#0b3b28]">
                <CalendarDays size={23} />
              </span>
              <div>
                <h2 className="text-2xl font-black">Form Reservasi</h2>
                <p className="text-sm font-semibold text-[#607066]">Kode berikutnya: {reservationCode}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-sm font-black">Tanggal</span>
                <input className="field" type="date" value={form.date} onChange={(event) => setField("date", event.target.value)} />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-black">Waktu</span>
                <input className="field" type="time" value={form.time} onChange={(event) => setField("time", event.target.value)} />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-black">Jumlah Tamu</span>
                <select className="field" value={form.guests} onChange={(event) => setField("guests", event.target.value)}>
                  {["2 Orang", "3 Orang", "4 Orang", "6 Orang", "8 Orang"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-black">Pilih Area</span>
                <select className="field" value={form.area} onChange={(event) => setField("area", event.target.value)}>
                  <option>Indoor</option>
                  <option>Outdoor</option>
                  <option>Private Room</option>
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-black">Nama</span>
                <input className="field" value={form.name} onChange={(event) => setField("name", event.target.value)} placeholder="Nama pemesan" />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-black">No. Telepon</span>
                <input className="field" value={form.phone} onChange={(event) => setField("phone", event.target.value)} placeholder="0812-3456-7890" />
              </label>
              <label className="md:col-span-2">
                <span className="mb-1.5 block text-sm font-black">Catatan</span>
                <textarea className="field min-h-24 resize-none" value={form.note} onChange={(event) => setField("note", event.target.value)} placeholder="Minta meja dekat jendela" />
              </label>
            </div>

            <button type="submit" className="icon-button mt-5 min-h-12 bg-[#0b3b28] px-8 text-white">
              <CheckCircle2 size={18} />
              <span>Pesan Sekarang</span>
            </button>
            {message ? <p className="mt-4 rounded-lg bg-[#e3f4ea] p-4 text-sm font-black text-[#0b3b28]">{message}</p> : null}
          </form>

          <aside className="space-y-5">
            <img src={cafeInteriorImage} alt="Ruang cafe" className="h-72 w-full rounded-lg object-cover shadow-lg" />
            <div className="cafe-card p-5">
              <h2 className="mb-4 text-lg font-black">Jadwal Hari Ini</h2>
              <div className="space-y-3">
                {reservations.map((item) => (
                  <div key={`${item.name}-${item.time}`} className="grid grid-cols-[1fr_auto] gap-3 rounded-lg bg-[#f7f6f1] p-3 text-sm">
                    <div>
                      <p className="font-black">{item.name}</p>
                      <p className="flex items-center gap-2 text-xs font-bold text-[#607066]">
                        <Clock3 size={14} />
                        {item.time} - {item.table}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="flex items-center justify-end gap-1 text-xs font-bold text-[#607066]">
                        <UsersRound size={14} />
                        {item.guests}
                      </p>
                      <span className={`status-pill mt-1 ${item.status === "Menunggu" ? "bg-[#fff1d8] text-[#c46600]" : "bg-[#e3f4ea] text-[#096b3c]"}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
