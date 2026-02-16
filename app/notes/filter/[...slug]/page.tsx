import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { TAGS, Tags } from "@/types/note";
import NotesClient from "./Notes.client";

interface NotesSlugProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesSlugPage({ params }: NotesSlugProps) {
  const { slug } = await params;
  const queryClient = new QueryClient();

  let tag: Tags | undefined = undefined;
  const currentSlug = slug[0];

  if (currentSlug) {
    if (TAGS.includes(currentSlug as Tags)) {
      tag = currentSlug as Tags;
    } else if (currentSlug === "All") {
      tag = undefined;
    }
  }

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        query: "",
        perPage: 12,
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
