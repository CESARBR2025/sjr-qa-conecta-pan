"use client";

import ButtonComponent from "@/components/ui/ButtonComponent";
import Card from "@/components/ui/Card";
import DataTable, { ColumnInterface } from "@/components/ui/DataTable";
import AsignarRoleModal from "@/components/ui/AsignarRolModal";
import { listarUsuariosRegistradosAction, UsersDashboardResponse } from "@/modules/users/services/users.server";
import { ViewUsersAsigarRol } from "@/modules/users/types/users.types";
import { Calendar, ChartNoAxesCombined, ListFilterPlus, LucideIcon, Search, Shield, Users2, UserStar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";


interface KPICardProps {
    icon: LucideIcon;
    value: string | number | undefined;
    label: string;
    isLast?: boolean;
    showBorder?: boolean
}





const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};


export default function UsuariosRegistradosPage() {
    const [verDetalles, setVerDetalles] = useState(false);
    const [data, setData] = useState<UsersDashboardResponse | undefined>();
    const [loading, setLoading] = useState(true);
    const [userSelected, setUserSelected] = useState<ViewUsersAsigarRol>()

    const [showSearch, setShowSearch] = useState(true);
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

        try {
            const response = await listarUsuariosRegistradosAction();

            console.log(response);

            if (response.success) {
                setData(response); // ✔ correcto si guardas el response completo
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    console.log(data)
    const usuarios = data?.data?.usuarios
    console.log(usuarios)
    const kpis = data?.data?.resumen
    console.log(kpis)

    /**
     * IMPORTANTE:
     * hooks siempre arriba, antes de cualquier return
     */

    const filteredData = useMemo(() => {
        const searchValue = search.toLowerCase().trim();

        return usuarios?.filter((row) => {
            if (!searchValue) return true;

            return (
                row.curp?.toLowerCase().includes(searchValue) ||
                row.nombreUsuario?.toLowerCase().includes(searchValue)
            );
        });
    }, [data, search]);

    console.log(filteredData)


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
            type: "role",
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
    const KPICard = ({ icon: Icon, value, label, isLast = false }: KPICardProps) => (
        <div className={`flex items-center gap-4 p-6 flex-1 relative ${!isLast ? 'pr-6' : ''}`}>
            <div className="p-3 bg-[#EAF0FD] rounded-full flex justify-center items-center">
                <Icon className="h-5 w-5 text-[#2E72EA]" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
                <h1 className="text-lg font-bold">{value}</h1>
                <p className="text-gray-600 font-semibold">{label}</p>
            </div>
            {!isLast && (
                <div className="absolute right-0 h-1/2 w-px bg-gray-200"></div>
            )}
        </div>
    );

    return (
        <div className="w-full">

            <h1 className="text-[30px] font-bold text-[#1A2340]">
                Gestión de usuarios
            </h1>

            <p className="text-[16px] text-gray-400 font-semibold leading-relaxed">
                Administra usuarios, roles y permisos para controlar el acceso y las acciones dentro del sistema.
            </p>

            <Card className="mt-6">



                {/* HEADER TOP */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">

                    {/* TITLE */}
                    <div className="flex items-start gap-3">

                        <div className="p-3 bg-[#EAF0FD] rounded-full flex items-center justify-center">
                            <Users2 className="h-5 w-5 text-[#2E72EA]" strokeWidth={2} />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold">
                                Usuarios registrados
                            </h1>
                            <p className="text-sm text-gray-400 font-semibold">
                                Gestiona los roles asignados a los usuarios
                            </p>
                        </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

                        {/* SEARCH */}
                        <div className="flex items-center gap-2 w-full lg:w-80 px-3 py-2 rounded-xl border border-[#E4E8EF]">

                            <Search className="h-4 w-4 text-gray-400" />

                            <input
                                type="text"
                                placeholder="Buscar por CURP o Nombre"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="
                        w-full
                        text-sm
                        outline-none
                    "
                            />
                        </div>

                        {/* BUTTON */}
                        <ButtonComponent
                            variant="ghost"
                            icon={ChartNoAxesCombined}
                            onClick={handleToggleSearch}
                            className="w-full sm:w-auto text-gray-500"
                        >
                            {showSearch ? "Ocultar KPIs" : "Mostrar KPIs"}
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



                {showSearch && (
                    <div className="w-full bg-[#F9FAFF] rounded-lg flex justify-around  grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4">
                        <KPICard icon={Users2} value={kpis?.totalUsuarios} label="Usuarios totales" />
                        <KPICard icon={UserStar} value={kpis?.usuariosActivos} label="Usuarios activos" />
                        <KPICard icon={Shield} value={kpis?.rolesAsignados} label="Roles asignados " />
                        <KPICard icon={Calendar} value={kpis?.ultimoAcceso ? formatDate(kpis.ultimoAcceso) : "-"} label="Ultimo acceso reciente " showBorder={false} />

                    </div>
                )}




                {/* TABLE WRAPPER RESPONSIVE */}
                <div className="w-full overflow-x-auto mt-8">

                    <DataTable
                        columns={columns}
                        data={filteredData ?? []}
                        onRowSelected={handleRowClick}
                    />

                </div>
            </Card>
        </div>
    );
}