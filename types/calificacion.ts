import { GenericId } from "convex/values";

export type CalificacionesId = GenericId<"calificaciones">;

export interface Calificacion {
  _id: CalificacionesId;
  materia: string;
  nota: number;
  semestre: string;
  estudianteId: string;
  createdAt: number;
  updatedAt?: number;
  estudiante?: {
    nombre: string;
  } | null; // Campo opcional para el nombre del estudiante
}