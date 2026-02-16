// NoteList.tsx
"use client";

import css from "./NoteList.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";

interface NoteListProps {
  notes: Note[];
  // tag?: string;
  // page: number;
  // onViewDetails: (id: number, tag?: string, page?: number) => void;
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleViewDetails = (id: number) => {
    router.push(`/notes/${id}`);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.detailsBtn}
              onClick={() => handleViewDetails(note.id)}
            >
              View details
            </button>
            <button
              className={css.deleteBtn}
              onClick={() => handleDelete(note.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
