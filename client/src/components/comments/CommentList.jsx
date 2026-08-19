import {
  useComments,
  useDeleteComment,
} from "../../features/comments/comments.hooks.js";

const CommentList = ({ postId }) => {
  const { data, isLoading, isError, error } = useComments(postId);
  const deleteMutation = useDeleteComment();
  const comments = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.comments)
      ? data.comments
      : Array.isArray(data)
        ? data
        : [];
  const handleDelete = (commentId) => {
    if (!commentId || deleteMutation.isPending) {
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );
    if (!confirmed) {
      return;
    }
    deleteMutation.mutate(commentId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="
              overflow-hidden
              rounded-3xl
              border
              border-border
              bg-surface
              p-5
            "
          >
            <div className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-card" />

                <div className="space-y-2">
                  <div className="h-3 w-28 rounded-full bg-card" />
                  <div className="h-2.5 w-20 rounded-full bg-card" />
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <div className="h-3 w-full rounded-full bg-card" />
                <div className="h-3 w-11/12 rounded-full bg-card" />
                <div className="h-3 w-2/3 rounded-full bg-card" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-danger/20
          bg-danger/10
          p-6
          shadow-sm
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
              grid
              h-10
              w-10
              shrink-0
              place-items-center
              rounded-2xl
              bg-danger/10
              text-danger
            "
          >
            !
          </div>

          <div>
            <h3 className="text-sm font-semibold text-danger">
              Unable to load comments
            </h3>

            <p className="mt-1 text-sm leading-6 text-danger/80">
              {error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while loading comments."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-dashed
          border-border
          bg-surface
          px-6
          py-12
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
            bg-primary-soft
            text-2xl
          "
        >
          💬
        </div>

        <h3 className="mt-5 text-base font-semibold text-foreground">
          No comments yet
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
          Start the conversation by sharing your thoughts about this post.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const user = comment?.ownership?.userId;

        const firstName = user?.identity?.firstName || "";
        const lastName = user?.identity?.lastName || "";
        const username = user?.identity?.username || "";

        const userName =
          [firstName, lastName].filter(Boolean).join(" ") || username || "User";

        const commentBody = comment?.content?.body || "";

        const commentId = comment?._id || comment?.id;

        const initials = userName
          .split(" ")
          .filter(Boolean)
          .map((name) => name.charAt(0))
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <article
            key={commentId}
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-border
              bg-surface
              p-5
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-primary/20
              hover:shadow-xl
              hover:shadow-black/5
              sm:p-6
            "
          >
            <div
              className="
                absolute
                inset-y-0
                left-0
                w-1
                bg-primary
                opacity-0
                transition-opacity
                duration-300
                group-hover:opacity-100
              "
            />

            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    grid
                    h-11
                    w-11
                    shrink-0
                    place-items-center
                    rounded-2xl
                    bg-primary-soft
                    text-sm
                    font-bold
                    text-primary
                    ring-4
                    ring-primary/5
                  "
                >
                  {initials || "U"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {userName}
                  </p>

                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    {username && (
                      <span className="text-xs text-muted">@{username}</span>
                    )}

                    {comment?.createdAt && (
                      <>
                        {username && (
                          <span className="text-xs text-border">•</span>
                        )}

                        <span className="text-xs text-muted">
                          {new Date(comment.createdAt).toLocaleDateString(
                            undefined,
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {commentId && (
                <button
                  type="button"
                  onClick={() => handleDelete(commentId)}
                  disabled={deleteMutation.isPending}
                  aria-label="Delete comment"
                  className="
                    shrink-0
                    rounded-xl
                    border
                    border-transparent
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    text-muted
                    opacity-0
                    transition-all
                    duration-200
                    hover:border-danger/20
                    hover:bg-danger/10
                    hover:text-danger
                    group-hover:opacity-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    sm:opacity-100
                  "
                >
                  {deleteMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span
                        className="
                          h-3
                          w-3
                          animate-spin
                          rounded-full
                          border-2
                          border-muted/30
                          border-t-muted
                        "
                      />
                      Deleting
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              )}
            </div>

            <div
              className="
                mt-5
                rounded-2xl
                bg-background
                px-4
                py-4
                ring-1
                ring-border/50
              "
            >
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                {commentBody}
              </p>
            </div>

            {comment?.moderation?.editedAt && (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                <span className="h-1 w-1 rounded-full bg-muted" />
                <span>Edited</span>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default CommentList;
