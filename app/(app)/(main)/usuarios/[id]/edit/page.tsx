"use client";

import { use, useEffect, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useBreadcrumbStore } from "@/app/stores/breadcrumbStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { UsuarioFormEditValues, usuarioEditSchema } from "@/app/shemas/usuario";

export default function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idUsuario = id as Id<"usuarios">;
    const router = useRouter();
    const usuario = useQuery(api.usuarios.obtenerUsuarioPorId, { id: idUsuario });

    const [isLoadingUsuario, setIsLoadingUsuario] = useState(true);
    const [errorUsuario, setErrorUsuario] = useState<Error | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems);

    const form = useForm<UsuarioFormEditValues>({
        resolver: zodResolver(usuarioEditSchema),
        defaultValues: {
            nombre: "",
            apellido: "",
            email: "",
            rol: "usuario",
            activo: true
        }
    });

    const updateUser = useAction(api["usersActions"].actualizarUsuarioConClerk);

    useEffect(() => {
        setIsLoadingUsuario(true);
        if (usuario) {
            form.reset({
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol,
                activo: usuario.activo
            });
            setItems([
                { label: 'Escuela Limón', href: '/' },
                { label: 'Usuarios', href: '/usuarios' },
                { label: `${usuario.nombre} ${usuario.apellido}`, href: `/usuarios/${usuario._id}` },
                { label: 'Editar', isCurrentPage: true },
            ]);
        }
        setIsLoadingUsuario(false);
    }, [usuario, form, setItems]);

    const onSubmit = async (values: UsuarioFormEditValues) => {
        toast("Actualizando usuario...")
        try {
            setIsSubmitting(true);
            if (usuario) {
                const result = await updateUser({
                    usuarioId: idUsuario,
                    clerkId: usuario.clerkId,
                    nuevosDatosConvex: {
                        nombre: values.nombre,
                        apellido: values.apellido,
                        email: values.email,
                        rol: values.rol,
                        activo: values.activo ? true : false
                    },
                    nuevosDatosClerk: {
                        firstName: values.nombre,
                        lastName: values.apellido,
                        emailAddress: values.email,
                        rol: values.rol
                    }
                });
                if (result.success) {
                    toast.success(result.message);
                } else {
                    toast.error(result.error);
                }
                //router.push("/usuarios");
            }

        } catch (error) {
            toast.error("Error", {
                description: "Ocurrió un error al guardar la usuario"
            });
            setErrorUsuario(error as Error)
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingUsuario) {
        return <div className="container mx-auto py-8 text-center">Cargando usuario...</div>;
    }

    if (errorUsuario) {
        return <div className="container mx-auto py-8 text-center text-red-500">Error al cargar usuario: {errorUsuario.message}</div>;
    }

    return (
        <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Editar Usuario
                    </h1>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-semibold text-center">Información de la usuario</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
                        <CardContent className="grid grid-cols-1 gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="apellido"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apellido</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="correo@ejemplo.com"  {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="rol"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rol</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona el rol" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="usuario">Usuario</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="activo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Activo</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={value => field.onChange(value === "true")}
                                                    value={field.value ? "true" : "false"}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona el estado" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="true">Activo</SelectItem>
                                                        <SelectItem value="false">Inactivo</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/usuarios")}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                {isSubmitting ? "Actualizando..." : "Guardar Cambios"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}