import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Botón de regreso - Parte superior */}
      <div className="absolute top-6 left-4 sm:left-8 z-10">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
          aria-label="Volver al inicio"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>
        </Link>
      </div>

      {/* Contenedor del formulario */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SignIn
            routing="path"
            path="/sign-in"
            afterSignInUrl="/dashboard"
            appearance={{
              elements: {
                card: "shadow-none border-0 bg-transparent",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm",
                formFieldInput: "text-sm focus:ring-2 focus:ring-blue-500",
                footerActionLink: "text-sm text-blue-600 hover:text-blue-800"
              },
              variables: {
                colorPrimary: "#2d957e"
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}