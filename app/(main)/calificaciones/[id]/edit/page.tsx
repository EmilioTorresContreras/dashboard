"use client";

import { use, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
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
import { CalificacionFormValues, calificacionSchema } from "@/app/shemas/calificacion";
import { fetchQuery } from "convex/nextjs";
import { Calificacion } from "@/types/calificacion";

export default function EditarCalificacionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idCalificacion = id as Id<"calificaciones">;
    const router = useRouter();
    const estudiantes = useQuery(api.estudiantes.obtenerEstudiantes);
    const [calificacion, setCalificacion] = useState<Calificacion | null>(null);
    const [isLoadingCalificacion, setIsLoadingCalificacion] = useState(true);
    const [errorCalificacion, setErrorCalificacion] = useState<Error | null>(null);
    const actualizarCalificacion = useMutation(api.calificaciones.actualizarCalificacion);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems);

    const form = useForm<CalificacionFormValues>({
        resolver: zodResolver(calificacionSchema),
        defaultValues: {
            materia: "",
            nota: 0,
            semestre: "",
            estudianteId: ""
        }
    });

    useEffect(() => {
        async function cargarCalificacion() {
            try {
                setIsLoadingCalificacion(true);
                const data = await fetchQuery(api.calificaciones.obtenerCalificacionPorId, { id: idCalificacion });

                if (!data) {
                    throw new Error("No se encontró la calificación");
                }

                const calificacionConEstudiante = {
                    ...data,
                    estudiante: {
                        nombre: estudiantes?.find(e => e._id === data.estudianteId)?.nombre || "Estudiante no encontrado",
                    },
                };

                setCalificacion(calificacionConEstudiante as Calificacion);
                setErrorCalificacion(null);

                // Actualiza los valores del formulario
                form.reset({
                    materia: calificacionConEstudiante.materia,
                    nota: Number(calificacionConEstudiante.nota),
                    semestre: calificacionConEstudiante.semestre,
                    estudianteId: calificacionConEstudiante.estudianteId
                });
            } catch (err) {
                console.error("Error fetching calificaciones:", err);
                setErrorCalificacion(err as Error);
                setCalificacion(null);
            } finally {
                setIsLoadingCalificacion(false);
            }
        }

        if (estudiantes) {
            cargarCalificacion();
        }
    }, [idCalificacion, estudiantes, form]);

    // Actualizar breadcrumbs
    useEffect(() => {
        if (calificacion) {
            setItems([
                { label: 'Escuela Limón', href: '/' },
                { label: 'Calificaciones', href: '/calificaciones' },
                { label: `${calificacion.estudiante?.nombre}`, href: `/calificaciones/${calificacion._id}` },
                { label: 'Editar', isCurrentPage: true },
            ]);
        }
    }, [calificacion, setItems]);

    const onSubmit = async (values: CalificacionFormValues) => {
        try {
            setIsSubmitting(true);
            await actualizarCalificacion({
                id: idCalificacion,
                materia: values.materia,
                nota: Number(values.nota),
                semestre: values.semestre
            });
            toast.success("Calificación actualizada", { description: "La calificación se ha actualizado correctamente" });
            router.push("/calificaciones");
        } catch (error) {
            toast.error("Error", {
                description: "Ocurrió un error al guardar la calificación"
            });
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingCalificacion) {
        return <div className="container mx-auto py-8 text-center">Cargando calificación...</div>;
    }

    if (errorCalificacion) {
        return <div className="container mx-auto py-8 text-center text-red-500">Error al cargar calificación: {errorCalificacion.message}</div>;
    }

    return (
        <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Editar Calificación
                    </h1>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-semibold text-center">Información de la calificación</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <CardContent className="grid grid-cols-1 gap-6">
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
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="10"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
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
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar estudiante" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {estudiantes?.map(estudiante => (
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
                        </CardContent>

                        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
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