'use client'
import ButtonComponent from "@/components/ui/ButtonComponent";
import Card from "@/components/ui/Card";
import DataTable, {ColumnInterface } from "@/components/ui/DataTable";
import AsignarRoleModal from "@/components/ui/AsignarRolModal";

import { listarUsuariosPendientesAction } from "@/modules/users/services/users.server";
import { UsersService } from "@/modules/users/services/users.service";
import { ViewUsersAsigarRol } from "@/modules/users/types/users.types";
import { Download, FunnelPlus, ListFilterPlus, Plus } from "lucide-react";
import { convertServerPatchToFullTree } from "next/dist/client/components/segment-cache/navigation";
import { useEffect, useState } from "react";


export default   function UsuariosSolicitudesPage()  {
    
    const [verDetalles, setVerDetalles] = useState<boolean>(false)
    const [data, setData] = useState<ViewUsersAsigarRol[]>([]);
    const [loading, setLoading] = useState(true);


const loadUsers = async () => {
  setLoading(true);

  const res = await listarUsuariosPendientesAction();

  if (res.success) {
    setData(res.data ?? []);
  }

  setLoading(false);
};

useEffect(() => {
  loadUsers();
}, []);

console.log(data)



if (loading) {
  return <p>Cargando datos...</p>; // o un loader
}
    

const columns: ColumnInterface[] = [
   {
    key: "idCus",
    label: "ID-CUS",
    type: "text",
  },
    {
    key: "nombreUsuario",
    label: "Nombre",
    type: "avatarName",
  },
  {
    key: "curp",
    label: "CURP",
      type: "text",
    
  },
  {
    key: "status",
    label: "Estado",
    type: "status",
  },
    {
    key: "ultimoAcceso",
    label: "Ultimo acceso",
    type: "date",
  },
   {
    key: "nombreRol",
    label: "Rol",
    type: "text",
  },
    {
    key: "actions",
    label: "Acciones",
    type: "actions",
    actions: [
      {
        label: "Editar",
        variant: "edit",
        onClick: (row) => {
             setVerDetalles(true);
        },
      },
      
    ],
  },
 
] ;


//Funcion que hace submit del modal
// Función que recibe los datos procesados del modal
  const handleSave = (updatedData: { nombre: string; edad: number }) => {
    console.log("Datos recibidos para guardar:");
    // Aquí harías tu fetch(API) o actualización de estado global
  };

  const mockData = {
  nombre: "Juan Pérez",
  edad: 32
};


    return (
        <div>
        
          <Card>
            <div className="flex justify-between mb-4">
                <div>
                                    <h2 className="text-xl font-semibold mb-4">
                  Nuevas solicitudes
                </h2>
        
                <p className="text-gray-600 mb-4">
                  Gestiona las solicitudes de usuarios nuevos para accesar al sistema
                </p>

             

                </div>
                <div className="flex items-center gap-6 ">
<ButtonComponent variant="primary" icon={Plus}>
  Nuevo usuario
</ButtonComponent>

<ButtonComponent variant="ghost" icon={ListFilterPlus}>
  Filtros
</ButtonComponent>

<ButtonComponent variant="ghost" icon={Download}>
  Exportar
</ButtonComponent>

                </div>

            </div>
        
                {/* Card dentro de otra Card */}

                {verDetalles && (
                    <AsignarRoleModal 
                    isOpen={verDetalles}
          onClose={() => setVerDetalles(false)}
          onSucces={loadUsers}
          initialData={data} // Pasamos los datos actuales
          
          
          
          />
                )}
               <DataTable  
               columns={columns}
               data={data ?? []}/>

              </Card>
        </div>
    )
}