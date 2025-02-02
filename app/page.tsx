import About from "@/components/About";
import Events from "@/components/Events.client";
import Hero from "@/components/Hero";
import News from "@/components/News";

export default function Home() {
  return (
    <>
      <Hero />
      <News />
      <About />
      <Events />
    </>
  );
}