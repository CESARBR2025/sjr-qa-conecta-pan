"use client";

import { useState } from "react";
import {
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { userAuthLocalStorage } from "@/lib/auth";
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

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = userAuthLocalStorage();

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  if (!user) return null;

  const userRole: UserRole =
    (user?.rolName as UserRole) || "ADMIN";

  const navItems: SidebarItem[] =
    menuByRole[userRole] || [];

  /**
   * Solo mostramos los principales
   */
  const mainItems = navItems.slice(0, 4);

  return (
    <>
      {/* Submenu flotante */}
      {openMenu && (
        <div
          className="
            md:hidden fixed bottom-20 left-4 right-4 z-50
            bg-white rounded-2xl border border-[#EAF1FC]
            shadow-[0px_10px_30px_rgba(31,105,231,0.12)]
            p-3 space-y-2
          "
        >
          {mainItems
            .find((item) => item.label === openMenu)
            ?.children?.map((child) => {
              const isActive = pathname === child.href;
              const ChildIcon = child.icon;

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setOpenMenu(null)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    text-sm font-medium transition-all
                    ${isActive
                      ? "bg-[#EFF4FE] text-[#1F69E7]"
                      : "text-[#6B778C] hover:bg-[#EFF4FE]"
                    }
                  `}
                >
                  <ChildIcon className="w-4 h-4" />
                  {child.label}
                </Link>
              );
            })}
        </div>
      )}

      {/* Bottom Nav */}
      <nav
        className="
          md:hidden fixed bottom-0 inset-x-0 z-40
          bg-white border-t border-blue-50
          flex items-center px-3 pb-safe pt-2
          shadow-[0_-4px_20px_rgba(31,105,231,0.08)]
        "
      >
        {mainItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = (item.children ?? []).length > 0;

          const isActive = item.href
            ? pathname === item.href
            : item.children?.some((child) =>
              pathname.startsWith(child.href)
            );

          if (hasChildren) {
            return (
              <button
                key={item.label}
                onClick={() =>
                  setOpenMenu(
                    openMenu === item.label ? null : item.label
                  )
                }
                className={`
                  flex-1 flex flex-col items-center gap-1 py-2 rounded-xl
                  text-[10px] font-semibold transition-all duration-200
                  ${isActive
                    ? "text-[#1F69E7] bg-[#EFF4FE]"
                    : "text-[#8A96B0]"
                  }
                `}
              >
                <Icon
                  className="w-5 h-5"
                  strokeWidth={isActive ? 2.5 : 2}
                />

                <div className="flex items-center gap-1">
                  {item.label}
                  <ChevronUp
                    className={`
                      w-3 h-3 transition-transform
                      ${openMenu === item.label
                        ? "rotate-180"
                        : ""
                      }
                    `}
                  />
                </div>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`
                flex-1 flex flex-col items-center gap-1 py-2 rounded-xl
                text-[10px] font-semibold transition-all duration-200
                ${isActive
                  ? "text-[#1F69E7] bg-[#EFF4FE]"
                  : "text-[#8A96B0]"
                }
              `}
            >
              <Icon
                className="w-5 h-5"
                strokeWidth={isActive ? 2.5 : 2}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}