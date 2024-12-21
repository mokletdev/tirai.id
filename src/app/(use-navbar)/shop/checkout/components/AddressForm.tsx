import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { z } from "zod";

const addressSchema = z.object({
  perusahaan: z.string().optional(),
  alamat: z.string().min(1, "Alamat harus diisi"),
  kota: z.string().min(1, "Kota harus diisi"),
  provinsi: z.string().min(1, "Provinsi harus diisi"),
  kodePos: z.string().min(5, "Kode pos harus 5 digit").max(5),
  telepon: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(13, "Nomor telepon maksimal 13 digit")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka"),
});

type AddressFormData = z.infer<typeof addressSchema>;

export const AddressForm: FC = () => {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      perusahaan: "",
      alamat: "",
      kota: "",
      provinsi: "",
      kodePos: "",
      telepon: "",
    },
  });

  const onSubmit = (data: AddressFormData) => {
    console.log(data);
    // Handle form submission here
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <h3 className="text-2xl font-bold text-black mb-6">Alamat Pengiriman</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="perusahaan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perusahaan</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nama Perusahaan (Opsional)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan Alamat" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kota</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Kota" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provinsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinsi</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Provinsi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kodePos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Pos</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Kode Pos" maxLength={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telepon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telepon</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nomor Telepon" type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full mt-6">
            Simpan Alamat
          </Button>
        </form>
      </Form>
    </div>
  );
};
