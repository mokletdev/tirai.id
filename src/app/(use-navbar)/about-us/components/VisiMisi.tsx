import Image from "next/image";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Body3, H2 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";

export default function VisiMisi() {
  return (
    <SectionContainer>
      <SectionTitle>Visi & Misi</SectionTitle>
      <H2 className="mb-[3.875rem] w-full text-black lg:max-w-[50%]">
        Komitmen Kami untuk Memberikan Layanan Tirai Terbaik
      </H2>
      <div className="mb-[3.875rem] flex flex-col justify-between lg:flex-row-reverse">
        <Image
          src={"/assets/vision.png"}
          alt="Asset Visi"
          width={367}
          height={160}
          className="pointer-events-none mb-[1.25rem] h-auto w-full object-cover lg:mb-0 lg:w-[32%]"
        />
        <div className="flex w-full flex-col justify-between lg:max-w-[55%]">
          <H2 className="mb-[3.75rem] text-black lg:mb-0">Visi</H2>
          <Body3 className="text-black">
            Menjadi penyedia tirai terpercaya di Indonesia yang mengutamakan
            kualitas, inovasi, dan kepuasan pelanggan untuk menciptakan ruang
            yang indah dan nyaman. Kami bercita-cita untuk membantu menciptakan
            ruangan yang lebih nyaman dan estetis bagi setiap pelanggan
          </Body3>
        </div>
      </div>
      <div className="flex flex-col justify-between lg:flex-row-reverse">
        <Image
          src={"/assets/mission.png"}
          alt="Asset Misi"
          width={367}
          height={160}
          className="pointer-events-none mb-[1.25rem] h-auto w-full object-cover lg:mb-0 lg:w-[32%]"
        />
        <div className="flex w-full flex-col justify-between lg:max-w-[55%]">
          <H2 className="mb-[3.75rem] text-black lg:mb-0">Misi</H2>
          <Body3 className="text-black">
            Kami berkomitmen untuk menyediakan tirai berkualitas tinggi dengan
            desain estetis dan fungsional, memberikan layanan pemesanan yang
            cepat dan tepat, serta selalu mengutamakan kepuasan pelanggan
          </Body3>
        </div>
      </div>
    </SectionContainer>
  );
}
