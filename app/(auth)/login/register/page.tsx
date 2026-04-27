"use client";

import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const [nombre, setNombre] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [email, setEmail] = useState("");
    const [curp, setCurp] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //Routerr
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre,
                    apellidoPaterno,
                    apellidoMaterno,
                    email,
                    password,
                    curp
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Ocurrió un error al crear la cuenta");
                return;
            }

            console.log("Registro exitoso:", data);

            // limpiar form
            setNombre("");
            setApellidoPaterno("");
            setApellidoMaterno("");
            setEmail("");
            setPassword("");

        } catch (err) {
            setError("Error de conexión con el servidor");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full max-w-xl mx-auto bg-[#FFFFFF] border 
    border-[#EAF1FC] rounded-[20px] py-4 px-4 sm:px-6 md:px-8 shadow-[0px_8px_30px_rgba(31,105,231,0.04)] mt-2">

            {/* TOP LEFT */}
            <div className="flex flex-col items-start gap-2 mb-2">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex h-10 w-10 items-center justify-center
                 rounded-xl border border-[#DDE3F0]
                  bg-white text-[#1F69E7] hover:bg-[#EFF4FE] transition"
                >
                    <ArrowLeft size={18} />
                </button>

                <img
                    src="/conecta-pan-logo.png"
                    alt="Logo Conecta PAN"
                    className="h-4 w-auto object-contain"
                />
            </div>

            {/* HEADER */}
            <div className="mb-2">
                <p className="text-[20px] sm:text-[22px] md:text-[24px] font-semibold text-[#1A2340] leading-tight">
                    Empieza a usar Conecta PAN
                </p>

                <p className="mt-3 text-[13px] sm:text-[14px] font-semibold text-gray-500 leading-relaxed">
                    Crea una cuenta para gestionar nuevas campañas, visualizar
                    estadísticas y administrar tu operación de forma más eficiente.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">


                {/* NOMBRE */}
                <div>
                    <label className="ml-1 text-[13px] font-medium text-[#8A96B0]">
                        Nombre
                    </label>

                    <div className="relative group mt-2">
                        <User
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A96B0] group-focus-within:text-[#1F69E7] transition"
                        />

                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            placeholder="Juan"
                            className="w-full rounded-xl border border-[#DDE3F0] bg-[#FFFFFF] py-3.5 pl-11 pr-4 text-sm text-[#1A2340] placeholder:text-[#8A96B0] outline-none transition focus:border-[#1F69E7] focus:ring-4 focus:ring-[rgba(31,105,231,0.08)]"
                        />
                    </div>
                </div>



                {/* APELLIDOS */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 sm:justify-between">

                    {/* APELLIDO PATERNO */}
                    <div className="w-full sm:w-1/2">
                        <label className="ml-1 text-[13px] font-medium text-[#8A96B0]">
                            Apellido Paterno
                        </label>

                        <div className="relative group mt-2">
                            <User
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A96B0] group-focus-within:text-[#1F69E7] transition"
                            />

                            <input
                                type="text"
                                value={apellidoPaterno}
                                onChange={(e) => setApellidoPaterno(e.target.value)}
                                required
                                placeholder="Gómez"
                                className="w-full rounded-xl border border-[#DDE3F0] bg-[#FFFFFF] py-3.5 pl-11 pr-4 text-sm text-[#1A2340] placeholder:text-[#8A96B0] outline-none transition focus:border-[#1F69E7] focus:ring-4 focus:ring-[rgba(31,105,231,0.08)]"
                            />
                        </div>
                    </div>

                    {/* APELLIDO MATERNO */}
                    <div className="w-full sm:w-1/2">
                        <label className="ml-1 text-[13px] font-medium text-[#8A96B0]">
                            Apellido Materno
                        </label>

                        <div className="relative group mt-2">
                            <User
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A96B0] group-focus-within:text-[#1F69E7] transition"
                            />

                            <input
                                type="text"
                                value={apellidoMaterno}
                                onChange={(e) => setApellidoMaterno(e.target.value)}
                                required
                                placeholder="López"
                                className="w-full rounded-xl border border-[#DDE3F0] bg-[#FFFFFF] py-3.5 pl-11 pr-4 text-sm text-[#1A2340] placeholder:text-[#8A96B0] outline-none transition focus:border-[#1F69E7] focus:ring-4 focus:ring-[rgba(31,105,231,0.08)]"
                            />
                        </div>
                    </div>
                </div>

                {/* CURP */}
                <div>
                    <label className="ml-1 text-[13px] font-medium text-[#8A96B0]">
                        Curp
                    </label>

                    <div className="relative group mt-2">
                        <User
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A96B0] group-focus-within:text-[#1F69E7] transition"
                        />

                        <input
                            type="text"
                            value={curp}
                            onChange={(e) => setCurp(e.target.value)}
                            required
                            placeholder="LOGJ021102HQTRSSA2"
                            className="w-full rounded-xl border border-[#DDE3F0] bg-[#FFFFFF] py-3.5 pl-11 pr-4 text-sm text-[#1A2340] placeholder:text-[#8A96B0] outline-none transition focus:border-[#1F69E7] focus:ring-4 focus:ring-[rgba(31,105,231,0.08)]"
                        />
                    </div>
                </div>

                {/* EMAIL */}
                <div>
                    <label className="ml-1 text-[13px] font-medium text-[#8A96B0]">
                        Email
                    </label>

                    <div className="relative group mt-2">
                        <Mail
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A96B0] group-focus-within:text-[#1F69E7] transition"
                        />

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="correo@ejemplo.com"
                            className="w-full rounded-xl border border-[#DDE3F0] bg-[#FFFFFF] py-3.5 pl-11 pr-4 text-sm text-[#1A2340] placeholder:text-[#8A96B0] outline-none transition focus:border-[#1F69E7] focus:ring-4 focus:ring-[rgba(31,105,231,0.08)]"
                        />
                    </div>
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="ml-1 text-[13px] font-medium text-[#8A96B0]">
                        Contraseña
                    </label>

                    <div className="relative group mt-2">
                        <Lock
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A96B0] group-focus-within:text-[#1F69E7] transition"
                        />

                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-[#DDE3F0] bg-[#FFFFFF] py-3.5 pl-11 pr-12 text-sm text-[#1A2340] placeholder:text-[#8A96B0] outline-none transition focus:border-[#1F69E7] focus:ring-4 focus:ring-[rgba(31,105,231,0.08)]"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A96B0] hover:text-[#1F69E7] transition"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="rounded-xl border border-[#FEF5E5] bg-[#FEFAF1] p-4 text-sm text-[#FB933D]">
                        {error}
                    </div>
                )}

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl py-3.5 font-semibold text-white bg-[#1F69E7] hover:bg-[#3E83F0] active:bg-[#1857C3] transition flex items-center justify-center shadow-[0px_4px_18px_rgba(31,105,231,0.18)] disabled:bg-[#C7D7F8] disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        "Crear cuenta"
                    )}
                </button>
            </form>
        </section>
    );
}