// frontend/src/components/Pagination.jsx
export default function Pagination({ page, pages, total, onPageChange }) {
  if (!pages || pages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < pages;

  const goTo = newPage => {
    if (newPage >= 1 && newPage <= pages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
      <p>
        Page {page} of {pages} • {total} records
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => goTo(page - 1)}
          disabled={!canPrev}
          className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => goTo(page + 1)}
          disabled={!canNext}
          className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
