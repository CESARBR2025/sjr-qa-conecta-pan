"use client";

import { userAuthLocalStorage } from "@/lib/auth";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/usuarios": "Usuarios",
  "/admin/eventos": "Eventos",
  "/admin/configuracion": "Configuración",
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Panel";

  //Traer datos de localStorage
  const {user} = userAuthLocalStorage()
  if(!user) return null

  return (
    <header className="
      sticky top-0 z-50
      h-16 bg-white border-b border-blue-50
      flex items-center px-6 gap-4
      shadow-[0_2px_12px_rgba(31,105,231,0.04)]
    ">
      {/* Título de página (solo desktop) */}
      <span className="hidden md:block font-bold text-lg text-[#1A2340] tracking-tight">
        {title}
      </span>

      {/* ── Logo (solo móvil) ── */}
      <div className="flex md:hidden items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1F69E7] to-[#3E83F0] flex items-center justify-center shadow-md">
          <span className="text-white text-sm font-bold">P</span>
        </div>
        <span className="font-bold text-[15px] text-[#1A2340]">Sistema de Eventos</span>
      </div>

      {/* Acciones */}
      <div className="ml-auto flex items-center gap-2">
        <button className="w-9 h-9 rounded-xl bg-[#F0F4FF] flex items-center justify-center text-[#6B778C] hover:bg-[#E0E8FF] hover:text-[#1F69E7] hover:scale-105 transition-all duration-200">
          <Search className="w-4 h-4" />
        </button>
        <button className="relative w-9 h-9 rounded-xl bg-[#F0F4FF] flex items-center justify-center text-[#6B778C] hover:bg-[#E0E8FF] hover:text-[#1F69E7] hover:scale-105 transition-all duration-200">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* User avatar — visible en todos */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1F69E7] to-[#3E83F0] flex items-center justify-center text-white font-bold text-[13px] shadow-[0_3px_10px_rgba(31,105,231,0.3)] cursor-pointer hover:scale-105 transition-transform">
          {user.nombres.charAt(0)}
        </div>
      </div>
    </header>
  );
}