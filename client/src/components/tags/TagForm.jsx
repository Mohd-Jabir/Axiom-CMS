import { useEffect, useState } from "react";
import Button from "../ui/Button.jsx";

const TagForm = ({
  initialData = null,
  onSubmit,
  isPending = false,
  onCancel,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData?.identity?.name || initialData?.name || "");
    } else {
      setName("");
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    onSubmit({
      identity: {
        name: trimmedName,
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
            {initialData ? "✎" : "#"}
          </div>

          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.16em]
                text-primary
              "
            >
              {initialData ? "Tag management" : "Content management"}
            </p>

            <h2
              className="
                mt-1
                text-xl
                font-semibold
                tracking-tight
                text-foreground
              "
            >
              {initialData ? "Edit Tag" : "Create Tag"}
            </h2>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-muted
              "
            >
              {initialData
                ? "Update the tag name and save your changes."
                : "Create a tag to help organize and discover posts."}
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-7 sm:px-8">
      
        <section>
          <div className="mb-5">
            <h3
              className="
                text-sm
                font-semibold
                text-foreground
              "
            >
              Tag information
            </h3>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-muted
              "
            >
              Use a short and meaningful name that describes the topic.
            </p>
          </div>

          <div>
            {/* Label + counter */}

            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="tag-name"
                className="
                  text-sm
                  font-medium
                  text-foreground
                "
              >
                Tag name
                <span className="ml-1 text-danger">*</span>
              </label>

              <span className="text-xs text-muted">{name.length}/50</span>
            </div>
            <div className="relative">
              <input
                id="tag-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="JavaScript"
                maxLength={50}
                required
                disabled={isPending}
                autoComplete="off"
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
            </div>
            {!name.trim() ? (
              <p className="mt-2 text-xs text-muted">
                Example: JavaScript, React, Backend, Design
              </p>
            ) : (
              <p className="mt-2 text-xs text-muted">
                This tag will be available when creating or editing posts.
              </p>
            )}
          </div>
        </section>
        {name.trim() && (
          <section
            className="
              mt-7
              rounded-2xl
              border
              border-border
              bg-background
              p-5
            "
          >
            <p
              className="
                mb-3
                text-xs
                font-semibold
                uppercase
                tracking-[0.14em]
                text-muted
              "
            >
              Preview
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-primary/20
                  bg-primary-soft
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-primary
                "
              >
                <span className="opacity-70">#</span>
                {name.trim()}
              </span>

              <span className="text-xs text-muted">
                How the tag may appear across your content.
              </span>
            </div>
          </section>
        )}
        <div
          className="
            mt-8
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
                {initialData ? "Save changes" : "Create tag"}

                <span className="text-base">→</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TagForm;
