import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Trace } from "@/components/Trace";
import { Work } from "@/components/Work";
import { Stack } from "@/components/Stack";
import { BeyondCode } from "@/components/BeyondCode";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Overlays } from "@/components/Overlays";
import { Toast } from "@/components/Toast";
import { Effects } from "@/components/Effects";
import { Uli } from "@/components/Uli";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <Trace />
        <Work />
        <Stack />
        <BeyondCode />
        <Contact />
      </main>
      <Footer />
      <Overlays />
      <Toast />
      <Effects />
      <Uli />
    </>
  );
}
