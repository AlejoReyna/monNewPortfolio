"use client";

/*
 * ==========================
 *  Código anterior (comentado)
 * ==========================
 *
 * import { useNavigation } from "@/contexts/navigation-context";
 * import HomeSection from "@/components/sections/home-section";
 * import ServicesSection from "@/components/sections/services-section";
 * import ProjectsSection from "@/components/sections/projects-section";
 * import ContactSection from "@/components/sections/contact-section";
 *
 * export default function Home() {
 *   const { currentSection, isTransitioning } = useNavigation();
 *
 *   const renderSection = () => {
 *     switch (currentSection) {
 *       case "home":
 *         return <HomeSection />;
 *       case "services":
 *         return <ServicesSection />;
 *       case "projects":
 *         return <ProjectsSection />;
 *       case "contact":
 *         return <ContactSection />;
 *       default:
 *         return <HomeSection />;
 *     }
 *   };
 *
 *   return (
 *     <main className="relative">
 *       <div
 *         className={`transition-opacity duration-300 ease-in-out ${
 *           isTransitioning ? "opacity-0" : "opacity-100"
 *         }`}
 *       >
 *         {renderSection()}
 *       </div>
 *     </main>
 *   );
 * }
 */

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-light tracking-tight">
          Please standby
        </h1>
        <p className="mt-3 text-sm font-light text-neutral-500">
          imma change this design
        </p>
      </div>
    </main>
  );
}
