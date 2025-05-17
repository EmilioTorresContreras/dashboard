"use client";

import { useState, useEffect, use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreadcrumbStore } from "@/app/stores/breadcrumbStore";

export default function EditarSalonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const idSalon = id as Id<"salones">;
  const router = useRouter();
  const salon = useQuery(api.salones.obtenerSalonPorId, { id: idSalon });
  const actualizarSalon = useMutation(api.salones.actualizarSalon);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    numSalon: "",
    edificio: "",
    planta: ""
  });

  // Cargar datos del salon cuando estén disponibles
  useEffect(() => {
    if (salon) {
      setFormData({
        numSalon: salon.numSalon,
        edificio: salon.edificio,
        planta: salon.planta
      });
    }
  }, [salon]);

  const setItems = useBreadcrumbStore(state => state.setItems)

  useEffect(() => {
    setItems([
      { label: 'Escuela Limón', href: '/' },
      { label: 'Salones', href: '/salones' },
      { label: `${salon?.numSalon}`, href: `/salones/${salon?._id}`},
      { label: 'Editar', isCurrentPage: true },
    ])
  }, [setItems, salon])

  if (salon === undefined) {
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

  if (!salon) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Salón no encontrado</h1>
        </div>
        <p>No se pudo encontrar el salon con el ID proporcionado.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await actualizarSalon({
        id: salon._id,
        ...formData,
      });
      router.push(`/salones/${id}`);
    } catch (error) {
      console.error("Error al actualizar salon:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Editar Salón</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-semibold text-center">Modificar información de {salon.edificio}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="numSalon">Número de Saló<nav></nav></Label>
              <Input
                id="numSalon"
                name="numSalon"
                value={formData.numSalon}
                onChange={handleChange}
                placeholder="Ej: A12345"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edificio">Edificio</Label>
              <Input
                id="edificio"
                name="edificio"
                value={formData.edificio}
                onChange={handleChange}
                placeholder="Nombre del salon"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planta">Planta</Label>
              <Input
                id="planta"
                name="planta"
                value={formData.planta}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 mt-8"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}