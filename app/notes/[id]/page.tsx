// app/notes/[id]/page.tsx

import css from "../filter/[...slug]/NotesPage.module.css";
import NotesClient from "../filter/[...slug]/Notes.client";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  // Передзагрузка фонового списку нотаток (наприклад, All notes, page 1)
  const defaultTag = undefined;
  const defaultPage = 1;
  const initialData: FetchNotesResponse = await fetchNotes({
    page: defaultPage,
    query: "",
    perPage: 12,
    tag: defaultTag,
  });

  return (
    <div className={css.notesPageWrapper}>
      <div className={css.pageContainer}>
        <NotesClient initialData={initialData} tag={defaultTag} />
      </div>
    </div>
  );
}
