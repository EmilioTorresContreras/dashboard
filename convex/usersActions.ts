import { action } from "./_generated/server";
import { v } from "convex/values";
import { createClerkClient } from "@clerk/backend";
import { api } from "./_generated/api";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export const crearUsuarioConClerk = action({
  args: v.object({
    nombre: v.string(),
    apellido: v.string(),
    email: v.string(),
    password: v.string(),
    rol: v.string(),
    metadata: v.optional(v.object({})),
  }),
  handler: async (ctx, args) => {
    const fechaActual = Date.now();

    try {
      const existingUsers = await clerkClient.users.getUserList({
        emailAddress: [args.email],
      });

      if (existingUsers.data.length > 0) {
        return {
          success: false,
          error: "Ya existe un usuario con ese correo.",
        };
      }

      const user = await clerkClient.users.createUser({
        emailAddress: [args.email],
        password: args.password,
        firstName: args.nombre,
        lastName: args.apellido,
        publicMetadata: {
          rol: args.rol,
        },

      });

      const clerkId = user.id;
      try {
        await ctx.runMutation(api.usuarios.guardarUsuario, {
          nombre: args.nombre,
          apellido: args.apellido,
          email: args.email,
          rol: args.rol,
          clerkId,
          activo: true,
          fechaCreacion: fechaActual,
          metadata: args.metadata
        });

        return {
          success: true,
          userId: clerkId,
          message: `Usuario creado exitosamente (${args.nombre} ${args.apellido} - ${args.rol})`,
        };

      } catch (convexError) {
        await clerkClient.users.deleteUser(clerkId);
        return {
          success: false,
          error: "Error al guardar en Convex: " + (convexError as Error).message,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Error general: " + (error as Error).message,
      };
    }
  },
});

export const eliminarUsuario = action({
  args: v.object({
    usuarioId: v.id("usuarios"),
    clerkId: v.string(),
  }),
  handler: async (ctx, args) => {
    try {

      await clerkClient.users.deleteUser(args.clerkId);

      await ctx.runMutation(api.usuarios.eliminarUsuario, {
        usuarioId: args.usuarioId,
      });

      return { success: true,
        message: "Usuario eliminado exitosamente"
       };
    } catch (error) {
      return {
        success: false,
        error: "Error al eliminar usuario: " + (error as Error).message,
      };
    }
  },
});