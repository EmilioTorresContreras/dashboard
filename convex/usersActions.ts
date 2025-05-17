// convex/users-actions.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { createClerkClient } from "@clerk/backend";
import { api } from "./_generated/api";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export const createUserTransactional = action({
  args: v.object({
    nombre: v.string(),
    apellido: v.string(),
    email: v.string(),
    password: v.string(),
    rol: v.string(),
    metadata: v.optional(v.object({})),
  }),
  handler: async (ctx, { nombre, apellido, email, password, rol, metadata }) => {
    const fecha = Date.now();

    let clerkUser;
    try {
      clerkUser = await clerkClient.users.createUser({
        emailAddress: [email],
        password,
        firstName: nombre,
        lastName: apellido,
        publicMetadata: {
          rol,
          ...(metadata ?? {}),
        },
      });
    } catch (error) {
      throw new Error(`Error creando usuario en Clerk: ${error}`);
    }
    try {
      await ctx.runMutation(api.usuarios.guardarUsuario, {
        nombre,
        apellido,
        email,
        clerkId: clerkUser.id,
        rol,
        activo: true,
        fechaCreacion: fecha,
        metadata,
      });

    } catch (error) {
      await clerkClient.users.deleteUser(clerkUser.id);
      throw new Error(`Error guardando en Convex. Rollback realizado. ${error}`);
    }

    return {
      success: true,
      userId: clerkUser.id,
      message: "Usuario creado correctamente.",
    };
  },
});
