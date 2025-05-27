"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  code: z.string().min(6, "Código requerido").optional(),
});

export function CambiarCorreoModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [successStep1, setSuccessStep1] = useState(false);
  const [newEmailId, setNewEmailId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!isLoaded || !user) return;
    setLoading(true);
    setErrorMsg("");

    try {
      if (!successStep1) {
        // Paso 1: crear email y enviar código
        const newEmail = await user.createEmailAddress({
          email: data.email,
        });

        await newEmail.prepareVerification({ strategy: "email_code" });

        setNewEmailId(newEmail.id);
        setSuccessStep1(true);
      } else {
        // Paso 2: verificar código
        const emailToVerify = user.emailAddresses.find(
          (e) => e.id === newEmailId
        );

        if (!emailToVerify) throw new Error("Correo no encontrado.");

        await emailToVerify.attemptVerification({ code: data.code! });

        await user.update({ primaryEmailAddressId: emailToVerify.id });

        // Opcional: eliminar correos antiguos
        for (const e of user.emailAddresses) {
          if (e.id !== emailToVerify.id) {
            await e.destroy();
          }
        }

        toast.success("Correo cambiado exitosamente");

        reset();
        setOpen(false);
      }
    } catch (err) {
      toast.error("Ocurrio un error al cambiar el correo");
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSuccessStep1(false);
    setNewEmailId(null);
    setErrorMsg("");
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar correo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!successStep1 ? (
            <>
              <Input
                placeholder="nuevo@email.com"
                {...register("email")}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Se envió un código de verificación al nuevo correo. Ingresa el
                código:
              </p>
              <Input
                placeholder="Código de verificación"
                {...register("code")}
                disabled={loading}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </>
          )}

          {errorMsg && (
            <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Procesando..."
                : !successStep1
                ? "Enviar código"
                : "Verificar y guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
