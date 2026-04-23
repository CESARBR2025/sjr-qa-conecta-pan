import BottomNav from "@/components/sideBar/BottomNav";
import Header from "@/components/sideBar/Header";
import Sidebar from "@/components/sideBar/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F0F4FF] overflow-hidden">
      {/* Sidebar visible en md+ */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header fijo SIEMPRE visible */}
        <Header />

        {/* Contenido con scroll */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom nav SOLO móvil */}
      <BottomNav />
    </div>
  );
}