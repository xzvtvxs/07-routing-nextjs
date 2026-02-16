"use client";

import css from "./NotePreview.module.css";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

interface NotePreviewProps {
  id?: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const resolvedId = id ?? params?.id;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note, Error>({
    queryKey: ["note", resolvedId],
    queryFn: () => fetchNoteById(resolvedId as string),
    enabled: Boolean(resolvedId),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (!resolvedId) {
    return null;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading note: {error.message}</p>;
  }

  if (!note) {
    return null;
  }

  const displayDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString()
    : "Date unavailable";

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <button className={css.closeBtn} onClick={handleClose}>
              Close
            </button>
          </div>
          <span className={css.tag}>{note.tag}</span>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <p className={css.date}>{displayDate}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
