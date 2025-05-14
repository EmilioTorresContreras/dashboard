import TableCalificaciones from "@/components/tabla_calificaciones";

export default function CalificacionesPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Sistema de Calificaciones</h1>
      <p className="text-muted-foreground mb-6">
        Haz clic en cualquier calificación para ver sus detalles completos, 
        editarlo o eliminarlo. Para crear un nuevo calificación, usa el botón 
        Nuevo Salón.
      </p>
      <TableCalificaciones/>
    </main>
  );
}