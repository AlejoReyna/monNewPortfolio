import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="relative">
      {/* Background continuo para toda la página */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-10"></div>
      
      <Hero />
      {/* <About /> 
      <Services />
      <Showcase />
      <MiniGame />
      <LetsTalk />
      */}
    </main>
  );
}
