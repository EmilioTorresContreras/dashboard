'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UsuarioFormValues, usuarioSchema } from "@/app/shemas/usuario";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useBreadcrumbStore } from "@/app/stores/breadcrumbStore";
import { toast } from "sonner";

export default function UserCreateForm() {

  const form = useForm<UsuarioFormValues>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      rol: "usuario"
    }
  })

  const createUser = useAction(api["usersActions"].crearUsuarioConClerk);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setItems = useBreadcrumbStore(state => state.setItems)

  useEffect(() => {
    setItems([
      { label: 'Escuela Limón', href: '/' },
      { label: 'Usuarios', href: '/usuarios' },
      { label: 'Crear Usuario', isCurrentPage: true },
    ])
  }, [setItems])

  const onSubmit = async (data: UsuarioFormValues) => {
    try {
      setIsSubmitting(true);
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
      let password = "";
      for (let i = 0, n = charset.length; i < 6; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      const year = new Date().getFullYear()
      const random = Math.floor(Math.random() * 1000)
      const passwordComplet = `${data.nombre.slice(0, 3)}${data.apellido.slice(0, 3)}Limon${year}${random}${password}`

      const result = await createUser({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: passwordComplet,
        rol: data.rol,
        metadata: {}
      });
      if (result.success) {
        try {
          await fetch("/api/enviar-correo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: data.nombre,
              apellido: data.apellido,
              email: data.email,
              rol: data.rol,
              password: passwordComplet,
              id: result.userId
            }),
          });
          toast.success("Correo enviado exitosamente");
        } catch (emailError) {
          toast.error("Ocurrió un error al enviar el correo");
          console.error("Error al enviar el correo:", emailError);
        }
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Crear Nuevo Usuario
          </h1>
        </div>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-semibold text-center">Crear un nuevo usuario</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="correo@ejemplo.com"  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usuario">Usuario</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Creando..." : "Crear Usuario"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
