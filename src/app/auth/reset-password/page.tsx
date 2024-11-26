"use client";

import { requestResetPasswordMail } from "@/actions/mail";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Body3, H2 } from "@/components/ui/text";
import { COLORS } from "@/constants/color";
import { useZodForm } from "@/hooks/use-zod-form";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordConfirmationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email harus diisi!" })
    .email("Email tidak valid!"),
});

const HasSentWarning: FC<{
  email: string;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}> = ({ email, loading, setLoading }) => {
  return (
    <>
      <div className="justify center mb-8 flex max-w-[68px] items-center rounded-full bg-primary-50 p-[1.125rem]">
        <Mail color={COLORS.primary[900]} />
      </div>
      <div className="flex flex-col text-black">
        <H2 className="mb-3 w-full text-center">Cek Email Anda</H2>
        <Body3 className="mb-[3.375rem] text-center text-neutral-500">
          Kami telah mengirimkan email untuk reset kata sandi ke <br />
          <span className="font-medium text-black">{email}</span>
        </Body3>
        <Body3 className="mb-[3.375rem] text-center text-neutral-500">
          Belum menerima email?{" "}
          <Button
            variant={"link"}
            size={"link"}
            disabled={loading}
            onClick={async () => {
              setLoading(true);

              const loadingToast = toast.loading("Loading...");

              const { error } = await requestResetPasswordMail(email);

              if (error) {
                toast.error(error.message, { id: loadingToast });
                return setLoading(false);
              }

              toast.success("Berhasil mengirim ulang email reset kata sandi", {
                id: loadingToast,
              });
              return setLoading(false);
            }}
          >
            Kirim ulang
          </Button>
        </Body3>
      </div>
    </>
  );
};

export default function ResetPasswordConfirmation() {
  const form = useZodForm({ schema: resetPasswordConfirmationSchema });
  const [loading, setLoading] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (fields) => {
    setLoading(true);

    const loadingToast = toast.loading("Loading...");

    const requestResetPasswordMailResult = await requestResetPasswordMail(
      fields.email,
    );

    if (requestResetPasswordMailResult.error) {
      setLoading(false);
      return toast.error(requestResetPasswordMailResult.error.message, {
        id: loadingToast,
      });
    }

    toast.success(
      "Email respon atas permintaan reset kata sandi anda telah dikirim",
      { id: loadingToast },
    );
    setLoading(false);
    return setHasSent(true);
  });

  return (
    <section className="flex w-full max-w-full flex-col items-center">
      {hasSent ? (
        <HasSentWarning
          email={form.getValues("email")}
          loading={loading}
          setLoading={setLoading}
        />
      ) : (
        <>
          <div className="justify center mb-8 flex max-w-[68px] items-center rounded-full bg-primary-50 p-[1.125rem]">
            <Lock color={COLORS.primary[900]} />
          </div>
          <div className="flex flex-col text-black">
            <H2 className="mb-3 w-full text-center">Atur Ulang Kata Sandi</H2>
            <Body3 className="mb-[3.375rem] text-center text-neutral-500">
              Kata sandi baru Anda harus berbeda dari kata sandi sebelumnya.
            </Body3>
            <Form {...form}>
              <form onSubmit={onSubmit} className="mb-8">
                <div className="mb-[3.375rem] flex w-full flex-col gap-y-[1.375rem]">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Masukkan alamat email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button disabled={loading} type="submit" className="w-full">
                  Reset password
                </Button>
              </form>
            </Form>
            <Link
              href={"/auth/login"}
              className={buttonVariants({
                variant: "link",
                size: "link",
                className: "self-center",
              })}
            >
              <ArrowLeft /> Kembali ke halaman masuk
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
