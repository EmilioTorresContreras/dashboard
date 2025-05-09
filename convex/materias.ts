import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Consulta para obtener todos los materias
export const obtenerMaterias = query({
  handler: async (ctx) => {
    return await ctx.db.query("materias").collect();
  },
});

// Consulta para obtener un materia por ID
export const obtenerMateriaPorId = query({
  args: { id: v.id("materias") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutación para crear un nuevo materia
export const crearMateria = mutation({
  args: {
    identificador: v.string(),
    nomMateria: v.string(),
  },
  handler: async (ctx, args) => {
    const { identificador, nomMateria } = args;
    return await ctx.db.insert("materias", {
      identificador,
      nomMateria,
    });
  },
});

// Mutación para actualizar un materia existente
export const actualizarMateria = mutation({
  args: {
    id: v.id("materias"),
    identificador: v.string(),
    nomMateria: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, identificador, nomMateria } = args;
    return await ctx.db.patch(id, {
      identificador,
      nomMateria,
    });
  },
});

// Mutación para eliminar un materia
export const eliminarMateria = mutation({
  args: {
    id: v.id("materias"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});