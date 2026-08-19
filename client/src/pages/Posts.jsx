import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { usePosts } from "../features/posts/posts.hooks.js";
import PostList from "../components/posts/PostList.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import useDebounce from "../hooks/useDebouce.js";

const Posts = () => {
  const pageRef = useRef(null);
  const resultsRef = useRef(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const limit = 9;

  const debouncedSearch = useDebounce(search, 400);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = usePosts({
    page,
    limit,
    ...(debouncedSearch.trim()
      ? {
          search: debouncedSearch.trim(),
        }
      : {}),
  });

  const posts = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.posts)
      ? data.posts
      : [];

  const pagination =
    data?.pagination || {
      page,
      limit,
      total: 0,
      totalPages: 1,
    };

  const totalPosts = pagination.total || posts.length || 0;

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from("[data-posts-hero]", {
          opacity: 0,
          y: 28,
          duration: 0.7,
        })
        .from(
          "[data-posts-search]",
          {
            opacity: 0,
            y: 18,
            duration: 0.55,
          },
          "-=0.4",
        )
        .from(
          "[data-posts-meta]",
          {
            opacity: 0,
            y: 14,
            duration: 0.45,
          },
          "-=0.3",
        );
    },
    {
      scope: pageRef,
    },
  );

  useGSAP(
    () => {
      if (isLoading || isError || posts.length === 0) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      gsap.fromTo(
        resultsRef.current,
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
      );
    },
    {
      scope: pageRef,
      dependencies: [page, debouncedSearch, isLoading, isError],
    },
  );

  return (
    <main
      ref={pageRef}
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-background
        pb-24
        text-foreground
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[520px]
          w-[520px]
          -translate-x-1/2
          rounded-full
          bg-primary/[0.035]
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-48
          top-[38%]
          h-96
          w-96
          rounded-full
          border
          border-border/60
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-48
          top-[18%]
          h-96
          w-96
          rounded-full
          border
          border-primary/[0.04]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-7xl
          px-5
          pt-28
          sm:px-8
          sm:pt-32
          lg:px-10
        "
      >
        <section
          data-posts-hero
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-border
            bg-foreground
            px-6
            py-10
            text-background
            shadow-[0_30px_90px_rgba(0,0,0,0.15)]
            sm:px-10
            sm:py-12
            lg:px-14
            lg:py-14
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              border
              border-background/[0.07]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-40
              left-1/3
              h-80
              w-80
              rounded-full
              border
              border-background/[0.05]
            "
          />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-background/10
                  bg-background/[0.05]
                  px-3
                  py-1.5
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-background/55
                  "
                >
                  Axiom Journal
                </span>
              </div>

              <h1
                className="
                  mt-7
                  max-w-3xl
                  text-4xl
                  font-medium
                  leading-[1.05]
                  tracking-[-0.055em]
                  sm:text-5xl
                  lg:text-7xl
                "
              >
                Ideas worth
                <span className="block text-background/45">
                  spending time with.
                </span>
              </h1>

              <p
                className="
                  mt-6
                  max-w-2xl
                  text-sm
                  leading-7
                  text-background/50
                  sm:text-base
                "
              >
                Explore thoughtful articles, practical tutorials,
                developer insights, and stories from the Axiom community.
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-2
                sm:grid-cols-3
              "
            >
              <div
                className="
                  rounded-2xl
                  border
                  border-background/10
                  bg-background/[0.05]
                  px-5
                  py-4
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-background/35
                  "
                >
                  Articles
                </p>

                <p className="mt-2 text-xl font-medium">
                  {totalPosts}
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-background/10
                  bg-background/[0.05]
                  px-5
                  py-4
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-background/35
                  "
                >
                  Per page
                </p>

                <p className="mt-2 text-xl font-medium">
                  {limit}
                </p>
              </div>

              <div
                className="
                  col-span-2
                  rounded-2xl
                  border
                  border-background/10
                  bg-background/[0.05]
                  px-5
                  py-4
                  sm:col-span-1
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-background/35
                  "
                >
                  Page
                </p>

                <p className="mt-2 text-xl font-medium">
                  {pagination.page || page}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          data-posts-search
          className="
            relative
            z-20
            mx-auto
            -mt-7
            max-w-5xl
            px-3
            sm:px-6
          "
        >
          <div
            className="
              rounded-[26px]
              border
              border-border
              bg-surface
              p-2
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]
            "
          >
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="
                  pointer-events-none
                  absolute
                  left-5
                  top-1/2
                  h-5
                  w-5
                  -translate-y-1/2
                  text-muted
                "
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path
                  strokeLinecap="round"
                  d="m20 20-4-4"
                />
              </svg>

              <input
                type="search"
                value={search}
                onChange={handleSearch}
                placeholder="Search articles, ideas, tutorials..."
                className="
                  h-14
                  w-full
                  rounded-[20px]
                  bg-background
                  pl-14
                  pr-32
                  text-sm
                  text-foreground
                  outline-none
                  transition
                  placeholder:text-subtle
                  focus:ring-2
                  focus:ring-primary/10
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    rounded-full
                    px-2
                    py-1
                    text-xs
                    font-medium
                    text-muted
                    transition
                    hover:bg-card-hover
                    hover:text-foreground
                  "
                >
                  Clear
                </button>
              )}

              {isFetching && !isLoading && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    right-5
                    top-1/2
                    hidden
                    -translate-y-1/2
                    items-center
                    gap-2
                    text-xs
                    text-muted
                    sm:flex
                  "
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  Searching
                </div>
              )}
            </div>
          </div>
        </section>

        <div
          data-posts-meta
          className="
            mt-10
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-primary
              "
            >
              {debouncedSearch ? "Search results" : "Latest stories"}
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-semibold
                tracking-[-0.04em]
                sm:text-3xl
              "
            >
              {debouncedSearch
                ? `Results for "${debouncedSearch}"`
                : "Discover something new."}
            </h2>
          </div>

          {!isLoading && !isError && posts.length > 0 && (
            <p className="text-xs text-muted">
              Showing{" "}
              <span className="font-medium text-foreground">
                {posts.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {totalPosts}
              </span>{" "}
              articles
            </p>
          )}
        </div>

        <div
          ref={resultsRef}
          className="mt-7"
        >
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: limit }).map((_, index) => (
                <div
                  key={index}
                  className="
                    overflow-hidden
                    rounded-[26px]
                    border
                    border-border
                    bg-surface
                    shadow-sm
                  "
                >
                  <div className="h-48 animate-pulse bg-card" />

                  <div className="space-y-4 p-6">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-card" />

                    <div className="h-6 w-4/5 animate-pulse rounded-lg bg-card" />

                    <div className="h-4 w-full animate-pulse rounded-lg bg-card" />

                    <div className="h-4 w-3/4 animate-pulse rounded-lg bg-card" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div
              className="
                rounded-[28px]
                border
                border-danger/20
                bg-danger/10
                px-6
                py-10
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  grid
                  h-14
                  w-14
                  place-items-center
                  rounded-2xl
                  bg-danger/10
                  text-danger
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 17h.01"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.3 3.8 2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z"
                  />
                </svg>
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                Unable to load articles
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-danger/80">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong while loading the posts."}
              </p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            posts.length === 0 && (
              <div
                className="
                  rounded-[28px]
                  border
                  border-border
                  bg-surface
                  px-6
                  py-20
                  text-center
                  shadow-sm
                "
              >
                <div
                  className="
                    mx-auto
                    grid
                    h-16
                    w-16
                    place-items-center
                    rounded-[22px]
                    bg-foreground
                    text-background
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-7 w-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 8h8M8 12h8M8 16h5"
                    />
                  </svg>
                </div>

                <h2
                  className="
                    mt-6
                    text-xl
                    font-semibold
                    tracking-tight
                  "
                >
                  {debouncedSearch
                    ? "Nothing matched your search"
                    : "No published posts yet"}
                </h2>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-md
                    text-sm
                    leading-6
                    text-muted
                  "
                >
                  {debouncedSearch
                    ? `We couldn't find any articles matching "${debouncedSearch}". Try another keyword.`
                    : "There are currently no published posts available to explore."}
                </p>

                {debouncedSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="
                      mt-7
                      rounded-full
                      bg-primary
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-background
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-primary-hover
                    "
                  >
                    View all posts →
                  </button>
                )}
              </div>
            )}

          {!isLoading &&
            !isError &&
            posts.length > 0 && (
              <>
                <PostList posts={posts} />

                <div className="mt-12 border-t border-border pt-8">
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
        </div>
      </div>

      <footer className="relative z-10 mx-auto mt-16 w-full max-w-7xl border-t border-border px-5 pt-6 sm:px-8 lg:px-10">
        <p className="text-center text-[11px] text-subtle">
          Designed & developed by{" "}
          <a
            href="mailto:mohdjabir.dev@gmail.com"
            className="text-muted transition-colors hover:text-foreground"
          >
            mohdjabir.dev@gmail.com
          </a>
        </p>
      </footer>
    </main>
  );
};

export default Posts;