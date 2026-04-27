import { MailX, Clock, AlertTriangle } from "lucide-react";

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
            message: "El enlace no contiene un token válido.",
            tone: "danger",
        },
        invalid_or_expired: {
            icon: Clock,
            title: "El enlace expiró o no es válido",
            message: "El enlace ya expiró o no es válido.",
            tone: "warning",
        },
        test_error: {
            icon: AlertTriangle,
            title: "Error de prueba",
            message: "Este es un error de desarrollo.",
            tone: "danger",
        },
        default: {
            icon: AlertTriangle,
            title: "Error de verificación",
            message: "Ocurrió un error inesperado.",
            tone: "danger",
        },
    };

    const current =
        config[reason as keyof typeof config] || config.default;

    const Icon = current.icon;

    return (
        <div className="min-h-screen flex items-center justify-center  px-6">

            <div
                className="
                    w-full max-w-md
                    bg-white
                    rounded-[20px]
                    p-8
                    text-center
                    space-y-6
                    border border-[#EAF1FC]
                    shadow-[0px_8px_30px_rgba(31,105,231,0.04)]
                "
            >

                {/* ICON */}
                <div className="flex justify-center">
                    <div
                        className="
                            w-14 h-14 
                            rounded-full 
                            bg-[#FFF0F0] 
                            flex items-center justify-center 
                            border border-[#FFC2C2]
                        "
                    >
                        <Icon className="w-7 h-7 text-[#E55353]" />
                    </div>
                </div>

                {/* TITLE */}
                <h1 className="text-[22px] font-semibold text-[#1A2340]">
                    {current.title}
                </h1>

                {/* MESSAGE */}
                <p className="text-[14px] text-[#6B778C]">
                    {current.message}
                </p>

                {/* ACTIONS */}
                <div className="space-y-3 pt-2">

                    {/* PRIMARY BUTTON */}
                    <a
                        href="/login"
                        className="
                            block w-full
                            bg-[#1F69E7]
                            text-white
                            py-3
                            rounded-xl
                            text-[14px]
                            font-medium
                            hover:bg-[#3E83F0]
                            active:bg-[#1857C3]
                            transition
                        "
                    >
                        Volver al login
                    </a>

                    {/* SECONDARY BUTTON */}
                    <a
                        href="/login/register"
                        className="
                            block w-full
                            bg-white
                            text-[#1F69E7]
                            border border-[#EDF0F6]
                            py-3
                            rounded-xl
                            text-[14px]
                            font-medium
                            hover:bg-[#EFF4FE]
                            transition
                        "
                    >
                        Crear cuenta
                    </a>

                </div>

            </div>
        </div>
    );
}