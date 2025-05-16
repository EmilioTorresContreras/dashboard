"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useBreadcrumbStore } from "@/app/stores/breadcrumbStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { CalificacionFormValues, calificacionSchema } from "@/app/shemas/calificacion";

export default function CrearCalificacionPage() {
    const estudiantes = useQuery(api.estudiantes.obtenerEstudiantes);
    const router = useRouter();
    const crearCalificacion = useMutation(api.calificaciones.crearCalificacion);

    const form = useForm<CalificacionFormValues>({
        resolver: zodResolver(calificacionSchema),
        defaultValues: {
            materia: "",
            nota: 0,
            semestre: "",
            estudianteId: ""
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)

    useEffect(() => {
        setItems([
            { label: 'Escuela Limón', href: '/' },
            { label: 'Calificaciones', href: '/calificaciones' },
            { label: 'Crear Calificación', isCurrentPage: true },
        ])
    }, [setItems])

    const onSubmit = async (values: CalificacionFormValues) => {
        try {
            setIsSubmitting(true);
            await crearCalificacion({
                materia: values.materia,
                nota: values.nota,
                semestre: values.semestre,
                estudianteId: values.estudianteId as Id<"estudiantes">
            });
            toast.success("Calificación creada", { description: "La calificación se ha creado correctamente" });
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

    return (
        <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Crear Nueva Calificación
                    </h1>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-semibold text-center">Información la calificación</CardTitle>
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
                                {isSubmitting ? "Creando..." : "Crear Calificación"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>

    );
}
