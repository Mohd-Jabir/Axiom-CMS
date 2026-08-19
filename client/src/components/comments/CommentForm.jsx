import { useState } from "react";
import { useCreateComment } from "../../features/comments/comments.hooks.js";
import Spinner from "../ui/Spinner.jsx";

const CommentForm = ({ postId }) => {
  const [body, setBody] = useState("");
  const createMutation = useCreateComment();
  const maxLength = 100;
  const remaining = maxLength - body.length;
  const hasContent = Boolean(body.trim());
  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedBody = body.trim();
    if (!trimmedBody || !postId) {
      return;
    }
    createMutation.mutate(
      {
        postId,
        body: trimmedBody,
      },
      {
        onSuccess: () => {
          setBody("");
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-surface
        shadow-sm
        transition-all
        duration-300
        hover:border-border-hover
        hover:shadow-md
      "
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <label
              htmlFor="comment"
              className="
                block
                text-sm
                font-semibold
                tracking-tight
                text-foreground
              "
            >
              Add a comment
            </label>

            <p className="mt-1 text-xs text-muted">
              Share your thoughts with the community.
            </p>
          </div>

          <span
            className="
              hidden
              rounded-full
              bg-primary/10
              px-2.5
              py-1
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-primary
              sm:inline-flex
            "
          >
            Discussion
          </span>
        </div>

        <div className="relative mt-5">
          <textarea
            id="comment"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={maxLength}
            rows={4}
            placeholder="Write something thoughtful..."
            disabled={createMutation.isPending}
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-border
              bg-background
              px-4
              py-3.5
              text-sm
              leading-6
              text-foreground
              outline-none
              transition-all
              duration-200
              placeholder:text-subtle
              focus:border-primary/50
              focus:ring-4
              focus:ring-primary/10
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              bottom-3
              right-3
              rounded-md
              bg-background/90
              px-1.5
              py-0.5
              text-[10px]
              font-medium
              text-muted
            "
          >
            {body.length}/{maxLength}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            {createMutation.isError ? (
              <p className="text-xs leading-5 text-danger">
                {createMutation.error?.response?.data?.message ||
                  createMutation.error?.message ||
                  "Unable to create comment."}
              </p>
            ) : (
              <p
                className={`
                  text-xs
                  transition-colors
                  ${remaining <= 20 ? "text-danger" : "text-muted"}
                `}
              >
                {remaining} characters remaining
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending || !hasContent}
            className="
              group/button
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-primary
              px-5
              py-2.5
              text-sm
              font-semibold
              text-black
              shadow-[0_6px_20px_rgba(245,158,11,0.12)]
              outline-none
              transition-all
              duration-200
              ease-out
              hover:-translate-y-0.5
              hover:bg-primary-hover
              hover:shadow-[0_9px_25px_rgba(245,158,11,0.18)]
              active:scale-[0.97]
              focus-visible:ring-2
              focus-visible:ring-primary/30
              focus-visible:ring-offset-2
              focus-visible:ring-offset-surface
              disabled:pointer-events-none
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {createMutation.isPending ? (
              <>
                <Spinner size="sm" />
                Posting...
              </>
            ) : (
              <>
                Comment
                <span
                  className="
                    text-base
                    transition-transform
                    duration-200
                    group-hover/button:translate-x-0.5
                  "
                >
                  →
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
