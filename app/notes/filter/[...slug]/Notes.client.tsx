// app/notes/filter/[...slug]/Notes.client.tsx

"use client";

import css from "./NotesPage.module.css";
import { useState, useCallback, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { usePathname } from "next/navigation";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NotePreviewClient from "@/app/notes/[id]/NoteDetails.client";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import type { Tags } from "@/types/note";

interface NotesClientProps {
  initialData: FetchNotesResponse;
  tag: Tags | undefined;
}

export default function NotesClient({ initialData, tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(initialData.page || 1);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(localSearchQuery, 500);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [currentTag, setCurrentTag] = useState<Tags | undefined>(tag);

  const pathname = usePathname();
  const apiTag = currentTag;

  const { data, error, isLoading } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", currentPage, debouncedQuery, apiTag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        query: debouncedQuery,
        perPage: 12,
        tag: apiTag,
      }),
    placeholderData: keepPreviousData,
    initialData:
      currentPage === 1 && debouncedQuery === "" && apiTag === initialData.tag
        ? initialData
        : undefined, // Використовуємо initialData лише для початкового стану
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    throw error;
  }

  // Обробка ID з URL для модального вікна
  useEffect(() => {
    const idFromPath = parseInt(pathname.split("/").pop() || "0", 10);
    if (
      !isNaN(idFromPath) &&
      pathname.startsWith("/notes/") &&
      !pathname.includes("/@modal/")
    ) {
      setSelectedNoteId(idFromPath);
    } else if (pathname.startsWith("/notes/filter/")) {
      setSelectedNoteId(null);
    }
  }, [pathname]);

  const handlePageChange = useCallback((selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      const lowerCaseValue = value.toLowerCase();
      if (lowerCaseValue !== localSearchQuery) {
        setCurrentPage(1);
        setLocalSearchQuery(lowerCaseValue);
        if (lowerCaseValue) {
          setCurrentTag(undefined); // Скидання тега при введенні запиту
        } else {
          setCurrentTag(tag); // Повернення до початкового тегу при очищенні
        }
      }
    },
    [localSearchQuery, tag],
  );

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={localSearchQuery} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage - 1}
          />
        )}
        <button
          className={css.button}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create note +
        </button>
      </header>
      {isLoading ? (
        <p>Loading...</p>
      ) : data?.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>Nothing found</p>
      )}
      {isCreateModalOpen && !selectedNoteId && (
        <Modal onClose={handleCloseCreateModal}>
          <NoteForm onClose={handleCloseCreateModal} />
        </Modal>
      )}
      {selectedNoteId &&
        !isCreateModalOpen &&
        !pathname.includes("/@modal/") && (
          <NotePreviewClient id={selectedNoteId} />
        )}
    </div>
  );
}
