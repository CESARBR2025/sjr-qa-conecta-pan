"use client";

import { useState } from "react";
import { X } from "lucide-react";
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
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                        Crear nuevo rol
                    </h2>

                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4">

                    <div>
                        <label className="text-sm font-medium">
                            Código del rol
                        </label>

                        <input
                            value={roleCode}
                            onChange={(e) =>
                                setRoleCode(e.target.value)
                            }
                            placeholder="Ej: SUPERVISOR"
                            className="w-full mt-2 border border-[#EEF3FD] rounded-lg px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Descripción
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Describe qué puede hacer este rol"
                            className="w-full mt-2 border border-[#EEF3FD] rounded-lg px-4 py-3 min-h-[120px]"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <ButtonComponent
                        variant="ghost"
                        onClick={onClose}
                    >
                        Cancelar
                    </ButtonComponent>

                    <ButtonComponent
                        onClick={handleCreateRole}
                        disabled={saving}
                    >
                        {saving
                            ? "Creando..."
                            : "Crear Rol"}
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );
}