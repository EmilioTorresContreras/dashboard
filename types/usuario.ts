import { GenericId } from "convex/values";

export type UsuariosId = GenericId<"usuarios">;

export interface Usuario {
    _id: UsuariosId;
    nombre: string
    apellido: string
    email: string
    clerkId: string
    rol: string
    activo: boolean
    fechaCreacion: number
    fechaActualizacion?: number
    metadata?: Record<string, unknown>
}