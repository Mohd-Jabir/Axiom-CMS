import { useEffect, useState } from "react";
import Button from "../ui/Button.jsx";

const CategoryForm = ({
  initialData = null,
  onSubmit,
  isPending = false,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  useEffect(() => {
    if (initialData) {
      setName(initialData?.identity?.name || initialData?.name || "");
      setDescription(
        initialData?.identity?.description || initialData?.description || "",
      );
      setMetaTitle(
        initialData?.seo?.metaTitle || initialData?.metadata?.metaTitle || "",
      );
      setMetaDescription(
        initialData?.seo?.metaDescription ||
          initialData?.metadata?.metaDescription ||
          "",
      );
    } else {
      setName("");
      setDescription("");
      setMetaTitle("");
      setMetaDescription("");
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedMetaTitle = metaTitle.trim();
    const trimmedMetaDescription = metaDescription.trim();
    if (!trimmedName) {
      return;
    }

    onSubmit({
      identity: {
        name: trimmedName,
        description: trimmedDescription,
      },
      seo: {
        metaTitle: trimmedMetaTitle,
        metaDescription: trimmedMetaDescription,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        overflow-hidden
        rounded-3xl
        border
        border-border
        bg-surface
        shadow-xl
        shadow-black/5
      "
    >
      <div
        className="
          border-b
          border-border
          px-6
          py-6
          sm:px-8
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
              rounded-2xl
              bg-primary-soft
              text-lg
              font-bold
              text-primary
            "
          >
            {initialData ? "✎" : "+"}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {initialData ? "Category management" : "Content management"}
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              {initialData ? "Edit Category" : "Create Category"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted">
              {initialData
                ? "Update the category information and SEO settings."
                : "Create a category to organize your posts."}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-6 py-7 sm:px-8">
        <section>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-foreground">
              Basic information
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted">
              Give your category a clear name and description.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="category-name"
                  className="
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  Category name
                  <span className="ml-1 text-danger">*</span>
                </label>

                <span className="text-xs text-muted">{name.length}/80</span>
              </div>

              <input
                id="category-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Technology"
                maxLength={80}
                required
                disabled={isPending}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-4
                  text-sm
                  text-foreground
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-subtle
                  hover:border-border-hover
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />

              {!name.trim() && (
                <p className="mt-2 text-xs text-muted">
                  Example: Technology, Design, Business
                </p>
              )}
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="category-description"
                  className="
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  Description
                </label>

                <span className="text-xs text-muted">
                  {description.length}/300
                </span>
              </div>

              <textarea
                id="category-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what readers can expect from this category..."
                rows={5}
                maxLength={300}
                disabled={isPending}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-foreground
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-subtle
                  hover:border-border-hover
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>
          </div>
        </section>
        <section
          className="
            rounded-2xl
            border
            border-border
            bg-background
            p-5
            sm:p-6
          "
        >
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div
                className="
                  grid
                  h-9
                  w-9
                  place-items-center
                  rounded-xl
                  bg-primary-soft
                  text-sm
                  font-semibold
                  text-primary
                "
              >
                SEO
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Search engine optimization
                </h3>

                <p className="mt-0.5 text-xs text-muted">
                  Optional metadata for search engines.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="meta-title"
                  className="
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  Meta title
                </label>

                <span
                  className={`
                    text-xs
                    ${metaTitle.length > 50 ? "text-primary" : "text-muted"}
                  `}
                >
                  {metaTitle.length}/60
                </span>
              </div>

              <input
                id="meta-title"
                type="text"
                value={metaTitle}
                onChange={(event) => setMetaTitle(event.target.value)}
                placeholder="Technology - Latest Articles"
                maxLength={60}
                disabled={isPending}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-surface
                  px-4
                  text-sm
                  text-foreground
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-subtle
                  hover:border-border-hover
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="meta-description"
                  className="
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  Meta description
                </label>

                <span
                  className={`
                    text-xs
                    ${
                      metaDescription.length > 140
                        ? "text-primary"
                        : "text-muted"
                    }
                  `}
                >
                  {metaDescription.length}/160
                </span>
              </div>

              <textarea
                id="meta-description"
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
                placeholder="Explore the latest technology articles and insights..."
                rows={4}
                maxLength={160}
                disabled={isPending}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-border
                  bg-surface
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-foreground
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-subtle
                  hover:border-border-hover
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>
          </div>
        </section>
        <div
          className="
            flex
            flex-col-reverse
            gap-3
            border-t
            border-border
            pt-6
            sm:flex-row
            sm:justify-end
          "
        >
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onCancel}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending || !name.trim()}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-background/30
                    border-t-background
                  "
                />
                Saving...
              </>
            ) : (
              <>
                {initialData ? "Save changes" : "Create category"}

                <span className="text-base">→</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
