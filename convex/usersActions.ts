import { action } from "./_generated/server";
import { v } from "convex/values";
import { createClerkClient } from "@clerk/backend";
import { api } from "./_generated/api";
import { jwtVerify } from "jose";

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
      // Paso 1: Eliminar en Clerk
      await clerkClient.users.deleteUser(args.clerkId);

      // Paso 2: Eliminar en Convex
      await ctx.runMutation(api.usuarios.eliminarUsuario, {
        usuarioId: args.usuarioId,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Error al eliminar usuario: " + (error as Error).message,
      };
    }
  },
});

export const actualizarUsuarioConClerk = action({
  args: v.object({
    usuarioId: v.id("usuarios"),
    clerkId: v.string(),
    nuevosDatosConvex: v.object({
      nombre: v.string(),
      apellido: v.string(),
      email: v.string(),
      rol: v.string(),
      activo: v.boolean(),
      metadata: v.optional(v.object({})),
    }),
    nuevosDatosClerk: v.object({
      firstName: v.string(),
      lastName: v.string(),
      emailAddress: v.string(),
      rol: v.string(),
    }),
  }),
  handler: async (ctx, args) => {
    // Paso 1: Obtener usuario de Convex
    const usuarioActual = await ctx.runQuery(api.usuarios.obtenerUsuarioPorId, {
      id: args.usuarioId,
    });

    if (!usuarioActual) {
      return { success: false, error: "Usuario no encontrado en Convex." };
    }

    // Paso 2: Obtener usuario de Clerk
    let clerkUser;
    try {
      clerkUser = await clerkClient.users.getUser(args.clerkId);
    } catch {
      return { success: false, error: "Usuario no encontrado en Clerk." };
    }

    // Guardar datos originales para rollback
    const datosOriginalesConvex = {
      nombre: usuarioActual.nombre,
      apellido: usuarioActual.apellido,
      email: usuarioActual.email,
      clerkId: usuarioActual.clerkId,
      rol: usuarioActual.rol,
      activo: usuarioActual.activo,
      fechaCreacion: usuarioActual.fechaCreacion,
      metadata: usuarioActual.metadata,
    };

    const datosOriginalesClerk = {
      firstName: clerkUser.firstName ?? undefined,
      lastName: clerkUser.lastName ?? undefined,
      publicMetadata: {
        rol: clerkUser.publicMetadata.rol,
      },
    };

    const datosNuevosClerk = {
      firstName: args.nuevosDatosClerk.firstName,
      lastName: args.nuevosDatosClerk.lastName,
      publicMetadata: {
        rol: args.nuevosDatosClerk.rol,
      },
    };

    try {
      // Paso 3: Actualizar en Convex
      await ctx.runMutation(api.usuarios.actualizarUsuario, {
        usuarioId: args.usuarioId,
        nuevosDatos: args.nuevosDatosConvex,
      });

      // Verificar si el nuevo email ya existe en Clerk
      // if (args.nuevosDatosClerk.emailAddress !== usuarioActual.email) {
      //   const existingUsers = await clerkClient.users.getUserList({
      //     emailAddress: [args.nuevosDatosClerk.emailAddress],
      //   });
      //   if (
      //     existingUsers.data.length > 0 &&
      //     existingUsers.data[0].id !== args.clerkId
      //   ) {
      //     return {
      //       success: false,
      //       error: "Ya existe un usuario con ese correo en Clerk.",
      //     };
      //   }
      // }

      // Paso 4: Manejar cambio de email
      // const currentEmail = clerkUser.emailAddresses.find(
      //   (e) => e.id === clerkUser.primaryEmailAddressId
      // );

      // if (currentEmail?.emailAddress !== args.nuevosDatosClerk.emailAddress) {
      //   // Crear nuevo email
      //   await clerkClient.emailAddresses.createEmailAddress({
      //     userId: args.clerkId,
      //     emailAddress: args.nuevosDatosClerk.emailAddress,
      //   });
      // }

      // Paso 5: Actualizar otros datos en Clerk
      await clerkClient.users.updateUser(args.clerkId, datosNuevosClerk);

      return { success: true, message: "Se realizarón los cambios exitosamente." };
    } catch (error) {
      // Rollback en caso de error
      try {
        await ctx.runMutation(api.usuarios.actualizarUsuario, {
          usuarioId: args.usuarioId,
          nuevosDatos: datosOriginalesConvex,
        });

        await clerkClient.users.updateUser(args.clerkId, datosOriginalesClerk);
      } catch (rollbackError) {
        return {
          success: false,
          error:
            "Error al actualizar y también falló la reversión: " +
            (rollbackError as Error).message,
        };
      }

      return {
        success: false,
        error: "Error al actualizar usuario: " + (error as Error).message,
      };
    }
  },
});

export const actualizarPasswordToken = action({
  args: v.object({
    token: v.string(),
    nuevaPassword: v.string(),
  }),
  handler: async (_ctx, args) => {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

      let decoded;
      try {
        const { payload } = await jwtVerify(args.token, secret);
        decoded = payload;
      } catch (err) {
        console.log(err)
        return {
          success: false,
          error: "Token inválido o expirado. Recarga la página o comunicate con soporte.",
        };
      }

      const clerkId = decoded.clerkId as string;

      // Actualizar la contraseña del usuario en Clerk
      await clerkClient.users.updateUser(clerkId, {
        password: args.nuevaPassword,
      });

      return { success: true, message: "Contraseña actualizada correctamente." };
    } catch (error) {
      return {
        success: false,
        error: "Error al actualizar la contraseña: " + (error as Error).message,
      };
    }
  },
});
