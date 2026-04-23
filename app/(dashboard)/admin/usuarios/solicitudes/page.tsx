'use client'
import ButtonComponent from "@/components/ui/ButtonComponent";
import Card from "@/components/ui/Card";
import DataTable, {ColumnInterface } from "@/components/ui/DataTable";
import EditUserModal from "@/components/ui/ModalDetalles";
import { Download, FunnelPlus, ListFilterPlus, Plus } from "lucide-react";
import { useState } from "react";


export default function UsuariosSolicitudesPage()  {
    const [selectedAction, setSelectedAction] = useState("");
    const [verDetalles, setVerDetalles] = useState<boolean>(false)


    
const data = [
  {
    id: "#1001",
    nombre: "Ana Martínez",
    correo: "ana@empresa.com",
    estado: "Pendiente",
    ultimo_acceso: "21/05/2025 10:24"

  },
  {
    id: "#1002",
    nombre: "Juan Rodríguez",
    correo: "juan@empresa.com",
    estado: "Pendiente",
    ultimo_acceso: "21/05/2025 10:24"
  },
];

const columns: ColumnInterface[] = [
   {
    key: "id",
    label: "ID-CUS",
    type: "text",
  },
    {
    key: "nombre",
    label: "Nombre",
    type: "avatarName",
  },
  {
    key: "correo",
    label: "Correo",
      type: "text",
    
  },
  {
    key: "estado",
    label: "Estado",
    type: "status",
  },
    {
    key: "ultimo_acceso",
    label: "Ultimo acceso",
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
      {
        label: "Eliminar",
        variant: "delete",
        onClick: (row) => {
             setSelectedAction(`ACTION / ELIMINAR → ${row.nombre}`);
          
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
                    <EditUserModal 
                    isOpen={verDetalles}
          onClose={() => setVerDetalles(false)}
          initialData={mockData || undefined} // Pasamos los datos actuales
          onSave={handleSave} // Pasamos la función de guardado
          titleModal="Asignar permiso"
          descriptionModal="Actualiza la información personal."
          />
                )}
               <DataTable  
               columns={columns}
               data={data}/>
              </Card>
        </div>
    )
}