"use client";

import { upsertCategory } from "@/actions/categories";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { H2 } from "@/components/ui/text";
import { useZodForm } from "@/hooks/use-zod-form";
import { ProductCategory } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function CategoryForm({
  updateData,
}: {
  updateData?: ProductCategory;
}) {
  const router = useRouter();
  const upsertCategorySchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, "Nama kategori wajib diisi."),
        slug: z.string().min(1, "Slug wajib diisi."),
      }),
    [],
  );
  const [isManualSlug, setManualSLug] = useState(updateData ? true : false);

  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      name: updateData?.name || "",
      slug: updateData?.slug || "",
    },
    schema: upsertCategorySchema,
  });

  const name = form.watch("name");

  useEffect(() => {
    if (!isManualSlug && name !== "") {
      const slug = `${name.split(" ").slice(0, 8).join("-")}`;
      form.setValue("slug", slug);
    } else form.setValue("slug", updateData?.slug || "");
  }, [form, isManualSlug, name, updateData?.slug]);

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const loading = toast.loading(
      updateData ? "Memperbarui kategori..." : "Menambahkan kategori...",
    );

    try {
      const upsertCategoryResult = await upsertCategory({
        id: updateData?.id,
        ...values,
      });
      if (!upsertCategoryResult.success) {
        setLoading(false);
        return toast.error(
          updateData
            ? "Gagal memperbarui kategori!"
            : "Gagal menambahkan kategori!",
          { id: loading },
        );
      }
      setLoading(false);
      toast.success(
        updateData
          ? "Berhasil memperbarui kategori!"
          : "Berhasil menambahkan kategori!",
        { id: loading },
      );
      return router.push("/admin/shop/category");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setLoading(false);
      return toast.error(
        updateData
          ? "Gagal memperbarui kategori!"
          : "Gagal menambahkan kategori!",
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
            <>
              Edit Kategori {updateData.name} ({updateData.slug})
            </>
          ) : (
            <>Buat Kategori Baru</>
          )}
        </H2>
      </div>

      <form onSubmit={onSubmit} className="max-w-screen-lg space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Nama Kategori</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan nama kategori" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="slug">Slug</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!isManualSlug}
                  placeholder="Masukkan slug artikel"
                />
              </FormControl>
              <FormDescription>
                Slug akan digunakan untuk URL artikel.
                {"(https://tirai.id/shop/{slug})"}
              </FormDescription>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isManualSlug}
                  onCheckedChange={(e) => setManualSLug(e as boolean)}
                  color="#000000"
                />
                <Label className="text-black">Manual</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit" className="w-full">
          Simpan
        </Button>
      </form>
    </Form>
  );
}
