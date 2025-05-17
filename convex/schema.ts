import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  estudiantes: defineTable({
    numMatricula: v.string(),
    nombre: v.string(),
    correo: v.string(),
  }),
  maestros: defineTable({
    numEmpleado: v.string(),
    nombre: v.string(),
    correo: v.string(),
  }),
  materias: defineTable({
    identificador: v.string(),
    nomMateria: v.string(),
  }),
  horarios: defineTable({
    hora_inicio: v.string(),
    hora_final: v.string()
  }),
  salones: defineTable({
    numSalon: v.string(),
    edificio: v.string(),
    planta: v.string(),
  }),
  calificaciones: defineTable({
    materia: v.string(),
    nota: v.float64(),
    semestre: v.string(),
    estudianteId: v.id("estudiantes"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }),
  usuarios: defineTable({
    nombre: v.string(),
    apellido: v.string(),
    email: v.string(),
    clerkId: v.string(),
    rol: v.string(),
    activo: v.boolean(),
    fechaCreacion: v.number(),
    fechaActualizacion: v.optional(v.number()),
    metadata: v.optional(v.object({})), 
  })
  .index("por_email", ["email"])
  .index("por_clerkId", ["clerkId"])
});