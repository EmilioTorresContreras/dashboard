"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Ban, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBreadcrumbStore } from "@/app/stores/breadcrumbStore";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "./dialogues/confirm-dialog";
import { Usuario } from "@/types/usuario";
import { toast } from "sonner";

export function TablaUsuarios() {
  const router = useRouter();
  const usuarios = useQuery(api.usuarios.obtenerUsuarios);
  const setItems = useBreadcrumbStore(state => state.setItems)

  const eliminarUsuario = useAction(api["usersActions"].eliminarUsuario);
  const actualizarEstadoUsuario = useMutation(api.usuarios.actualizarEstadoUsuario);

  const [showDialog, setShowDialog] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogDescription, setDialogDescription] = useState<React.ReactNode>("")
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => { })

  useEffect(() => {
    setItems([
      { label: 'Escuela Limón', href: '/' },
      { label: 'Usuarios', href: '/usuarios', isCurrentPage: true },
    ])
  }, [setItems])

  if (usuarios === undefined) {
    return <div>Cargando usuarios...</div>;
  }

  const handleVerUsuario = (id: string) => {
    router.push(`/usuarios/${id}`);
  };

  const handleCrear = () => {
    router.push("/usuarios/create");
  };

  const handleEstado = async (usuario: Usuario) => {
    setDialogTitle(`¿Estás seguro de ${usuario?.activo == true ? "inhabilitar" : "activar"} al usuario ${usuario?.nombre} ${usuario?.apellido} - ${usuario?.rol} ?`)
    setDialogDescription(
      "Esta acción no es permanente."
    )
    if (!usuario) return;
    setOnConfirmAction(() => async () => {
      try {
        await actualizarEstadoUsuario({ usuarioId: usuario._id, activo: !usuario.activo });
        toast.success("Acción realizada exitosamente");
      } catch (error) {
        toast.error("Error", { description: `Ocurrió un error. ${error}` });
      }
      setShowDialog(false)
    })
    setShowDialog(true)
  };

  const handleDelete = async (usuario: Usuario) => {
    setDialogTitle(`¿Estás seguro de eliminar al usuario ${usuario?.nombre} ${usuario?.apellido} - ${usuario?.rol} ?`)
    setDialogDescription(
      "Esta acción no se puede deshacer."
    )
    if (!usuario) return;
    setOnConfirmAction(() => async () => {
      try {
        await eliminarUsuario({ usuarioId: usuario._id, clerkId: usuario.clerkId });
        toast.success("Usuario eliminado exitosamente");
      } catch (error) {
        toast.error("Error", { description: `Ocurrió un error al eliminar el usuario. ${error}` });
      }
      setShowDialog(false)
    })
    setShowDialog(true)
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Usuarios</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <Table>
        <TableCaption>Lista de usuarios registrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nomber Completo</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estatus</TableHead>
            <TableHead>Fecha Creación</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay usuarios registrados
              </TableCell>
            </TableRow>
          ) : (
            usuarios.map((usuario) => (
              <TableRow key={usuario._id}>
                <TableCell
                className="font-medium cursor-pointer hover:bg-muted/50"
                onClick={() => handleVerUsuario(usuario._id)}>
                  {usuario.nombre} {usuario.apellido}
                </TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.rol}</TableCell>
                <TableCell>{usuario.activo ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>{new Date(usuario.fechaCreacion).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-row justify-center items-center gap-1">
                    <Button
                      className="cursor-pointer hover:bg-red-600"
                      size="sm"
                      onClick={async () =>  handleEstado(usuario)}
                    >
                      <Ban />
                    </Button>
                    <Button
                      variant="destructive"
                      className="cursor-pointer hover:bg-black"
                      size="sm"
                      onClick={async () => handleDelete(usuario)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <ConfirmDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title={dialogTitle}
        description={dialogDescription}
        onCancel={() => setShowDialog(false)}
        onConfirm={onConfirmAction}
      />
    </div>
  );
}