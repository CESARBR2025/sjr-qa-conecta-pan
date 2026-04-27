'use client'
import { Clock, MailCheck, ShieldAlert } from "lucide-react";

export default function PendingApprovalPage() {
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
                    <div className="w-14 h-14 rounded-full bg-[#FEFAF1] flex items-center justify-center border border-[#FEF5E5]">
                        <Clock className="w-7 h-7 text-[#FB933D]" />
                    </div>
                </div>

                {/* TITLE */}
                <div className="space-y-2">
                    <h1 className="text-[22px] font-semibold text-[#1A2340]">
                        Cuenta en revisión
                    </h1>

                    <p className="text-[14px] text-[#6B778C]">
                        Tu cuenta fue creada correctamente y tu correo ha sido verificado.
                    </p>
                </div>

                {/* STATUS BOX */}
                <div className="bg-[#FAFBFF] border border-[#EAF1FC] rounded-xl p-4 space-y-3 text-[13px] text-left">

                    <div className="flex items-center gap-2 text-[#1A2340]">
                        <MailCheck className="w-4 h-4 text-[#22A06B]" />
                        <span>Correo verificado correctamente</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#1A2340]">
                        <ShieldAlert className="w-4 h-4 text-[#FB933D]" />
                        <span>Pendiente de aprobación por administrador</span>
                    </div>

                </div>

                {/* INFO TEXT */}
                <p className="text-[12px] text-[#8A96B0] leading-relaxed">
                    Un administrador revisará tu solicitud y te asignará los permisos correspondientes.
                    Recibirás un correo cuando tu cuenta sea activada.
                </p>

                {/* FOOTER STATUS */}
                <div className="pt-2 flex justify-center">
                    <div className="inline-flex items-center gap-2 text-[12px] text-[#B76A1E] bg-[#FFF4E8] px-3 py-1 rounded-full border border-[#FEF5E5]">
                        <span className="w-2 h-2 bg-[#FB933D] rounded-full animate-pulse" />
                        En espera de aprobación
                    </div>
                </div>

            </div>
        </div>
    );
}