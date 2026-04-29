"use client";

import ButtonComponent from "@/components/ui/ButtonComponent";
import Card from "@/components/ui/Card";
import { ChevronRight, ListFilterPlus, Plus, Shield, Users, Zap, Search, ChevronDown, ChevronUp, Check, Mail, CircleCheckBig, Calendar, LogIn, Logs, MapIcon, ChartNoAxesColumn, ChartNoAxesCombined, Form, User, Trash2, CheckCheck, Save, SaveAll, AlertTriangle, X, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { eliminarRolAction, listarRolesPermisosAction, listarTodosLosPermisosAction } from "@/modules/roles/service/roles.server";
import { ViewRolesPermisos } from "@/modules/roles/types/roles.types";
import { actualizarRolesPermisosAction } from "@/modules/roles/service/roles.server";
import CustomToast from "@/components/ui/Toast";
import CreateRoleModal from "@/components/roles/CreateRolModal";

const PERMISSION_CATEGORIES: Record<string, { label: string; description: string; icon: React.ReactNode }> = {
    "affiliate": { label: "Control de afiliados", description: "Administra vista de afiliados", icon: <Users /> },
    "campaign": { label: "Creación de campanias", description: "Controla permisos de campanias", icon: <Mail /> },
    "checkin": { label: "Registro de asistencia", description: "Administra acceso a eventos", icon: <CircleCheckBig /> },
    "event": { label: "Control de eventos", description: "Crea y visualiza eventos", icon: <Calendar /> },
    "log": { label: "Log", description: "Visualiza logs del sistema", icon: <Logs /> },
    "map": { label: "Mapa de afiliados", description: "Visualiza mapa de afiliados", icon: <MapIcon /> },
    "report": { label: "Reportes & KPIs", description: "Visualiza reportes del sistema", icon: <ChartNoAxesCombined /> },
    "role": { label: "Roles & Permisos", description: "Administra roles", icon: <Shield /> },
    "template": { label: "Plantillas de mensaje", description: "Administra plantillas de mensajes de campania", icon: <Form /> },
    "user": { label: "Control de usuarios", description: "Administra usuarios", icon: <User /> },
};

function mergePermissions(allPermissions: string[], activePermissions: string[]) {
    const grouped: Record<string, Record<string, boolean>> = {};
    allPermissions.forEach((permission) => {
        const [resource, action] = permission.split(":");
        if (!grouped[resource]) grouped[resource] = {};
        grouped[resource][action] = activePermissions.includes(permission);
    });
    return grouped;
}

function PermissionsEditor({ role, allPermissions, onUpdateRolePermissions, onBack }: {
    role: ViewRolesPermisos;
    allPermissions: string[];
    onUpdateRolePermissions: (roleCode: string, permissions: string[]) => void;
    onBack?: () => void;
}) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["campaign"]));
    const [searchQuery, setSearchQuery] = useState("");
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
        show: false, message: "", type: "success",
    });

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type });
    };

    const [permissionsState, setPermissionsState] = useState<Record<string, Record<string, boolean>>>(
        mergePermissions(allPermissions, role.permissions)
    );

    useEffect(() => {
        setPermissionsState(mergePermissions(allPermissions, role.permissions));
    }, [role, allPermissions]);

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) newExpanded.delete(category);
        else newExpanded.add(category);
        setExpandedCategories(newExpanded);
    };

    const togglePermission = (resource: string, action: string) => {
        setPermissionsState((prev) => ({
            ...prev,
            [resource]: { ...prev[resource], [action]: !prev[resource][action] },
        }));
    };

    const expandAll = () => setExpandedCategories(new Set(Object.keys(permissionsState)));

    const filteredCategories = Object.entries(permissionsState).filter(([resource]) => {
        const category = PERMISSION_CATEGORIES[resource];
        return category?.label.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const totalPermissions = role.permissions.length;
    const enabledPermissions = Object.values(permissionsState).reduce(
        (acc, permission) => acc + (permission.view ? 1 : 0) + (permission.manage ? 1 : 0),
        0
    );

    const buildPermissionsPayload = () => {
        const permissions: string[] = [];
        Object.entries(permissionsState).forEach(([resource, actions]) => {
            Object.entries(actions).forEach(([action, enabled]) => {
                if (enabled) permissions.push(`${resource}:${action}`);
            });
        });
        return { roleCode: role.roleName, permissions };
    };

    const handleSavePermissions = async () => {
        try {
            setSaving(true);
            const payload = buildPermissionsPayload();
            const response = await actualizarRolesPermisosAction(payload.roleCode, payload.permissions);
            if (response.success) {
                showToast(response.message, "success");
                await onUpdateRolePermissions(payload.roleCode, payload.permissions);
            } else {
                showToast(response.message, "error");
            }
        } catch (error) {
            console.log(error);
            showToast("Ocurrió un error inesperado al guardar cambios", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            {toast.show && (
                <CustomToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                />
            )}

            {/* Back button — solo visible en mobile/tablet */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="lg:hidden flex items-center gap-2 text-sm text-blue-500 font-medium mb-4 hover:text-blue-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a roles
                </button>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-blue-500 shrink-0" />
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                            Editando permisos de: <span className="text-blue-500">{role.roleName}</span>
                        </h3>
                    </div>
                    <p className="text-sm text-gray-500">Administra las acciones que puede desarrollar este rol</p>
                </div>

                <div className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 self-start sm:self-auto whitespace-nowrap">
                    <p className="text-sm font-medium text-emerald-700">
                        ✓ {enabledPermissions} / {totalPermissions} permissions
                    </p>
                </div>
            </div>

            {/* Save button */}
            <div className="mb-4">
                <ButtonComponent onClick={() => handleSavePermissions()} disabled={saving} icon={Save}>
                    {saving ? "Guardando..." : "Guardar cambios"}
                </ButtonComponent>
            </div>

            {/* Search + Expand all */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search permissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#EEF3FD] rounded-lg bg-[#FDFDFD] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={expandAll}
                    className="text-blue-500 text-sm font-medium flex items-center gap-1 hover:text-blue-700 transition-colors self-start sm:self-auto"
                >
                    <ChevronUp className="w-4 h-4" />
                    Expand all
                </button>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                {filteredCategories.map(([resource, actions]) => {
                    const category = PERMISSION_CATEGORIES[resource];
                    const isExpanded = expandedCategories.has(resource);

                    return (
                        <div key={resource} className="border border-[#EEF3FD] rounded-lg bg-[#FDFDFD]">
                            <button
                                onClick={() => toggleCategory(resource)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-lg text-[#3272EB] bg-[#E5EEFD] p-2 rounded-lg shrink-0">{category?.icon}</span>
                                    <div className="text-left min-w-0">
                                        <h4 className="font-bold text-gray-900 truncate">{category?.label}</h4>
                                        <p className="text-sm text-gray-500 truncate">{category?.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                    <span className="text-sm text-gray-500 hidden sm:inline">
                                        {Object.values(actions).filter(Boolean).length} permission{Object.values(actions).filter(Boolean).length !== 1 ? "s" : ""}
                                    </span>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="border-t border-[#EEF3FD] px-4 py-3 space-y-3 bg-white">
                                    {Object.entries(actions).map(([action, enabled]) => (
                                        <div key={action} className="flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                                    {resource}:{action}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Permission for {resource}
                                                </p>
                                            </div>

                                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                <input
                                                    type="checkbox"
                                                    checked={enabled}
                                                    onChange={() => togglePermission(resource, action)}
                                                    className="sr-only peer"
                                                />
                                                <div className="
                                                    w-11 h-6
                                                    bg-gray-200
                                                    rounded-full
                                                    transition-colors
                                                    peer-checked:bg-blue-600
                                                    peer-checked:after:translate-x-full
                                                    after:content-['']
                                                    after:absolute
                                                    after:top-[2px]
                                                    after:left-[2px]
                                                    after:bg-white
                                                    after:border
                                                    after:rounded-full
                                                    after:h-5
                                                    after:w-5
                                                    after:transition-all
                                                " />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function DeleteRoleModal({
    open, role, onCancel, onConfirm, loading,
}: {
    open: boolean;
    role: ViewRolesPermisos | null;
    onCancel: () => void;
    onConfirm: () => void;
    loading: boolean;
}) {
    if (!open || !role) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="absolute inset-0" onClick={onCancel} />

            <div
                className="relative w-full max-w-md rounded-2xl border shadow-lg"
                style={{
                    background: "#FFFFFF",
                    borderColor: "#EAF1FC",
                    boxShadow: "0px 8px 30px rgba(31, 105, 231, 0.08)",
                }}
            >
                <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: "#EAF1FC" }}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full" style={{ background: "#FFF0F0", color: "#E55353" }}>
                            <AlertTriangle size={18} />
                        </div>
                        <h2 className="text-lg font-semibold" style={{ color: "#1A2340" }}>
                            Eliminar rol
                        </h2>
                    </div>
                    <button onClick={onCancel} className="p-2 rounded-lg hover:bg-[#EFF4FE] transition">
                        <X size={18} style={{ color: "#6B778C" }} />
                    </button>
                </div>

                <div className="p-5">
                    <p className="text-sm leading-relaxed" style={{ color: "#6B778C" }}>
                        ¿Seguro que deseas eliminar el rol{" "}
                        <span className="font-semibold" style={{ color: "#1A2340" }}>
                            {role.roleName}
                        </span>
                        ? Esta acción no se puede deshacer.
                    </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-5 border-t" style={{ borderColor: "#EAF1FC" }}>
                    <button
                        onClick={onCancel}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg transition"
                        style={{ color: "#6B778C", background: "#FFFFFF", border: "1px solid #DDE3F0" }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                        style={{ background: "#E55353", color: "#FFFFFF" }}
                    >
                        <Trash2 size={16} />
                        {loading ? "Eliminando..." : "Eliminar rol"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ControlRolesPermisosPage() {
    const [data, setData] = useState<ViewRolesPermisos[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<ViewRolesPermisos | null>(null);
    const [allPermissions, setAllPermissions] = useState<string[]>([]);
    const [openCreateRoleModal, setOpenCreateRoleModal] = useState(false);

    // En mobile/tablet, controla si se muestra el panel de permisos
    const [showPermissionsPanel, setShowPermissionsPanel] = useState(false);

    const [showAllRoles, setShowAllRoles] = useState(false);
    const visibleRoles = showAllRoles ? data : data.slice(0, 3);

    const [roleToDelete, setRoleToDelete] = useState<ViewRolesPermisos | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
        show: false, message: "", type: "success",
    });

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type });
    };

    const handleDeleteRole = async () => {
        if (!roleToDelete) return;
        try {
            setDeleting(true);
            const res = await eliminarRolAction(roleToDelete.roleName);
            if (res.success) {
                showToast(res.message, "success");
                setData((prev) => prev.filter((r) => r.roleName !== roleToDelete.roleName));
                if (selectedRole?.roleName === roleToDelete.roleName) {
                    setSelectedRole(null);
                    setShowPermissionsPanel(false);
                }
                setShowDeleteModal(false);
                setRoleToDelete(null);
            } else {
                showToast(res.message, "error");
            }
        } catch (error) {
            console.log(error);
            showToast("Error al eliminar rol", "error");
        } finally {
            setDeleting(false);
        }
    };

    const loadRoles = async () => {
        setLoading(true);
        const res = await listarRolesPermisosAction();
        if (res.success) {
            setData(res.data ?? []);
            if (res.data && res.data.length > 0) {
                setSelectedRole(res.data[0]);
            }
        }
        const permissionsRes = await listarTodosLosPermisosAction();
        setAllPermissions(permissionsRes.map((permission) => permission.name));
        setLoading(false);
    };

    useEffect(() => {
        loadRoles();
    }, []);

    const handleLocalRoleUpdate = (roleCode: string, permissions: string[]) => {
        setData((prev) =>
            prev.map((role) => role.roleName === roleCode ? { ...role, permissions } : role)
        );
        setSelectedRole((prev) =>
            prev?.roleName === roleCode ? { ...prev, permissions } : prev
        );
    };

    const handleSelectRole = (role: ViewRolesPermisos) => {
        setSelectedRole(role);
        setShowPermissionsPanel(true); // en mobile navega al panel
    };

    if (loading) {
        return <p>Cargando datos...</p>;
    }

    return (
        <div className="w-full">
            <h1 className="text-2xl sm:text-[30px] font-bold">Roles & Permisos</h1>
            <p className="text-base text-gray-500">Administra el control de los permisos asignados a los roles</p>

            {/*
                Layout responsivo:
                - Mobile/Tablet (<lg): columna única, alterna entre lista de roles y panel de permisos
                - Desktop (lg+): grid side-by-side 2fr + 4fr
            */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_5fr] gap-4">

                {/* Panel izquierdo: Lista de roles
                    En mobile, se oculta cuando se muestra el panel de permisos */}
                <div className={`${showPermissionsPanel ? "hidden lg:block" : "block"}`}>
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg sm:text-[20px] font-bold text-gray-900">Roles</h2>
                            <ButtonComponent
                                variant="ghostBlue"
                                icon={Plus}
                                onClick={() => setOpenCreateRoleModal(true)}
                                className="w-auto"
                            >
                                Nuevo rol
                            </ButtonComponent>
                        </div>

                        <div className="space-y-3">
                            {visibleRoles.map((role) => (
                                <div
                                    key={role.roleName}
                                    onClick={() => handleSelectRole(role)}
                                    className={`w-full p-4 border rounded-lg transition-all cursor-pointer relative ${selectedRole?.roleName === role.roleName
                                        ? "border-blue-400 bg-blue-50"
                                        : "border-[#EEF3FD] bg-[#FDFDFD] hover:shadow-md"
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="mt-1 shrink-0">
                                                {role.roleName === "ADMIN" && <Shield className="w-6 h-6 text-blue-500" />}
                                                {role.roleName === "OPERATOR" && <Zap className="w-6 h-6 text-emerald-500" />}
                                                {role.roleName === "RECEPTIONIST" && <Users className="w-6 h-6 text-orange-500" />}
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <h3 className="font-bold text-gray-900 truncate">{role.roleName}</h3>
                                                <p className="text-sm text-gray-500 truncate">{role.description}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0 ml-2">
                                            {/* Flecha en mobile para indicar navegación */}
                                            <ChevronRight className="w-4 h-4 text-gray-300 lg:hidden" />

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setRoleToDelete(role);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            {data.length > 3 && (
                                <button
                                    onClick={() => setShowAllRoles(!showAllRoles)}
                                    className="text-blue-500 text-sm font-medium flex items-center gap-1 hover:text-blue-700 transition-colors"
                                >
                                    {showAllRoles ? "Ver menos" : "Ver todos los roles"}
                                    <ChevronRight
                                        className={`w-4 h-4 transition-transform ${showAllRoles ? "rotate-90" : ""}`}
                                    />
                                </button>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Panel derecho: Editor de permisos
                    En mobile, se muestra cuando se selecciona un rol */}
                <div className={`${showPermissionsPanel ? "block" : "hidden lg:block"}`}>
                    <Card>
                        {selectedRole ? (
                            <PermissionsEditor
                                role={selectedRole}
                                allPermissions={allPermissions}
                                onUpdateRolePermissions={handleLocalRoleUpdate}
                                onBack={() => setShowPermissionsPanel(false)}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-64 lg:h-96">
                                <p className="text-gray-500 text-sm text-center px-4">
                                    Selecciona un rol para ver sus permisos
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <CreateRoleModal
                open={openCreateRoleModal}
                onClose={() => setOpenCreateRoleModal(false)}
                onSuccess={loadRoles}
            />

            <DeleteRoleModal
                open={showDeleteModal}
                role={roleToDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setRoleToDelete(null);
                }}
                onConfirm={handleDeleteRole}
                loading={deleting}
            />

            {toast.show && (
                <CustomToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                />
            )}
        </div>
    );
}