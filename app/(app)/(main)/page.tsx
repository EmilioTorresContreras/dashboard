'use client';
import { useState, useEffect } from "react";
import { useBreadcrumbStore } from "../../stores/breadcrumbStore";
import { ChevronDown, GraduationCap, Book, Clock, Users, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const setItems = useBreadcrumbStore(state => state.setItems);
  const [scrolled, setScrolled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setItems([
      { label: 'Escuela Limón', href: '/', isCurrentPage: true }
    ]);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setItems]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: (section as HTMLElement).offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
  }

  const handleContactSubmit = (e: React.FormEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const formData: ContactFormData = { name, email, subject, message };
    // Handle form submission logic here
    console.log(formData);
    // Reset form fields
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");

    alert("Mensaje enviado correctamente. Nos pondremos en contacto pronto.");
  };

  return (
    <div className="min-h-screen flex flex-col w-full ">


      {/* Hero Section with Parallax Effect */}
      <section id="inicio" className="flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900">
          <Image
            src="/imgs/escuela-3.png"
            alt="Fondo Escuela Limón"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            style={{
              transform: scrolled ? "translateY(10%)" : "translateY(0%)",
              transition: "transform 0.5s ease-out"
            }}
          />
        </div>

        <div className="relative z-10 text-center px-2 max-w-3xl mx-auto py-50">
          <div className="opacity-0 animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Escuela Limón
            </h1>
            <p className="text-xl text-zinc-200 mb-8">
              Formando el futuro a través de la excelencia educativa
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fadeInDelay">
            <button
              onClick={() => scrollToSection("programas")}
              className="px-6 py-3 bg-white text-zinc-900 rounded-md font-medium hover:bg-zinc-100 transition-colors"
            >
              Nuestros Programas
            </button>
            <button
              onClick={() => scrollToSection("contacto")}
              className="px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white/10 transition-colors"
            >
              Contáctanos
            </button>
          </div>

          <div className=" animate-bounce absolute top-130 sm:top-110 left-1/2 transform -translate-x-1/2">
            <ChevronDown
              className="h-8 w-8 text-white opacity-70 cursor-pointer"
              onClick={() => scrollToSection("nosotros")}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-20 px-4 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Sobre Nosotros</h2>
            <div className="h-1 w-20 bg-zinc-900 dark:bg-zinc-100 mx-auto opacity-0 animate-growWidth"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Nuestra Misión</h3>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                En Escuela Limón nos dedicamos a proporcionar una educación integral de alta calidad que desarrolle las habilidades académicas, sociales y emocionales de nuestros estudiantes. Fomentamos un ambiente donde el pensamiento crítico y la creatividad son pilares fundamentales para el crecimiento personal.
              </p>

              <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 pt-4">Nuestra Visión</h3>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Aspiramos a ser reconocidos como una institución educativa líder que forma individuos íntegros, comprometidos con su comunidad y preparados para enfrentar los retos del mundo contemporáneo con excelencia y valores sólidos.
              </p>
            </div>

            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl opacity-0 animate-slideInRight">
              <div className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-700">
                <Image
                  src="/imgs/escuela-2.png"
                  alt="About imagen"
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                  style={{
                    transform: scrolled ? "translateY(10%)" : "translateY(0%)",
                    transition: "transform 0.5s ease-out"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programas" className="py-20 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Nuestros Programas</h2>
            <div className="h-1 w-20 bg-zinc-900 dark:bg-zinc-100 mx-auto opacity-0 animate-growWidth"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Book className="h-12 w-12 mb-4" />,
                title: "Programa Académico",
                description: "Currículo completo adaptado a las necesidades educativas contemporáneas con énfasis en ciencias, tecnología, artes y humanidades."
              },
              {
                icon: <Users className="h-12 w-12 mb-4" />,
                title: "Desarrollo Integral",
                description: "Actividades extracurriculares diseñadas para potenciar habilidades sociales, artísticas y deportivas que complementan la formación académica."
              },
              {
                icon: <GraduationCap className="h-12 w-12 mb-4" />,
                title: "Orientación Vocacional",
                description: "Programa especializado para guiar a los estudiantes en la identificación de sus talentos y la elección de su futuro profesional."
              }
            ].map((program, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-zinc-100 dark:border-zinc-700 transform hover:-translate-y-1"
                style={{ opacity: 0, animation: `fadeIn 0.8s ease-out forwards ${index * 0.2}s` }}
              >
                <div className="text-zinc-800 dark:text-zinc-200">
                  {program.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">{program.title}</h3>
                <p className="text-zinc-700 dark:text-zinc-300">{program.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendario" className="py-20 px-4 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Calendario Escolar</h2>
            <div className="h-1 w-20 bg-zinc-900 dark:bg-zinc-100 mx-auto opacity-0 animate-growWidth"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm opacity-0 animate-slideInLeft">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Próximos Eventos
              </h3>

              <div className="space-y-6">
                {[
                  { date: "15 Mayo", title: "Día del Maestro", desc: "Celebración especial para nuestro personal docente" },
                  { date: "20 Mayo", title: "Feria de Ciencias", desc: "Exposición de proyectos científicos de los estudiantes" },
                  { date: "5 Junio", title: "Festival Cultural", desc: "Muestras artísticas y presentaciones culturales" },
                  { date: "30 Junio", title: "Clausura del Ciclo", desc: "Ceremonia de fin de curso escolar" }
                ].map((event, index) => (
                  <div key={index} className="flex items-start border-b border-zinc-200 dark:border-zinc-700 pb-4 last:border-0 last:pb-0">
                    <div className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-2 rounded text-center min-w-16">
                      <span className="text-sm font-medium block">{event.date.split(" ")[0]}</span>
                      <span className="text-xs block">{event.date.split(" ")[1]}</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-zinc-900 dark:text-zinc-100 font-medium">{event.title}</h4>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="opacity-0 animate-slideInRight">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Periodos Escolares</h3>

              <div className="space-y-4">
                <div className="relative pl-8 pb-8 border-l border-zinc-300 dark:border-zinc-700">
                  <div className="absolute left-0 top-0 transform -translate-x-1/2 w-4 h-4 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  <h4 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Primer Trimestre</h4>
                  <p className="text-zinc-600 dark:text-zinc-300 mb-2">Agosto - Noviembre</p>
                  <p className="text-zinc-700 dark:text-zinc-400 text-sm">Enfoque en adaptación y establecimiento de bases académicas fundamentales.</p>
                </div>

                <div className="relative pl-8 pb-8 border-l border-zinc-300 dark:border-zinc-700">
                  <div className="absolute left-0 top-0 transform -translate-x-1/2 w-4 h-4 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  <h4 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Segundo Trimestre</h4>
                  <p className="text-zinc-600 dark:text-zinc-300 mb-2">Diciembre - Marzo</p>
                  <p className="text-zinc-700 dark:text-zinc-400 text-sm">Desarrollo de proyectos colaborativos y profundización de conocimientos.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 transform -translate-x-1/2 w-4 h-4 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  <h4 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Tercer Trimestre</h4>
                  <p className="text-zinc-600 dark:text-zinc-300 mb-2">Abril - Julio</p>
                  <p className="text-zinc-700 dark:text-zinc-400 text-sm">Cierre de ciclo, evaluaciones finales y presentación de resultados.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Contáctanos</h2>
            <div className="h-1 w-20 bg-zinc-900 dark:bg-zinc-100 mx-auto opacity-0 animate-growWidth"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6 opacity-0 animate-slideInLeft">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Información de Contacto</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-zinc-700 dark:text-zinc-300 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Ubicación</h4>
                    <p className="text-zinc-700 dark:text-zinc-400">Av. Principal #123, Col. Centro<br />Ciudad de México, CP 12345</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-zinc-700 dark:text-zinc-300 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Correo Electrónico</h4>
                    <p className="text-zinc-700 dark:text-zinc-400">contacto@escuelalimon.edu.mx</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-zinc-700 dark:text-zinc-300 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Teléfono</h4>
                    <p className="text-zinc-700 dark:text-zinc-400">(55) 1234-5678</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-3">Horario de Atención</h4>
                <p className="text-zinc-700 dark:text-zinc-400">
                  Lunes a Viernes: 8:00 AM - 4:00 PM<br />
                  Sábados: 9:00 AM - 1:00 PM
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-700 opacity-0 animate-slideInRight">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Envíanos un Mensaje</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Asunto</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Mensaje</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                  ></textarea>
                </div>

                <button
                  onClick={handleContactSubmit}
                  className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center"
                >
                  Enviar Mensaje
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes growWidth {
          from { width: 0; opacity: 0; }
          to { width: 5rem; opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          animation-delay: 0.2s;
        }
        
        .animate-fadeInDelay {
          animation: fadeIn 0.8s ease-out forwards;
          animation-delay: 0.4s;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
          animation-delay: 0.3s;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
          animation-delay: 0.3s;
        }
        
        .animate-growWidth {
          animation: growWidth 0.8s ease-out forwards;
          animation-delay: 0.5s;
        }
        
        section {
          scroll-margin-top: 80px;
        }
      `}</style>
    </div>
  );
}