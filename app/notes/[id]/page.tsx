import css from "../filter/[...slug]/NotesPage.module.css";
import NotesClient from "../filter/[...slug]/Notes.client";

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  const defaultTag = undefined;

  return (
    <div className={css.notesPageWrapper}>
      <div className={css.pageContainer}>
        <NotesClient tag={defaultTag} />
      </div>
    </div>
  );
}
