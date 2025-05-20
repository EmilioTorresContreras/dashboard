"use client";

import { use, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBreadcrumbStore } from "@/app/stores/breadcrumbStore";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialogues/confirm-dialog";

export default function DetalleUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idUsuario = id as Id<"usuarios">;
    const router = useRouter();
    const usuario = useQuery(api.usuarios.obtenerUsuarioPorId, { id: idUsuario });
    const eliminarUsuario = useMutation(api.usuarios.eliminarUsuario);

    const [showDialog, setShowDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogDescription, setDialogDescription] = useState<React.ReactNode>("")
    const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => { })

    const setItems = useBreadcrumbStore(state => state.setItems)

    useEffect(() => {
        setItems([
            { label: 'Escuela Limón', href: '/' },
            { label: 'Usuarios', href: '/usuarios' },
            { label: `${usuario?.nombre} ${usuario?.apellido}`, isCurrentPage: true },
        ])
    }, [setItems, usuario])

    if (usuario === undefined) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Skeleton className="h-8 w-64" />
                </div>
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <Skeleton className="h-8 w-full mb-2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-24 mr-2" />
                        <Skeleton className="h-10 w-24" />
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold">Usuario no encontrado</h1>
                </div>
                <p>No se pudo encontrar el usuario con el ID proporcionado.</p>
            </div>
        );
    }

    const handleEditar = () => {
        router.push(`/usuarios/${id}/edit`);
    };

    const handleDelete = async () => {
        setDialogTitle(`¿Estás seguro de eliminar al usuario ${usuario?.nombre} ${usuario?.apellido} - ${usuario?.rol} ?`)
        setDialogDescription(
            "Esta acción no se puede deshacer."
        )
        if (!usuario) return;
        setOnConfirmAction(() => async () => {
            try {
                await eliminarUsuario({ usuarioId: usuario._id });
                router.push(`/usuarios`);
                toast.success("Usuario eliminado exitosamente");
            } catch (error) {
                toast.error("Error", { description: `Ocurrió un error al eliminar el usuario. ${error}` });
            }
            setShowDialog(false)
        })
        setShowDialog(true)
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold">Detalle del Usuario</h1>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl">
                            {usuario.nombre} {usuario.apellido} - {usuario.rol}
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleEditar}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDelete()}
                                className="text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Nombre</h3>
                        <div className="p-2 bg-muted rounded-md">{usuario.nombre}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Apellido</h3>
                        <div className="p-2 bg-muted rounded-md">{usuario.apellido}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Correo Electrónico</h3>
                        <div className="p-2 bg-muted rounded-md">{usuario.email}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Rol</h3>
                        <div className="p-2 bg-muted rounded-md">{usuario.rol}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Estatus</h3>
                        <div className="p-2 bg-muted rounded-md">{usuario.activo ? "Activo" : "Inactivo"}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Fecha de Creación</h3>
                        <div className="p-2 bg-muted rounded-md">{new Date(usuario.fechaCreacion).toLocaleDateString()}</div>
                    </div>
                </CardContent>
            </Card>

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