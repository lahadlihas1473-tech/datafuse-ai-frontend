import { ChevronIcon } from "../Icons";

// Page numbers with ellipses: 1 … 4 5 6 … 53
const pageWindow = (page, pageCount) => {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);

  return [...pages]
    .filter((item) => item >= 1 && item <= pageCount)
    .sort((a, b) => a - b)
    .flatMap((item, index, list) =>
      index > 0 && item - list[index - 1] > 1 ? ["gap", item] : [item]
    );
};

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="pagination__range">
        {first.toLocaleString()}–{last.toLocaleString()} of{" "}
        {total.toLocaleString()}
      </span>

      {pageCount > 1 && (
        <div className="pagination__pages">
          <button
            type="button"
            className="page-button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronIcon direction="left" />
          </button>

          {pageWindow(page, pageCount).map((item, index) =>
            item === "gap" ? (
              <span className="pagination__gap" key={`gap-${index}`}>
                …
              </span>
            ) : (
              <button
                type="button"
                key={item}
                className={`page-button${item === page ? " page-button--active" : ""}`}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            className="page-button"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronIcon />
          </button>
        </div>
      )}
    </nav>
  );
}
