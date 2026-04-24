"use client";

import { actualizarRolAction, listarRolesAction } from "@/modules/roles/service/roles.server";
import { ViewRolesTable } from "@/modules/roles/types/roles.types";
import { ViewUsersAsigarRol } from "@/modules/users/types/users.types";
import { useEffect, useState } from "react";



interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSucces: () => void;
  initialData: ViewUsersAsigarRol[]
}

export default  function AsignarRoleModal({
  isOpen,
  onClose,
  onSucces,
  initialData,
  
}: Props) {
  
  console.log(initialData)


  const [roles, setRoles] = useState<ViewRolesTable[] >([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadinSuccess, setLoadingSucces] = useState<boolean>(false)
  const [selectedRole, setSelectedRole] = useState<number | null>(null)
  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
  
      const res = await listarRolesAction();
      console.log(res)
      if (res.success) {
        console.log("entro")
        setRoles(res.data ?? []);
      }
  
      setLoading(false);
    };
  
    load();
  }, []);
  
  console.log(roles)


 

  console.log(initialData[0].idCus)
 const user = initialData[0]
 console.log(user)
  if (!isOpen) return null;

  const  handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()

    if (!selectedRole) return
    setLoadingSucces(true)
 
  const response = await actualizarRolAction(
    initialData[0].idCus,
    Number(selectedRole)
  );

   if (response.success) {
    console.log("Rol actualizado correctamente");

    // aquí luego puedes usar toast.success(...)
    alert("Rol asignado exitosamente");

    onSucces(); // refresca tabla padre
    onClose();   // cierra modal
  } else {
    console.error(response.error);

    // aquí luego puedes usar toast.error(...)
    alert("Error al asignar rol");
  }

  };

  
  const initials = user.nombreUsuario
    ?.split(" ")
      .map((w: string) => w[0])
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
                Asignar permisos
              </h2>
              <p className="text-[13px] text-[#8A96B0] mt-0.5">
                Asigna permisos a usuario
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
                {user.nombreUsuario || "Sin nombre"}
              </p>
              <p className="text-[12px] text-[#B0BBCC]">
                {user.curp}
              </p>
            </div>
            <div className="ml-auto flex-shrink-0">
              <span className="text-[11px] font-medium bg-[#EAF8F1] text-[#1F7A4D] border border-[#BFE8D1] rounded-[6px] px-2 py-0.5">
                Activo
              </span>
            </div>
          </div>

          {/* Campo asignar rol */}
          <div className="space-y-1.5">
            <label className="block text-[12px] font-medium text-[#6B778C] tracking-wide">
              Selecciona el rol a asignar
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
      <circle
        cx="12"
        cy="7"
        r="4"
        stroke="#8A96B0"
        strokeWidth="2"
      />
    </svg>
  </div>

  <select
    value={selectedRole ?? ''}
     onChange={(e) => setSelectedRole(Number(e.target.value))}
    
    className="w-full h-[42px] pl-9 pr-4 rounded-[10px] border border-[#DDE3F0] text-[#1A2340] text-[14px] bg-white focus:outline-none focus:border-[#1F69E7] focus:ring-4 focus:ring-[#1F69E7]/[0.08] transition-all appearance-none"
  >
    <option value="">Selecciona un rol</option>

    {roles.map((rol) => (
      <option key={rol.idRol} value={rol.idRol}>
        {rol.nombreRol}
      </option>
    ))}
  </select>
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