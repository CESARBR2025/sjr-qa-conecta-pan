// components/ui/Button.tsx

import { ReactNode } from "react";
import { Loader2, LucideIcon } from "lucide-react";


interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "ghost" | "success" | "warning" | "danger" | "ghostBlue";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: LucideIcon
}

export default function ButtonComponent({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  icon: Icon
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    px-5 py-2.5
    rounded-lg
    font-medium
    text-sm
    transition-all
    duration-200
    border-2
    cursor-pointer
    disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-[#1070FA]
      text-white
      border-transparent
      hover:bg-[#3E83F0]
      active:bg-[#1857C3]
      disabled:bg-[#C7D7F8]
    `,

    success: `
      bg-[#22A06B]
      text-white
      border-transparent
      hover:bg-[#1C8B5C]
      active:bg-[#176F4A]
    `,

    warning: `
      bg-[#F08A24]
      text-white
      border-transparent
      hover:bg-[#D97816]
      active:bg-[#B86110]
    `,

    danger: `
      bg-[#E55353]
      text-white
      border-transparent
      hover:bg-[#D94444]
      active:bg-[#BE3535]
    `,

    ghost: `
      bg-white
      text-[#1F69E7]
      border-[#EDF0F6]
      hover:bg-[#EFF4FE]
    `,
    ghostBlue: `
      bg-white
      text-[#1F69E7]
      border-[#EEF3FD]
      hover:bg-[#EFF4FE]
    `,
  };

  const iconColor = variant === 'ghost' ? 'text-gray-500 font-semibold' : 'text-current'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${className}
        border-2
      `}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}

      {!loading && Icon && <Icon size={18} className={iconColor} strokeWidth={2.5} />}

      {children}
    </button>
  );
}