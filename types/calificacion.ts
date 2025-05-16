export interface Calificacion {
  _id: import("/home/app/dashboard/convex/_generated/dataModel").Id<"calificaciones">;
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