"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface SortFormValues {
  rating: "1" | "2" | "3" | "4" | "5" | "";
  status: "all" | "published" | "archived" | "";
}

export const SelectFilter: React.FC<{
  rating: string;
  setRating: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setRating, rating }) => {
  const form = useForm<SortFormValues>({
    defaultValues: {
      rating: (rating as SortFormValues["rating"]) || "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex w-full items-center justify-between space-x-2"
      >
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="w-full">
              <Select
                onValueChange={(value) => {
                  const ratingValue = value as SortFormValues["rating"];
                  field.onChange(ratingValue);
                  setRating(ratingValue);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bintang" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["1", "2", "3", "4", "5"].map((sortOption) => (
                    <SelectItem key={sortOption} value={sortOption}>
                      {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
