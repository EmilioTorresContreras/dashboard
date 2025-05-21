// convex/usuarios.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const guardarUsuario = mutation({
  args: v.object({
    nombre: v.string(),
    apellido: v.string(),
    email: v.string(),
    clerkId: v.string(),
    rol: v.string(),
    activo: v.boolean(),
    fechaCreacion: v.number(),
    metadata: v.optional(v.object({})),
  }),
  handler: async (ctx, args) => {
    await ctx.db.insert("usuarios", args);
  },
});

export const obtenerUsuarios = query({
  handler: async (ctx) => {
    return await ctx.db.query("usuarios").collect();
  },
});

export const actualizarEstadoUsuario = mutation({
  args: v.object({
    usuarioId: v.id("usuarios"),
    activo: v.boolean(),
  }),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.usuarioId, { activo: args.activo });
  },
});

export const eliminarUsuario = mutation({
  args: v.object({
    usuarioId: v.id("usuarios"),
  }),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.usuarioId);
  },
});

export const obtenerUsuarioPorId = query({
  args: { id: v.id("usuarios") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const actualizarUsuario = mutation({
  args: v.object({
    usuarioId: v.id("usuarios"),
    nuevosDatos: v.object({
      nombre: v.string(),
      apellido: v.string(),
      email: v.string(),
      rol: v.string(),
      activo: v.boolean(),
      metadata: v.optional(v.object({})),
    }),
  }),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.usuarioId, args.nuevosDatos);
  },
});