//NoteForm.tsx

"use client";

import css from "./NoteForm.module.css";
import * as Yup from "yup";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createNote, updateNote } from "@/lib/api";
import type { Note, Tags } from "@/types/note";
import { TAGS } from "@/types/note";

interface NoteFormProps {
  note?: Note;
  onClose: () => void;
}

interface PaginatedNotes {
  pages: Array<{
    notes: Note[];
    nextPage?: number | null;
  }>;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Maximum 500 characters"),
  tag: Yup.string().oneOf(TAGS, "Invalid tag").required("Tag is required"),
});

export default function NoteForm({ note, onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState<string | null>(null);
  const titleId = "note-title";
  const contentId = "note-content";
  const tagId = "note-tag";

  const mutation = useMutation({
    mutationFn: (values: {
      id?: number;
      title: string;
      content: string;
      tag: Tags;
    }) => (note ? updateNote({ id: note.id, ...values }) : createNote(values)),
    onSuccess: (data) => {
      if (note) {
        queryClient.setQueryData(["note", note.id], data);
        queryClient.setQueriesData<PaginatedNotes>(
          { queryKey: ["notes"] },
          (oldData) => {
            if (oldData?.pages) {
              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  notes: page.notes.map((n) =>
                    n.id === note.id ? { ...n, ...data } : n,
                  ),
                })),
              };
            }
            return oldData;
          },
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      }
      setMutationError(null);
      onClose();
    },
    onError: (error: Error) => {
      setMutationError(error.message || "Failed to save note");
    },
  });

  return (
    <Formik
      initialValues={{
        title: note?.title || "",
        content: note?.content || "",
        tag: note?.tag || "Todo",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        mutation.mutate({ id: note?.id, ...values });
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          {mutationError && (
            <div className={css.error} role="alert">
              {mutationError}
            </div>
          )}
          <div
            className={css.formGroup}
            id={`${titleId}-wrapper`}
            aria-live="polite"
          >
            <label htmlFor={titleId}>Title</label>
            <Field
              id={titleId}
              name="title"
              type="text"
              className={css.input}
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div
            className={css.formGroup}
            id={`${contentId}-wrapper`}
            aria-live="polite"
          >
            <label htmlFor={contentId}>Content</label>
            <Field
              id={contentId}
              name="content"
              as="textarea"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div
            className={css.formGroup}
            id={`${tagId}-wrapper`}
            aria-live="polite"
          >
            <label htmlFor={tagId}>Tag</label>
            <Field id={tagId} name="tag" as="select" className={css.select}>
              {TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || mutation.isPending}
            >
              {note ? "Save" : "Create"} note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
