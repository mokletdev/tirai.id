import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { H1, H3, H6 } from "@/components/ui/text";
import { SectionTitle } from "@/components/widget/SectionTitle";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Author from "./author";

export default function Recent() {
  return (
    <SectionContainer>
      <div className="flex flex-col">
        <SectionTitle>Blog</SectionTitle>
        <H1 className="mb-[1.375rem] text-black">Recent Post</H1>
        <div id="post" className="flex flex-col justify-between lg:flex-row">
          <img
            src="/assets/post-thumbnail.png"
            alt="recent thumbnail"
            width={560}
            height={345}
          />
          <div
            id="paragraph"
            className="mt-11 flex max-w-full flex-col justify-between md:mt-0 lg:max-w-[48%]"
          >
            <div>
              <H3 className="mb-3 text-black">
                Tips Berbelanja Tirai yang Berkualitas
              </H3>
              <H6 className="mb-3 text-black opacity-50">
                Tips Memilih Tirai yang Berkualitas - Tirai tidak hanya
                mempercantik ruangan, tetapi juga membantu mengatur pencahayaan
                dan privasi. Dengan berbagai pilihan yang tersedia, penting
                untuk memilih tirai yang sesuai kebutuhan. Pastikan untuk
                mempertimbangkan bahan dan fungsi. Tirai blackout cocok untuk
                kamar tidur, sedangkan tirai berbahan ringan lebih sesuai untuk
                ruang tamu yang membutuhkan pencahayaan alami.
              </H6>
            </div>
            <div className="flex flex-col items-start justify-between lg:flex-row lg:items-center">
              <Author />

              {/* TODO: Change this to the recent post route */}
              <Link
                href={"#"}
                className={buttonVariants({
                  variant: "default",
                  className: "w-full flex-grow sm:w-fit md:flex-grow-0",
                })}
              >
                Baca Artikel <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
