"use client";

import { userAuthLocalStorage } from "@/lib/auth";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import UserAvatarDropdown from "../logout/UserAvatarDropdown";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/usuarios": "Usuarios",
  "/admin/eventos": "Eventos",
  "/admin/configuracion": "Configuración",
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Panel";

  // Traer datos de localStorage
  const { user } = userAuthLocalStorage();

  if (!user) return null;

  return (
    <header
      className="
        sticky top-0 z-50
        h-16
        bg-white
        border-b border-[#EAF1FC]
        px-4 md:px-6
        flex items-center
        shadow-[0_2px_12px_rgba(31,105,231,0.04)]
      "
    >
      {/* Desktop title */}
      <div className="hidden md:flex items-center">
        <h1 className="text-lg font-bold text-[#1A2340] tracking-tight">
          {title}
        </h1>
      </div>

      {/* Mobile branding */}
      <div className="flex md:hidden items-center gap-3 min-w-0">
        <div
          className="
            w-10 h-10 rounded-2xl
            bg-gradient-to-br from-[#1F69E7] to-[#3E83F0]
            flex items-center justify-center
            shadow-[0_6px_18px_rgba(31,105,231,0.18)]
            shrink-0
          "
        >
          <span className="text-white text-sm font-bold">P</span>
        </div>

        <span
          className="
            text-sm font-semibold text-[#1A2340]
            truncate
          "
        >
          Sistema
        </span>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {/* Notifications - hidden on mobile */}
        <button
          type="button"
          className="
            hidden sm:flex
            relative
            w-10 h-10
            rounded-2xl
            bg-[#F0F4FF]
            items-center justify-center
            text-[#6B778C]
            hover:bg-[#EFF4FE]
            hover:text-[#1F69E7]
            transition-all duration-200
          "
        >
          <Bell className="w-4 h-4" />

          <span
            className="
              absolute top-2 right-2
              w-2 h-2
              rounded-full
              bg-red-500
              border-2 border-white
            "
          />
        </button>

        {/* User dropdown */}
        <UserAvatarDropdown user={user} />
      </div>
    </header>
  );
}