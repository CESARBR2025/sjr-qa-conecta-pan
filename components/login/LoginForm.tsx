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

  const [curp, setCurp] = useState('');
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
        body: JSON.stringify({ curp, password }),
        credentials: 'include', // 🔥 ESTO ES CLAVE
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error al iniciar sesión');
        return;
      }

      //Guardar el token en local storage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', data.user)

      //Redireccionar segun rol
      router.push(data.redirectTo)

      
    } catch {
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="h-screen w-full flex overflow-hidden">
  
    <section className="flex-1 flex w-full flex flex-col overflow-hidden">

  {/* HEADER */}
 <header className="flex items-center gap-4 p-4">

  {/* LEFT */}
  <div className="flex items-center ">
    <Image src="/whats.svg" alt="Logo PAN"  width={60} height={60}
      className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px]" />

    <p className="text-sm sm:text-xl lg:text-2xl font-bold ">Conecta PAN</p>
  </div>

   {/* DIVIDER */}
  <div className="h-4 w-px bg-gray-300" />

  {/* RIGHT */}
  <div className="text-sm sm:text-lg lg:text-xl  text-gray ">
    API Platform
  </div>

</header>

  {/* CONTENT */}
  <div className="flex-1 flex  justify-center items-start pt-6 sm:pt-16 lg:pt-8  p-8 sm:px-4 lg:px-4 ">

    <div className="w-full max-w-md justify-center flex flex-col bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100">

<div className='flex flex-col  '>
   {/* TITLE */}
      <h1 className=" text-2xl font-bold text-[30px] sm:text-[40px]
       text-center mb-6">
        ¡Hola!
      </h1>

     <h1 className=" text-2xl text-[18px] sm:text-[18px]
       text-center mb-6">
        Que bueno verte de nuevo
      </h1>

       <h1 className=" text-2xl text-[10px] sm:text-[12px]
       text-center mb-8 tracking-normal">
        Ingresa tus datos para iniciar sesión
      </h1>
</div>

     

      {/* CARD */}
      
<div className="w-full max-w-md flex flex-col justify-center">
<form onSubmit={handleSubmit} className="space-y-10">

          {/* CURP */}
          <div>
            <label className="text-xs  text-black uppercase   block">
              CURP
            </label>

            <div className="relative group">
              <UserRoundCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AABB] group-focus-within:text-[#2E86AB]" size={16} />

              <input
                type="text"
                value={curp}
                onChange={(e) => setCurp(e.target.value.toUpperCase())}
                maxLength={18}
                required
                placeholder="GOML850101HDFNZL02"
                className="w-full rounded-xl border border-[#E4E8EF] bg-[#F8FAFC] py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#2E86AB] focus:bg-white focus:ring-4 focus:ring-[#2E86AB]/10 transition"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[11px] font-semibold text-[#6B7A93] uppercase tracking-[0.12em]">
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
            className="w-full rounded-xl py-3.5 text-sm 
            font-semibold text-white bg-gradient-to-r from-[#1B4F72] to-[#2E86AB] hover:opacity-90 transition disabled:opacity-60"
          >
             {loading ? (
    <div className='flex justify-center items-center'><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>
      
      
    
  ) : (
    "Iniciar sesión"
  )}
          </button>



 {/* FOOTER */}
  <div className=" flex justify-center">
    
   {/* Support contact */}
        <div className="relative z-10 flex flex-col items-center gap-0 ">
          {/* Trigger row */}
          <div className="flex items-center gap-2.5 w-full max-w-[360px]">
            <div className="flex-1 h-px bg-[#E4E8EF]" />
            <button
              type="button"
              onClick={() => setShowSupport(!showSupport)}
              className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 group"
            >
              <span className="text-[10px] text-gray-500 uppercase tracking-wider whitespace-nowrap
               group-hover:text-[#2E86AB] transition-colors duration-150">
                ¿Problemas para acceder?
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-gray-500 group-hover:text-[#2E86AB] transition-all duration-250
                    ${showSupport ? 'rotate-180' : 'rotate-0'}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="flex-1 h-px bg-[#E4E8EF]" />
          </div>

          {/* Expandable panel */}
          <div
            className={`w-full max-w-[360px] overflow-hidden transition-all duration-300
                ${showSupport ? 'max-h-48 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}
          >
            <a
              href="mailto:sistemas@sanjuandelrio.gob.mx?subject=Solicitud%20de%20soporte%20t%C3%A9cnico%20-%20SSPM&body=Hola%2C%20necesito%20asistencia%20con%20el%20acceso%20al%20sistema."
              className="flex items-center gap-3 w-full px-4 py-3 bg-white
                 border-[1.5px] border-[#E4E8EF] hover:border-[#2E86AB]
                 rounded-[14px] transition-all duration-150 active:scale-[0.98] group
                 no-underline"
              style={{ boxShadow: 'none' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  '0 0 0 4px rgba(46,134,171,0.08)')
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div className="w-[38px] h-[38px] rounded-full bg-[#EAF4FB] flex items-center justify-center shrink-0">
                <Mail size={16} className="text-[#2E86AB]" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#A0AABB] mb-0.5">
                  Soporte técnico · responde en 24 h
                </p>
                <p className="text-[13px] font-semibold text-[#0D2137] truncate">
                  sistemas@sanjuandelrio.gob.mx
                </p>
              </div>
              <ArrowUpRight
                size={14}
                className="text-[#C0C8D4] group-hover:text-[#2E86AB] transition-colors shrink-0"
                strokeWidth={1.8}
              />
            </a>
            <p className="text-[11px] text-[#A0AABB] text-center mt-2 leading-relaxed">
              Se abrirá tu cliente de correo con el{' '}
              <span className="text-[#6B7A93] font-medium">
                asunto prellenado
              </span>
            </p>
          </div>
        </div>


  </div>
          

        </form>
</div>
        
      
    </div>
  </div>

 
 

</section>

          {/* ─── Left panel ─── */}
     
<section className="hidden lg:flex flex-1 relative items-center justify-center bg-[#F4F6FA] overflow-hidden ">

  {/* 🔷 Fondo grande (base) */}
  <div
    className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] bg-white border border-blue-500 opacity-80 z-10"
    style={{
      clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)"
    }}
  />

  

  {/* 🟧 Shape principal (encima) */}
  <div
    className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] bg-orange-400 opacity-90 z-20 shadow-2xl"
    style={{
      clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)"
    }}
  />

  {/* 🔷 Shape secundario (abajo izquierda) */}
  <div
    className="absolute bottom-[-150px] left-[-120px] w-[420px] h-[420px] bg-blue-300 opacity-60 z-0 blur-sm"
    style={{
      clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)"
    }}
  />

  {/* 🔷 Shape pequeño decorativo */}
  <div
    className="absolute bottom-[-100px] left-[-90px] w-[320px] h-[320px] bg-blue-400 opacity-70 z-30"
    style={{
      clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)"
    }}
  />

  {/* ✏️ Contenido */}
  <div className="relative z-40 flex flex-col items-center justify-center text-center px-6 max-w-lg mx-auto">
  
  <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight space-y-2">
    
    <span className="block">Conecta</span>

    <span className="block">
      Afiliados <span className="text-blue-500 mx-2">⌒</span>
    </span>

    <span className="block">
      en Campaña
      <span className="text-orange-400 ml-1">●</span>
    </span>

  </h1>

</div>

</section>
    </main>
  );
}
