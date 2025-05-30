"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useBreadcrumbStore } from "@/app/stores/breadcrumbStore";

export default function CrearHorarioPage() {
    const router = useRouter();
    const crearHorario = useMutation(api.horarios.crearHorario);

    const [formData, setFormData] = useState({
        hora_inicio: "",
        hora_final: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)

    useEffect(() => {
        setItems([
            { label: 'Escuela Limón', href: '/' },
            { label: 'Horarios', href: '/horarios' },
            { label: 'Crear Horario', isCurrentPage: true },
        ])
    }, [setItems])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await crearHorario(formData);
            router.push("/horarios");
        } catch (error) {
            console.error("Error al crear horario:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Crear Nuevo Horario
                    </h1>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="font-semibold text-center">Información del Horario</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-6">

                        <div className="grid gap-2">
                            <Label htmlFor="hora_inicio">Horario inicial</Label>
                            <Input
                                id="hora_inicio"
                                name="hora_inicio"
                                value={formData.hora_inicio}
                                onChange={handleChange}
                                placeholder="7:00 AM"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="hora_final">Horario final</Label>
                            <Input
                                id="hora_final"
                                name="hora_final"
                                value={formData.hora_final}
                                onChange={handleChange}
                                placeholder="8:00 AM"
                                required
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
                            {isSubmitting ? "Creando..." : "Crear Horario"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>

    );
}
