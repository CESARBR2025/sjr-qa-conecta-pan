"use client";

import { useState } from "react";
import { Check, FileText, Hash, Loader2, Shield, X } from "lucide-react";
import ButtonComponent from "@/components/ui/ButtonComponent";
import { crearNuevoRolAction } from "@/modules/roles/service/roles.server";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateRoleModal({
    open,
    onClose,
    onSuccess,
}: Props) {
    const [roleCode, setRoleCode] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    if (!open) return null;

    const handleCreateRole = async () => {
        try {
            setSaving(true);

            const response = await crearNuevoRolAction(
                roleCode,
                description
            );

            if (response.success) {
                setRoleCode("");
                setDescription("");
                onSuccess();
                onClose();
            } else {
                alert(response.message);
            }

        } catch (error) {
            console.log(error);
            alert("Error al crear el rol");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-[3px]"
                onClick={onClose}
            />

            {/* MODAL */}
            <div
                className="
        relative w-full max-w-lg
        bg-[#FFFFFF]
        border border-[#EAF1FC]
        rounded-[22px]
        shadow-[0px_12px_40px_rgba(31,105,231,0.10)]
        p-6
      "
            >

                {/* HEADER */}
                <div className="flex justify-between items-start mb-6">

                    {/* TITLE BLOCK */}
                    <div className="flex gap-3">

                        {/* ICON BADGE */}
                        <div className="w-10 h-10 rounded-[14px] bg-[#F0F4FF] flex items-center justify-center">
                            <Shield className="w-5 h-5 text-[#1F69E7]" />
                        </div>

                        <div>
                            <h2 className="text-[18px] font-semibold text-[#1A2340]">
                                Crear nuevo rol
                            </h2>

                            <p className="text-[13px] text-[#6B778C] mt-1">
                                Define permisos y acceso dentro del sistema
                            </p>
                        </div>
                    </div>

                    {/* CLOSE */}
                    <button
                        onClick={onClose}
                        className="
            w-9 h-9 flex items-center justify-center
            rounded-full
            text-[#8A96B0]
            hover:bg-[#EFF4FE]
            hover:text-[#1F69E7]
            transition
          "
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* BODY */}
                <div className="space-y-5">

                    {/* ROLE CODE */}
                    <div>
                        <label className="text-[13px] font-medium text-[#6B778C]">
                            Código del rol
                        </label>

                        <div className="relative mt-2">

                            <Hash className="w-4 h-4 text-[#8A96B0] absolute left-3 top-1/2 -translate-y-1/2" />

                            <input
                                value={roleCode}
                                onChange={(e) => setRoleCode(e.target.value)}
                                placeholder="Ej: SUPERVISOR"
                                className="
                w-full
                bg-[#FFFFFF]
                border border-[#DDE3F0]
                rounded-[14px]
                pl-10 pr-4 py-3
                text-[#1A2340]
                placeholder:text-[#8A96B0]
                outline-none
                focus:border-[#1F69E7]
                focus:shadow-[0_0_0_4px_rgba(31,105,231,0.08)]
                transition
              "
                            />
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="text-[13px] font-medium text-[#6B778C]">
                            Descripción
                        </label>

                        <div className="relative mt-2">

                            <FileText className="w-4 h-4 text-[#8A96B0] absolute left-3 top-4" />

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe qué puede hacer este rol"
                                className="
                w-full
                bg-[#FFFFFF]
                border border-[#DDE3F0]
                rounded-[14px]
                pl-10 pr-4 py-3
                min-h-[120px]
                text-[#1A2340]
                placeholder:text-[#8A96B0]
                outline-none
                focus:border-[#1F69E7]
                focus:shadow-[0_0_0_4px_rgba(31,105,231,0.08)]
                transition
                resize-none
              "
                            />
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div
                    className="
          flex justify-end gap-3
          mt-6 pt-4
          border-t border-[#EAF1FC]
        "
                >

                    {/* CANCEL */}
                    <button
                        onClick={onClose}
                        className="
            px-4 py-2
            rounded-[12px]
            border border-[#EDF0F6]
            text-[#6B778C]
            hover:bg-[#EFF4FE]
            transition
            flex items-center gap-2
          "
                    >
                        Cancelar
                    </button>

                    {/* CREATE */}
                    <button
                        onClick={handleCreateRole}
                        disabled={saving}
                        className="
            px-4 py-2
            rounded-[12px]
            bg-[#1F69E7]
            text-white
            hover:bg-[#3E83F0]
            active:bg-[#1857C3]
            transition
            flex items-center gap-2
            disabled:opacity-60
          "
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creando...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Crear rol
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}