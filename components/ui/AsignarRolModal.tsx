"use client";

import { actualizarRolAction, listarRolesAction } from "@/modules/roles/service/roles.server";
import { ViewRolesTable } from "@/modules/roles/types/roles.types";
import { ViewUsersAsigarRol } from "@/modules/users/types/users.types";
import { useEffect, useState, useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSucces: () => void;
  initialData: ViewUsersAsigarRol[];
}

export default function AsignarRoleModal({
  isOpen,
  onClose,
  onSucces,
  initialData,
}: Props) {
  const [roles, setRoles] = useState<ViewRolesTable[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSuccess, setLoadingSuccess] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectFocused, setSelectFocused] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // pequeño delay para que la animación de entrada se dispare correctamente
      requestAnimationFrame(() => setIsVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await listarRolesAction();
      if (res.success) setRoles(res.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  if (!isOpen) return null;

  const user = initialData[0];
  const initials = user.nombreUsuario
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setLoadingSuccess(true);

    console.log(initialData[0].userId)
    const response = await actualizarRolAction(
      initialData[0].idCus,
      Number(selectedRole),
      initialData[0].userId
    );

    if (response.success) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        onSucces();
        handleClose();
      }, 2500);

    } else {
      setLoadingSuccess(false);
      console.error(response.error);
      alert("Error al asignar rol");
    }
  };

  const selectedRoleName = roles.find((r) => r.idRol === selectedRole)?.nombreRol;

  return (
    <>
      {/* Toast notification — fuera del modal para no verse afectada por el blur */}
      <div
        className={`
          fixed top-5 right-5 z-[9999] min-w-[300px] max-w-[360px]
          rounded-2xl border border-green-100 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]
          p-4 flex items-center gap-3
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${showNotification
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
          }
        `}
      >
        <div className="w-9 h-9 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-gray-800 leading-tight">
            Rol asignado correctamente
          </p>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {user.nombreUsuario} ahora tiene el rol actualizado.
          </p>
        </div>
      </div>

      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={(e) => e.target === overlayRef.current && handleClose()}
        className={`
          fixed inset-0 z-50 flex items-center justify-center
          transition-all duration-300 ease-out
          ${isVisible
            ? "bg-black/20 backdrop-blur-[6px]"
            : "bg-black/0 backdrop-blur-none"
          }
        `}
      >
        {/* Modal */}
        <div
          className={`
            w-full max-w-[440px] mx-4 bg-white rounded-[22px]
            border border-[#E4EAF6]
            shadow-[0_24px_60px_rgba(31,105,231,0.10),0_4px_16px_rgba(0,0,0,0.06)]
            overflow-hidden
            transition-all duration-[220ms] ease-[cubic-bezier(0.34,1.3,0.64,1)]
            ${isVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-[0.96] translate-y-2"
            }
          `}
        >
          {/* Header con sutil gradiente superior */}
          <div className="relative px-7 pt-6 pb-5">
            {/* Línea de acento en el top */}
            <div className="absolute top-0 left-7 right-7 h-[2px] bg-gradient-to-r from-transparent via-[#1F69E7]/20 to-transparent rounded-full" />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#E8F0FD] to-[#D6E4FB] flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
                  <h2 className="text-[17px] font-semibold text-[#111827] leading-snug tracking-[-0.01em]">
                    Asignar permisos
                  </h2>
                  <p className="text-[12.5px] text-[#9CA3AF] mt-0.5 font-normal">
                    Configura el rol del usuario
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="
                  w-8 h-8 flex items-center justify-center rounded-[9px]
                  border border-[#F0F2F7] bg-[#FAFBFF] text-[#9CA3AF]
                  hover:bg-[#EEF2FB] hover:text-[#374151] hover:border-[#DDE3F0]
                  hover:shadow-[0_2px_8px_rgba(31,105,231,0.08)]
                  active:scale-95
                  transition-all duration-150
                  flex-shrink-0 mt-0.5
                "
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#E4EAF6] to-transparent mx-6" />

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-7 pt-5 pb-6 space-y-5">

            {/* Avatar row */}
            <div className="
              flex items-center gap-3.5 px-4 py-3.5
              bg-gradient-to-br from-[#FAFBFF] to-[#F5F8FF]
              rounded-[14px] border border-[#EDF1FA]
              shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(31,105,231,0.04)]
            ">
              {/* Avatar con ring */}
              <div className="relative flex-shrink-0">
                <div className="
                  w-[42px] h-[42px] rounded-full
                  bg-gradient-to-br from-[#DAEAFC] to-[#C5D8F8]
                  flex items-center justify-center
                  text-[14px] font-bold text-[#1F69E7]
                  select-none
                  ring-2 ring-white ring-offset-1 ring-offset-[#F5F8FF]
                  shadow-[0_2px_8px_rgba(31,105,231,0.15)]
                ">
                  {initials || "?"}
                </div>
                {/* Dot verde de estado */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-white" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold text-[#111827] truncate leading-snug">
                  {user.nombreUsuario || "Sin nombre"}
                </p>
                <p className="text-[11.5px] text-[#9CA3AF] font-mono tracking-wide mt-0.5">
                  {user.curp}
                </p>
              </div>

              <span className="
                text-[10.5px] font-semibold
                bg-[#F0FBF4] text-[#15803d]
                border border-[#BBF7D0]
                rounded-[6px] px-2.5 py-1
                flex-shrink-0
                tracking-wide
              ">
                ACTIVO
              </span>
            </div>

            {/* Select de rol */}
            <div className="space-y-2">
              <label className="block text-[11.5px] font-semibold text-[#6B7280] tracking-[0.06em] uppercase">
                Rol a asignar
              </label>

              <div className="relative group">
                {/* Icono izquierdo */}
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-colors duration-150">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={selectFocused ? "text-[#1F69E7]" : "text-[#9CA3AF]"}
                  >
                    <path
                      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                <select
                  value={selectedRole ?? ""}
                  onChange={(e) => setSelectedRole(Number(e.target.value))}
                  onFocus={() => setSelectFocused(true)}
                  onBlur={() => setSelectFocused(false)}
                  disabled={loading}
                  className={`
                    w-full h-[44px] pl-10 pr-10 rounded-[11px]
                    border text-[13.5px] bg-white
                    appearance-none cursor-pointer
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${selectedRole
                      ? "text-[#111827] font-medium"
                      : "text-[#9CA3AF]"
                    }
                    ${selectFocused
                      ? "border-[#1F69E7] ring-4 ring-[#1F69E7]/[0.08] shadow-[0_0_0_1px_rgba(31,105,231,0.15)]"
                      : "border-[#DDE3F0] hover:border-[#B8C5E0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                    }
                  `}
                >
                  <option value="">
                    {loading ? "Cargando roles…" : "Selecciona un rol"}
                  </option>
                  {roles.map((rol) => (
                    <option key={rol.idRol} value={rol.idRol}>
                      {rol.nombreRol}
                    </option>
                  ))}
                </select>

                {/* Chevron derecho */}
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-transform duration-200 ${selectFocused ? "rotate-180 text-[#1F69E7]" : "text-[#9CA3AF]"}`}
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Preview del rol seleccionado */}
              <div className={`
                overflow-hidden transition-all duration-300 ease-out
                ${selectedRole ? "max-h-12 opacity-100" : "max-h-0 opacity-0"}
              `}>
                <p className="text-[11.5px] text-[#6B7280] pt-1.5 pl-1 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#1F69E7] inline-block" />
                  Se asignará el rol <span className="font-semibold text-[#1F69E7]">{selectedRoleName}</span> a este usuario
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#E4EAF6] to-transparent" />

            {/* Acciones */}
            <div className="flex items-center justify-end gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleClose}
                className="
                  h-[38px] px-5 rounded-[10px]
                  border border-[#E8ECF5] bg-white
                  text-[13px] font-medium text-[#6B778C]
                  hover:bg-[#F5F7FB] hover:text-[#374151] hover:border-[#D1D9EA]
                  active:scale-[0.98]
                  transition-all duration-150
                  shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                "
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={!selectedRole || loadingSuccess}
                className="
                  h-[38px] px-5 rounded-[10px]
                  bg-[#1F69E7] text-[13px] font-semibold text-white
                  hover:bg-[#2E77F0]
                  active:bg-[#1857C3] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                  transition-all duration-150
                  flex items-center gap-2
                  shadow-[0_2px_8px_rgba(31,105,231,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]
                  hover:shadow-[0_4px_16px_rgba(31,105,231,0.40)]
                "
              >
                {loadingSuccess ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="3"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Guardando…
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}