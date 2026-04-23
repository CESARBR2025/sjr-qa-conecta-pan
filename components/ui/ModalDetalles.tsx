"use client";

import { useState } from "react";

interface UserData {
  nombre: string;
  edad: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UserData;
  onSave: (data: UserData) => void;
  titleModal: string
  descriptionModal: string
}

export default function EditUserModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  titleModal,
  descriptionModal
}: Props) {
  const [formData, setFormData] = useState<UserData>(
    initialData ?? { nombre: "", edad: 0 }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const initials = formData.nombre
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[440px] mx-4 bg-white rounded-[20px] border border-[#DDE3F0] overflow-hidden shadow-[0px_8px_30px_rgba(31,105,231,0.08)] animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F4FF] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  stroke="#1F69E7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="#1F69E7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-[#1A2340] leading-snug">
                {titleModal}
              </h2>
              <p className="text-[13px] text-[#8A96B0] mt-0.5">
                {descriptionModal}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-[#EAF1FC] bg-[#FAFBFF] text-[#8A96B0] hover:bg-[#EFF4FE] hover:text-[#1A2340] transition-colors flex-shrink-0 mt-0.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#EAF1FC] mx-7" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 pt-5 pb-7 space-y-5">

          {/* Avatar row */}
          <div className="flex items-center gap-3 px-3 py-3 bg-[#FAFBFF] rounded-xl border border-[#EAF1FC]">
            <div className="w-11 h-11 rounded-full bg-[#E8EDFA] flex items-center justify-center text-[15px] font-semibold text-[#1F69E7] flex-shrink-0 select-none">
              {initials || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[#1A2340] truncate">
                {formData.nombre || "Sin nombre"}
              </p>
              <p className="text-[12px] text-[#B0BBCC]">
                {formData.edad > 0 ? `${formData.edad} años` : "Edad no definida"}
              </p>
            </div>
            <div className="ml-auto flex-shrink-0">
              <span className="text-[11px] font-medium bg-[#EAF8F1] text-[#1F7A4D] border border-[#BFE8D1] rounded-[6px] px-2 py-0.5">
                Activo
              </span>
            </div>
          </div>

          {/* Campo Nombre */}
          <div className="space-y-1.5">
            <label className="block text-[12px] font-medium text-[#6B778C] tracking-wide">
              Nombre completo
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="#8A96B0"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="7" r="4" stroke="#8A96B0" strokeWidth="2" />
                </svg>
              </div>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Ej. Juan Pérez"
                className="w-full h-[42px] pl-9 pr-4 rounded-[10px] border border-[#DDE3F0] text-[#1A2340] text-[14px] bg-white placeholder:text-[#8A96B0] focus:outline-none focus:border-[#1F69E7] focus:ring-4 focus:ring-[#1F69E7]/[0.08] transition-all"
              />
            </div>
          </div>

          {/* Campo Edad */}
          <div className="space-y-1.5">
            <label className="block text-[12px] font-medium text-[#6B778C] tracking-wide">
              Edad
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="#8A96B0"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 2v4M8 2v4M3 10h18"
                    stroke="#8A96B0"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <input
                type="number"
                value={formData.edad || ""}
                onChange={(e) =>
                  setFormData({ ...formData, edad: Number(e.target.value) })
                }
                placeholder="32"
                min={0}
                max={120}
                className="w-full h-[42px] pl-9 pr-4 rounded-[10px] border border-[#DDE3F0] text-[#1A2340] text-[14px] bg-white placeholder:text-[#8A96B0] focus:outline-none focus:border-[#1F69E7] focus:ring-4 focus:ring-[#1F69E7]/[0.08] transition-all"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#EAF1FC]" />

          {/* Footer de acciones */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-[38px] px-5 rounded-[10px] border border-[#EAF1FC] bg-[#FAFBFF] text-[13px] font-medium text-[#6B778C] hover:bg-[#EFF4FE] hover:text-[#1A2340] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-[38px] px-5 rounded-[10px] bg-[#1F69E7] text-[13px] font-medium text-white hover:bg-[#3E83F0] active:bg-[#1857C3] transition-colors flex items-center gap-2"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <polyline
                  points="17 21 17 13 7 13 7 21"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <polyline
                  points="7 3 7 8 15 8"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}