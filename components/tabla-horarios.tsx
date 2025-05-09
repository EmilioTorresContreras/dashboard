"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function TablaHorarios() {
  const router = useRouter();
  const horarios = useQuery(api.horarios.obtenerHorarios);

  if (horarios === undefined) {
    return <div>Cargando horarios...</div>;
  }

  const handleVerHorario = (id: string) => {
    router.push(`/horarios/${id}`);
  };

  const handleCrear = () => {
    router.push("/horarios/create");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Horarios</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Horario
        </Button>
      </div>
      
      <Table>
        <TableCaption>Lista de horarios registrados</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[100px]">Matrícula</TableHead> */}
            <TableHead>Hora inicial</TableHead>
            <TableHead>Hora final</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {horarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay horarios registrados
              </TableCell>
            </TableRow>
          ) : (
            horarios.map((horario) => (
              <TableRow 
                key={horario._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleVerHorario(horario._id)}
              >
                {/* <TableCell className="font-medium">
                  {horario.numMatricula}
                </TableCell> */}
                <TableCell>{horario.hora_inicio}</TableCell>
                <TableCell>{horario.hora_final}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}