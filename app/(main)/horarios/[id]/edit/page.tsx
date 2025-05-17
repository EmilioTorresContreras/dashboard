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

export default function EditarHorarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const idHorario = id as Id<"horarios">;
  const router = useRouter();
  const horario = useQuery(api.horarios.obtenerHorarioPorId, { id: idHorario });
  const actualizarHorario = useMutation(api.horarios.actualizarHorario);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hora_inicio: "",
    hora_final: ""
  });
  const setItems = useBreadcrumbStore(state => state.setItems)
  
  // Cargar datos del horario cuando estén disponibles
  useEffect(() => {
    if (horario) {
      setFormData({
        hora_inicio: horario.hora_inicio,
        hora_final: horario.hora_final
      });
    }
    setItems([
        { label: 'Escuela Limón', href: '/' },
        { label: 'Horarios', href: '/horarios' },
        { label: `${horario?.hora_inicio}`, href: `/horarios/${horario?._id}`},
        { label: 'Editar', isCurrentPage: true },
      ])
  }, [horario, setItems]);
  
  if (horario === undefined) {
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

  if (!horario) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Horario no encontrado</h1>
        </div>
        <p>No se pudo encontrar el horario con el ID proporcionado.</p>
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
      await actualizarHorario({
        id: horario._id,
        ...formData,
      });
      router.push(`/horarios/${id}`);
    } catch (error) {
      console.error("Error al actualizar horario:", error);
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
        <h1 className="text-3xl font-bold">Editar Horario</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-semibold text-center">Modificar información de {horario.hora_inicio}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="hora_inicio">Nombre Completo</Label>
              <Input
                id="hora_inicio"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                placeholder="7:00 AM"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hora_final">Correo Electrónico</Label>
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