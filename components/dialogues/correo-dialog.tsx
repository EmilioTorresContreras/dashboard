// components/CambiarCorreoModal.tsx

"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@clerk/nextjs";

export function CambiarCorreoModal({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl h-[90vh] sm:max-w-5xl overflow-y-auto flex flex-col justify-center items-center">
        <DialogHeader>
          <DialogTitle className="mb-4">Gestiona tu correo</DialogTitle>
        </DialogHeader>

        {/* <UserProfile routing="hash"/> */}
  <UserProfile routing="hash" />

        <DialogClose asChild>
          <Button variant="secondary" className="mt-4">
            Cerrar
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
