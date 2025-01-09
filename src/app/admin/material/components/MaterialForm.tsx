"use client";

import { upsertMaterial } from "@/actions/customProduct/materials";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Body3, H2, H5 } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useZodForm } from "@/hooks/use-zod-form";
import { cn } from "@/lib/utils";
import { MaterialWithAllowedModel } from "@/types/entityRelations";
import { formatPrice } from "@/utils/format-price";
import { Model } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function MaterialForm({
  updateData,
  models,
}: {
  updateData?: MaterialWithAllowedModel;
  models: Model[];
}) {
  const router = useRouter();
  const upsertCategorySchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, "Nama material wajib diisi."),
        price: z.string().min(1, "Harga wajib diisi."),
        supplier_price: z.string().min(1, "Harga untuk supplier wajib diisi."),
        description: z.string().min(1, "Deskripsi wajib diisi"),
        image: updateData ? z.instanceof(File).optional() : z.instanceof(File),
        allowedModels: z.string().array(),
      }),
    [],
  );

  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      name: updateData?.name || "",
      price: updateData?.price.toString() || "",
      supplier_price: updateData?.supplier_price.toString() || "",
      description: updateData?.description?.toString(),
      allowedModels: updateData?.allowed_model.map((i) => i.name) || [],
    },
    schema: upsertCategorySchema,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const loading = toast.loading(
      updateData ? "Memperbarui material..." : "Menambahkan material...",
    );

    try {
      const imageData = new FormData();
      if (values.image) imageData.append("image", values.image);
      const upsertCategoryResult = await upsertMaterial(
        {
          id: updateData?.id,
          ...values,
        },
        imageData,
      );
      if (!upsertCategoryResult.success) {
        setLoading(false);
        return toast.error(
          updateData
            ? "Gagal memperbarui material!"
            : "Gagal menambahkan material!",
          { id: loading },
        );
      }
      setLoading(false);
      toast.success(
        updateData
          ? "Berhasil memperbarui material!"
          : "Berhasil menambahkan material!",
        { id: loading },
      );
      return router.push("/admin/material");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setLoading(false);
      return toast.error(
        updateData
          ? "Gagal memperbarui material!"
          : "Gagal menambahkan material!",
        { id: loading },
      );
    }
  });

  return (
    <Form {...form}>
      <div className="mb-12 flex flex-col items-start gap-4">
        <Button
          variant={"link"}
          size={"link"}
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft /> Kembali
        </Button>
        <H2 className="text-black">
          {updateData ? (
            <>Edit Bahan {updateData.name}</>
          ) : (
            <>Tambah Bahan Baru</>
          )}
        </H2>
      </div>

      <form onSubmit={onSubmit} className="max-w-screen-lg space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Nama Bahan</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan nama bahan" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="price">Harga (per m²)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(formatPrice(e.target.value));
                  }}
                  placeholder="Masukkan harga material"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplier_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="supplier_price">
                Harga dari Supplier (per m²)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(formatPrice(e.target.value));
                  }}
                  placeholder="Masukkan harga material untuk supplier"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">Deskripsi</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Deskripsi bahan" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Label className={cn("mb-1 text-black")}>Model</Label>
          {models.map((i) => (
            <div key={i.id} className="flex items-center gap-1">
              <Checkbox
                defaultChecked={form
                  .getValues("allowedModels")
                  .some((j) => j === i.name)}
                onCheckedChange={(e) => {
                  const allowed = form.getValues("allowedModels");
                  if (e as boolean) {
                    if (!allowed.find((j) => j === i.name))
                      form.setValue("allowedModels", [...allowed, i.name]);
                  } else {
                    if (allowed.find((j) => j === i.name)) {
                      form.setValue(
                        "allowedModels",
                        allowed.filter((j) => j !== i.name),
                      );
                    }
                  }
                }}
              />
              <Body3 className="text-black">{i.name}</Body3>
            </div>
          ))}
        </div>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gambar (optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  placeholder="Unggah gambar"
                  accept="image/*"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <H5 className="text-black">Gambar</H5>
        {updateData?.image ? (
          <Image
            src={updateData?.image}
            alt="Model preview"
            height={200}
            width={200}
          />
        ) : (
          <p className="text-sm text-black">Tidak ada gambar</p>
        )}
        <Button disabled={loading} type="submit" className="w-full">
          Simpan
        </Button>
      </form>
    </Form>
  );
}
