"use client";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { H1, H3, Body3, Body4 } from "@/components/ui/text";
import { FC } from "react";

const POLICY_ITEMS = [
  {
    number: "01",
    title: "Batas Waktu Pengajuan",
    description:
      "Pengajuan pengembalian maksimal 3 (tiga) hari kalender setelah barang diterima, sesuai status pengiriman pada marketplace.",
  },
  {
    number: "02",
    title: "Kondisi Barang",
    description:
      "Barang yang dikembalikan harus dalam kondisi baik, tidak rusak, tidak cacat, tidak kotor, dan belum digunakan.",
  },
  {
    number: "03",
    title: "Kelengkapan Kemasan",
    description:
      "Produk wajib dikembalikan dengan kemasan asli, label, serta kelengkapan lengkap seperti saat diterima.",
  },
  {
    number: "04",
    title: "Pengecualian",
    description:
      "Pengembalian tidak berlaku untuk barang yang rusak akibat kesalahan penggunaan, terkena air, sobek, atau kelalaian pembeli.",
  },
  {
    number: "05",
    title: "Bukti Pengajuan",
    description:
      "Pembeli wajib menyertakan video unboxing dan foto kondisi barang sebagai bukti saat mengajukan komplain.",
  },
  {
    number: "06",
    title: "Proses Refund / Penukaran",
    description:
      "Setelah barang kami terima dan diperiksa, proses refund atau penukaran barang akan diproses sesuai kebijakan marketplace.",
  },
  {
    number: "07",
    title: "Biaya Pengiriman Retur",
    description:
      "Biaya pengiriman retur mengikuti ketentuan marketplace atau hasil kesepakatan setelah pengecekan.",
  },
];

export default function ReturnPolicyPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-white text-foreground">
      <SectionContainer id="return-policy-hero" className="max-w-screen-2xl">
        <div className="relative overflow-hidden rounded-[1.25rem] bg-primary-950">
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary-500 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary-400 blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center px-6 py-20 text-center sm:px-12 md:px-[8.625rem]">
            <div className="mb-4 flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Body3 className="text-white">Jaminan Kepuasan Pelanggan</Body3>
            </div>

            <H1 className="mb-4 text-balance text-white">
              Kebijakan Pengembalian Barang
            </H1>

            <Body3 className="max-w-2xl text-balance text-white/70">
              Kami berkomitmen memberikan produk terbaik untuk setiap pembelian.
              Apabila terdapat kendala, pembeli dapat mengajukan pengembalian
              barang dengan ketentuan berikut.
            </Body3>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer id="return-policy-items" className="max-w-screen-2xl">
        <div className="py-12 md:py-16">
          <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {POLICY_ITEMS.map((item) => (
              <PolicyCard key={item.number} {...item} />
            ))}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer id="return-policy-footer" className="max-w-screen-2xl">
        <div className="mb-16 overflow-hidden rounded-[1.25rem] border border-neutral-100 bg-neutral-50">
          <div className="flex flex-col gap-8 px-6 py-10 md:flex-row md:items-end md:justify-between md:px-12">
            <div className="max-w-xl">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-1 w-6 rounded-full bg-primary-700" />
                <Body4 className="font-medium text-primary-700">
                  Catatan Penting
                </Body4>
              </div>
              <Body3 className="text-neutral-700">
                Dengan melakukan pembelian, pembeli dianggap telah membaca dan
                menyetujui kebijakan ini.
              </Body3>
            </div>

            {/* Signature */}
            <div className="flex flex-col items-start md:items-end">
              <Body4 className="mb-1 text-neutral-500">Hormat Kami,</Body4>
              <H3 className="text-neutral-700">Achmad Sodiq</H3>
              <Body4 className="text-neutral-400">Direktur Tirai.id</Body4>
            </div>
          </div>
        </div>
      </SectionContainer>
    </main>
  );
}


interface PolicyCardProps {
  number: string;
  title: string;
  description: string;
}

const PolicyCard: FC<PolicyCardProps> = ({ number, title, description }) => {
  return (
    <div className="group flex gap-5 rounded-[1rem] border border-neutral-100 bg-neutral-50 px-6 py-6 transition-colors duration-200 hover:border-primary-200 hover:bg-primary-50">
      <span className="mt-0.5 shrink-0 font-medium text-primary-700 opacity-40 transition-opacity duration-200 group-hover:opacity-100">
        {number}
      </span>

      <div className="flex flex-col gap-2">
        <H3 className="text-[18px] leading-[26px] text-neutral-700 md:text-[18px]">
          {title}
        </H3>
        <Body3 className="text-neutral-500">{description}</Body3>
      </div>
    </div>
  );
};