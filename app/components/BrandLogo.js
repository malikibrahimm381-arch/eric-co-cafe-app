import { Leaf } from "lucide-react";
import Link from "next/link";

export default function BrandLogo({ dark = false, compact = false }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${dark ? "text-white" : "text-[#0d2118]"}`}>
      <span className={`grid ${compact ? "size-10" : "size-12"} place-items-center rounded-lg bg-[#0b3b28] text-[#8bd46c]`}>
        <Leaf size={compact ? 21 : 25} />
      </span>
      <span className="leading-tight">
        <span className={`${compact ? "text-lg" : "text-2xl"} font-black tracking-normal`}>MAUL.CE</span>
        <span className={`block text-xs font-bold ${dark ? "text-white/72" : "text-[#607066]"}`}>Cafe & Resto</span>
      </span>
    </Link>
  );
}
