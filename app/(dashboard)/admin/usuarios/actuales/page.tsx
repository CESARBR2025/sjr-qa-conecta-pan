"use client";

import ButtonComponent from "@/components/ui/ButtonComponent";
import Card from "@/components/ui/Card";
import DataTable, { ColumnInterface } from "@/components/ui/DataTable";
import AsignarRoleModal from "@/components/ui/AsignarRolModal";
import { listarUsuariosRegistradosAction } from "@/modules/users/services/users.server";
import { ViewUsersAsigarRol } from "@/modules/users/types/users.types";
import { ListFilterPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/*
//2. Enviar correo
    // 10. Enviar correo
    const text = `
Hola ${user.nombreUsuario || "Usuario"},

Te informamos que tu rol en la plataforma ha sido actualizado.

Nuevo rol asignado: ${user.nombreRol}

A partir de este momento, tendrás acceso a las funcionalidades correspondientes a este rol dentro del sistema.

Si tienes alguna duda o consideras que esto es un error, puedes contactar al equipo de administración.

Saludos,
Equipo de la plataforma
`;

    const html = `
  <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #FAFBFF; border-radius: 12px;">

    <h2 style="color: #1F69E7; margin-bottom: 16px;">
      Actualización de rol en la plataforma
    </h2>

    <p>
      Hola <strong>${user.nombreUsuario || "Usuario"}</strong>,
    </p>

    <p>
      Te informamos que tu rol en la plataforma ha sido <strong>actualizado</strong>.
    </p>

    <div style="
      margin: 20px 0;
      padding: 16px;
      background-color: #ffffff;
      border: 1px solid #EAF1FC;
      border-radius: 10px;
    ">
      <p style="margin: 0; font-size: 14px; color: #666;">
        Nuevo rol asignado:
      </p>
      <p style="margin: 6px 0 0 0; font-size: 18px; font-weight: 700; color: #1F69E7;">
        ${user.nombreUsuario}
      </p>
    </div>

    <p style="font-size: 14px; color: #333;">
      A partir de este momento, tendrás acceso a las funcionalidades correspondientes a este rol dentro del sistema.
    </p>

    <p style="font-size: 14px; color: #333;">
      Si no reconoces este cambio o consideras que es un error, por favor contacta al equipo de administración.
    </p>

    <p style="margin-top: 24px; font-size: 14px; color: #666;">
      Saludos,<br/>
      Equipo de la plataforma
    </p>

  </div>
`;

    sendMail({
      to: user.email,
      subject: "Nueva solicitud de usuario",
      text,
      html,
    }).catch((err) => {
      console.error("ERROR EMAIL ADMIN:", err);
    });

*/

export default function UsuariosRegistradosPage() {
    const [verDetalles, setVerDetalles] = useState(false);
    const [data, setData] = useState<ViewUsersAsigarRol[]>([]);
    const [loading, setLoading] = useState(true);
    const [userSelected, setUserSelected] = useState<ViewUsersAsigarRol>()

    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");

    // Obtener datos de registro seleccionado
    const handleRowClick = (row: any) => {
        setUserSelected(row);
        setVerDetalles(true);
    };

    console.log(userSelected)


    // Filtrar el valor que se esta filtrando
    const handleToggleSearch = () => {
        setShowSearch((prev) => !prev);
    };


    //Cargando users 
    const loadUsers = async () => {
        setLoading(true);

        const res = await listarUsuariosRegistradosAction();

        if (res.success) {
            setData(res.data ?? []);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    console.log(data)

    /**
     * IMPORTANTE:
     * hooks siempre arriba, antes de cualquier return
     */
    const filteredData = useMemo(() => {
        const searchValue = search.toLowerCase().trim();

        return data.filter((row) => {
            if (!searchValue) return true;

            return (
                row.curp?.toLowerCase().includes(searchValue) ||
                row.nombreUsuario?.toLowerCase().includes(searchValue)
            );
        });
    }, [data, search]);

    const columns: ColumnInterface[] = [
        {
            key: "nombreUsuario",
            label: "Nombre",
            type: "avatarName",
            showOnMobile: true
        },
        {
            key: "curp",
            label: "CURP",
            type: "text",
            showOnMobile: false
        },
        {
            key: "estatus",
            label: "Estado",
            type: "status",
            showOnMobile: false
        },
        {
            key: "ultimoAcceso",
            label: "Último acceso",
            type: "date",
            showOnMobile: false
        },
        {
            key: "nombreRol",
            label: "Rol",
            type: "text",
            showOnMobile: false
        },
        {
            key: "actions",
            label: "Acciones",
            type: "actions",
            showOnMobile: true,
            actions: [
                {
                    label: "Editar",
                    variant: "edit",
                    onClick: () => {
                        setVerDetalles(true);
                    },
                },
            ],
        },
    ];

    if (loading) {
        return <p>Cargando datos...</p>;
    }

    return (
        <div className="w-full">
            <Card>
                {/* HEADER */}
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    {/* TITLES */}
                    <div className="w-full">
                        <h2 className="text-lg sm:text-xl font-semibold mb-2">
                            Usuarios registrados
                        </h2>

                        <p className="text-sm sm:text-base text-gray-600">
                            Gestiona los roles asignados a los usuarios
                        </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="w-full md:w-auto flex justify-start md:justify-end">
                        <ButtonComponent
                            variant="ghost"
                            icon={ListFilterPlus}
                            onClick={handleToggleSearch}
                            className="w-full sm:w-auto"
                        >
                            Buscar
                        </ButtonComponent>
                    </div>
                </div>

                {/* MODAL */}
                {verDetalles && userSelected && (
                    <AsignarRoleModal
                        isOpen={verDetalles}
                        onClose={() => setVerDetalles(false)}
                        onSucces={loadUsers}
                        initialData={userSelected}
                    />
                )}

                {/* SEARCH BOX */}
                {showSearch && (
                    <div className="mb-6 bg-white border border-[#EAF1FC] rounded-2xl p-4 sm:p-5 shadow-[0px_4px_18px_rgba(31,105,231,0.05)]">
                        <input
                            type="text"
                            placeholder="Buscar por CURP o Nombre"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="
                            w-full
                            rounded-xl
                            border border-[#E4E8EF]
                            bg-[#F8FAFC]
                            px-4 py-3
                            text-sm
                            outline-none
                            focus:border-[#1F69E7]
                            focus:bg-white
                            transition
                        "
                        />
                    </div>
                )}

                {/* TABLE WRAPPER RESPONSIVE */}
                <div className="w-full overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        onRowSelected={handleRowClick}
                    />
                </div>
            </Card>
        </div>
    );
}