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

export default function CrearMateriaPage() {
    const router = useRouter();
    const crearMateria = useMutation(api.materias.crearMateria);

    const [formData, setFormData] = useState({
        identificador: "",
        nomMateria: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)

    useEffect(() => {
        setItems([
            { label: 'Escuela Limón', href: '/' },
            { label: 'Materias', href: '/materias' },
            { label: 'Crear Materia', isCurrentPage: true },
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
            await crearMateria(formData);
            router.push("/materias");
        } catch (error) {
            console.error("Error al crear materia:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Crear Nuevo Materia
                    </h1>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="font-semibold text-center">Información del Materia</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="identificador">Identificador </Label>
                            <Input
                                id="identificador"
                                name="identificador"
                                value={formData.identificador}
                                onChange={handleChange}
                                placeholder="Identificador del materia"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="nomMateria">Número de Materia </Label>
                            <Input
                                id="nomMateria"
                                name="nomMateria"
                                value={formData.nomMateria}
                                onChange={handleChange}
                                placeholder="Sistemas Operativos"
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
                            {isSubmitting ? "Creando..." : "Crear Materia"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>

    );
}
