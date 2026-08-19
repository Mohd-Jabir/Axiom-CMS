import { Link } from "react-router-dom";
import { useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useMyPosts } from "../features/posts/posts.hooks.js";
import PostList from "../components/posts/PostList.jsx";
import Pagination from "../components/ui/Pagination.jsx";

const MyPosts = () => {
  const [page, setPage] = useState(1);

  const limit = 9;

  const { data, isLoading, isError, error } = useMyPosts({
    page,
    limit,
  });

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from(".my-posts-header-item", {
        opacity: 0,
        y: 20,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
      });
    });

    return () => context.revert();
  });

  const posts = Array.isArray(data?.data) ? data.data : [];

  const pagination = data?.pagination || {
    page,
    limit,
    total: 0,
    totalPages: 1,
  };

  return (
    <main
      className="
        min-h-screen
        overflow-hidden
        bg-background
        text-foreground
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[420px]
          w-[420px]
          -translate-x-1/2
          rounded-full
          bg-primary/5
          blur-[120px]
        "
      />

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-7xl
          px-5
          pb-20
          pt-28
          sm:px-6
          lg:px-8
          lg:pt-32
        "
      >
        <section
          className="
            mb-12
            border-b
            border-border
            pb-10
          "
        >
          <div
            className="
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >
            <div className="max-w-2xl">
              <div className="my-posts-header-item mb-5 flex items-center gap-3">
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-primary
                  "
                />

                <span
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-primary
                  "
                >
                  Dashboard
                </span>
              </div>

              <h1
                className="
                  my-posts-header-item
                  text-4xl
                  font-semibold
                  tracking-[-0.04em]
                  text-foreground
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                Your
                <span className="text-primary"> stories.</span>
              </h1>

              <p
                className="
                  my-posts-header-item
                  mt-5
                  max-w-xl
                  text-sm
                  leading-7
                  text-muted
                  sm:text-base
                "
              >
                Create, manage, and refine everything you've published from one
                place.
              </p>
            </div>

            <div className="my-posts-header-item">
              <Link
                to="/posts/create"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-primary
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-background
                  shadow-lg
                  shadow-primary/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-primary-hover
                  hover:shadow-xl
                  hover:shadow-primary/25
                "
              >
                <span>Create Post</span>

                <span
                  className="
                    text-base
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          <div
            className="
              my-posts-header-item
              mt-8
              flex
              flex-wrap
              items-center
              gap-x-6
              gap-y-3
              text-xs
              text-muted
            "
          >
            <span>
              <span className="font-semibold text-foreground">
                {pagination.total || 0}
              </span>{" "}
              {pagination.total === 1 ? "post" : "posts"}
            </span>

            <span className="h-1 w-1 rounded-full bg-border" />

            <span>
              Page{" "}
              <span className="font-medium text-foreground">
                {pagination.page || page}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {pagination.totalPages || 1}
              </span>
            </span>
          </div>
        </section>

        {isLoading && (
          <section>
            <div className="mb-6">
              <div className="h-5 w-28 animate-pulse rounded-lg bg-border" />
            </div>

            <PostList posts={[]} isLoading />
          </section>
        )}

        {isError && (
          <section
            className="
              rounded-[28px]
              border
              border-danger/20
              bg-danger/5
              p-8
              sm:p-10
            "
          >
            <div className="flex items-start gap-5">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-danger/10
                  text-danger
                "
              >
                !
              </div>

              <div>
                <h2
                  className="
                    text-base
                    font-semibold
                    text-foreground
                  "
                >
                  Unable to load your posts
                </h2>

                <p
                  className="
                    mt-2
                    max-w-xl
                    text-sm
                    leading-6
                    text-muted
                  "
                >
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong while loading your posts."}
                </p>
              </div>
            </div>
          </section>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <section
            className="
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-border
                bg-surface
                px-6
                py-20
                text-center
                shadow-sm
                sm:px-10
              "
          >
            <div
              className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-0
                  h-48
                  w-48
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-primary/10
                  blur-3xl
                "
            />

            <div
              className="
                  relative
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary/10
                  text-2xl
                  text-primary
                "
            >
              +
            </div>

            <h2
              className="
                  relative
                  mt-7
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-foreground
                "
            >
              Your canvas is empty.
            </h2>

            <p
              className="
                  relative
                  mx-auto
                  mt-3
                  max-w-md
                  text-sm
                  leading-6
                  text-muted
                "
            >
              You haven't created any posts yet. Start with an idea and turn it
              into something worth sharing.
            </p>

            <Link
              to="/posts/create"
              className="
                  relative
                  mt-8
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-primary
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-background
                  transition
                  hover:bg-primary-hover
                "
            >
              Write your first post
              <span>→</span>
            </Link>
          </section>
        )}

        {!isLoading && !isError && posts.length > 0 && (
          <section>
            <div
              className="
                  mb-7
                  flex
                  items-center
                  justify-between
                "
            >
              <div>
                <p
                  className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-muted
                    "
                >
                  Your library
                </p>

                <h2
                  className="
                      mt-2
                      text-xl
                      font-semibold
                      tracking-tight
                      text-foreground
                    "
                >
                  Published & saved work
                </h2>
              </div>
            </div>

            <PostList posts={posts} showActions />

            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default MyPosts;
