"use client";

import { Clock, MailCheck, ShieldAlert } from "lucide-react";

export default function PendingApprovalPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center space-y-6">

                {/* ICONO */}
                <div className="flex justify-center">
                    <div className="bg-yellow-100 p-4 rounded-full">
                        <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                </div>

                {/* TITULO */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Cuenta en revisión
                    </h1>

                    <p className="text-gray-600 text-sm">
                        Tu cuenta fue creada correctamente y tu correo ha sido verificado.
                    </p>
                </div>

                {/* ESTADO */}
                <div className="bg-gray-50 border rounded-xl p-4 space-y-3 text-sm text-left">

                    <div className="flex items-center gap-2">
                        <MailCheck className="w-4 h-4 text-green-500" />
                        <span>Correo verificado correctamente</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-yellow-500" />
                        <span>Pendiente de aprobación por administrador</span>
                    </div>

                </div>

                {/* INFO */}
                <p className="text-xs text-gray-500 leading-relaxed">
                    Un administrador revisará tu solicitud y te asignará los permisos correspondientes.
                    Recibirás un correo cuando tu cuenta sea activada.
                </p>

                {/* FOOTER STATUS */}
                <div className="pt-2">
                    <div className="inline-flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                        En espera de aprobación
                    </div>
                </div>

            </div>
        </div>
    );
}