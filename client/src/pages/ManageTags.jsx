import { useState } from "react";

import {
  useTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from "../features/tags/tags.hooks.js";

import TagForm from "../components/tags/TagForm.jsx";
import Pagination from "../components/ui/Pagination.jsx";

const extractTags = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.tags)) {
    return response.tags;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.tags)) {
    return response.data.tags;
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

const ManageTags = () => {
  const [page, setPage] = useState(1);
  const [editingTag, setEditingTag] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const limit = 10;

  const { data, isLoading, isError, error } = useTags({
    page,
    limit,
  });

  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const deleteMutation = useDeleteTag();

  const tags = extractTags(data);

  const pagination = extractPagination(data, page, limit);

  const handleCreate = (tagData) => {
    createMutation.mutate(tagData, {
      onSuccess: () => {
        setShowForm(false);
        setPage(1);
      },
    });
  };

  const handleUpdate = (tagData) => {
    updateMutation.mutate(
      {
        id: editingTag?._id || editingTag?.id,
        tagData,
      },
      {
        onSuccess: () => {
          setEditingTag(null);
          setShowForm(false);
        },
      },
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this tag?")) {
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
              Manage Tags
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingTag(null);
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
            {showForm ? "Close Form" : "+ Add Tag"}
          </button>
        </div>

        {showForm && (
          <div className="mt-8">
            <TagForm
              initialData={editingTag}
              onSubmit={editingTag ? handleUpdate : handleCreate}
              isPending={createMutation.isPending || updateMutation.isPending}
              onCancel={() => {
                setEditingTag(null);
                setShowForm(false);
              }}
            />
          </div>
        )}

        {isLoading && (
          <div className="mt-8 text-sm text-muted">Loading tags...</div>
        )}

        {isError && (
          <div className="mt-8 rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
            {error?.response?.data?.message ||
              error?.message ||
              "Unable to load tags."}
          </div>
        )}

        {!isLoading && !isError && tags.length === 0 && (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-10 text-center">
            <h2 className="font-semibold text-foreground">No tags found</h2>

            <p className="mt-2 text-sm text-muted">Create your first tag.</p>
          </div>
        )}

        {!isLoading && !isError && tags.length > 0 && (
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
                    {tags.map((tag) => {
                      const id = tag?._id || tag?.id;

                      const name =
                        tag?.identity?.name || tag?.name || "Unnamed";

                      const slug = tag?.identity?.slug || tag?.slug || "-";

                      const description =
                        tag?.identity?.description || tag?.description || "-";

                      return (
                        <tr key={id} className="hover:bg-card-hover">
                          <td className="px-5 py-4 font-medium text-foreground">
                            {name}
                          </td>

                          <td className="px-5 py-4 text-sm text-muted">
                            {slug}
                          </td>

                          <td className="px-5 py-4 text-sm text-muted">
                            {description}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTag(tag);
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

export default ManageTags;
