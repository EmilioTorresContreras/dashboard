'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserFormValues, userSchema } from "@/app/shemas/user";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useBreadcrumbStore } from "@/app/stores/breadcrumbStore";
import { toast } from "sonner";

export default function UserCreateForm() {

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      confirmPassword: "",
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

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await createUser({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: data.password,
        rol: data.rol,
        metadata: {}
      });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error(err);
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              {/* <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button> */}
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
      {/* <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-6 p-4">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" placeholder="Juan" {...register("nombre")} />
          {errors.nombre && <p className="text-red-600 mt-1 text-sm">{errors.nombre.message}</p>}
        </div>

        <div>
          <Label htmlFor="apellido">Apellido</Label>
          <Input id="apellido" placeholder="Pérez" {...register("apellido")} />
          {errors.apellido && <p className="text-red-600 mt-1 text-sm">{errors.apellido.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="correo@ejemplo.com" {...register("email")} />
          {errors.email && <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-red-600 mt-1 text-sm">{errors.confirmPassword.message}</p>}
        </div>

        <div>
          <Label htmlFor="rol">Rol</Label>
          <Select defaultValue="usuario" {...register("rol")}>
            <SelectTrigger id="rol">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="usuario">Usuario</SelectItem>
            </SelectContent>
          </Select>
          {errors.rol && <p className="text-red-600 mt-1 text-sm">{errors.rol.message}</p>}
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </div>
      </form> */}
    </div>
  );
}
