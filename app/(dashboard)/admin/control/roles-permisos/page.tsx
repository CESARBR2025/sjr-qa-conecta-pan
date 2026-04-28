"use client";

import ButtonComponent from "@/components/ui/ButtonComponent";
import Card from "@/components/ui/Card";
import DataTable, { ColumnInterface } from "@/components/ui/DataTable";
import AsignarRoleModal from "@/components/ui/AsignarRolModal";
import { listarUsuariosRegistradosAction } from "@/modules/users/services/users.server";
import { ViewUsersAsigarRol } from "@/modules/users/types/users.types";
import { ChevronRight, ListFilterPlus, Plus, Shield, Users, Zap, Search, ChevronDown, ChevronUp, Check, Mail, CircleCheckBig, Calendar, LogIn, Logs, MapIcon, ChartNoAxesColumn, ChartNoAxesCombined, Form, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { listarRolesPermisosAction } from "@/modules/roles/service/roles.server";
import { ViewRolesPermisos } from "@/modules/roles/types/roles.types";

// Mapeo de permisos a iconos y categorías
const PERMISSION_CATEGORIES: Record<string, { label: string; description: string; icon: React.ReactNode }> = {
    "affiliate": { label: "Afiliados", description: "Administra vista de afiliados", icon: <Users /> },
    "campaign": { label: "Campaign", description: "Manage and view campaigns", icon: <Mail /> },
    "checkin": { label: "Check-in", description: "Use check-in functionality", icon: <CircleCheckBig /> },
    "event": { label: "Event", description: "Manage and view events", icon: <Calendar /> },
    "log": { label: "Log", description: "View system logs", icon: <Logs /> },
    "map": { label: "Map", description: "View maps", icon: <MapIcon /> },
    "report": { label: "Report", description: "View reports", icon: <ChartNoAxesCombined /> },
    "role": { label: "Role", description: "Manage roles", icon: <Shield /> },
    "template": { label: "Template", description: "Manage and view templates", icon: <Form /> },
    "user": { label: "User", description: "Manage users", icon: <User /> },
};

// Función para agrupar permisos
function groupPermissions(permissions: string[]) {
    const grouped: Record<string, { view: boolean; manage: boolean }> = {};

    permissions.forEach((permission) => {
        const [resource, action] = permission.split(":");
        if (!grouped[resource]) {
            grouped[resource] = { view: false, manage: false };
        }
        if (action === "view") grouped[resource].view = true;
        if (action === "manage") grouped[resource].manage = true;
        if (action === "use") grouped[resource].manage = true; // checkin:use -> manage
    });

    return grouped;
}

// Componente de Editor de Permisos
function PermissionsEditor({ role }: { role: ViewRolesPermisos }) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["campaign"]));
    const [searchQuery, setSearchQuery] = useState("");
    const groupedPermissions = groupPermissions(role.permissions);

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const expandAll = () => {
        setExpandedCategories(new Set(Object.keys(groupedPermissions)));
    };

    const filteredCategories = Object.entries(groupedPermissions).filter(([resource]) => {
        const category = PERMISSION_CATEGORIES[resource];
        return category?.label.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const totalPermissions = role.permissions.length;
    const enabledPermissions = totalPermissions;

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-bold text-gray-900">
                            Editando rol:  <span className="text-blue-500">{role.roleName}</span>
                        </h3>
                    </div>
                    <p className="text-sm text-gray-500">Configura los permisos para este rol</p>
                </div>

                <div className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                    <p className="text-sm font-medium text-emerald-700">
                        ✓ {enabledPermissions} / {totalPermissions} permissions
                    </p>
                </div>
            </div>


            <div className="flex justify-between">

                {/* Search Bar */}
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search permissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#EEF3FD] rounded-lg bg-[#FDFDFD] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Expand All Link */}
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={expandAll}
                        className="text-blue-500 text-sm font-medium flex items-center gap-1 hover:text-blue-700 transition-colors"
                    >
                        <ChevronUp className="w-4 h-4" />
                        Expand all
                    </button>
                </div>
            </div>



            {/* Categories */}
            <div className="space-y-3">
                {filteredCategories.map(([resource, actions]) => {
                    const category = PERMISSION_CATEGORIES[resource];
                    const isExpanded = expandedCategories.has(resource);

                    return (
                        <div key={resource} className="border border-[#EEF3FD] rounded-lg bg-[#FDFDFD]">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(resource)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-lg text-[#3272EB] bg-[#E5EEFD] p-2 rounded-lg">{category?.icon}</span>
                                    <div className="text-left">
                                        <h4 className="font-bold text-gray-900">{category?.label}</h4>
                                        <p className="text-sm text-gray-500">{category?.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        {Object.values(actions).filter(Boolean).length} permission{Object.values(actions).filter(Boolean).length !== 1 ? "s" : ""}
                                    </span>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </button>

                            {/* Expandable Permissions */}
                            {isExpanded && (
                                <div className="border-t border-[#EEF3FD] px-4 py-3 space-y-3 bg-white">
                                    {actions.view && (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{resource}:view</p>
                                                <p className="text-sm text-gray-500">View {resource.toLowerCase()}s</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={true}
                                                    onChange={() => { }}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-blue-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                            </label>
                                        </div>
                                    )}

                                    {actions.manage && (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{resource}:manage</p>
                                                <p className="text-sm text-gray-500">Create, edit and delete {resource.toLowerCase()}s</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={true}
                                                    onChange={() => { }}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-blue-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function ControlRolesPermisosPage() {

    const [data, setData] = useState<ViewRolesPermisos[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<ViewRolesPermisos | null>(null);

    //Cargando roles 
    const loadRoles = async () => {
        setLoading(true);

        const res = await listarRolesPermisosAction();

        if (res.success) {
            setData(res.data ?? []);
            if (res.data && res.data.length > 0) {
                setSelectedRole(res.data[0]); // Seleccionar el primer rol por defecto
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        loadRoles();
    }, []);

    if (loading) {
        return <p>Cargando datos...</p>;
    }

    return (
        <div className="w-full ">

            <h1 className="text-[30px] font-bold ">Roles  & Permisos</h1>
            <p className="text-[16px] text-gray-500 ">Administra el control de los permisos asignados a los roles</p>

            <div className="flex gap-2 mt-6">
                <Card className="w-2/6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[20px] font-bold text-gray-900">Roles</h2>
                        <ButtonComponent
                            variant="ghostBlue"
                            icon={Plus}
                            //onClick={handleToggleSearch}
                            className="w-full sm:w-auto"
                        >
                            Nuevo rol
                        </ButtonComponent>
                    </div>

                    {/* Roles List */}
                    <div className="space-y-3">
                        {data.map((role) => (
                            <button
                                key={role.roleName}
                                onClick={() => setSelectedRole(role)}
                                className={`w-full p-4 border-1 rounded-lg transition-all cursor-pointer ${selectedRole?.roleName === role.roleName
                                    ? "border-blue-400 bg-blue-50"
                                    : "border-[#EEF3FD] bg-[#FDFDFD] hover:shadow-md"
                                    }`}
                            >
                                {/* Icon & Title */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        {role.roleName === 'ADMIN' && (
                                            <Shield className="w-6 h-6 text-blue-500" />
                                        )}
                                        {role.roleName === 'OPERATOR' && (
                                            <Zap className="w-6 h-6 text-emerald-500" />
                                        )}
                                        {role.roleName === 'RECEPTIONIST' && (
                                            <Users className="w-6 h-6 text-orange-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-bold text-gray-900">{role.roleName}</h3>
                                        <p className="text-sm text-gray-500">{role.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer Link */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <a
                            href="#"
                            className="text-blue-500 text-sm font-medium flex items-center gap-1 hover:text-blue-700 transition-colors"
                        >
                            Ver todos los roles
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </Card>
                <Card className="w-4/6">
                    {selectedRole ? (
                        <PermissionsEditor role={selectedRole} />
                    ) : (
                        <div className="flex items-center justify-center h-96">
                            <p className="text-gray-500">Selecciona un rol para ver sus permisos</p>
                        </div>
                    )}
                </Card>


            </div>


        </div>
    );
}