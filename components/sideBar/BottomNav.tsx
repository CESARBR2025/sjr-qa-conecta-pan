"use client";

import { House, Users, Calendar, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Inicio", href: "/admin", icon: House },
  { label: "Usuarios", href: "/admin/usuarios", icon: Users },
  { label: "Eventos", href: "/admin/eventos", icon: Calendar },
  { label: "Config", href: "/admin/configuracion", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="
      md:hidden fixed bottom-0 inset-x-0 z-50
      bg-white border-t border-blue-50
      flex items-center px-3 pb-safe pt-2
      shadow-[0_-4px_20px_rgba(31,105,231,0.08)]
    ">
      {items.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`
              flex-1 flex flex-col items-center gap-1 py-2 rounded-xl
              text-[10px] font-semibold transition-all duration-200
              ${isActive
                ? "text-[#1F69E7] bg-[#EFF4FE]"
                : "text-[#8A96B0] hover:text-[#1F69E7]"
              }
            `}
          >
            <Icon
              className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
              strokeWidth={isActive ? 2.5 : 2}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}