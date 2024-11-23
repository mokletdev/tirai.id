"use client";
import { SearchInput } from "./SearchInput";
import { SearchSelector } from "./SearchSelector";
import { useRouter } from "next/navigation";
import { DateRangePicker } from "./DateRangePicker";
import { useState } from "react";
interface ArticleFilterLayoutProps {
  title: string;
  tags: string;
  sort: "latest" | "popular";
  status: "all" | "published" | "archived";
}
export default function ArticleFilterLayout({
  searchData,
}: {
  searchData: ArticleFilterLayoutProps;
}) {
  const [searchTitle, setSearchTitle] = useState(searchData.title);
  const [searchTags, setSearchTags] = useState(searchData.tags);
  const [searchSort, setSearchSort] = useState(searchData.sort);
  const [searchStatus, setSearchStatus] = useState(searchData.status);

  const router = useRouter();

  function handleSearch() {
    const params: URLSearchParams = new URLSearchParams();
    if (searchTitle) {
      const trimmedSearch = searchTitle.trim();
      params.set("title", trimmedSearch);
    }
    if (searchTags) {
      const trimmedSearch = searchTags.trim();
      params.set("tags", trimmedSearch);
    }
    if (searchSort) {
      params.set("sort", searchSort);
    }
    if (searchStatus) {
      params.set("status", searchStatus);
    }
    router.push(`?${params.toString()}`);
  }

  function handleSearchSelector(
    sort?: ArticleFilterLayoutProps["sort"],
    status?: ArticleFilterLayoutProps["status"],
  ) {
    const params: URLSearchParams = new URLSearchParams();
    if (searchTitle) {
      const trimmedSearch = searchTitle.trim();
      params.set("title", trimmedSearch);
    }
    if (searchTags) {
      const trimmedSearch = searchTags.trim();
      params.set("tags", trimmedSearch);
    }
    if (sort) {
      const newSort = sort;
      setSearchSort(newSort);
      params.set("sort", newSort);
    }
    if (status) {
      const newStatus = status;
      setSearchStatus(newStatus);
      params.set("status", newStatus);
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex w-full flex-row space-x-2">
      <DateRangePicker />
      <SearchSelector
        searchTerm={{ sort: searchSort, status: searchStatus }}
        setSort={setSearchSort}
        setStatus={setSearchStatus}
        handleSearch={handleSearchSelector}
      />
      <SearchInput
        searchTerm={{ title: searchTitle, tags: searchTags }}
        handleSearch={handleSearch}
        setTags={setSearchTags}
        setTitle={setSearchTitle}
      />
    </div>
  );
}
