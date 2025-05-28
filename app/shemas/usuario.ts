import { z } from "zod";

export const usuarioSchema = z.object({
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres" }),
  apellido: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(50, { message: "El apellido no puede tener más de 50 caracteres" }),
  email: z
    .string()
    .email({ message: "Ingrese un correo electrónico válido" }),
  activo: z.boolean().optional(),
  rol: z
    .string()
    .min(2, { message: "El rol debe tener al menos 4 caracteres" })
    .max(50, { message: "El rol no puede tener más de 50 caracteres" }),
});

export type UsuarioFormValues = z.infer<typeof usuarioSchema>;