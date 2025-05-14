"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBreadcrumbStore } from "@/app/stores/breadcrumbStore";
import { useEffect } from "react";

export function TablaMaterias() {
  const router = useRouter();
  const materias = useQuery(api.materias.obtenerMaterias);
  const setItems = useBreadcrumbStore(state => state.setItems)

  useEffect(() => {
      setItems([
        { label: 'Escuela Limón', href: '/' },
        { label: 'Materias', href: '/materias', isCurrentPage: true },
      ])
    }, [setItems])

  if (materias === undefined) {
    return <div>Cargando materias...</div>;
  }

  const handleVerMateria = (id: string) => {
    router.push(`/materias/${id}`);
  };

  const handleCrear = () => {
    router.push("/materias/create");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Materias</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Materia
        </Button>
      </div>

      <Table>
        <TableCaption>Lista de materias registrados</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[100px]">Matrícula</TableHead> */}
            <TableHead>Identificador</TableHead>
            <TableHead>Número de materia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay materias registrados
              </TableCell>
            </TableRow>
          ) : (
            materias.map((materia) => (
              <TableRow
                key={materia._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleVerMateria(materia._id)}
              >
                {/* <TableCell className="font-medium">
                  {materia.numMatricula}
                </TableCell> */}
                <TableCell>{materia.identificador}</TableCell>
                <TableCell>{materia.nomMateria}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}