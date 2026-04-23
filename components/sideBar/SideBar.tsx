"use client";

import { userAuthLocalStorage } from "@/lib/auth";
import { House, Users, Settings, Calendar, Bell, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Inicio", href: "/admin", icon: House, group: "Principal" },
  { label: "Usuarios", href: "/admin/usuarios", icon: Users, group: "Principal" },
  { label: "Eventos", href: "/admin/eventos", icon: Calendar, group: "Principal" },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings, group: "Sistema" },
];

// Agrupamos por sección
const grouped = navItems.reduce<Record<string, typeof navItems>>((acc, item) => {
  (acc[item.group] ??= []).push(item);
  return acc;
}, {});



export default function Sidebar() {
  const pathname = usePathname();

  // Leer objeto de localStorage
  const {user} = userAuthLocalStorage()
  if (!user) return null


  return (
    <>
      {/* ─── SIDEBAR (tablet + desktop) ─────────────────────── */}
      <aside className="
        hidden md:flex
        w-60 h-screen flex-col
        bg-white border-r border-blue-50
        shadow-[4px_0_24px_rgba(31,105,231,0.06)]
      ">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-blue-50">
          <div className="w-15 h-15 flex items-center justify-center ">
            <Image src="/pan-side-bar.png" alt="PAN" width={70} height={70}
             className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="font-bold text-lg text-[#6B778C] leading-tight tracking-tight font-display">
              Gestión de Eventos
            </p>
            
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#B0BBCC] px-2 mb-1">
                {group}
              </p>
              <div className="space-y-0.5">
                {items.map(({ label, href, icon: Icon }, i) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      style={{ animationDelay: `${i * 50}ms` }}
                      className={`
                        group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                        font-medium text-sm transition-all duration-200
                        animate-[slideIn_0.3s_ease_both]
                        ${isActive
                          ? "bg-gradient-to-r from-[#1F69E7] to-[#3E83F0] text-white shadow-[0_4px_14px_rgba(31,105,231,0.35)]"
                          : "text-[#6B778C] hover:bg-[#EFF4FE] hover:text-[#1F69E7] hover:translate-x-0.5"
                        }
                      `}
                    >
                      <Icon className="w-4.5 h-4.5 flex-shrink-0" strokeWidth={2.2} />
                      <span>{label}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User card */}
        <div className="m-3 p-3 rounded-xl bg-gradient-to-br from-[#F0F4FF] to-[#E8EDFA] border border-[#DDE3F0] flex items-center gap-2.5 cursor-pointer hover:from-[#E8EDFA] hover:to-[#D8E2F8] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(31,105,231,0.1)] transition-all duration-200">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1F69E7] to-[#3E83F0] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user.nombres!.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-[#1A2340] truncate">{user.nombres}</p>
            <span className="text-[11px] text-[#8A96B0] font-medium">{user.rolName}</span>
          </div>
          <span className="ml-auto text-[#8A96B0] text-lg leading-none">⋯</span>
        </div>
      </aside>
    </>
  );
}