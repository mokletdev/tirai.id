import { PageContainer } from "@/components/layout/PageContainer";
import { Testimonies } from "../(landing-page)/components/Testimonies";
import { Client } from "./components/Client";
import { Hero } from "./components/Hero";
import { Keunggulan } from "./components/Keunggulan";
import VisiMisi from "./components/VisiMisi";

export default function AboutUs() {
  return (
    <PageContainer>
      <Hero />
      <VisiMisi />
      <Client />
      <Keunggulan />
      <Testimonies />
    </PageContainer>
  );
}
