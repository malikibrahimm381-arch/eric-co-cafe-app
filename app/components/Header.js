"use client";

import BrandLogo from "@/app/components/BrandLogo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogIn, LogOut, Menu, ReceiptText, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const baseLinks = [
  { href: "/", label: "Beranda" },
  { href: "/customer", label: "Menu" },
  { href: "/#tentang", label: "Tentang Kami" },
  { href: "/#galeri", label: "Galeri" },
  { href: "/reservasi", label: "Reservasi" },
  { href: "/#kontak", label: "Kontak" }
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (mounted) setUser(data.user);
      })
      .catch(() => {
        if (mounted) setUser(null);
      });

    return () => {
      mounted = false;
    };
  }, [pathname]);

  const landing = pathname === "/";

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={`no-print sticky top-0 z-30 border-b backdrop-blur-xl ${
        landing ? "border-white/10 bg-[#020d09]/92" : "border-[#0b221812] bg-white/92"
      }`}
    >
      <div className="app-shell flex min-h-16 items-center justify-between gap-3 py-3">
        <BrandLogo dark={landing} compact />

        <nav className="hidden items-center gap-1 lg:flex">
          {baseLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${landing ? "public-nav-link" : "rounded-full px-4 py-2 text-sm font-bold text-[#0e1713] hover:bg-[#eef4ee]"} ${
                  active ? (landing ? "bg-white/12 text-white" : "bg-[#e3f4ea] text-[#0b3b28]") : ""
                }`}
                title={link.label}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="icon-button min-h-10 bg-[#0b3b28] px-4 text-sm text-white">
                <LayoutDashboard size={17} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button type="button" onClick={logout} className="grid size-10 place-items-center rounded-full bg-[#ffe0e0] text-[#bc3131]" title="Logout">
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/customer"
                className="icon-button min-h-10 bg-[#0b3b28] px-4 text-sm text-white hover:bg-[#15543a]"
                title="Pesan sekarang"
              >
                <ShoppingCart size={17} />
                <span className="hidden sm:inline">Pesan Sekarang</span>
              </Link>
              <Link
                href="/login"
                className={`icon-button min-h-10 px-3 text-sm ${
                  landing ? "border border-white/18 bg-white/10 text-white hover:bg-white/16" : "bg-[#e3f4ea] text-[#0b3b28] hover:bg-[#d6efdf]"
                }`}
                title="Masuk"
              >
                <LogIn size={17} />
                <span>Login / Daftar</span>
              </Link>
            </>
          )}
          <button type="button" className={`grid size-10 place-items-center rounded-lg lg:hidden ${landing ? "bg-white/10 text-white" : "bg-[#eef4ee] text-[#0b3b28]"}`}>
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
