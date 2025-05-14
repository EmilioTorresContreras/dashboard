// app/components/calificaciones/CalificacionesTablePage.tsx
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBreadcrumbStore } from "@/app/stores/breadcrumbStore";
import { Calificacion } from "@/types/calificacion";

// Zod schema para validar el formulario
const calificacionSchema = z.object({
    materia: z.string().min(1, { message: "La materia es requerida" }),
    nota: z.coerce.number()
        .min(0, { message: "La nota no puede ser menor a 0" })
        .max(5, { message: "La nota no puede ser mayor a 5" }),
    semestre: z.string().min(1, { message: "El semestre es requerido" }),
    estudianteId: z.string().min(1, { message: "El estudiante es requerido" })
});

type CalificacionFormValues = z.infer<typeof calificacionSchema>;

export default function TableCalificaciones() {

    // Non-reactive fetch using Convex invoke (no real-time updates)
    //const calificaciones = fetchQuery(api.calificaciones.obtenerCalificacionesConEstudiante);
    const estudiantes = useQuery(api.estudiantes.obtenerEstudiantes);

    const crearCalificacion = useMutation(api.calificaciones.crearCalificacion);
    const actualizarCalificacion = useMutation(api.calificaciones.actualizarCalificacion);
    const eliminarCalificacion = useMutation(api.calificaciones.eliminarCalificacion);

    // Configurar formulario con react-hook-form y zod
    const form = useForm<CalificacionFormValues>({
        resolver: zodResolver(calificacionSchema),
        defaultValues: {
            materia: "",
            nota: 0,
            semestre: "",
            estudianteId: ""
        }
    });

    // Calificaciones sin tiempo real
    const [calificaciones, setCalificaciones] = useState<Calificacion[] | null>(null);
    const [isLoadingCalificaciones, setIsLoadingCalificaciones] = useState(true);
    const [errorCalificaciones, setErrorCalificaciones] = useState<Error | null>(null);

    const [editingId, setEditingId] = useState<Id<"calificaciones"> | null>(null);
    // Cargar calificaciones de forma no reactiva al montar el componente
    useEffect(() => {
        async function cargarCalificaciones() {
            try {
                setIsLoadingCalificaciones(true);
                const data = await fetchQuery(api.calificaciones.obtenerCalificacionesConEstudiante);
                setCalificaciones(data as Calificacion[]); // Asegúrate que el tipo es correcto
                setErrorCalificaciones(null);
            } catch (err) {
                console.error("Error fetching calificaciones:", err);
                setErrorCalificaciones(err as Error);
                setCalificaciones([]); // O maneja el error como prefieras
            } finally {
                setIsLoadingCalificaciones(false);
            }
        }
        cargarCalificaciones();
    }, []); // El array vacío [] significa que solo se ejecuta al montar y desmontar

    // useEffect(() => {
    //     const fetchCalificacion = async () => {
    //         if (editingId && calificaciones) {
    //             const calificacion = (await calificaciones).find(c => c._id === editingId);
    //             if (calificacion) {
    //                 form.reset({
    //                     materia: calificacion.materia,
    //                     nota: calificacion.nota,
    //                     semestre: calificacion.semestre,
    //                     estudianteId: calificacion.estudianteId
    //                 });
    //             }
    //         }
    //     };

    //     fetchCalificacion();
    // }, [editingId, calificaciones, form]);

    // useEffect para resetear el form cuando 'editingId' cambia
    useEffect(() => {
        // Solo proceder si 'calificaciones' ya se cargó y no es null
        if (editingId && calificaciones) {
            const calificacion = calificaciones.find(c => c._id === editingId);
            if (calificacion) {
                form.reset({
                    materia: calificacion.materia,
                    nota: calificacion.nota,
                    semestre: calificacion.semestre,
                    estudianteId: calificacion.estudianteId // Asegúrate que este es el ID y no el objeto estudiante
                });
            }
        } else if (!editingId) { // Si no hay editingId, resetea a valores por defecto
            form.reset();
        }
    }, [editingId, calificaciones, form]); // 'calificaciones' ahora es el estado


    const setItems = useBreadcrumbStore(state => state.setItems)

    useEffect(() => {
        setItems([
            { label: 'Escuela Limón', href: '/' },
            { label: 'Calificaciones', href: '/calificaciones', isCurrentPage: true },
        ])
    }, [setItems])

    // Manejar envío del formulario
    const onSubmit = async (values: CalificacionFormValues) => {
        try {
            if (editingId) {
                // Actualizar calificación existente
                await actualizarCalificacion({
                    id: editingId,
                    materia: values.materia,
                    nota: values.nota,
                    semestre: values.semestre
                });
                toast("Calificación actualizada", { description: "La calificación se ha actualizado correctamente" });
            } else {
                // Crear nueva calificación
                await crearCalificacion({
                    materia: values.materia,
                    nota: values.nota,
                    semestre: values.semestre,
                    estudianteId: values.estudianteId as Id<"estudiantes">
                });
                toast("Calificación creada", { description: "La calificación se ha creado correctamente" });
            }

            // Limpiar formulario y estado de edición
            form.reset();
            setEditingId(null);
        } catch (error) {
            toast.error("Error", {
                description: "Ocurrió un error al guardar la calificación"
            });
            console.error(error);
        }
    };

    // Función para manejar la eliminación
    const handleDelete = async (id: Id<"calificaciones">) => {
        try {
            await eliminarCalificacion({ id });
            toast.warning("Calificación eliminada", { description: "La calificación se ha eliminado correctamente" });
        } catch (error) {
            toast.error("Error", { description: "Ocurrió un error al eliminar la calificación" });
            console.error(error);
        }
    };

    // Cancelar edición
    const handleCancel = () => {
        setEditingId(null);
        form.reset();
    };

    if (isLoadingCalificaciones) {
        return <div className="container mx-auto py-8 text-center">Cargando calificaciones...</div>;
    }

    if (errorCalificaciones) {
        return <div className="container mx-auto py-8 text-center text-red-500">Error al cargar calificaciones: {errorCalificaciones.message}</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Gestión de Calificaciones</h1>

            {/* Formulario */}
            <div className="bg-card p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? "Editar Calificación" : "Nueva Calificación"}
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="materia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Materia</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Matemáticas" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nota"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nota</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" min="0" max="5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="semestre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Semestre</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar semestre" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="2023-1">2023-1</SelectItem>
                                                    <SelectItem value="2023-2">2023-2</SelectItem>
                                                    <SelectItem value="2024-1">2024-1</SelectItem>
                                                    <SelectItem value="2024-2">2024-2</SelectItem>
                                                    <SelectItem value="2025-1">2025-1</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="estudianteId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estudiante</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={!!editingId} // No permitir cambiar estudiante al editar
                                                value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar estudiante" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(estudiantes)?.map(estudiante => (
                                                        <SelectItem
                                                            key={estudiante._id}
                                                            value={estudiante._id}
                                                        >
                                                            {estudiante.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            {editingId && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </Button>
                            )}
                            <Button type="submit">
                                {editingId ? "Actualizar" : "Guardar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Tabla de calificaciones */}
            <div className="bg-card rounded-lg shadow overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Estudiante</TableHead>
                            <TableHead>Materia</TableHead>
                            <TableHead>Nota</TableHead>
                            <TableHead>Semestre</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!calificaciones || (calificaciones).length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    No hay calificaciones registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            (calificaciones).map((calificacion) => (
                                <TableRow key={calificacion._id}>
                                    <TableCell>
                                        {calificacion.estudianteId
                                            ? `${calificacion.estudianteId}`
                                            : "Estudiante no encontrado"}
                                    </TableCell>
                                    <TableCell>{calificacion.materia}</TableCell>
                                    <TableCell>{calificacion.nota.toFixed(1)}</TableCell>
                                    <TableCell>{calificacion.semestre}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditingId(calificacion._id)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(calificacion._id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}


