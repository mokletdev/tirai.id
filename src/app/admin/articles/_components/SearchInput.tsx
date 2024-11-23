"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface SearchInputProps {
  title: string;
  tags: string;
}

export function SearchInput({
  searchTerm,
  handleSearch,
  setTitle,
  setTags,
}: {
  searchTerm: SearchInputProps;
  handleSearch: () => void;
  setTitle: (title: string) => void;
  setTags: (tags: string) => void;
}) {
  const form = useForm({
    defaultValues: {
      tags: searchTerm.tags || "",
      title: searchTerm.title || "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <FormControl>
          <FormItem className="w-full">
            <Input
              type="search"
              placeholder="Search Tags"
              className="w-full"
              value={searchTerm.tags || ""}
              onChange={(e) => setTags(e.target.value)}
            />
          </FormItem>
        </FormControl>
        <FormControl>
          <FormItem className="w-full">
            <Input
              type="search"
              placeholder="Search Title"
              className="w-full"
              value={searchTerm.title || ""}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormItem>
        </FormControl>
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
    </Form>
  );
}
