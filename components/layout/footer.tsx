"use client";

/**
 * # Footer
 * Pie de página global con links esenciales, redes sociales y selector de tema.
 */

import Link from "next/link";
import { Instagram, Facebook, Twitter, GraduationCap } from "lucide-react";

export function Footer(): React.ReactElement {
  return (
    <footer className="border-t bg-muted/40 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
      <div className="max-w-6xl mx-auto">


        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-8 sm:flex-row sm:justify-between">
          {/* Brand + navegación rápida */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <span className="text-lg font-semibold tracking-wide flex flex-row gap-2">
              {<GraduationCap />} Escuela Limón
            </span>
            <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link href="/" className="transition hover:text-foreground">
                Inicio
              </Link>
              <Link href="/about" className="transition hover:text-foreground">
                Nosotros
              </Link>
              <Link href="/contact" className="transition hover:text-foreground">
                Contacto
              </Link>
              <Link href="/calendario" className="transition hover:text-foreground">
                Calendario
              </Link>
              <Link href="/programas" className="transition hover:text-foreground">
                Programsa
              </Link>
            </nav>
          </div>

          {/* Social + theme toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="https://instagram.com/tu‑perfil"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded p-2 transition hover:bg-accent"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://facebook.com/tu‑pagina"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded p-2 transition hover:bg-accent"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com/tu‑usuario"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded p-2 transition hover:bg-accent"
            >
              <Twitter className="h-5 w-5" />
            </Link>

          </div>

        </div>
        <div className="border-t py-8 text-center text-zinc-400 text-sm">
          <p>© {new Date().getFullYear()} Escuela Limón. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
