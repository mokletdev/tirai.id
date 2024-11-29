import { PageContainer } from "@/components/layout/PageContainer";
import { findArticle } from "@/utils/database/article.query";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;

  const article = await findArticle({ slug });

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${article?.title} - ${article?.author.name}`,
    openGraph: {
      images: [article?.cover_url!, ...previousImages],
    },
    authors: [
      {
        name: article?.author.name,
      },
    ],
    description: article?.description,
    keywords: article?.tags,
    robots: {
      index: true,
      nocache: false,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await findArticle({ slug });

  return (
    <PageContainer>
      <div></div>
    </PageContainer>
  );
}
