import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Botón de regreso - Parte superior (igual que en SignIn) */}
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
          <SignUp
            routing="path"
            path="/sign-up"
            afterSignUpUrl="/dashboard"
            appearance={{
              elements: {
                card: "shadow-none border-0 bg-transparent",
                formButtonPrimary: "bg-green-600 hover:bg-green-700 text-sm",
                formFieldInput: "text-sm focus:ring-2 focus:ring-green-500",
                footerActionLink: "text-sm text-green-600 hover:text-green-800",
                footerActionText: "text-gray-500 text-sm",
                socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50"
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