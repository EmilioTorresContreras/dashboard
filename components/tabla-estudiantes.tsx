"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBreadcrumbStore } from "@/app/stores/breadcrumbStore";
import { Fragment, useEffect, useState } from "react";
import { Calificacion } from "@/types/calificacion";
import { fetchQuery } from "convex/nextjs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import type { Id } from "@/convex/_generated/dataModel";

export function TablaEstudiantes() {
  const router = useRouter();
  const estudiantes = useQuery(api.estudiantes.obtenerEstudiantes);
  const setItems = useBreadcrumbStore(state => state.setItems)

  useEffect(() => {
    setItems([
      { label: 'Escuela Limón', href: '/' },
      { label: 'Estudiantes', href: '/estudiantes', isCurrentPage: true },
    ])
  }, [setItems])

  const [calificacionesPorEstudiante, setCalificacionesPorEstudiante] = useState<Record<string, Calificacion[]>>({});
  const [openRows, setOpenRows] = useState<string[]>([]);

  const cargarCalificacion = async ({ id }: { id: Id<"estudiantes"> }) => {
    setOpenRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
    
    if (!calificacionesPorEstudiante[id]) {
      try {
        const data = await fetchQuery(api.calificaciones.obtenerCalificacionesPorEstudianteId, { estudianteId: id });
        setCalificacionesPorEstudiante((prev) => ({
          ...prev,
          [id]: (data as Calificacion[]).map((cal) => ({
            ...cal,
            estudiante: {
              nombre: estudiantes?.find(e => e._id === cal.estudianteId)?.nombre || "Estudiante no encontrado",
            },
          })),
        }));
      } catch (err) {
        console.error("Error fetching calificaciones:", err);
        setCalificacionesPorEstudiante((prev) => ({ ...prev, [id]: [] }));
      }
    }
  };

  const handleVerEstudiante = (id: string) => {
    router.push(`/estudiantes/${id}`);
  };

  const handleCrear = () => {
    router.push("/estudiantes/create");
  };

  if (!estudiantes) {
    return <div className="container mx-auto py-8 text-center">Cargando estudiantes...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Estudiantes</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Estudiante
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead className="w-[100px]">Matrícula</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estudiantes.map((row) => (
            <Fragment key={row._id}>
              <TableRow>
                <TableCell>
                  <Collapsible open={openRows.includes(row._id)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        className="cursor-pointer hover:bg-muted/50"
                        variant="ghost"
                        size="icon"
                        onClick={() => cargarCalificacion({ id: row._id })}
                        aria-label="Toggle Row"
                      >
                        {openRows.includes(row._id) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </TableCell>
                <TableCell
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleVerEstudiante(row._id)}>
                  {row.numMatricula}
                </TableCell>
                <TableCell>{row.nombre}</TableCell>
                <TableCell>{row.correo}</TableCell>
                <TableCell>
                  {/* Any actions */}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="p-0 border-0">
                  <Collapsible open={openRows.includes(row._id)}>
                    <CollapsibleContent>
                      <div className="pl-8 py-2">
                        <h1>Calificaciones de {row.nombre}</h1>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Materia</TableHead>
                              <TableHead>Nota</TableHead>
                              <TableHead>Semestre</TableHead>
                              <TableHead>Estudiante</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(calificacionesPorEstudiante[row._id] || []).map((cal) => (
                              <TableRow key={cal._id}>
                                <TableCell>{cal.materia}</TableCell>
                                <TableCell>{cal.nota}</TableCell>
                                <TableCell>{cal.semestre}</TableCell>
                                <TableCell>{cal.estudiante?.nombre}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}