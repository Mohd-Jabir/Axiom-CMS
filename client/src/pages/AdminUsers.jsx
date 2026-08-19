import { useState } from "react";
import { useUsers, useChangeUserRole } from "../features/users/users.hooks.js";
import Pagination from "../components/ui/Pagination.jsx";

const extractUsers = (response) => {
  if (Array.isArray(response)) {
    return response;
  }
  if (Array.isArray(response?.users)) {
    return response.users;
  }
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  if (Array.isArray(response?.data?.users)) {
    return response.data.users;
  }
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
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

const getUserId = (user) => {
  return user?._id || user?.id;
};

const getUsername = (user) => {
  return user?.identity?.username || user?.username || "Unknown user";
};

const getEmail = (user) => {
  return user?.identity?.email || user?.email || "-";
};

const getRole = (user) => {
  return user?.authorization?.role || user?.role || "user";
};

const getFirstName = (user) => {
  return user?.identity?.firstName || "";
};

const getLastName = (user) => {
  return user?.identity?.lastName || "";
};

const getFullName = (user) => {
  const firstName = getFirstName(user);
  const lastName = getLastName(user);

  return [firstName, lastName].filter(Boolean).join(" ") || getUsername(user);
};

const getAvatar = (user) => {
  return user?.profile?.avatar || user?.avatar || user?.profileImage || null;
};

const getInitials = (user) => {
  const firstName = getFirstName(user);
  const lastName = getLastName(user);

  if (firstName || lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  return getUsername(user).charAt(0).toUpperCase();
};
const roleConfig = {
  user: {
    label: "User",
    className: "border-border bg-card text-muted",
  },

  author: {
    label: "Author",
    className: "border-primary/20 bg-primary-soft text-primary",
  },

  editor: {
    label: "Editor",
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },

  admin: {
    label: "Admin",
    className: "border-danger/20 bg-danger/10 text-danger",
  },
};

const RoleBadge = ({ role }) => {
  const config = roleConfig[role] || roleConfig.user;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-3
        py-1.5
        text-[11px]
        font-semibold
        capitalize
        tracking-wide
        ${config.className}
      `}
    >
      <span
        className="
          h-1.5
          w-1.5
          rounded-full
          bg-current
        "
      />

      {config.label}
    </span>
  );
};

const UserAvatar = ({ user, size = "md" }) => {
  const avatar = getAvatar(user);
  const initials = getInitials(user);

  const sizeClasses = size === "lg" ? "h-12 w-12 text-sm" : "h-10 w-10 text-xs";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={getUsername(user)}
        className={`
          ${sizeClasses}
          shrink-0
          rounded-xl
          object-cover
          ring-1
          ring-border
        `}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeClasses}
        grid
        shrink-0
        place-items-center
        rounded-xl
        bg-primary-soft
        font-bold
        text-primary
        ring-1
        ring-primary/10
      `}
    >
      {initials}
    </div>
  );
};

const UserSkeleton = () => {
  return (
    <div
      className="
        animate-pulse
        rounded-2xl
        border
        border-border
        bg-surface
        p-5
      "
    >
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-card" />

        <div className="flex-1">
          <div className="h-3.5 w-32 rounded bg-card" />

          <div className="mt-2 h-3 w-48 rounded bg-card" />
        </div>

        <div className="h-8 w-24 rounded-lg bg-card" />
      </div>
    </div>
  );
};

const MobileUserCard = ({ user, roleMutation, handleRoleChange }) => {
  const role = getRole(user);

  return (
    <div
      className="
        rounded-2xl
        border
        border-border
        bg-surface
        p-5
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-primary/20
        hover:shadow-lg
        hover:shadow-black/5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar user={user} size="lg" />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {getFullName(user)}
            </p>

            <p className="mt-0.5 truncate text-xs text-muted">
              @{getUsername(user)}
            </p>
          </div>
        </div>

        <RoleBadge role={role} />
      </div>

      <div
        className="
          mt-5
          border-t
          border-border
          pt-4
        "
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          Email
        </p>

        <p className="mt-1 break-all text-sm text-foreground">
          {getEmail(user)}
        </p>
      </div>

      <div className="mt-4">
        <label
          htmlFor={`mobile-role-${getUserId(user)}`}
          className="
            mb-2
            block
            text-[11px]
            font-semibold
            uppercase
            tracking-wider
            text-muted
          "
        >
          Change role
        </label>

        <select
          id={`mobile-role-${getUserId(user)}`}
          value={role}
          disabled={roleMutation.isPending}
          onChange={(event) => handleRoleChange(user, event.target.value)}
          className="
            h-10
            w-full
            rounded-xl
            border
            border-border
            bg-background
            px-3
            text-sm
            font-medium
            text-foreground
            outline-none
            transition
            focus:border-primary
            focus:ring-2
            focus:ring-primary/10
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <option value="user">User</option>
          <option value="author">Author</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  );
};
const AdminUsers = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isError, error } = useUsers({
    page,
    limit,
  });
  const roleMutation = useChangeUserRole();
  const users = extractUsers(data);
  const pagination = extractPagination(data, page, limit);
  const handleRoleChange = (user, role) => {
    const id = getUserId(user);

    if (!id) {
      return;
    }

    const username = getUsername(user);

    if (!window.confirm(`Change ${username}'s role to ${role}?`)) {
      return;
    }

    roleMutation.mutate({
      id,
      roleData: {
        role,
      },
    });
  };

  const errorMessage =
    error?.response?.data?.message || error?.message || "Unable to load users.";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
       
        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-soft px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                  Administration
                </span>
              </div>

              <h1
                className="
                  text-3xl
                  font-semibold
                  tracking-tight
                  text-foreground
                  sm:text-4xl
                "
              >
                Manage Users
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Manage accounts, review user roles, and control access across
                your Axiom CMS.
              </p>
            </div>

            {!isLoading && !isError && (
              <div
                className="
                  inline-flex
                  w-fit
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
                <div
                  className="
                    grid
                    h-9
                    w-9
                    place-items-center
                    rounded-xl
                    bg-primary-soft
                    text-primary
                  "
                >
                  <span className="text-sm font-bold">
                    {pagination.total ?? users.length}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Total users
                  </p>

                  <p className="text-[11px] text-muted">Registered accounts</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {roleMutation.isError && (
          <div
            className="
              mb-6
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
                grid
                h-7
                w-7
                shrink-0
                place-items-center
                rounded-lg
                bg-danger/10
                font-bold
              "
            >
              !
            </div>

            <div>
              <p className="font-semibold">Unable to update role</p>

              <p className="mt-0.5 text-xs opacity-80">
                {roleMutation.error?.response?.data?.message ||
                  roleMutation.error?.message ||
                  "Something went wrong while updating the user role."}
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            {/* Desktop skeleton */}

            <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface lg:block">
              <div className="border-b border-border bg-card px-5 py-4">
                <div className="h-3 w-32 animate-pulse rounded bg-border" />
              </div>

              <div className="divide-y divide-border">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-6 px-5 py-5"
                  >
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-card" />

                    <div className="flex-1">
                      <div className="h-3.5 w-32 animate-pulse rounded bg-card" />

                      <div className="mt-2 h-3 w-48 animate-pulse rounded bg-card" />
                    </div>

                    <div className="h-3 w-44 animate-pulse rounded bg-card" />

                    <div className="h-7 w-20 animate-pulse rounded-full bg-card" />

                    <div className="h-10 w-32 animate-pulse rounded-xl bg-card" />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile skeleton */}

            <div className="space-y-4 lg:hidden">
              {Array.from({ length: 5 }).map((_, index) => (
                <UserSkeleton key={index} />
              ))}
            </div>
          </div>
        )}

        {isError && !isLoading && (
          <div
            className="
              flex
              min-h-[320px]
              items-center
              justify-center
              rounded-3xl
              border
              border-danger/20
              bg-surface
              p-8
              text-center
            "
          >
            <div className="max-w-md">
              <div
                className="
                  mx-auto
                  grid
                  h-14
                  w-14
                  place-items-center
                  rounded-2xl
                  bg-danger/10
                  text-xl
                  font-bold
                  text-danger
                "
              >
                !
              </div>

              <h2 className="mt-5 text-xl font-semibold text-foreground">
                Unable to load users
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="
                  mt-6
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-border
                  bg-surface
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-foreground
                  transition-all
                  duration-200
                  hover:border-primary/30
                  hover:bg-card-hover
                "
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <div
            className="
                flex
                min-h-[360px]
                items-center
                justify-center
                rounded-3xl
                border
                border-dashed
                border-border
                bg-surface
                p-8
                text-center
              "
          >
            <div className="max-w-md">
              <div
                className="
                    mx-auto
                    grid
                    h-16
                    w-16
                    place-items-center
                    rounded-2xl
                    bg-card
                    text-muted
                  "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-7 w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                  />

                  <circle cx="9" cy="7" r="4" />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 21v-2a4 4 0 0 0-3-3.87"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 3.13a4 4 0 0 1 0 7.75"
                  />
                </svg>
              </div>

              <h2 className="mt-5 text-xl font-semibold text-foreground">
                No users found
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                There are currently no users available on this page.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !isError && users.length > 0 && (
          <>
            <div
              className="
                  hidden
                  overflow-hidden
                  rounded-3xl
                  border
                  border-border
                  bg-surface
                  shadow-sm
                  lg:block
                "
            >
              <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-border
                    bg-card/50
                    px-5
                    py-4
                  "
              >
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    User accounts
                  </h2>

                  <p className="mt-0.5 text-xs text-muted">
                    Manage access and permissions.
                  </p>
                </div>

                <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted">
                  Page {pagination.page || page} of {pagination.totalPages || 1}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th
                        className="
                            px-5
                            py-4
                            text-left
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-muted
                          "
                      >
                        User
                      </th>

                      <th
                        className="
                            px-5
                            py-4
                            text-left
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-muted
                          "
                      >
                        Email
                      </th>

                      <th
                        className="
                            px-5
                            py-4
                            text-left
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-muted
                          "
                      >
                        Current role
                      </th>

                      <th
                        className="
                            px-5
                            py-4
                            text-left
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-muted
                          "
                      >
                        Change role
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {users.map((user) => {
                      const id = getUserId(user);
                      const role = getRole(user);

                      return (
                        <tr
                          key={id}
                          className="
                              group
                              transition-colors
                              duration-200
                              hover:bg-card-hover/50
                            "
                        >
                          {/* User */}

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <UserAvatar user={user} />

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-foreground">
                                  {getFullName(user)}
                                </p>

                                <p className="mt-0.5 truncate text-xs text-muted">
                                  @{getUsername(user)}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Email */}

                          <td className="px-5 py-5">
                            <p className="max-w-[260px] truncate text-sm text-muted">
                              {getEmail(user)}
                            </p>
                          </td>

                          {/* Current role */}

                          <td className="px-5 py-5">
                            <RoleBadge role={role} />
                          </td>

                          {/* Change role */}

                          <td className="px-5 py-5">
                            <div className="relative w-fit">
                              <select
                                value={role}
                                disabled={roleMutation.isPending}
                                onChange={(event) =>
                                  handleRoleChange(user, event.target.value)
                                }
                                className="
                                    h-10
                                    min-w-[145px]
                                    appearance-none
                                    rounded-xl
                                    border
                                    border-border
                                    bg-background
                                    px-3
                                    pr-9
                                    text-sm
                                    font-medium
                                    text-foreground
                                    outline-none
                                    transition-all
                                    duration-200
                                    hover:border-primary/30
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/10
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                  "
                              >
                                <option value="user">User</option>

                                <option value="author">Author</option>

                                <option value="editor">Editor</option>

                                <option value="admin">Admin</option>
                              </select>

                              <svg
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="
                                    pointer-events-none
                                    absolute
                                    right-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-muted
                                  "
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>


            <div className="space-y-4 lg:hidden">
              {users.map((user) => (
                <MobileUserCard
                  key={getUserId(user)}
                  user={user}
                  roleMutation={roleMutation}
                  handleRoleChange={handleRoleChange}
                />
              ))}
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

export default AdminUsers;
