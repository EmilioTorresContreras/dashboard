"use client";

import { useQuery } from "convex/react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";

export function TablaSalones() {
  const router = useRouter();
  const salones = useQuery(api.salones.obtenerSalones);

  if (salones === undefined) {
    return <div>Cargando salones...</div>;
  }

  const handleVerSalon = (id: string) => {
    router.push(`/salones/${id}`);
  };

  const handleCrear = () => {
    router.push("/salones/create");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Salones</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Salón
        </Button>
      </div>
      
      <Table>
        <TableCaption>Lista de salones registrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Número de Salón</TableHead>
            <TableHead>Edificio</TableHead>
            <TableHead>Planta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salones.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay salones registrados
              </TableCell>
            </TableRow>
          ) : (
            salones.map((salon) => (
              <TableRow 
                key={salon._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleVerSalon(salon._id)}
              >
                <TableCell className="font-medium">
                  {salon.numSalon}
                </TableCell>
                <TableCell>{salon.edificio}</TableCell>
                <TableCell>{salon.planta}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}