import { useState } from "react";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../features/categories/categories.hooks.js";

import CategoryForm from "../components/categories/CategoryForm.jsx";
import Pagination from "../components/ui/Pagination.jsx";

const extractCategories = (response) => {
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

  return [];
};

const extractPagination = (response, page, limit) => {
  return (
    response?.pagination ||
    response?.data?.pagination || {
      page,
      limit,
      total: 0,
      totalPages: 1,
    }
  );
};

const ManageCategories = () => {
  const [page, setPage] = useState(1);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const limit = 10;

  const { data, isLoading, isError, error } = useCategories({
    page,
    limit,
  });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const categories = extractCategories(data);

  const pagination = extractPagination(data, page, limit);

  const handleCreate = (categoryData) => {
    createMutation.mutate(categoryData, {
      onSuccess: () => {
        setShowForm(false);
        setPage(1);
      },
    });
  };

  const handleUpdate = (categoryData) => {
    updateMutation.mutate(
      {
        id: editingCategory?._id || editingCategory?.id,
        categoryData,
      },
      {
        onSuccess: () => {
          setEditingCategory(null);
          setShowForm(false);
        },
      },
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this category?")) {
      return;
    }

    deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-primary">Administration</p>

            <h1 className="mt-1 text-3xl font-bold text-foreground">
              Manage Categories
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setShowForm((value) => !value);
            }}
            className="
              rounded-xl
              bg-primary
              px-5
              py-3
              text-sm
              font-semibold
              text-background
              hover:opacity-90
            "
          >
            {showForm ? "Close Form" : "+ Add Category"}
          </button>
        </div>

        {showForm && (
          <div className="mt-8">
            <CategoryForm
              initialData={editingCategory}
              onSubmit={editingCategory ? handleUpdate : handleCreate}
              isPending={createMutation.isPending || updateMutation.isPending}
              onCancel={() => {
                setEditingCategory(null);
                setShowForm(false);
              }}
            />
          </div>
        )}

        {isLoading && (
          <div className="mt-8 text-sm text-muted">Loading categories...</div>
        )}

        {isError && (
          <div className="mt-8 rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
            {error?.response?.data?.message ||
              error?.message ||
              "Unable to load categories."}
          </div>
        )}

        {!isLoading && !isError && categories.length === 0 && (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-10 text-center">
            <h2 className="font-semibold text-foreground">
              No categories found
            </h2>

            <p className="mt-2 text-sm text-muted">
              Create your first category.
            </p>
          </div>
        )}

        {!isLoading && !isError && categories.length > 0 && (
          <>
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead className="border-b border-border bg-card">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted">
                        Name
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted">
                        Slug
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted">
                        Description
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-muted">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {categories.map((category) => {
                      const id = category?._id || category?.id;

                      return (
                        <tr key={id} className="hover:bg-card-hover">
                          <td className="px-5 py-4 font-medium text-foreground">
                            {category?.name ||
                              category?.identity?.name ||
                              "Unnamed"}
                          </td>

                          <td className="px-5 py-4 text-sm text-muted">
                            {category?.slug || category?.identity?.slug || "-"}
                          </td>

                          <td className="px-5 py-4 text-sm text-muted">
                            {category?.description ||
                              category?.identity?.description ||
                              "-"}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCategory(category);
                                  setShowForm(true);
                                }}
                                className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-card-hover"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                disabled={deleteMutation.isPending}
                                onClick={() => handleDelete(id)}
                                className="rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger hover:bg-danger/20 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              page={pagination.page || page}
              totalPages={pagination.totalPages || 1}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
