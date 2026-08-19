import { Link } from "react-router-dom";
import PostActions from "./PostActions.jsx";

const PostCard = ({ post, showActions = false }) => {
  const title = post?.identity?.title || "Untitled post";
  const slug = post?.identity?.slug || "";
  const authorName =
    post?.author?.name || post?.author?.username || "Unknown author";
  const excerpt = post?.identity?.excerpt || post?.content?.body || "";
  const status = post?.publishing?.status || "";
  const likes = post?.engagement?.likesCount || 0;
  const comments = post?.engagement?.commentsCount || 0;
  const views = post?.engagement?.views || 0;
  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <article
      className="
        group
        relative
        flex
        h-full
        min-h-[390px]
        flex-col
        overflow-hidden
        rounded-[28px]
        border
        border-border
        bg-surface
        shadow-sm
        transition-all
        duration-500
        ease-out
        hover:-translate-y-2
        hover:border-foreground/10
        hover:shadow-[0_25px_70px_rgba(0,0,0,0.10)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-primary/50
          to-transparent
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />

      <div className="flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          {status ? (
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-primary/15
                bg-primary-soft
                px-3
                py-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-primary
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {status}
            </span>
          ) : (
            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-subtle
              "
            >
              Article
            </span>
          )}

          {formattedDate && (
            <time
              className="
                shrink-0
                text-[10px]
                font-medium
                uppercase
                tracking-[0.1em]
                text-subtle
              "
            >
              {formattedDate}
            </time>
          )}
        </div>

        <div className="mt-7">
          <h2
            className="
              line-clamp-3
              text-[22px]
              font-semibold
              leading-[1.2]
              tracking-[-0.035em]
              text-foreground
              transition-colors
              duration-300
              group-hover:text-primary
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-4
              line-clamp-3
              text-sm
              leading-7
              text-muted
            "
          >
            {excerpt}
          </p>
        </div>

        <div
          className="
            mt-7
            flex
            items-center
            gap-5
            border-t
            border-border
            pt-5
          "
        >
          <div className="flex items-center gap-1.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-4 w-4 text-muted"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 10v10" />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 10l1-5c.2-1 .8-2 1.8-2 1.2 0 2.1 1.1 1.9 2.3L15 10h4.2c1.2 0 2.1 1.1 1.8 2.3l-1.4 6.5A2 2 0 0117.6 20H7"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h4v10H3z"
              />
            </svg>

            <span className="text-xs font-medium text-muted">{likes}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-4 w-4 text-muted"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 11.5a7.5 7.5 0 01-7.5 7.5c-1.3 0-2.5-.3-3.6-.9L4 20l1.9-4.1A7.4 7.4 0 014.5 11.5 7.5 7.5 0 0112 4a7.5 7.5 0 018 7.5z"
              />
            </svg>

            <span className="text-xs font-medium text-muted">{comments}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-4 w-4 text-muted"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
              />

              <circle cx="12" cy="12" r="2.5" />
            </svg>

            <span className="text-xs font-medium text-muted">{views}</span>
          </div>
        </div>

        <div className="mt-auto pt-7">
          <div className="flex items-center gap-3">
            <div
              className="
                grid
                h-9
                w-9
                shrink-0
                place-items-center
                rounded-full
                bg-foreground
                text-xs
                font-semibold
                text-background
              "
            >
              {authorName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.12em] text-subtle">
                Written by
              </p>

              <p className="mt-0.5 truncate text-xs font-medium text-foreground">
                {authorName}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            {slug ? (
              <Link
                to={`/posts/${slug}`}
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-foreground
                  transition-all
                  duration-300
                  group-hover:gap-3
                  group-hover:text-primary
                "
              >
                Read article
                <span
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </Link>
            ) : (
              <span />
            )}

            {showActions && (
              <div
                className="
                  rounded-xl
                  border
                  border-border
                  bg-background
                  p-1
                "
              >
                <PostActions post={post} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="
          absolute
          bottom-0
          left-0
          h-0.5
          w-0
          bg-primary
          transition-all
          duration-500
          group-hover:w-full
        "
      />
    </article>
  );
};

export default PostCard;
