import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Consulta para obtener todas las calificaciones (bajo demanda, no real-time)
export const obtenerCalificaciones = query({
  handler: async (ctx) => {
    return await ctx.db.query("calificaciones").collect();
  },
});

// Consulta para obtener calificaciones por estudiante ID
export const obtenerCalificacionesPorEstudianteId = query({
  args: { estudianteId: v.id("estudiantes") },
  handler: async (ctx, args) => {
    return await ctx.db.query("calificaciones")
      .filter(q => q.eq(q.field("estudianteId"), args.estudianteId))
      .collect();
  },
});

// Consulta para obtener una calificación específica por ID
export const obtenerCalificacionPorId = query({
  args: { id: v.id("calificaciones") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutación para crear una nueva calificación
export const crearCalificacion = mutation({
  args: {
    materia: v.string(),
    nota: v.float64(),
    semestre: v.string(),
    estudianteId: v.id("estudiantes")
  },
  handler: async (ctx, args) => {
    const { materia, nota, semestre, estudianteId } = args;
    
    // Verificar que el estudiante existe
    const estudiante = await ctx.db.get(estudianteId);
    if (!estudiante) {
      throw new Error(`Estudiante con ID ${estudianteId} no existe`);
    }
    
    return await ctx.db.insert("calificaciones", {
      materia,
      nota,
      semestre,
      estudianteId,
      createdAt: Date.now(),
    });
  },
});

// Mutación para actualizar una calificación existente
export const actualizarCalificacion = mutation({
  args: {
    id: v.id("calificaciones"),
    materia: v.optional(v.string()),
    nota: v.optional(v.float64()),
    semestre: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fieldsToUpdate } = args;
    
    // Verificar que la calificación existe
    const calificacion = await ctx.db.get(id);
    if (!calificacion) {
      throw new Error(`Calificación con ID ${id} no existe`);
    }
    
    // Agregar timestamp de actualización
    return await ctx.db.patch(id, {
      ...fieldsToUpdate,
      updatedAt: Date.now(),
    });
  },
});

// Mutación para eliminar una calificación
export const eliminarCalificacion = mutation({
  args: {
    id: v.id("calificaciones"),
  },
  handler: async (ctx, args) => {
    // Verificar que la calificación existe
    const calificacion = await ctx.db.get(args.id);
    if (!calificacion) {
      throw new Error(`Calificación con ID ${args.id} no existe`);
    }
    
    return await ctx.db.delete(args.id);
  },
});

// Consulta para obtener estadísticas de calificaciones por estudiante
export const obtenerEstadisticasEstudiante = query({
  args: { estudianteId: v.id("estudiantes") },
  handler: async (ctx, args) => {
    const calificaciones = await ctx.db
      .query("calificaciones")
      .filter(q => q.eq(q.field("estudianteId"), args.estudianteId))
      .collect();
    
    if (calificaciones.length === 0) {
      return {
        promedio: 0,
        materias: 0,
        mejorNota: 0,
        peorNota: 0
      };
    }
    
    const notas = calificaciones.map(c => c.nota);
    const promedio = notas.reduce((sum, nota) => sum + nota, 0) / notas.length;
    const mejorNota = Math.max(...notas);
    const peorNota = Math.min(...notas);
    
    return {
      promedio,
      materias: calificaciones.length,
      mejorNota,
      peorNota
    };
  },
});

// Consulta para obtener todas las calificaciones con información del estudiante
export const obtenerCalificacionesConEstudiante = query({
  handler: async (ctx) => {
    const calificaciones = await ctx.db.query("calificaciones").collect();
    
    // Obtener información de estudiantes para cada calificación
    const calificacionesConEstudiante = await Promise.all(
      calificaciones.map(async (calificacion) => {
        const estudiante = await ctx.db.get(calificacion.estudianteId);
        return {
          ...calificacion,
          estudiante: estudiante 
            ? { nombre: estudiante.nombre} 
            : null
        };
      })
    );
    
    return calificacionesConEstudiante;
  },
});