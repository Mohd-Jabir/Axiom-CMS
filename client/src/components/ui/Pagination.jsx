const Pagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    if (page <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (page >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const pages = getPages();

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <nav
      aria-label="Pagination"
      className="
        mt-12
        flex
        items-center
        justify-center
        gap-2
      "
    >
      <button
        type="button"
        onClick={handlePrevious}
        disabled={page <= 1}
        aria-label="Previous page"
        className="
          group
          inline-flex
          h-10
          items-center
          gap-2
          rounded-xl
          border
          border-border
          bg-surface
          px-3.5
          text-sm
          font-medium
          text-foreground
          shadow-sm
          outline-none
          transition-all
          duration-200
          ease-out
          hover:-translate-y-0.5
          hover:border-border-hover
          hover:bg-card-hover
          hover:shadow-md
          active:scale-[0.96]
          disabled:pointer-events-none
          disabled:opacity-35
          sm:px-4
        "
      >
        <span
          className="
            text-base
            transition-transform
            duration-200
            group-hover:-translate-x-0.5
          "
        >
          ←
        </span>

        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="
                  flex
                  h-10
                  w-7
                  items-center
                  justify-center
                  text-sm
                  text-muted
                "
              >
                …
              </span>
            );
          }

          const isActive = pageNumber === page;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isActive ? "page" : undefined}
              className={`
                relative
                h-10
                min-w-10
                rounded-xl
                px-3
                text-sm
                font-medium
                outline-none
                transition-all
                duration-200
                ease-out
                active:scale-[0.94]
                focus-visible:ring-2
                focus-visible:ring-primary/30
                ${
                  isActive
                    ? `
                      bg-primary
                      text-black
                      shadow-[0_6px_20px_rgba(245,158,11,0.18)]
                    `
                    : `
                      border
                      border-border
                      bg-surface
                      text-muted
                      hover:-translate-y-0.5
                      hover:border-border-hover
                      hover:bg-card-hover
                      hover:text-foreground
                    `
                }
              `}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="
          group
          inline-flex
          h-10
          items-center
          gap-2
          rounded-xl
          border
          border-border
          bg-surface
          px-3.5
          text-sm
          font-medium
          text-foreground
          shadow-sm
          outline-none
          transition-all
          duration-200
          ease-out
          hover:-translate-y-0.5
          hover:border-border-hover
          hover:bg-card-hover
          hover:shadow-md
          active:scale-[0.96]
          disabled:pointer-events-none
          disabled:opacity-35
          sm:px-4
        "
      >
        <span className="hidden sm:inline">Next</span>

        <span
          className="
            text-base
            transition-transform
            duration-200
            group-hover:translate-x-0.5
          "
        >
          →
        </span>
      </button>
    </nav>
  );
};

export default Pagination;
