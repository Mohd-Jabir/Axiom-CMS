import { Link } from "react-router-dom";

import {
  useDeletePost,
  usePublishPost,
  useArchivePost,
} from "../../features/posts/posts.hooks.js";

const PostActions = ({ post }) => {
  const deleteMutation = useDeletePost();
  const publishMutation = usePublishPost();
  const archiveMutation = useArchivePost();
  const id = post?._id || post?.id;
  const status = post?.publishing?.status || post?.status || "";
  const isLoading =
    deleteMutation.isPending ||
    publishMutation.isPending ||
    archiveMutation.isPending;
  const handleDelete = () => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) return;

    deleteMutation.mutate(id);
  };

  const handlePublish = () => {
    if (!id) return;

    publishMutation.mutate(id);
  };

  const handleArchive = () => {
    if (!id) return;

    archiveMutation.mutate(id);
  };

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-1
      "
    >
      <Link
        to={`/posts/edit/${id}`}
        className="
          inline-flex
          h-8
          items-center
          gap-1.5
          rounded-lg
          px-2.5
          text-[11px]
          font-semibold
          text-muted
          transition-all
          duration-200
          hover:bg-foreground
          hover:text-background
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-3.5 w-3.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4L16.5 3.5z"
          />
        </svg>
        Edit
      </Link>

      {status !== "published" && (
        <button
          type="button"
          onClick={handlePublish}
          disabled={isLoading}
          className="
            inline-flex
            h-8
            items-center
            gap-1.5
            rounded-lg
            bg-primary-soft
            px-2.5
            text-[11px]
            font-semibold
            text-primary
            transition-all
            duration-200
            hover:bg-primary
            hover:text-background
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {publishMutation.isPending ? (
            <>
              <span
                className="
                  h-3
                  w-3
                  animate-spin
                  rounded-full
                  border
                  border-primary/30
                  border-t-primary
                "
              />
              Publishing
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-3.5 w-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m13 6 6 6-6 6"
                />
              </svg>
              Publish
            </>
          )}
        </button>
      )}

      {status === "published" && (
        <button
          type="button"
          onClick={handleArchive}
          disabled={isLoading}
          className="
            inline-flex
            h-8
            items-center
            gap-1.5
            rounded-lg
            px-2.5
            text-[11px]
            font-semibold
            text-muted
            transition-all
            duration-200
            hover:bg-card-hover
            hover:text-foreground
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {archiveMutation.isPending ? (
            <>
              <span
                className="
                  h-3
                  w-3
                  animate-spin
                  rounded-full
                  border
                  border-border
                  border-t-foreground
                "
              />
              Archiving
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-3.5 w-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 7l1 13h10l1-13"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 7V4h6v3"
                />
              </svg>
              Archive
            </>
          )}
        </button>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={isLoading}
        className="
          inline-flex
          h-8
          items-center
          gap-1.5
          rounded-lg
          px-2.5
          text-[11px]
          font-semibold
          text-danger/70
          transition-all
          duration-200
          hover:bg-danger/10
          hover:text-danger
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        {deleteMutation.isPending ? (
          <>
            <span
              className="
                h-3
                w-3
                animate-spin
                rounded-full
                border
                border-danger/20
                border-t-danger
              "
            />
            Deleting
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-3.5 w-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 11v6" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 7l1 13h10l1-13"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7V4h6v3"
              />
            </svg>
            Delete
          </>
        )}
      </button>
    </div>
  );
};

export default PostActions;
