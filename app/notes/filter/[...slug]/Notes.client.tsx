"use client";

import css from "./NotesPage.module.css";
import { useState, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import type { Tags } from "@/types/note";

interface NotesClientProps {
  tag: Tags | undefined;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(localSearchQuery, 500);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, error, isLoading } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", currentPage, debouncedQuery, tag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        query: debouncedQuery,
        perPage: 12,
        tag,
      }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    throw error;
  }

  const handlePageChange = useCallback((selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      const lowerCaseValue = value.toLowerCase();
      if (lowerCaseValue !== localSearchQuery) {
        setCurrentPage(1);
        setLocalSearchQuery(lowerCaseValue);
      }
    },
    [localSearchQuery],
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
      {isCreateModalOpen && (
        <Modal onClose={handleCloseCreateModal}>
          <NoteForm onClose={handleCloseCreateModal} />
        </Modal>
      )}
    </div>
  );
}
