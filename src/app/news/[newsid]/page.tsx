"use clients";

import { NewsFallback } from "@/components/features/news/NewsFallback";
import { OurStoryPage } from "@/components/features/news/OurStoryPage";

export default async function NewsPage(props: { params: Promise<{ newsid: string }> }) {
  const params = await props.params;

  if (params.newsid === "our-story") {
    return <OurStoryPage />;
  }

  return <NewsFallback newsid={params.newsid} />;
}
