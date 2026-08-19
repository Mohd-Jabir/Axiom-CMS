import { useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import {
  useCreatePost,
  usePostById,
  useUpdatePost,
} from "../features/posts/posts.hooks.js";

import PostForm from "../components/posts/PostForm.jsx";

const PostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const { data, isLoading: isPostLoading, isError, error } = usePostById(id);

  const post = data?.post || data;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const mutationError = createMutation.error || updateMutation.error;

  useGSAP(
    () => {
      if (isEditMode && isPostLoading) return;
      if (isEditMode && isError) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

        timeline
          .from(".editor-back", {
            opacity: 0,
            x: -15,
            duration: 0.4,
          })
          .from(
            ".editor-heading",
            {
              opacity: 0,
              y: 20,
              duration: 0.55,
            },
            "-=0.15",
          )
          .from(
            ".editor-info",
            {
              opacity: 0,
              y: 15,
              duration: 0.45,
            },
            "-=0.3",
          )
          .from(
            ".editor-form",
            {
              opacity: 0,
              y: 25,
              duration: 0.65,
              scale: 0.99,
            },
            "-=0.25",
          );
      });

      return () => context.revert();
    },
    {
      dependencies: [isEditMode, isPostLoading, isError],
    },
  );

  const handleSubmit = (formData) => {
    if (isEditMode) {
      updateMutation.mutate(
        {
          id,
          postData: formData,
        },
        {
          onSuccess: (response) => {
            const updatedPost = response?.post || response;

            if (updatedPost?.slug) {
              navigate(`/posts/${updatedPost.slug}`);
            } else {
              navigate("/my-posts");
            }
          },
        },
      );

      return;
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        navigate("/my-posts");
      },
    });
  };

  if (isEditMode && isPostLoading) {
    return (
      <main className="min-h-screen bg-background px-5 pb-24 pt-28 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="animate-pulse">
            <div className="h-4 w-28 rounded-full bg-card" />

            <div className="mt-10 h-10 w-72 rounded-xl bg-card" />

            <div className="mt-4 h-5 w-full max-w-xl rounded bg-card" />

            <div className="mt-10 h-[700px] rounded-3xl bg-card" />
          </div>
        </div>
      </main>
    );
  }

  if (isEditMode && isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-28 text-foreground">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-8 text-center shadow-2xl shadow-black/10">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-danger/10 text-xl font-bold text-danger">
            !
          </div>

          <h1 className="mt-5 text-2xl font-semibold">Unable to load post</h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            {error?.response?.data?.message ||
              error?.message ||
              "Something went wrong while loading this post."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/my-posts")}
            className="
              mt-7
              inline-flex
              rounded-xl
              bg-primary
              px-5
              py-2.5
              text-sm
              font-semibold
              text-background
              transition
              hover:bg-primary-hover
            "
          >
            Back to my posts →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-28 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/my-posts")}
          className="
            editor-back
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-muted
            transition
            hover:text-primary
          "
        >
          <span>←</span>
          <span>Back to my posts</span>
        </button>

        <div
          className="
            editor-heading
            mt-10
            flex
            flex-col
            gap-6
            border-b
            border-border
            pb-8
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-primary/20
                  bg-primary-soft
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-primary
                "
              >
                {isEditMode ? "Editor" : "Writing"}
              </span>

              <span className="h-1 w-1 rounded-full bg-border" />

              <span className="text-xs text-muted">Axiom publishing</span>
            </div>

            <h1
              className="
                mt-5
                text-4xl
                font-semibold
                tracking-[-0.035em]
                text-foreground
                sm:text-5xl
              "
            >
              {isEditMode
                ? "Edit your story"
                : "Create something worth reading"}
            </h1>

            <p
              className="
                mt-4
                max-w-2xl
                text-sm
                leading-7
                text-muted
                sm:text-base
              "
            >
              {isEditMode
                ? "Refine your content, update its presentation, and save your latest changes."
                : "Write, organize, optimize, and publish your next article from one place."}
            </p>
          </div>

          <div
            className="
              editor-info
              flex
              shrink-0
              items-center
              gap-3
              rounded-2xl
              border
              border-border
              bg-surface
              px-4
              py-3
              shadow-sm
            "
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
              ✦
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground">
                {isEditMode ? "Editing mode" : "Draft workspace"}
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Your content is in your hands
              </p>
            </div>
          </div>
        </div>

        {mutationError && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-danger/20
              bg-danger/10
              px-5
              py-4
              text-sm
              leading-6
              text-danger
            "
          >
            <div className="flex items-start gap-3">
              <span className="font-bold">!</span>

              <p>
                {mutationError?.response?.data?.message ||
                  mutationError?.message ||
                  "Unable to save post."}
              </p>
            </div>
          </div>
        )}

        <div
          className="
            editor-form
            mt-8
            rounded-[2rem]
            border
            border-border
            bg-surface/60
            p-1
            shadow-2xl
            shadow-black/5
          "
        >
          <PostForm
            post={post}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </main>
  );
};

export default PostEditor;
