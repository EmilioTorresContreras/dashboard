import { z } from "zod";

export const calificacionSchema = z.object({
    materia: z.string().min(1, { message: "La materia es requerida" }),
    nota: z.coerce.number()
        .min(0, { message: "La nota no puede ser menor a 0" })
        .max(5, { message: "La nota no puede ser mayor a 5" }),
    semestre: z.string().min(1, { message: "El semestre es requerido" }),
    estudianteId: z.string().min(1, { message: "El estudiante es requerido" })
});

export type CalificacionFormValues = z.infer<typeof calificacionSchema>;