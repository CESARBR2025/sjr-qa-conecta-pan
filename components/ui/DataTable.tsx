// components/ui/DataTable.tsx

import { Eye, PenLine, Trash2 } from "lucide-react";
import { ReactNode } from "react";

export interface ColumnInterface {
  key: string;
  label: string;
  type?: "text" | "avatarName" | "status" | "actions" | "date";
  render?: (value: any, row: any) => ReactNode;

  actions?: {
    label: string;
    onClick: (row: any) => void
    variant?: "edit" | "delete" | "view"
  }[]
}

interface DataTableProps {
  columns: ColumnInterface[];
  data: any[];
}

function getInitials(name: string) {
  return name
    ?.split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}


const avatarColors = [
  {
    bg: "bg-[#EAF1FC]",
    text: "text-[#1F69E7]",
  },
  {
    bg: "bg-[#EAFBF3]",
    text: "text-[#16A34A]",
  },
  {
    bg: "bg-[#FFF4E6]",
    text: "text-[#F59E0B]",
  },
  {
    bg: "bg-[#F3E8FF]",
    text: "text-[#7C3AED]",
  },
  {
    bg: "bg-[#FEECEC]",
    text: "text-[#DC2626]",
  },
  {
    bg: "bg-[#E6FFFB]",
    text: "text-[#0F766E]",
  },
];



const getAvatarColor = (name: string) => {
  const index =
    name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    avatarColors.length;

  return avatarColors[index];
};


function renderCell(column: ColumnInterface, row: any) {
  const value = row[column.key];

  if (column.render) {
    return column.render(value, row);
  }

  switch (column.type) {
    case "date":
  return (
    <span>
      {value
        ? new Date(value).toLocaleDateString("es-MX")
        : "-"}
    </span>
  );
    case "avatarName":
       const avatarColor = getAvatarColor(value);

  return (
    <div className="flex items-center gap-3">
      <div
        className={`
          w-10 h-10
          rounded-full
          flex items-center justify-center
          font-semibold text-sm
          ${avatarColor.bg}
          ${avatarColor.text}
        `}
      >
        {getInitials(value)}
      </div>

      <span className="font-medium text-[#1A2340]">
        {value}
      </span>
    </div>
  );

    case "status":
      return (
        <span
  className={`
    inline-flex items-center gap-2
    px-3 py-1 rounded-lg text-sm font-medium
    ${
      value === "Activo"
        ? "bg-[#EAF8F1] text-[#1F7A4D]"
        : value === "Pendiente"
        ? "bg-[#FEFAF1] text-[#FB933D] border border-[#FEF5E5]"
        : "bg-[#FFF0F0] text-[#B54747]"
    }
  `}
>
  {/* Puntito */}
  <span
    className={`
      w-2 h-2 rounded-full
      ${
        value === "Activo"
          ? "bg-[#1F7A4D]"
          : value === "Pendiente"
          ? "bg-[#FB933D]"
          : "bg-[#B54747]"
      }
    `}
  />

  {value}
</span>
      );
  
 case "actions":
  return (
    <div className="flex items-center gap-2">
      {column.actions?.map((action, index) => {
        const Icon =
          action.variant === "delete"
            ? Trash2
            : action.variant === "edit"
            ? PenLine
            : Eye;

        return (
          <button
            key={index}
            onClick={() => action.onClick(row)}
            className={`
              inline-flex items-center gap-2
              px-3 py-2 rounded-lg text-sm font-medium transition
              ${
                action.variant === "delete"
                  ? "bg-[#FEF4F6] text-[#DF4357] border-2 border-[#FCE2E7]"
                  : action.variant === "edit"
                  ? "bg-[#FEFEFE] text-[#1F69E7] border-2 border-[#ECF1FA]"
                  : "bg-[#FFFAF3] text-[#FA9A44] border-2 border-[#FEECD9]"
              }
            `}
          >
            <Icon size={16} />

            
          </button>
        );
      })}
    </div>
  );


    default:
      return (
        <p className="text-gray-500 font-semibold">{value}</p>
      );
  }
}

export default function DataTable({
  columns,
  data,
}: DataTableProps) {
  return (
    <div className="bg-white border border-[#EAF1FC] rounded-2xl shadow-[0px_4px_18px_rgba(31,105,231,0.05)] overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#F8FAFF]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 text-left text-sm font-semibold text-[#6B778C] border-b border-[#EAF1FC]"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b border-[#F1F4FA] hover:bg-[#F7FAFF] transition"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 text-sm text-[#1A2340]"
                >
                  {renderCell(column, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}