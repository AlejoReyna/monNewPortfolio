import Hero from "@/components/hero";
import Showcase from "@/components/showcase";
import Services from "@/components/services";
import MiniGame from "@/components/mini-game";
import LetsTalk from "@/components/lets-talk";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Showcase />
      <MiniGame />
      <LetsTalk />
    </main>
  );
}
