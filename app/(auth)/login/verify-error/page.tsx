"use client";

import { useSearchParams } from "next/navigation";
import { AlertTriangle, MailX, Clock } from "lucide-react";

export default function VerifyErrorPage() {
    const params = useSearchParams();
    const reason = params.get("reason");

    const config = {
        missing_token: {
            icon: MailX,
            title: "Falta el token de verificación",
            message:
                "El enlace que utilizaste no contiene un token válido. Solicita uno nuevo desde el registro.",
        },
        invalid_or_expired: {
            icon: Clock,
            title: "El enlace expiró o no es válido",
            message:
                "El enlace de verificación ya no es válido o ha expirado. Por seguridad, los enlaces solo duran 24 horas.",
        },
        test_error: {
            icon: AlertTriangle,
            title: "Error de prueba",
            message:
                "Este es un error generado en entorno de desarrollo para pruebas de interfaz.",
        },
        default: {
            icon: AlertTriangle,
            title: "No se pudo verificar la cuenta",
            message:
                "Ocurrió un error inesperado durante la verificación. Intenta nuevamente o solicita un nuevo enlace.",
        },
    };

    const current =
        config[reason as keyof typeof config] || config.default;

    const Icon = current.icon;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center space-y-6">

                {/* ICONO */}
                <div className="flex justify-center">
                    <div className="bg-red-100 p-4 rounded-full">
                        <Icon className="w-8 h-8 text-red-600" />
                    </div>
                </div>

                {/* TITULO */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {current.title}
                    </h1>

                    <p className="text-gray-600 text-sm">
                        {current.message}
                    </p>
                </div>

                {/* ACCIONES */}
                <div className="space-y-3 pt-2">

                    <a
                        href="/login"
                        className="block w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Volver al inicio de sesión
                    </a>

                    <a
                        href="/login/register"
                        className="block w-full border border-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
                    >
                        Crear nueva cuenta
                    </a>

                </div>

                {/* FOOTER */}
                <p className="text-xs text-gray-400 pt-2">
                    Si el problema persiste, contacta al administrador del sistema.
                </p>

            </div>
        </div>
    );
}