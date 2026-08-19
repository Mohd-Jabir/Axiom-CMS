import { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useCategories } from "../../features/categories/categories.hooks.js";
import { useTags } from "../../features/tags/tags.hooks.js";

const initialForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  format: "markdown",
  coverImage: "",
  status: "draft",
  visibility: "public",
  categoryId: "",
  tagIds: [],
  metaTitle: "",
  metaDescription: "",
};

const PostForm = ({
  post,
  onSubmit,
  isSubmitting = false,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useCategories({
      page: 1,
      limit: 100,
    });
  const { data: tagsResponse, isLoading: tagsLoading } = useTags({
    page: 1,
    limit: 100,
  });
  const categories = Array.isArray(categoriesResponse?.data)
    ? categoriesResponse.data
    : Array.isArray(categoriesResponse?.categories)
      ? categoriesResponse.categories
      : Array.isArray(categoriesResponse)
        ? categoriesResponse
        : [];

  const tags = Array.isArray(tagsResponse?.data)
    ? tagsResponse.data
    : Array.isArray(tagsResponse?.tags)
      ? tagsResponse.tags
      : Array.isArray(tagsResponse)
        ? tagsResponse
        : [];

  useEffect(() => {
    if (!post) {
      setFormData(initialForm);
      return;
    }
    setFormData({
      title: post?.identity?.title || post?.title || "",
      slug: post?.identity?.slug || post?.slug || "",
      excerpt: post?.identity?.excerpt || post?.excerpt || "",
      content: post?.content?.body || post?.content || "",
      format: post?.content?.format || "markdown",
      coverImage: post?.content?.coverImage || "",
      status: post?.publishing?.status || "draft",
      visibility: post?.publishing?.visibility || "public",
      categoryId:
        post?.classification?.categoryId?._id ||
        post?.classification?.categoryId ||
        "",

      tagIds: Array.isArray(post?.classification?.tagIds)
        ? post.classification.tagIds.map((tag) =>
            typeof tag === "object" ? tag._id : tag,
          )
        : [],
      metaTitle: post?.seo?.metaTitle || "",
      metaDescription: post?.seo?.metaDescription || "",
    });
  }, [post]);
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;
    gsap.from(".post-form-section", {
      opacity: 0,
      y: 18,
      duration: 0.55,
      stagger: 0.08,
      ease: "power3.out",
    });
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setError("");
    if (name === "coverImage") {
      setImageError(false);
    }
  };

  const handleTagChange = (tagId) => {
    setFormData((previous) => {
      const exists = previous.tagIds.includes(tagId);
      return {
        ...previous,
        tagIds: exists
          ? previous.tagIds.filter((id) => id !== tagId)
          : [...previous.tagIds, tagId],
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (formData.title.trim().length > 60) {
      setError("Title cannot be longer than 60 characters.");
      return;
    }
    if (!formData.content.trim()) {
      setError("Content is required.");
      return;
    }
    if (formData.metaTitle.trim().length > 60) {
      setError("SEO meta title cannot exceed 60 characters.");
      return;
    }
    if (formData.metaDescription.trim().length > 200) {
      setError("SEO meta description cannot exceed 200 characters.");
      return;
    }

    const payload = {
      identity: {
        title: formData.title.trim(),
        ...(formData.slug.trim()
          ? {
              slug: formData.slug.trim(),
            }
          : {}),
        excerpt: formData.excerpt.trim(),
      },

      content: {
        body: formData.content.trim(),
        format: formData.format,

        ...(formData.coverImage.trim()
          ? {
              coverImage: formData.coverImage.trim(),
            }
          : {}),
      },

      publishing: {
        status: formData.status,
        visibility: formData.visibility,
      },

      classification: {
        ...(formData.categoryId
          ? {
              categoryId: formData.categoryId,
            }
          : {}),

        tagIds: formData.tagIds,
      },

      seo: {
        metaTitle: formData.metaTitle.trim(),
        metaDescription: formData.metaDescription.trim(),
      },
    };

    onSubmit(payload);
  };

  const selectedCategory = categories.find((category) => {
    const id = category?._id || category?.id;

    return id === formData.categoryId;
  });

  const selectedCategoryName =
    selectedCategory?.identity?.name || selectedCategory?.name || "";

  return (
    <form
      onSubmit={handleSubmit}
      className="
        relative
        mx-auto
        w-full
        max-w-5xl
        pb-28
        text-foreground
      "
    >
      <div
        className="
          post-form-section
          relative
          overflow-hidden
          rounded-[32px]
          bg-foreground
          px-6
          py-9
          text-background
          shadow-[0_30px_90px_rgba(0,0,0,0.14)]
          sm:px-9
          sm:py-11
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
            border-background/[0.06]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-32
            left-1/3
            h-64
            w-64
            rounded-full
            border
            border-background/[0.05]
          "
        />

        <div className="relative">
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
              {isEditMode ? "Edit article" : "New article"}
            </span>
          </div>

          <h1
            className="
              mt-6
              max-w-3xl
              text-3xl
              font-medium
              leading-tight
              tracking-[-0.045em]
              sm:text-4xl
            "
          >
            {isEditMode
              ? "Refine your story."
              : "Turn your ideas into something worth reading."}
          </h1>

          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-background/45
            "
          >
            Shape your article, organize your content, and prepare it for
            publication.
          </p>

          <div
            className="
              mt-7
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <span
              className="
                rounded-full
                bg-background/[0.07]
                px-3
                py-1.5
                text-[10px]
                font-medium
                uppercase
                tracking-[0.12em]
                text-background/50
              "
            >
              {formData.status}
            </span>

            <span
              className="
                rounded-full
                bg-background/[0.07]
                px-3
                py-1.5
                text-[10px]
                font-medium
                uppercase
                tracking-[0.12em]
                text-background/50
              "
            >
              {formData.visibility}
            </span>

            {selectedCategoryName && (
              <span
                className="
                  rounded-full
                  bg-primary/15
                  px-3
                  py-1.5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-primary
                "
              >
                {selectedCategoryName}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div
          className="
            post-form-section
            mt-6
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-danger/20
            bg-danger/10
            px-5
            py-4
            text-sm
            text-danger
          "
        >
          <div
            className="
              mt-0.5
              grid
              h-6
              w-6
              shrink-0
              place-items-center
              rounded-full
              bg-danger/10
            "
          >
            !
          </div>

          <p>{error}</p>
        </div>
      )}

      <section
        className="
          post-form-section
          mt-7
          rounded-[28px]
          border
          border-border
          bg-surface
          p-6
          shadow-sm
          sm:p-8
        "
      >
        <SectionHeader
          number="01"
          title="Identity"
          description="Give your article a strong title and a clear introduction."
        />

        <div className="mt-8 space-y-6">
          <Field label="Title" required counter={`${formData.title.length}/60`}>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={60}
              placeholder="The idea you want people to remember"
              disabled={isSubmitting}
              required
              className={inputClass}
            />
          </Field>

          <Field
            label="Slug"
            hint="Optional. Leave empty to let the backend generate it."
          >
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="my-first-article"
              disabled={isSubmitting}
              className={inputClass}
            />
          </Field>
          <Field
            label="Excerpt"
            counter={`${formData.excerpt.length}/300`}
            hint="A short summary shown before readers open the article."
          >
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              maxLength={300}
              rows={4}
              placeholder="Give readers a reason to keep reading..."
              disabled={isSubmitting}
              className={textareaClass}
            />
          </Field>
        </div>
      </section>

      <section
        className="
          post-form-section
          mt-6
          rounded-[28px]
          border
          border-border
          bg-surface
          p-6
          shadow-sm
          sm:p-8
        "
      >
        <SectionHeader
          number="02"
          title="Content"
          description="Write the actual story and decide how it should be interpreted."
        />

        <div className="mt-8 space-y-6">
          <Field
            label="Format"
            hint="Choose the format expected by your content renderer."
          >
            <div className="grid gap-2 sm:grid-cols-4">
              {[
                ["markdown", "Markdown"],
                ["plaintext", "Plain text"],
                ["html", "HTML"],
                ["json", "JSON"],
              ].map(([value, label]) => {
                const active = formData.format === value;

                return (
                  <button
                    key={value}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setFormData((previous) => ({
                        ...previous,
                        format: value,
                      }))
                    }
                    className={`
                      rounded-xl
                      border
                      px-3
                      py-3
                      text-xs
                      font-semibold
                      transition-all
                      duration-200
                      ${
                        active
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-background text-muted hover:border-foreground/20 hover:text-foreground"
                      }
                    `}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field
            label="Content"
            required
            counter={`${formData.content.length.toLocaleString()} characters`}
          >
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={20}
              required
              placeholder="Start writing your article..."
              disabled={isSubmitting}
              className="
                w-full
                resize-y
                rounded-2xl
                border
                border-border
                bg-background
                px-5
                py-5
                font-mono
                text-sm
                leading-7
                text-foreground
                outline-none
                transition-all
                placeholder:text-subtle
                focus:border-primary
                focus:ring-4
                focus:ring-primary/5
              "
            />
          </Field>

          <Field
            label="Cover image"
            hint="Paste a publicly accessible image URL."
          >
            <input
              name="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
              disabled={isSubmitting}
              className={inputClass}
            />

            {formData.coverImage && !imageError && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  onError={() => setImageError(true)}
                  className="
                    h-56
                    w-full
                    object-cover
                    sm:h-72
                  "
                />
              </div>
            )}

            {formData.coverImage && imageError && (
              <p className="mt-2 text-xs text-danger">
                Unable to preview this image URL.
              </p>
            )}
          </Field>
        </div>
      </section>

      <section
        className="
          post-form-section
          mt-6
          rounded-[28px]
          border
          border-border
          bg-surface
          p-6
          shadow-sm
          sm:p-8
        "
      >
        <SectionHeader
          number="03"
          title="Classification"
          description="Organize your article so readers can discover related content."
        />

        <div className="mt-8 space-y-7">
          <Field label="Category">
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              disabled={isSubmitting || categoriesLoading}
              className={selectClass}
            >
              <option value="">Select a category</option>

              {categories.map((category) => {
                const id = category?._id || category?.id;

                const name =
                  category?.identity?.name ||
                  category?.name ||
                  "Unnamed category";

                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </Field>

          <Field label="Tags" hint={`${formData.tagIds.length} selected`}>
            {tagsLoading ? (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="
                        h-8
                        w-20
                        animate-pulse
                        rounded-full
                        bg-card
                      "
                  />
                ))}
              </div>
            ) : tags.length === 0 ? (
              <div
                className="
                  rounded-2xl
                  border
                  border-dashed
                  border-border
                  bg-background
                  px-5
                  py-6
                  text-center
                  text-sm
                  text-muted
                "
              >
                No tags available.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const id = tag?._id || tag?.id;

                  const name =
                    tag?.identity?.name || tag?.name || "Unnamed tag";

                  const selected = formData.tagIds.includes(id);

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleTagChange(id)}
                      disabled={isSubmitting}
                      className={`
                        rounded-full
                        border
                        px-4
                        py-2
                        text-xs
                        font-medium
                        transition-all
                        duration-200
                        ${
                          selected
                            ? "border-primary bg-primary text-background shadow-sm"
                            : "border-border bg-background text-muted hover:border-foreground/20 hover:text-foreground"
                        }
                      `}
                    >
                      {selected && <span className="mr-1">✓</span>}

                      {name}
                    </button>
                  );
                })}
              </div>
            )}
          </Field>
        </div>
      </section>

      <section
        className="
          post-form-section
          mt-6
          rounded-[28px]
          border
          border-border
          bg-surface
          p-6
          shadow-sm
          sm:p-8
        "
      >
        <SectionHeader
          number="04"
          title="Publishing"
          description="Control the state and visibility of your article."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <label className={labelClass}>Status</label>

            <div className="mt-3 grid gap-2">
              {[
                ["draft", "Draft", "Keep working on it"],
                ["published", "Published", "Make it available to readers"],
                [
                  "archived",
                  "Archived",
                  "Keep it but remove it from publishing",
                ],
              ].map(([value, title, description]) => {
                const active = formData.status === value;

                return (
                  <button
                    key={value}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setFormData((previous) => ({
                        ...previous,
                        status: value,
                      }))
                    }
                    className={`
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        p-4
                        text-left
                        transition-all
                        ${
                          active
                            ? "border-primary/40 bg-primary-soft"
                            : "border-border bg-background hover:border-foreground/15"
                        }
                      `}
                  >
                    <div>
                      <p
                        className={`
                            text-sm
                            font-semibold
                            ${active ? "text-primary" : "text-foreground"}
                          `}
                      >
                        {title}
                      </p>

                      <p className="mt-1 text-xs text-muted">{description}</p>
                    </div>

                    <span
                      className={`
                          grid
                          h-5
                          w-5
                          place-items-center
                          rounded-full
                          border
                          ${
                            active
                              ? "border-primary bg-primary text-background"
                              : "border-border"
                          }
                        `}
                    >
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-background" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass}>Visibility</label>

            <div className="mt-3 grid gap-2">
              {[
                ["public", "Public", "Anyone can discover this article"],
                ["private", "Private", "Only authorized users can access it"],
                ["unlisted", "Unlisted", "Accessible through its direct link"],
              ].map(([value, title, description]) => {
                const active = formData.visibility === value;

                return (
                  <button
                    key={value}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setFormData((previous) => ({
                        ...previous,
                        visibility: value,
                      }))
                    }
                    className={`
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        p-4
                        text-left
                        transition-all
                        ${
                          active
                            ? "border-primary/40 bg-primary-soft"
                            : "border-border bg-background hover:border-foreground/15"
                        }
                      `}
                  >
                    <div>
                      <p
                        className={`
                            text-sm
                            font-semibold
                            ${active ? "text-primary" : "text-foreground"}
                          `}
                      >
                        {title}
                      </p>

                      <p className="mt-1 text-xs text-muted">{description}</p>
                    </div>

                    <span
                      className={`
                          grid
                          h-5
                          w-5
                          place-items-center
                          rounded-full
                          border
                          ${
                            active
                              ? "border-primary bg-primary text-background"
                              : "border-border"
                          }
                        `}
                    >
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-background" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        className="
          post-form-section
          mt-6
          rounded-[28px]
          border
          border-border
          bg-surface
          p-6
          shadow-sm
          sm:p-8
        "
      >
        <SectionHeader
          number="05"
          title="Search optimization"
          description="Control how your article appears in search engines."
        />

        <div className="mt-8 space-y-6">
          <Field label="Meta title" counter={`${formData.metaTitle.length}/60`}>
            <input
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              maxLength={60}
              placeholder="A clear title for search engines"
              disabled={isSubmitting}
              className={inputClass}
            />
          </Field>

          <Field
            label="Meta description"
            counter={`${formData.metaDescription.length}/200`}
          >
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              maxLength={200}
              rows={4}
              placeholder="Explain what readers will find in this article..."
              disabled={isSubmitting}
              className={textareaClass}
            />
          </Field>

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-border
              bg-background
              p-5
            "
          >
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-subtle
              "
            >
              Search preview
            </p>

            <div className="mt-4">
              <p className="line-clamp-1 text-lg font-medium text-primary">
                {formData.metaTitle || formData.title || "Your article title"}
              </p>

              <p className="mt-1 text-xs text-foreground/45">
                axiom.com/posts/
                {formData.slug || "your-article-slug"}
              </p>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                {formData.metaDescription ||
                  formData.excerpt ||
                  "Your search description will appear here."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div
        className="
          post-form-section
          fixed
          inset-x-0
          bottom-0
          z-40
          border-t
          border-border
          bg-surface/95
          px-5
          py-4
          backdrop-blur-xl
          sm:static
          sm:mt-7
          sm:border
          sm:rounded-[24px]
          sm:px-6
        "
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="hidden min-w-0 sm:block">
            <p className="text-xs font-semibold text-foreground">
              {isEditMode ? "Ready to update?" : "Ready to publish?"}
            </p>

            <p className="mt-1 truncate text-[11px] text-muted">
              {formData.title || "Give your article a title first"}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
              className="
                rounded-xl
                border
                border-border
                px-4
                py-2.5
                text-sm
                font-medium
                text-foreground
                transition
                hover:bg-card-hover
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:px-5
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-primary
                px-5
                py-2.5
                text-sm
                font-semibold
                text-background
                shadow-lg
                shadow-primary/10
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-primary-hover
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:px-6
              "
            >
              {isSubmitting ? (
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
                  {isEditMode ? "Update article" : "Create article"}

                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const SectionHeader = ({ number, title, description }) => {
  return (
    <div className="flex items-start gap-4">
      <div
        className="
          grid
          h-10
          w-10
          shrink-0
          place-items-center
          rounded-xl
          bg-foreground
          text-xs
          font-semibold
          text-background
        "
      >
        {number}
      </div>

      <div>
        <h2
          className="
            text-xl
            font-semibold
            tracking-[-0.025em]
            text-foreground
          "
        >
          {title}
        </h2>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
          {description}
        </p>
      </div>
    </div>
  );
};

const Field = ({ label, required = false, hint, counter, children }) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <label className={labelClass}>
          {label}

          {required && <span className="ml-1 text-primary">*</span>}
        </label>

        {counter && (
          <span className="shrink-0 text-[10px] font-medium text-subtle">
            {counter}
          </span>
        )}
      </div>

      {children}

      {hint && <p className="mt-2 text-[11px] leading-5 text-subtle">{hint}</p>}
    </div>
  );
};

const labelClass = "text-sm font-semibold text-foreground";

const inputClass = `
  h-13
  w-full
  rounded-2xl
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
  focus:border-primary
  focus:ring-4
  focus:ring-primary/5
  disabled:cursor-not-allowed
  disabled:opacity-50
`;

const textareaClass = `
  w-full
  resize-y
  rounded-2xl
  border
  border-border
  bg-background
  px-4
  py-4
  text-sm
  leading-7
  text-foreground
  outline-none
  transition-all
  duration-200
  placeholder:text-subtle
  focus:border-primary
  focus:ring-4
  focus:ring-primary/5
  disabled:cursor-not-allowed
  disabled:opacity-50
`;

const selectClass = `
  h-13
  w-full
  rounded-2xl
  border
  border-border
  bg-background
  px-4
  text-sm
  text-foreground
  outline-none
  transition-all
  focus:border-primary
  focus:ring-4
  focus:ring-primary/5
  disabled:cursor-not-allowed
  disabled:opacity-50
`;

export default PostForm;
