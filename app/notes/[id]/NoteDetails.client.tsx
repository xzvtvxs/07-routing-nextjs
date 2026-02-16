// app/notes/[id]/NoteDetails.client.tsx

"use client";

import css from "./NoteDetails.module.css";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById, updateNote } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaginatedNotes } from "@/lib/api";
import type { Note } from "@/types/note";

export default function NotePreview({ id }: { id: number }) {
  const router = useRouter();
  const { data: note } = useQuery<Note, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [mutationError, setMutationError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const tagRef = useRef<HTMLSelectElement>(null);

  const mutation = useMutation({
    mutationFn: (note: {
      id: number;
      title: string;
      content: string;
      tag: string;
    }) => updateNote(note), // Надсилаємо оновлення нотатки на сервер
    onSuccess: (updatedNote) => {
      // Оновлюємо кеш для однієї нотатки
      queryClient.setQueryData(["note", id], updatedNote);

      // Оновлюємо список нотаток у кеші
      queryClient.setQueriesData<PaginatedNotes>(
        { queryKey: ["notes"] },
        (oldData) => {
          if (!oldData || !oldData.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              notes: page.notes.map((note) =>
                note.id === id ? { ...note, ...updatedNote } : note,
              ),
            })),
          };
        },
      );

      // Позначаємо список нотаток як застарілий для оновлення
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      setIsEditing(false);
      setMutationError(null);
      handleClose();
    },
    onError: (error: Error) => {
      setMutationError(error);
    },
  });

  if (mutationError) {
    throw mutationError;
  }

  if (!note) {
    return null;
  }

  const displayDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString()
    : "Date unavailable";

  const handleEditClick = () => {
    setIsEditing(true);
    setMutationError(null);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (note && titleRef.current && contentRef.current && tagRef.current) {
      const updatedNote = {
        id: note.id,
        title: titleRef.current.value,
        content: contentRef.current.value,
        tag: tagRef.current.value,
      };
      mutation.mutate(updatedNote);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMutationError(null);
    handleClose();
  };

  const handleClose = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/notes/filter/All");
    }
  };

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <button className={css.closeBtn} onClick={handleClose}>
              Close details
            </button>
          </div>
          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  ref={titleRef}
                  defaultValue={note.title}
                  className={css.input}
                />
              </div>
              <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  ref={contentRef}
                  defaultValue={note.content}
                  className={css.textarea}
                />
              </div>
              <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select
                  id="tag"
                  ref={tagRef}
                  defaultValue={note.tag}
                  className={css.select}
                >
                  <option value="Todo">Todo</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Shopping">Shopping</option>
                </select>
              </div>
              <div className={css.actions}>
                <button
                  type="button"
                  className={css.cancelBtn}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={css.saveBtn}
                  disabled={mutation.isPending}
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className={css.content}>{note.content}</p>
              <div className={css.footer}>
                <p className={css.date}>{displayDate}</p>
                {!isEditing && (
                  <button className={css.editBtn} onClick={handleEditClick}>
                    Edit note
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
