import { TablaUsuarios } from "@/components/tabla-usuarios";

export default function UsuariosPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Sistema de Usuarios</h1>
      <p className="text-muted-foreground mb-6">
        Haz clic en cualquier usuarios para ver sus detalles completos, 
        editarlo o eliminarlo. Para crear un nuevo usuarios, usa el botón 
        Nueva Usuarios.
      </p>
      <TablaUsuarios/>
    </main>
  );
}