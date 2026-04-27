import { MailCheck } from "lucide-react";

export default function CheckEmailPage() {
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
                    <div className="w-14 h-14 rounded-full bg-[#F0F4FF] flex items-center justify-center">
                        <MailCheck className="w-7 h-7 text-[#1F69E7]" />
                    </div>
                </div>

                {/* TITLE */}
                <h1 className="text-[22px] font-semibold text-[#1A2340]">
                    Revisa tu correo
                </h1>

                {/* DESCRIPTION */}
                <p className="text-[14px] text-[#6B778C] leading-relaxed">
                    Te enviamos un enlace de verificación.
                    <br />
                    Haz clic en el enlace para activar tu cuenta.
                </p>

                {/* INFO BOX */}
                <div className="bg-[#F0F4FF] text-[#1F69E7] text-[13px] p-3 rounded-xl border border-[#E8EDFA]">
                    Si no lo encuentras, revisa tu carpeta de spam.
                </div>

                {/* BUTTON */}
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

            </div>
        </div>
    );
}