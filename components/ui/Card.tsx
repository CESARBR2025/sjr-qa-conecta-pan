// components/ui/Card.tsx

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: string;
}

export default function Card({
  children,
  className = "",
  padding = "p-6",
}: CardProps) {
  return (
    <div
      className={`
        bg-white
        border
        border-[#EAF1FC]
        rounded-2xl
        shadow-[0px_4px_18px_rgba(31,105,231,0.05)]
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
}