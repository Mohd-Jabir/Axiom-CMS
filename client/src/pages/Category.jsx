import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useCategories,
  useCategoryBySlug,
} from "../features/categories/categories.hooks.js";

const getCategories = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.categories)) {
    return response.categories;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.categories)) {
    return response.data.categories;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.content)) {
    return response.content;
  }

  return [];
};

const getCategoryName = (category) => {
  return category?.identity?.name || category?.name || "Untitled category";
};
const getCategoryDescription = (category) => {
  return category?.identity?.description || category?.description || "";
};
const getCategorySlug = (category) => {
  return category?.slug || category?.identity?.slug || "";
};
const getCategoryId = (category) => {
  return category?._id || category?.id || getCategorySlug(category);
};

const CategoryIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-6 w-6"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
};
const ArrowIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="
        h-4
        w-4
        transition-transform
        duration-300
        group-hover:translate-x-1
      "
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />

      <path strokeLinecap="round" strokeLinejoin="round" d="m13 6 6 6-6 6" />
    </svg>
  );
};

const CategorySkeleton = () => {
  return (
    <div
      className="
        animate-pulse
        rounded-3xl
        border
        border-border
        bg-surface
        p-6
      "
    >
      <div className="h-12 w-12 rounded-2xl bg-card" />
      <div className="mt-6 h-5 w-32 rounded bg-card" />
      <div className="mt-3 h-3 w-full rounded bg-card" />
      <div className="mt-2 h-3 w-4/5 rounded bg-card" />
      <div className="mt-6 h-4 w-24 rounded bg-card" />
    </div>
  );
};

const Category = () => {
  const [selectedSlug, setSelectedSlug] = useState("");

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorData,
  } = useCategories();

  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useCategoryBySlug(selectedSlug);

  const categories = getCategories(categoriesData);

  const selectedCategory =
    categoryData?.data || categoryData?.category || categoryData;

  const selectedName = getCategoryName(selectedCategory);

  const selectedDescription = getCategoryDescription(selectedCategory);

  const selectedCategorySlug =
    getCategorySlug(selectedCategory) || selectedSlug;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-24 sm:px-6 lg:px-8">
        {/* Hero */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[2rem]
            border
            border-border
            bg-surface
            px-6
            py-10
            shadow-sm
            sm:px-10
            sm:py-14
          "
        >
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2">
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-primary
                  shadow-[0_0_12px_rgba(245,158,11,0.6)]
                "
              />

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-primary
                "
              >
                Explore
              </p>
            </div>

            <h1
              className="
                mt-5
                text-4xl
                font-bold
                tracking-tight
                text-foreground
                sm:text-5xl
              "
            >
              Explore by category
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
              Discover content organized into meaningful categories. Choose a
              category to explore everything related to it.
            </p>
          </div>

          {/* Decorative background */}

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-primary/5
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              right-20
              h-64
              w-64
              rounded-full
              bg-primary/5
              blur-3xl
            "
          />
        </section>

        {/* Section heading */}

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
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
                Categories
              </p>

              <h2
                className="
                  mt-1
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-foreground
                "
              >
                Browse topics
              </h2>
            </div>

            {!categoriesLoading && (
              <p className="text-sm text-muted">
                {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"}
              </p>
            )}
          </div>

          {/* Loading */}

          {categoriesLoading && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <CategorySkeleton key={item} />
              ))}
            </div>
          )}

          {/* Error */}

          {categoriesError && (
            <div
              className="
                mt-6
                rounded-2xl
                border
                border-danger/20
                bg-danger/10
                p-6
                text-sm
                text-danger
              "
            >
              {categoriesErrorData?.response?.data?.message ||
                categoriesErrorData?.message ||
                "Unable to load categories."}
            </div>
          )}

          {/* Empty */}

          {!categoriesLoading &&
            !categoriesError &&
            categories.length === 0 && (
              <div
                className="
                  mt-6
                  rounded-3xl
                  border
                  border-border
                  bg-surface
                  px-6
                  py-14
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
                    text-primary
                  "
                >
                  <CategoryIcon />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No categories available
                </h3>

                <p className="mt-2 text-sm text-muted">
                  There are currently no categories to explore.
                </p>
              </div>
            )}

          {/* Category cards */}

          {!categoriesLoading && !categoriesError && categories.length > 0 && (
            <div
              className="
                  mt-6
                  grid
                  gap-5
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                "
            >
              {categories.map((category) => {
                const id = getCategoryId(category);
                const name = getCategoryName(category);
                const description = getCategoryDescription(category);
                const slug = getCategorySlug(category);

                const isSelected = selectedSlug === slug;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedSlug(slug)}
                    className={`
                        group
                        relative
                        overflow-hidden
                        rounded-3xl
                        border
                        bg-surface
                        p-6
                        text-left
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-xl
                        hover:shadow-black/5
                        ${
                          isSelected
                            ? "border-primary/40 ring-2 ring-primary/10"
                            : "border-border hover:border-primary/30"
                        }
                      `}
                  >
                    {/* Icon */}

                    <div
                      className={`
                          grid
                          h-12
                          w-12
                          place-items-center
                          rounded-2xl
                          transition-all
                          duration-300
                          ${
                            isSelected
                              ? "bg-primary text-background"
                              : "bg-primary-soft text-primary group-hover:scale-110"
                          }
                        `}
                    >
                      <CategoryIcon />
                    </div>

                    {/* Content */}

                    <div className="mt-6">
                      <h3
                        className="
                            line-clamp-1
                            text-lg
                            font-semibold
                            text-foreground
                          "
                      >
                        {name}
                      </h3>

                      {description ? (
                        <p
                          className="
                              mt-2
                              line-clamp-3
                              min-h-[4.5rem]
                              text-sm
                              leading-6
                              text-muted
                            "
                        >
                          {description}
                        </p>
                      ) : (
                        <p
                          className="
                              mt-2
                              min-h-[4.5rem]
                              text-sm
                              leading-6
                              text-muted
                            "
                        >
                          Explore content from this category.
                        </p>
                      )}
                    </div>

                    {/* Action */}

                    <div
                      className="
                          mt-6
                          flex
                          items-center
                          gap-2
                          text-sm
                          font-semibold
                          text-primary
                        "
                    >
                      <span>Explore category</span>

                      <ArrowIcon />
                    </div>

                    {/* Decorative circle */}

                    <div
                      className="
                          pointer-events-none
                          absolute
                          -bottom-10
                          -right-10
                          h-28
                          w-28
                          rounded-full
                          bg-primary/5
                          blur-2xl
                          transition-transform
                          duration-500
                          group-hover:scale-150
                        "
                    />
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Selected category */}

        {selectedSlug && (
          <section
            className="
              mt-10
              overflow-hidden
              rounded-[2rem]
              border
              border-border
              bg-surface
              shadow-sm
            "
          >
            {categoryLoading ? (
              <div className="animate-pulse p-7 sm:p-9">
                <div className="h-4 w-28 rounded bg-card" />

                <div className="mt-4 h-8 w-64 rounded bg-card" />

                <div className="mt-4 h-4 w-full max-w-2xl rounded bg-card" />

                <div className="mt-2 h-4 w-2/3 rounded bg-card" />

                <div className="mt-7 h-11 w-36 rounded-xl bg-card" />
              </div>
            ) : categoryError ? (
              <div className="p-7 sm:p-9">
                <div
                  className="
                    rounded-2xl
                    border
                    border-danger/20
                    bg-danger/10
                    p-5
                    text-sm
                    text-danger
                  "
                >
                  Unable to load category details.
                </div>
              </div>
            ) : selectedCategory ? (
              <div
                className="
                  flex
                  flex-col
                  gap-8
                  p-7
                  sm:p-9
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        rounded-full
                        bg-primary-soft
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-primary
                      "
                    >
                      Selected category
                    </span>
                  </div>

                  <h2
                    className="
                      mt-4
                      text-2xl
                      font-bold
                      tracking-tight
                      text-foreground
                      sm:text-3xl
                    "
                  >
                    {selectedName}
                  </h2>

                  {selectedDescription && (
                    <p
                      className="
                        mt-3
                        text-sm
                        leading-7
                        text-muted
                        sm:text-base
                      "
                    >
                      {selectedDescription}
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  <Link
                    to={`/products?category=${selectedCategorySlug}`}
                    className="
                      group
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-primary
                      px-6
                      py-3.5
                      text-sm
                      font-semibold
                      text-background
                      shadow-lg
                      shadow-primary/10
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-primary-hover
                      hover:shadow-xl
                    "
                  >
                    <span>View products</span>

                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            ) : null}
          </section>
        )}
      </div>
    </main>
  );
};

export default Category;
