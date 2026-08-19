import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { usePostBySlug } from "../features/posts/posts.hooks.js";
import { useToggleLike } from "../features/likes/likes.hooks.js";

import CommentForm from "../components/comments/CommentForm.jsx";
import CommentList from "../components/comments/CommentList.jsx";

const PostDetails = () => {
  const { slug } = useParams();

  const { data, isLoading, isError, error } = usePostBySlug(slug);

  const likeMutation = useToggleLike();

  const [liked, setLiked] = useState(false);

  useGSAP(
    () => {
      if (isLoading || isError) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      const ctx = gsap.context(() => {
        const intro = gsap.timeline({
          defaults: {
            ease: "power4.out",
          },
        });

        intro
          .from(".article-nav", {
            opacity: 0,
            y: -10,
            duration: 0.4,
          })
          .from(
            ".article-kicker",
            {
              opacity: 0,
              y: 15,
              duration: 0.45,
            },
            "-=0.15",
          )
          .from(
            ".article-title",
            {
              opacity: 0,
              y: 35,
              duration: 0.75,
            },
            "-=0.25",
          )
          .from(
            ".article-excerpt",
            {
              opacity: 0,
              y: 20,
              duration: 0.55,
            },
            "-=0.4",
          )
          .from(
            ".article-author",
            {
              opacity: 0,
              y: 15,
              duration: 0.5,
            },
            "-=0.3",
          )
          .from(
            ".article-cover",
            {
              opacity: 0,
              y: 30,
              scale: 0.97,
              duration: 0.8,
            },
            "-=0.25",
          );

        gsap.from(".article-body > *", {
          opacity: 0,
          y: 18,
          duration: 0.55,
          stagger: 0.08,
          delay: 0.65,
          ease: "power3.out",
        });

        gsap.from(".article-engagement", {
          opacity: 0,
          y: 20,
          duration: 0.55,
          delay: 0.9,
          ease: "power3.out",
        });

        gsap.from(".article-comments", {
          opacity: 0,
          y: 25,
          duration: 0.6,
          delay: 1,
          ease: "power3.out",
        });
      });

      return () => ctx.revert();
    },
    {
      dependencies: [isLoading, isError],
    },
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-5 pb-24 pt-28 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded-full bg-card" />

            <div className="mx-auto mt-16 max-w-4xl">
              <div className="h-4 w-32 rounded-full bg-card" />

              <div className="mt-6 h-12 w-full rounded-2xl bg-card" />

              <div className="mt-4 h-12 w-4/5 rounded-2xl bg-card" />

              <div className="mt-8 h-4 w-2/3 rounded bg-card" />

              <div className="mt-10 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-card" />

                <div className="space-y-2">
                  <div className="h-3 w-28 rounded bg-card" />
                  <div className="h-3 w-20 rounded bg-card" />
                </div>
              </div>
            </div>

            <div className="mt-12 aspect-[16/7] rounded-[2rem] bg-card" />

            <div className="mx-auto mt-14 max-w-3xl space-y-4">
              <div className="h-4 rounded bg-card" />
              <div className="h-4 rounded bg-card" />
              <div className="h-4 w-11/12 rounded bg-card" />
              <div className="h-4 rounded bg-card" />
              <div className="h-4 w-4/5 rounded bg-card" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-28 text-foreground">
        <div className="w-full max-w-lg rounded-[2rem] border border-border bg-surface p-8 text-center shadow-2xl shadow-black/10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-danger/10 text-xl font-bold text-danger">
            !
          </div>

          <h1 className="mt-6 text-2xl font-semibold">
            Unable to load this article
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted">
            {error?.response?.data?.message ||
              error?.message ||
              "Something went wrong while loading this article."}
          </p>

          <Link
            to="/posts"
            className="
              mt-8
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
            <span>←</span>
            Back to articles
          </Link>
        </div>
      </main>
    );
  }

  const post = data?.data || data;

  if (!post) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-28 text-foreground">
        <div className="w-full max-w-lg rounded-[2rem] border border-border bg-surface p-8 text-center shadow-2xl shadow-black/10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-xl font-bold text-primary">
            ?
          </div>

          <h1 className="mt-6 text-2xl font-semibold">Article not found</h1>

          <p className="mt-3 text-sm leading-7 text-muted">
            The article you're looking for doesn't exist or may have been
            removed.
          </p>

          <Link
            to="/posts"
            className="
              mt-8
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
            "
          >
            Explore articles
            <span>→</span>
          </Link>
        </div>
      </main>
    );
  }

  const postId = post?._id || post?.id;

  const title = post?.identity?.title || post?.title || "Untitled article";

  const excerpt = post?.identity?.excerpt || post?.excerpt || "";

  const author = post?.author?.authorId;

  const firstName = author?.identity?.firstName || "";

  const lastName = author?.identity?.lastName || "";

  const username = author?.identity?.username || "";

  const authorName =
    [firstName, lastName].filter(Boolean).join(" ") ||
    username ||
    "Unknown author";

  const avatar = author?.profile?.avatar || null;

  const content = post?.content?.body || post?.content || post?.body || "";

  const coverImage =
    post?.content?.coverImage ||
    post?.coverImage ||
    post?.media?.coverImage ||
    "";

  const status = post?.publishing?.status || post?.status || "";

  const visibility = post?.publishing?.visibility || "";

  const createdAt = post?.createdAt || post?.publishing?.publishedAt || null;

  const likesCount = post?.engagement?.likesCount ?? 0;

  const commentsCount = post?.engagement?.commentsCount ?? 0;

  const views = post?.engagement?.views ?? 0;

  const category = post?.classification?.categoryId;

  const categoryName = category?.identity?.name || category?.name || "";

  const tags = Array.isArray(post?.classification?.tagIds)
    ? post.classification.tagIds
    : [];

  const handleLike = () => {
    if (!postId || likeMutation.isPending) {
      return;
    }

    likeMutation.mutate(postId, {
      onSuccess: (response) => {
        setLiked(Boolean(response?.liked));
      },
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-5 pb-28 pt-28 sm:px-6 lg:px-8">
        <Link
          to="/posts"
          className="
            article-nav
            group
            inline-flex
            items-center
            gap-3
            rounded-full
            border
            border-border
            bg-surface
            px-4
            py-2.5
            text-sm
            font-medium
            text-muted
            shadow-sm
            transition-all
            duration-300
            hover:-translate-x-0.5
            hover:border-primary/30
            hover:text-primary
          "
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>

          <span>All articles</span>
        </Link>

        <article className="mt-14">
          <header className="mx-auto max-w-5xl text-center">
            <div className="article-kicker flex flex-wrap items-center justify-center gap-3">
              {categoryName && (
                <span
                  className="
                    rounded-full
                    bg-primary-soft
                    px-4
                    py-1.5
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-primary
                  "
                >
                  {categoryName}
                </span>
              )}

              {status && (
                <span className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold capitalize text-muted">
                  {status}
                </span>
              )}

              {createdAt && (
                <span className="text-xs font-medium text-muted">
                  {new Date(createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            <h1
              className="
                article-title
                mx-auto
                mt-7
                max-w-5xl
                text-4xl
                font-bold
                leading-[1.02]
                tracking-[-0.045em]
                text-foreground
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
              "
            >
              {title}
            </h1>

            {excerpt && (
              <p
                className="
                  article-excerpt
                  mx-auto
                  mt-7
                  max-w-3xl
                  text-base
                  leading-7
                  text-muted
                  sm:text-lg
                  sm:leading-8
                  lg:text-xl
                "
              >
                {excerpt}
              </p>
            )}

            <div
              className="
                article-author
                mx-auto
                mt-9
                flex
                w-fit
                items-center
                gap-4
                rounded-2xl
                border
                border-border
                bg-surface
                px-4
                py-3
                text-left
                shadow-sm
              "
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt={authorName}
                  className="
                    h-12
                    w-12
                    rounded-full
                    object-cover
                    ring-2
                    ring-primary/10
                  "
                />
              ) : (
                <div
                  className="
                    grid
                    h-12
                    w-12
                    shrink-0
                    place-items-center
                    rounded-full
                    bg-primary
                    text-sm
                    font-bold
                    text-background
                    shadow-lg
                    shadow-primary/20
                  "
                >
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  Written by
                </p>

                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {authorName}
                </p>

                {username && <p className="text-xs text-muted">@{username}</p>}
              </div>
            </div>
          </header>

          {coverImage && (
            <div
              className="
                article-cover
                group
                relative
                mx-auto
                mt-14
                max-w-6xl
                overflow-hidden
                rounded-[2rem]
                border
                border-border
                bg-surface
                shadow-2xl
                shadow-black/10
              "
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-70" />

              <img
                src={coverImage}
                alt={title}
                className="
                  block
                  aspect-[16/7]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-[1.025]
                "
              />
            </div>
          )}

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid gap-12 lg:grid-cols-[1fr_220px]">
              <div>
                <div
                  className="
                    article-body
                    whitespace-pre-wrap
                    text-[17px]
                    leading-[1.9]
                    text-foreground
                    sm:text-[18px]
                  "
                >
                  {content}
                </div>

                {tags.length > 0 && (
                  <div className="mt-12 border-t border-border pt-7">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => {
                        const tagName =
                          tag?.identity?.name || tag?.name || tag?.slug || "";

                        if (!tagName) {
                          return null;
                        }

                        return (
                          <span
                            key={tag?._id || tag?.id || index}
                            className="
                              rounded-full
                              border
                              border-border
                              bg-surface
                              px-3.5
                              py-1.5
                              text-xs
                              font-medium
                              text-muted
                              transition
                              hover:border-primary/30
                              hover:text-primary
                            "
                          >
                            #{tagName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-28 space-y-4">
                  <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                      Article stats
                    </p>

                    <div className="mt-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">Views</span>

                        <span className="text-sm font-semibold text-foreground">
                          {views}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">Likes</span>

                        <span className="text-sm font-semibold text-foreground">
                          {likesCount}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">Comments</span>

                        <span className="text-sm font-semibold text-foreground">
                          {commentsCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {visibility && (
                    <div className="rounded-3xl border border-border bg-surface px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                        Visibility
                      </p>

                      <p className="mt-2 text-sm font-semibold capitalize text-foreground">
                        {visibility}
                      </p>
                    </div>
                  )}
                </div>
              </aside>
            </div>

            <div
              className="
                article-engagement
                mt-14
                rounded-[2rem]
                border
                border-border
                bg-surface
                p-4
                shadow-xl
                shadow-black/5
                sm:p-5
              "
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Enjoyed this article?
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    Let the author know what you think.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLike}
                    disabled={likeMutation.isPending}
                    className={`
                      group
                      inline-flex
                      items-center
                      gap-2.5
                      rounded-xl
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      transition-all
                      duration-300
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      ${
                        liked
                          ? "bg-primary text-background shadow-lg shadow-primary/20"
                          : "border border-border bg-background text-foreground hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
                      }
                    `}
                  >
                    <span
                      className={`
                        text-lg
                        leading-none
                        transition-transform
                        duration-300
                        ${liked ? "scale-110" : "group-hover:scale-125"}
                      `}
                    >
                      {liked ? "♥" : "♡"}
                    </span>

                    <span>{liked ? "Liked" : "Like"}</span>

                    <span
                      className={liked ? "text-background/70" : "text-muted"}
                    >
                      {likesCount}
                    </span>
                  </button>

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-border
                      bg-background
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-foreground
                    "
                  >
                    <span>💬</span>
                    <span>{commentsCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <section className="article-comments mt-20">
              <div className="flex flex-col gap-3 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    Community
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                    Join the discussion
                  </h2>

                  <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
                    Share your perspective, ask a question, or continue the
                    conversation.
                  </p>
                </div>

                <div className="w-fit rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-semibold text-primary">
                  {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
                </div>
              </div>

              <div className="mt-8">
                <CommentForm postId={postId} />
              </div>

              <div className="mt-8">
                <CommentList postId={postId} />
              </div>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
};

export default PostDetails;
