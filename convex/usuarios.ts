// convex/usuarios.ts
import { mutation } from "./_generated/server";
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
