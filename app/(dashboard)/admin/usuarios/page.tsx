import Card from "@/components/ui/Card";

export default function UsuariosPage() {
  return (
    <div>
      <h1>Hola usuarios page</h1>
      {/* Card principal */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">
          Card principal
        </h2>

        <p className="text-gray-600 mb-4">
          Aquí puedes meter cualquier contenido.
        </p>

        {/* Card dentro de otra Card */}
        <Card className="bg-[#F8FAFF]">
          <h3 className="font-medium">
            Esta es una card dentro de otra card
          </h3>

          <p className="text-sm text-gray-500">
            Totalmente reutilizable
          </p>
        </Card>
      </Card>
    </div>
  )
}