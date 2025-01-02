"use client";

import { deleteColor } from "@/actions/customProduct/colors";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/widget/DataTable";
import { CustomColor } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { FC, useMemo } from "react";
import { toast } from "sonner";

interface ColorTableProps {
  colors: CustomColor[];
}

export const ColorTable: FC<ColorTableProps> = ({ colors }) => {
  const router = useRouter();

  const columns: ColumnDef<CustomColor>[] = useMemo(
    (): ColumnDef<CustomColor>[] => [
      {
        id: "number",
        accessorFn: (_, index) => index,
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            No.
            <ArrowUpDown size={16} />
          </Button>
        ),
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Color Name
            <ArrowUpDown size={16} />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "colorCode",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Color Code
            <ArrowUpDown size={16} />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("colorCode")}</div>,
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        id: "preview",
        header: () => <div>Preview</div>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded border"
              style={{ backgroundColor: row.original.colorCode }}
            />
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        id: "actions",
        header: () => <Button variant="ghost">Actions</Button>,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/admin/colors/${row.original.id}`);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  const loadingToast = toast.loading("Loading...");

                  const deleteResult = await deleteColor(row.original.id);
                  if (deleteResult.error) {
                    return toast.error(deleteResult.error.message, {
                      id: loadingToast,
                    });
                  }

                  return toast.success("Color deleted successfully!", {
                    id: loadingToast,
                  });
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableHiding: false,
      },
    ],
    [router],
  );

  return (
    <DataTable
      data={colors}
      columns={columns}
      createPath="/admin/colors/add"
      filterPlaceholder="Filter by color name"
    />
  );
};
