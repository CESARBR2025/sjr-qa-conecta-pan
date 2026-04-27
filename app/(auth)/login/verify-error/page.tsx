import { AlertTriangle, MailX, Clock } from "lucide-react";

export default function VerifyErrorPage({
    searchParams,
}: {
    searchParams: { reason?: string };
}) {
    const reason = searchParams.reason;

    const config = {
        missing_token: {
            icon: MailX,
            title: "Falta el token de verificación",
            message:
                "El enlace no contiene un token válido.",
        },
        invalid_or_expired: {
            icon: Clock,
            title: "El enlace expiró o no es válido",
            message:
                "El enlace ya expiró o no es válido.",
        },
        test_error: {
            icon: AlertTriangle,
            title: "Error de prueba",
            message:
                "Este es un error de desarrollo.",
        },
        default: {
            icon: AlertTriangle,
            title: "Error de verificación",
            message:
                "Ocurrió un error inesperado.",
        },
    };

    const current =
        config[reason as keyof typeof config] || config.default;

    const Icon = current.icon;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center space-y-6">

                <div className="flex justify-center">
                    <div className="bg-red-100 p-4 rounded-full">
                        <Icon className="w-8 h-8 text-red-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                    {current.title}
                </h1>

                <p className="text-gray-600 text-sm">
                    {current.message}
                </p>

                <div className="space-y-3 pt-2">
                    <a
                        href="/login"
                        className="block w-full bg-black text-white py-3 rounded-xl text-sm font-medium"
                    >
                        Volver al login
                    </a>

                    <a
                        href="/login/register"
                        className="block w-full border border-gray-300 py-3 rounded-xl text-sm font-medium"
                    >
                        Crear cuenta
                    </a>
                </div>

            </div>
        </div>
    );
}