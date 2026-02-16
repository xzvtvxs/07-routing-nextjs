// app/notes/filter/[...slug]/page.tsx

import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import { TAGS, Tags } from "@/types/note";

interface NotesSlugProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesSlugPage({ params }: NotesSlugProps) {
  const { slug } = await params;
  // slug завжди масив у Next.js

  let tag: Tags | undefined = undefined;
  const searchQuery: string = "";
  const currentSlug = slug[0];

  if (currentSlug) {
    if (TAGS.includes(currentSlug as Tags)) {
      tag = currentSlug as Tags; // Точна відповідність тегу з великої літери
    } else if (currentSlug === "All") {
      tag = undefined; // якщо сегмент "All" -> tag = undefined
    }
  }

  const pageNumber = 1;
  const initialData: FetchNotesResponse = await fetchNotes({
    page: pageNumber,
    query: searchQuery,
    perPage: 12,
    tag,
  });

  return <NotesClient initialData={initialData} tag={tag} />;
}
