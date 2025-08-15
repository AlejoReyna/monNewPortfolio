import Hero from "@/components/hero";
import About from "@/components/about";
import Showcase from "@/components/showcase";
import Services from "@/components/services";
import MiniGame from "@/components/mini-game";
import LetsTalk from "@/components/lets-talk";

export default function Home() {
  return (
    <main className="relative">
      {/* Background continuo para toda la página */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-10"></div>
      
      <Hero />
      <About />
      <Services />
      <Showcase />
      <MiniGame />
      <LetsTalk />
    </main>
  );
}
