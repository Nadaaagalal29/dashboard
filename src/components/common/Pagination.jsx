import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, setPage, total }) {
  return total > 6 ? (
    <div className="pagination">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={17} />
      </button>
      Page {page} of {Math.ceil(total / 6)}
      <button
        disabled={page * 6 >= total}
        onClick={() => setPage(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={17} />
      </button>
    </div>
  ) : null;
}
