//Pagination.tsx

import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";

export interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  currentPage: number;
}

export default function Pagination({
  pageCount,
  onPageChange,
  currentPage,
}: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={onPageChange}
      forcePage={currentPage}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel="←"
      nextLabel="→"
      disableInitialCallback={true}
    />
  );
}
