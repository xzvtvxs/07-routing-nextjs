//app/notes/[id]/NotePreview.client.tsx

"use client";

import css from "./NotePreview.module.css";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { updateNote, fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

export default function NotePreview({ id }: { id: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [mutationError, setMutationError] = useState<Error | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const tagRef = useRef<HTMLSelectElement>(null);

  const mutation = useMutation({
    mutationFn: (data: {
      id: number;
      title: string;
      content: string;
      tag: string;
    }) => updateNote(data),
    onSuccess: (updatedNote) => {
      queryClient.setQueryData(["note", id], updatedNote);
      queryClient.invalidateQueries({ queryKey: ["notes"] }); // Інвалідація для оновлення списку
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

  const handleEditClick = () => {
    setIsEditing(true);
    setMutationError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleRef.current && contentRef.current && tagRef.current) {
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
              Close
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
