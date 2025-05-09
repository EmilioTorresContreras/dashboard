import { Users, BookOpen, Building , Calendar } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const sections = [
    { 
      name: "Estudiantes", 
      href: "/estudiantes", 
      icon: <Users className="h-8 w-8 mb-3 text-blue-500 group-hover:text-blue-600 transition-colors" />,
      description: "Gestiona la información de todos los estudiantes registrados."
    },
    { 
      name: "Maestros", 
      href: "/maestros", 
      icon: <Users className="h-8 w-8 mb-3 text-green-500 group-hover:text-green-600 transition-colors" />,
      description: "Administra el personal docente y sus asignaciones."
    },
    { 
      name: "Materias", 
      href: "/materias", 
      icon: <BookOpen className="h-8 w-8 mb-3 text-yellow-500 group-hover:text-yellow-600 transition-colors" />,
      description: "Explora y gestiona el catálogo de materias disponibles."
    },
    { 
      name: "Salones", 
      href: "/salones", 
      icon: <Building  className="h-8 w-8 mb-3 text-purple-500 group-hover:text-purple-600 transition-colors" />,
      description: "Visualiza y administra los espacios educativos."
    },
    { 
      name: "Horarios", 
      href: "/horarios", 
      icon: <Calendar className="h-8 w-8 mb-3 text-red-500 group-hover:text-red-600 transition-colors" />,
      description: "Organiza y consulta los horarios de clases."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-background py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">Sistema de Gestión Escolar</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Una plataforma integral para administrar todos los aspectos de tu institución educativa
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-12 px-4 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Accede a nuestros módulos
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <Link 
                href={section.href}
                key={section.name}
                className="group bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-100 dark:border-zinc-700 transform hover:-translate-y-1"
              >
                {section.icon}
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {section.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Sistema de Gestión Escolar. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}