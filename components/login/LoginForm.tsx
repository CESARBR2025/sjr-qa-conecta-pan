'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';
import {
  Mail,
  ArrowUpRight,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  Loader2,
  UserRoundCheck,
} from 'lucide-react';



export default function LoginForm() {
  const router = useRouter();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [, setShakeError] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    if (error) {
      setShakeError(true);
      const t = setTimeout(() => setShakeError(false), 400);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
        credentials: 'include', // 🔥 ESTO ES CLAVE
      });
      const data = await res.json();
      console.log(data)

      if (!data.ok) {
        console.log("entro")
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      console.log(data.user)
      //Guardar el token en local storage
      localStorage.setItem('user', JSON.stringify(data.user))

      //Redireccionar segun rol
      router.push(data.redirectTo)


    } catch {
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (

    <main className="h-screen w-full flex flex-col lg:flex-row overflow-hidden">

      <section className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="flex items-center gap-3 sm:gap-4 p-3 sm:p-2">

          {/* LEFT */}
          <div className="flex items-center gap-2">
            <Image src="/whats.svg" alt="Logo PAN" width={40} height={40}
              className="w-[24px] h-[24px] sm:w-[36px] sm:h-[36px] lg:w-[30px] lg:h-[30px]" />
            <p className="text-[12px] sm:text-[14px] lg:text-[18px] font-bold">Conecta PAN</p>
          </div>

          {/* DIVIDER */}
          <div className="h-4 w-px bg-gray-300" />

          {/* RIGHT */}
          <div className="text-[12px] sm:text-[14px] lg:text-[18px]  text-gray-500">
            API Platform
          </div>

        </header>

        {/* CONTENT */}
        <div className="flex-1 flex justify-center items-start sm:items-center pt-4 sm:pt-8 lg:pt-0 px-4 sm:px-8 pb-8">

          <div className="w-full max-w-sm sm:max-w-md flex flex-col bg-white rounded-2xl shadow-md p-5 sm:p-8 border border-gray-100">

            <div className="flex flex-col">
              {/* TITLE */}
              <h1 className="text-[26px] sm:text-[36px] font-bold text-center mb-3 sm:mb-6">
                ¡Hola!
              </h1>

              <h2 className="text-[15px] sm:text-[18px] text-center mb-2 sm:mb-4">
                Que bueno verte de nuevo
              </h2>

              <h3 className="text-[10px] sm:text-[12px] text-center mb-6 sm:mb-8 tracking-normal text-gray-500">
                Ingresa tus datos para iniciar sesión
              </h3>
            </div>

            {/* CARD */}
            <div className="w-full flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 lg:space-y-10">

                {/* EMAIL */}
                <div>
                  <label className="ml-2 text-xs font-semibold text-[#6B7A93] uppercase tracking-[0.12em]">
                    Correo
                  </label>

                  <div className="relative group mt-2">
                    <UserRoundCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AABB] group-focus-within:text-[#2E86AB]" size={16} />
                    <input
                      type="text"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                      placeholder="juanjose@gmail.com"
                      className="w-full rounded-xl border border-[#E4E8EF] bg-[#F8FAFC] py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#2E86AB] focus:bg-white focus:ring-4 focus:ring-[#2E86AB]/10 transition"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs ml-2 font-semibold text-[#6B7A93] uppercase tracking-[0.12em]">
                      Contraseña
                    </label>
                    <a className="text-[11px] text-[#2E86AB] hover:underline cursor-pointer">
                      ¿Olvidaste Contraseña?
                    </a>
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AABB] group-focus-within:text-[#2E86AB]" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-[#E4E8EF] bg-[#F8FAFC] py-3.5 pl-11 pr-12 text-sm outline-none focus:border-[#2E86AB] focus:bg-white focus:ring-4 focus:ring-[#2E86AB]/10 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0AABB]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-xl p-3">
                    {error}
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-3.5
                  font-semibold text-sm sm:text-md text-white
                   bg-gradient-to-br from-[#1F69E7] to-[#3E83F0] 
                   flex items-center justify-center shadow-[0_3px_10px_rgba(31,105,231,0.3)] 
                   cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    "Iniciar sesión"
                  )}
                </button>

                {/* DIVIDER OR */}
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px bg-[#E4E8EF]" />
                  <span className="text-[10px] sm:text-[11px] text-gray-500 
                  uppercase tracking-wider whitespace-nowrap">
                    OR
                  </span>
                  <div className="flex-1 h-px bg-[#E4E8EF]" />
                </div>

                {/* CREATE ACCOUNT */}
                <button
                  type="button"
                  onClick={() => router.push("/login/register")}
                  className="w-full rounded-xl py-3.5
                   font-semibold text-sm sm:text-md border border-[#DDE3F0]
                    text-[#1F69E7] bg-white hover:bg-[#EFF4FE] transition-all
                     cursor-pointer"
                >
                  Crear cuenta nueva
                </button>



              </form>
            </div>

          </div>
        </div>

      </section>

      {/* ─── Right panel ─── */}
      <section className="hidden lg:flex flex-1 relative items-center justify-center bg-white overflow-hidden">

        <div
          className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] bg-white border border-blue-500 opacity-80 z-10"
          style={{ clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)" }}
        />
        <div
          className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] bg-orange-400 opacity-90 z-20 shadow-2xl"
          style={{ clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)" }}
        />
        <div
          className="absolute bottom-[-150px] left-[-120px] w-[420px] h-[420px] bg-blue-300 opacity-60 z-0 blur-sm"
          style={{ clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)" }}
        />
        <div
          className="absolute bottom-[-100px] left-[-90px] w-[320px] h-[320px] bg-blue-400 opacity-70 z-30"
          style={{ clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)" }}
        />

        <div className="relative z-40 flex flex-col items-center justify-center text-center px-6 max-w-lg mx-auto">
          <h1 className="text-3xl xl:text-5xl font-bold text-gray-900 leading-tight space-y-2">
            <span className="block">Conecta</span>
            <span className="block">Afiliados <span className="text-blue-500 mx-2">⌒</span></span>
            <span className="block">en Campaña<span className="text-orange-400 ml-1">●</span></span>
          </h1>
        </div>

      </section>

    </main>
  );
}
