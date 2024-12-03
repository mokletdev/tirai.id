"use client";

import { deleteUserAction } from "@/actions/users";
import { Button, buttonVariants } from "@/components/ui/button";
import { Body3, Body4, H3 } from "@/components/ui/text";
import { User } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export const UserCard = ({ data }: { data: User }) => {
  const [loading, setLoading] = useState(false);

  return (
    <figure className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-black">
      <div>
        <H3 className="mb-2">{data.name}</H3>
        <Body3>{data.role}</Body3>
        <Body4>{data.email}</Body4>
      </div>
      <div className="mt-4 flex gap-3">
        <Link
          href={`/admin/user/${data.id}`}
          className={buttonVariants({
            variant: "default",
            className: "flex-grow",
          })}
        >
          Edit
        </Link>
        <Button
          className="flex-grow"
          variant={"destructive"}
          disabled={loading}
          onClick={async () => {
            setLoading(true);

            const loadingToast = toast.loading("Menghapus User...");
            const delUserRes = await deleteUserAction({
              data: {
                id: data.id,
              },
            });

            if (delUserRes.success) {
              setLoading(false);
              return toast.success("Berhasil menghapus user!", {
                id: loadingToast,
              });
            }
            setLoading(false);
            return toast.error("Gagal menghapus user!", {
              id: loadingToast,
            });
          }}
        >
          Delete
        </Button>
      </div>
    </figure>
  );
};
