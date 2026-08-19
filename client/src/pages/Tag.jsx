import { useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useTags } from "../features/tags/tags.hooks.js";

const Tags = () => {
  const [page, setPage] = useState(1);
  const limit = 12;
  const { data, isLoading, isError, error } = useTags({
    page,
    limit,
  });
  const tags = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.tags)
      ? data.tags
      : Array.isArray(data)
        ? data
        : [];

  const pagination = data?.pagination ||
    data?.data?.pagination || {
      page,
      limit,
      total: 0,
      totalPages: 1,
    };

  useGSAP(
    () => {
      if (isLoading || isError || tags.length === 0) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

        timeline
          .from(".tags-header", {
            opacity: 0,
            y: 25,
            duration: 0.6,
          })
          .from(
            ".tag-card",
            {
              opacity: 0,
              y: 20,
              scale: 0.97,
              duration: 0.45,
              stagger: 0.055,
            },
            "-=0.25",
          )
          .from(
            ".tags-pagination",
            {
              opacity: 0,
              y: 15,
              duration: 0.4,
            },
            "-=0.15",
          );
      });

      return () => context.revert();
    },
    {
      dependencies: [isLoading, isError, page, tags.length],
    },
  );

  const handlePrevious = () => {
    if (page > 1) {
      setPage((current) => current - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (page < pagination.totalPages) {
      setPage((current) => current + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-5 pb-24 pt-28 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="tags-header relative mb-12 overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-10 shadow-xl shadow-black/5 sm:px-10 sm:py-14">
          {/* Decorative background */}
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-64
              w-64
              rounded-full
              bg-primary/10
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              left-1/3
              h-48
              w-48
              rounded-full
              bg-primary/5
              blur-3xl
            "
          />

          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Discover
              </span>
            </div>

            <h1
              className="
                text-4xl
                font-semibold
                leading-tight
                tracking-[-0.035em]
                text-foreground
                sm:text-5xl
                lg:text-6xl
              "
            >
              Explore by <span className="text-primary">topic.</span>
            </h1>

            <p
              className="
                mt-5
                max-w-2xl
                text-sm
                leading-7
                text-muted
                sm:text-base
              "
            >
              Discover articles, ideas, and conversations through the topics
              that shape our community.
            </p>

            {!isLoading && !isError && (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-muted">
                  {pagination.total ?? tags.length}{" "}
                  {pagination.total === 1 ? "topic" : "topics"}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-muted">
                    Page {pagination.page || page} of {pagination.totalPages}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Loading */}
        {isLoading && (
          <section
            className="
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="
                  h-36
                  animate-pulse
                  rounded-2xl
                  border
                  border-border
                  bg-card
                "
              />
            ))}
          </section>
        )}

        {/* Error */}
        {isError && (
          <section
            className="
              rounded-3xl
              border
              border-danger/20
              bg-danger/10
              px-6
              py-8
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  grid
                  h-11
                  w-11
                  shrink-0
                  place-items-center
                  rounded-xl
                  bg-danger/10
                  text-lg
                  font-bold
                  text-danger
                "
              >
                !
              </div>

              <div>
                <h2 className="font-semibold text-danger">
                  Unable to load tags
                </h2>

                <p className="mt-1 text-sm leading-6 text-danger/80">
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong while loading the topics."}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Empty */}
        {!isLoading && !isError && tags.length === 0 && (
          <section
            className="
              rounded-[2rem]
              border
              border-border
              bg-surface
              px-6
              py-20
              text-center
            "
          >
            <div
              className="
                mx-auto
                grid
                h-16
                w-16
                place-items-center
                rounded-2xl
                bg-primary-soft
                text-2xl
                text-primary
              "
            >
              #
            </div>

            <h2 className="mt-6 text-xl font-semibold text-foreground">
              No topics yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              There aren't any tags available right now. Check back later as new
              topics are added.
            </p>

            <Link
              to="/posts"
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-primary
                px-5
                py-3
                text-sm
                font-semibold
                text-background
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-primary-hover
                hover:shadow-lg
                hover:shadow-primary/20
              "
            >
              Explore posts
              <span>→</span>
            </Link>
          </section>
        )}

        {/* Tags */}
        {!isLoading && !isError && tags.length > 0 && (
          <section>
            <div
              className="
                mb-5
                flex
                items-end
                justify-between
                gap-4
              "
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Topics
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Browse all tags
                </h2>
              </div>

              <p className="hidden text-sm text-muted sm:block">
                Select a topic to explore related posts.
              </p>
            </div>

            <div
              className="
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >
              {tags.map((tag) => {
                const tagId = tag?._id || tag?.id;

                const tagName =
                  tag?.identity?.name || tag?.name || "Unnamed tag";

                const tagSlug = tag?.identity?.slug || tag?.slug || "";

                const description =
                  tag?.identity?.description || tag?.description || "";

                return (
                  <Link
                    key={tagId || tagSlug || tagName}
                    to={`/tags/${tagSlug}`}
                    className="
                      tag-card
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      border-border
                      bg-surface
                      p-5
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-primary/40
                      hover:shadow-xl
                      hover:shadow-black/5
                    "
                  >
                    {/* Hover glow */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-10
                        -top-10
                        h-24
                        w-24
                        rounded-full
                        bg-primary/0
                        blur-2xl
                        transition-all
                        duration-500
                        group-hover:bg-primary/10
                      "
                    />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className="
                            grid
                            h-10
                            w-10
                            shrink-0
                            place-items-center
                            rounded-xl
                            bg-primary-soft
                            text-sm
                            font-bold
                            text-primary
                            transition-transform
                            duration-300
                            group-hover:scale-110
                          "
                        >
                          #
                        </div>

                        <span
                          className="
                            text-lg
                            text-muted
                            transition-all
                            duration-300
                            group-hover:translate-x-1
                            group-hover:text-primary
                          "
                        >
                          →
                        </span>
                      </div>

                      <h3
                        className="
                          mt-5
                          line-clamp-1
                          text-base
                          font-semibold
                          text-foreground
                          transition-colors
                          duration-300
                          group-hover:text-primary
                        "
                      >
                        {tagName}
                      </h3>

                      {description ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                          {description}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-muted">
                          Explore related posts.
                        </p>
                      )}

                      <div className="mt-5 flex items-center gap-2 text-xs font-medium text-muted">
                        <span className="h-1 w-1 rounded-full bg-primary" />

                        <span>Explore topic</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Pagination */}
        {!isLoading &&
          !isError &&
          tags.length > 0 &&
          pagination.totalPages > 1 && (
            <div className="tags-pagination mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                disabled={page <= 1}
                onClick={handlePrevious}
                className="
                  inline-flex
                  min-w-28
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-border
                  bg-surface
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-foreground
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-primary/40
                  hover:bg-card-hover
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  disabled:hover:translate-y-0
                "
              >
                <span>←</span>
                Previous
              </button>

              <div
                className="
                  rounded-xl
                  border
                  border-border
                  bg-surface
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-muted
                "
              >
                <span className="text-foreground">
                  {pagination.page || page}
                </span>{" "}
                / {pagination.totalPages}
              </div>

              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={handleNext}
                className="
                  inline-flex
                  min-w-28
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-border
                  bg-surface
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-foreground
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-primary/40
                  hover:bg-card-hover
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  disabled:hover:translate-y-0
                "
              >
                Next
                <span>→</span>
              </button>
            </div>
          )}
      </div>
    </main>
  );
};

export default Tags;
