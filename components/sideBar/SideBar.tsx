"use client";

import { userAuthLocalStorage } from "@/lib/auth";
import {
  House,
  Users,
  Settings,
  Calendar,
  ChevronDown,
  UserPlus,
  UserRoundCheck,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navItems = [
  {
    label: "Usuarios",
    icon: Users,
    group: "Principal",
    children: [
      {
        icon: UserPlus,
        label: "Solicitudes",
        href: "/admin/usuarios/solicitudes",
      },
      {
        icon: UserRoundCheck,
        label: "Actuales",
        href: "/admin/usuarios/actuales",
      },
    ],
  },
  {
    label: "Kpis",
    href: "/admin",
    icon: House,
    group: "Principal",
  },
  {
    label: "Eventos",
    href: "/admin/eventos",
    icon: Calendar,
    group: "Principal",
  },
  {
    label: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
    group: "Sistema",
  },
];

const grouped = navItems.reduce<Record<string, typeof navItems>>(
  (acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  },
  {}
);

// ─── Bottom tab items (móvil): todos los items principales ───────────────────
const bottomTabItems = navItems.filter((i) => i.group === "Principal");

// ─── Componente interno: NavItem ──────────────────────────────────────────────
function NavItem({
  item,
  i,
  onNavigate,
}: {
  item: (typeof navItems)[number];
  i: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const Icon = item.icon;
  const hasChildren = (item.children ?? []).length > 0;

  const isActive = item.href
    ? pathname === item.href
    : item.children?.some((child) => pathname.startsWith(child.href));

  const [isOpen, setIsOpen] = useState(isActive ?? false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div>
      {hasChildren ? (
        <>
          <button
            type="button"
            onClick={toggleMenu}
            style={{ animationDelay: `${i * 50}ms` }}
            className={`
              w-full group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl
              font-medium text-sm transition-all duration-200 text-left
              ${isActive
                ? "bg-[#EFF4FE] text-[#1F69E7]"
                : "text-[#6B778C] hover:bg-[#EFF4FE] hover:text-[#1F69E7]"
              }
            `}
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0" strokeWidth={2.2} />
            <span>{item.label}</span>
            <ChevronDown
              className={`
                ml-auto w-4 h-4 transition-transform duration-300
                ${isOpen ? "rotate-0" : "-rotate-90"}
              `}
            />
          </button>

          <div
            className={`
              ml-7 mt-1 space-y-1 overflow-hidden
              transition-all duration-300 ease-in-out
              ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            {item.children!.map((child) => {
              const isChildActive = pathname === child.href;
              const ChildIcon = child.icon;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  className={`
                    flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                    font-medium text-sm transition-all duration-200
                    ${isChildActive
                      ? "bg-gradient-to-r from-[#1F69E7] to-[#3E83F0] text-white shadow-[0_4px_14px_rgba(31,105,231,0.35)]"
                      : "text-[#6B778C] hover:bg-[#EFF4FE] hover:text-[#1F69E7] hover:translate-x-0.5"
                    }
                  `}
                >
                  <ChildIcon
                    className="w-4.5 h-4.5 flex-shrink-0"
                    strokeWidth={2.2}
                  />
                  <span>{child.label}</span>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <Link
          href={item.href!}
          onClick={onNavigate}
          style={{ animationDelay: `${i * 50}ms` }}
          className={`
            group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl
            font-medium text-sm transition-all duration-200
            ${isActive
              ? "bg-gradient-to-r from-[#1F69E7] to-[#3E83F0] text-white shadow-[0_4px_14px_rgba(31,105,231,0.35)]"
              : "text-[#6B778C] hover:bg-[#EFF4FE] hover:text-[#1F69E7] hover:translate-x-0.5"
            }
          `}
        >
          <Icon className="w-4.5 h-4.5 flex-shrink-0" strokeWidth={2.2} />
          <span>{item.label}</span>
          {isActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
          )}
        </Link>
      )}
    </div>
  );
}

// ─── Contenido interno del sidebar ───────────────────────────────────────────
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = userAuthLocalStorage();
  if (!user) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-blue-50 flex-shrink-0">
        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
          <Image
            src="/pan-side-bar.png"
            alt="PAN"
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <p className="font-bold text-base text-[#6B778C] leading-tight tracking-tight">
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
            <div className="space-y-0.5 mt-2">
              {items.map((item, i) => (
                <NavItem key={item.label} item={item} i={i} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="m-3 mt-0 p-3 rounded-xl bg-gradient-to-br from-[#F0F4FF] to-[#E8EDFA] border border-[#DDE3F0] flex items-center gap-2.5 cursor-pointer hover:from-[#E8EDFA] hover:to-[#D8E2F8] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(31,105,231,0.1)] transition-all duration-200 flex-shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1F69E7] to-[#3E83F0] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {user.nombres!.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-[#1A2340] truncate">
            {user.nombres}
          </p>
          <span className="text-[11px] text-[#8A96B0] font-medium">
            {user.rolName}
          </span>
        </div>
        <LogOut className="w-4 h-4 text-[#8A96B0] flex-shrink-0" />
      </div>
    </div>
  );
}

// ─── Sidebar principal ────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const { user } = userAuthLocalStorage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [popoverItem, setPopoverItem] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Cerrar al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
    setPopoverItem(null);
  }, [pathname]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setPopoverItem(null);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (!user) return null;

  return (
    <>
      {/* ── DESKTOP: sidebar fijo ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-60 h-screen flex-col bg-white border-r border-blue-50 shadow-[4px_0_24px_rgba(31,105,231,0.06)] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* ── TABLET: sidebar colapsado (solo iconos) ───────────────────────── */}
      <aside className="hidden md:flex lg:hidden w-16 h-screen flex-col bg-white border-r border-blue-50 shadow-[4px_0_24px_rgba(31,105,231,0.06)] flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center justify-center py-5 border-b border-blue-50">
          <Image
            src="/pan-side-bar.png"
            alt="PAN"
            width={36}
            height={36}
            className="object-cover"
          />
        </div>

        {/* Iconos */}
        <nav className="flex-1 flex flex-col items-center py-4 gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href
              ? pathname === item.href
              : item.children?.some((c) => pathname.startsWith(c.href));

            // Para items con hijos, enlazamos al primer hijo
            const href = item.href ?? item.children?.[0]?.href ?? "#";

            return (
              <Link
                key={item.label}
                href={href}
                title={item.label}
                className={`
                  relative w-10 h-10 flex items-center justify-center rounded-xl
                  transition-all duration-200
                  ${isActive
                    ? "bg-gradient-to-br from-[#1F69E7] to-[#3E83F0] text-white shadow-[0_4px_14px_rgba(31,105,231,0.35)]"
                    : "text-[#6B778C] hover:bg-[#EFF4FE] hover:text-[#1F69E7]"
                  }
                `}
              >
                <Icon className="w-5 h-5" strokeWidth={2.2} />
                {/* Tooltip */}
                <span className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded-lg bg-[#1A2340] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hidden group-hover:block">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Avatar */}
        <div className="flex justify-center pb-4">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1F69E7] to-[#3E83F0] flex items-center justify-center text-white font-bold text-sm">
            {user.nombres!.charAt(0)}
          </div>
        </div>
      </aside>

      {/* ── MOBILE: top bar + drawer ──────────────────────────────────────── */}
      <div className="md:hidden">
        {/* Top bar */}
        <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-blue-50 shadow-[0_2px_12px_rgba(31,105,231,0.08)] flex items-center px-4 gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#6B778C] hover:bg-[#EFF4FE] hover:text-[#1F69E7] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 flex-1">
            <Image
              src="/pan-side-bar.png"
              alt="PAN"
              width={28}
              height={28}
              className="object-cover"
            />
            <p className="font-bold text-sm text-[#6B778C] leading-tight tracking-tight">
              Gestión de Eventos
            </p>
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1F69E7] to-[#3E83F0] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {user.nombres!.charAt(0)}
          </div>
        </header>

        {/* Overlay */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`
            fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
            transition-opacity duration-300
            ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className={`
            fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw]
            bg-white shadow-[4px_0_32px_rgba(31,105,231,0.15)]
            transform transition-transform duration-300 ease-in-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Header del drawer */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-blue-50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Image
                src="/pan-side-bar.png"
                alt="PAN"
                width={28}
                height={28}
                className="object-cover"
              />
              <p className="font-bold text-sm text-[#6B778C]">Gestión de Eventos</p>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B778C] hover:bg-[#EFF4FE] hover:text-[#1F69E7] transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Contenido */}
          <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>

        {/* Popover overlay (cierra al tocar fuera) */}
        {popoverItem && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setPopoverItem(null)}
            aria-hidden="true"
          />
        )}

        {/* Bottom nav bar (accesos rápidos) */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-white border-t border-blue-50 shadow-[0_-2px_12px_rgba(31,105,231,0.08)] flex items-center justify-around px-2">
          {bottomTabItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = (item.children ?? []).length > 0;
            const isActive = item.href
              ? pathname === item.href
              : item.children?.some((c) => pathname.startsWith(c.href));
            const isPopoverOpen = popoverItem === item.label;

            return (
              <div key={item.label} className="relative flex flex-col items-center">
                {/* Popover hacia arriba */}
                {hasChildren && isPopoverOpen && (
                  <div
                    ref={popoverRef}
                    className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-50
                      bg-white rounded-2xl shadow-[0_8px_32px_rgba(31,105,231,0.18)]
                      border border-[#DDE3F0] overflow-hidden min-w-[160px]
                      animate-[popoverIn_0.18s_ease_out_both]"
                    style={{
                      // Si el ítem está en el borde izquierdo, ajustar
                    }}
                  >
                    {/* Flecha del popover */}
                    <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-[#DDE3F0] rotate-45" />

                    {/* Título del grupo */}
                    <div className="px-4 pt-3 pb-1">
                      <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#B0BBCC]">
                        {item.label}
                      </p>
                    </div>

                    {/* Subítems */}
                    <div className="px-2 pb-2 space-y-0.5">
                      {item.children!.map((child) => {
                        const isChildActive = pathname === child.href;
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setPopoverItem(null)}
                            className={`
                              flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                              font-medium text-sm transition-all duration-150
                              ${isChildActive
                                ? "bg-gradient-to-r from-[#1F69E7] to-[#3E83F0] text-white shadow-[0_4px_14px_rgba(31,105,231,0.3)]"
                                : "text-[#6B778C] hover:bg-[#EFF4FE] hover:text-[#1F69E7]"
                              }
                            `}
                          >
                            <ChildIcon className="w-4 h-4 flex-shrink-0" strokeWidth={2.2} />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Botón del tab */}
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => setPopoverItem(isPopoverOpen ? null : item.label)}
                    className={`
                      flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200
                      ${isActive || isPopoverOpen ? "text-[#1F69E7]" : "text-[#8A96B0]"}
                    `}
                  >
                    <span
                      className={`
                        w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200
                        ${isActive || isPopoverOpen ? "bg-[#EFF4FE]" : ""}
                      `}
                    >
                      <Icon
                        className="w-5 h-5 transition-all"
                        strokeWidth={isActive || isPopoverOpen ? 2.5 : 2}
                      />
                    </span>
                    <span className="text-[10px] font-semibold leading-none">
                      {item.label}
                    </span>
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    className={`
                      flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200
                      ${isActive ? "text-[#1F69E7]" : "text-[#8A96B0]"}
                    `}
                  >
                    <span
                      className={`
                        w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200
                        ${isActive ? "bg-[#EFF4FE]" : ""}
                      `}
                    >
                      <Icon
                        className="w-5 h-5 transition-all"
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </span>
                    <span className="text-[10px] font-semibold leading-none">
                      {item.label}
                    </span>
                  </Link>
                )}
              </div>
            );
          })}

          {/* Botón de menú completo en la bottom bar */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[#8A96B0] transition-all duration-200"
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-xl">
              <Menu className="w-5 h-5" strokeWidth={2} />
            </span>
            <span className="text-[10px] font-semibold leading-none">Más</span>
          </button>
        </nav>

        {/* Keyframe para la animación del popover */}
        <style>{`
          @keyframes popoverIn {
            from { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.96); }
            to   { opacity: 1; transform: translateX(-50%) translateY(0)   scale(1); }
          }
        `}</style>

        {/* Spacer para que el contenido no quede debajo del top/bottom bar */}
        <div className="h-14" aria-hidden="true" />
      </div>
    </>
  );
}