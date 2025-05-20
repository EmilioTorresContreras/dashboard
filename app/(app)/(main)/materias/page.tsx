import { TablaMaterias } from "@/components/tabla-materias";


export default function MateriasPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Sistema de Materias</h1>
      <p className="text-muted-foreground mb-6">
        Haz clic en cualquier materia para ver sus detalles completos, 
        editarlo o eliminarlo. Para crear un nuevo materia, usa el botón 
        Nuevo Materia.
      </p>
      <TablaMaterias />
    </main>
  );
}