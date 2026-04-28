"use client";

import { userAuthLocalStorage } from "@/lib/auth";
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { menuByRole, UserRole } from "@/config/sidebar.config";

type SidebarItem = {
  label: string;
  href?: string;
  icon: any;
  group: string;
  children?: {
    label: string;
    href: string;
    icon: any;
  }[];
};

function NavItem({
  item,
  i,
  onNavigate,
}: {
  item: SidebarItem;
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

function SidebarContent({
  onNavigate,
  grouped,
}: {
  onNavigate?: () => void;
  grouped: Record<string, SidebarItem[]>;
}) {
  const { user } = userAuthLocalStorage();

  if (!user) return null;

  return (
    <div className="flex flex-col h-full">
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
          <p className="font-bold text-base text-[#6B778C]">
            Gestión de Eventos
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#B0BBCC] px-2 mb-1">
              {group}
            </p>

            <div className="space-y-0.5 mt-2">
              {items.map((item, i) => (
                <NavItem
                  key={item.label}
                  item={item}
                  i={i}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>


    </div>
  );
}

export default function Sidebar() {
  console.log("entro")

  const pathname = usePathname();
  const { user } = userAuthLocalStorage();
  console.log(user?.rolName)

  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);

  const userRole: UserRole =
    (user?.rolName as UserRole) || "ADMIN";

  const navItems: SidebarItem[] = menuByRole[userRole] || [];

  const grouped = navItems.reduce(
    (acc: Record<string, SidebarItem[]>, item) => {
      (acc[item.group] ??= []).push(item);
      return acc;
    },
    {}
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (!user) return null;

  return (
    <>
      <aside className="hidden lg:flex w-60 h-screen flex-col bg-white border-r border-blue-50">
        <SidebarContent grouped={grouped} />
      </aside>

      <div className="md:hidden">
        <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-blue-50 flex items-center px-4 gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 flex-1">
            <Image
              src="/pan-side-bar.png"
              alt="PAN"
              width={28}
              height={28}
            />

            <p className="font-bold text-sm text-[#6B778C]">
              Gestión de Eventos
            </p>
          </div>
        </header>

        <div
          onClick={() => setMobileOpen(false)}
          className={`
            fixed inset-0 z-50 bg-black/40
            ${mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
            }
          `}
        />

        <div
          ref={drawerRef}
          className={`
            fixed top-0 left-0 bottom-0 z-50 w-72 bg-white
            transition-transform duration-300
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex items-center justify-between px-4 h-14 border-b border-blue-50">
            <p className="font-bold text-sm text-[#6B778C]">
              Gestión de Eventos
            </p>

            <button onClick={() => setMobileOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <SidebarContent
            grouped={grouped}
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      </div>
    </>
  );
}