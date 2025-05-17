import { z } from "zod";

export const userSchema = z.object({
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
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(100, { message: "La contraseña no puede tener más de 100 caracteres" })
    .regex(/[A-Z]/, { message: "La contraseña debe tener al menos una letra mayúscula" })
    .regex(/[a-z]/, { message: "La contraseña debe tener al menos una letra minúscula" })
    .regex(/[0-9]/, { message: "La contraseña debe tener al menos un número" }),
  confirmPassword: z.string(),
  rol: z
    .string()
    .min(2, { message: "El rol debe tener al menos 4 caracteres" })
    .max(50, { message: "El rol no puede tener más de 50 caracteres" }),
  //   enum(["admin", "usuario"], {
  //   required_error: "Por favor seleccione un rol",
  // }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type UserFormValues = z.infer<typeof userSchema>;