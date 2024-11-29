import { getArticles } from "@/actions/articles";
import { Body3 } from "@/components/ui/text";
import { ArticleWithUser } from "@/types/entityRelations";
import ArticleCard from "./components/ArticleCard";
import ArticleFilterLayout from "./components/ArticleFilterLayout";

export default async function Articles({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{
    title: string;
    tags: string;
    sort: "latest" | "popular";
    status: "all" | "published" | "archived";
    start: Date;
    end: Date;
  }>;
}) {
  const searchParams = await searchParamsPromise;
  const response = await getArticles({
    searchQuery: searchParams.title,
    tags: searchParams.tags,
    order: searchParams.sort,
    status:
      searchParams.status === "published"
        ? true
        : searchParams.status === "archived"
          ? false
          : undefined,
    startDate: searchParams.start,
    endDate: searchParams.end,
  });
  const articles: ArticleWithUser[] = response.data ?? [];

  return (
    <div className="w-full space-y-8">
      <div className="flex w-full justify-end">
        <ArticleFilterLayout searchData={searchParams} />
      </div>
      <div className="flex w-full max-w-[90%] flex-wrap gap-6 pb-16">
        {articles.length > 0 &&
          articles.map((article: ArticleWithUser) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              imageUrl={article.cover_url}
              createdAt={article.created_at.toLocaleDateString()}
              tags={article.tags}
              slug={article.slug}
              author={article.author.name}
              author_role={article.author.role}
              views={article.views}
            />
          ))}
        {articles.length === 0 && <Body3>Belum ada artikel apa-apa...</Body3>}
      </div>
    </div>
  );
}
