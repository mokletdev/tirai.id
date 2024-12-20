import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { H3 } from "@/components/ui/text";
import { useZodForm } from "@/hooks/use-zod-form";
import { FC } from "react";
import { z } from "zod";

const addressSchema = z.object({});

export const AddressForm: FC = () => {
  const form = useZodForm({ schema: addressSchema });

  return (
    <div className="flex w-1/2 flex-col justify-start">
      <H3 className="text-bold text-black">Shipping Address</H3>
      <div className="flex flex-row justify-between">
        <FormField
          control={form.control}
          name="Perusahaan"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Perusahaan</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nama Perusahaan (Opsional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Alamat"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Alamat</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan Alamat" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Kota"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Kota</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Kota" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Provinsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Provinsi</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Provinsi" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Kode Pos"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Kode Pos</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Kode Pos" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Telepon"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Telepon</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nomor Telepon" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button></Button>
      </div>
    </div>
  );
};
