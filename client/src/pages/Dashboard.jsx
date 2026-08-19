import { Link } from "react-router-dom";
import {
  useCategories,
} from "../features/categories/categories.hooks.js";
import {useTags} from '../features/tags/tags.hooks.js'
import { useUsers } from "../features/users/users.hooks.js";

const getArray = (response, keys = []) => {
  if (Array.isArray(response)) {
    return response;
  }

  for (const key of keys) {
    if (Array.isArray(response?.[key])) {
      return response[key];
    }
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
};

const getTotal = (response, fallbackArray) => {
  return (
    response?.pagination?.total ??
    response?.data?.pagination?.total ??
    fallbackArray.length
  );
};

const StatIcon = ({ type }) => {
  if (type === "users") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
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
    );
  }

  if (type === "categories") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 13.5 13.5 20a2 2 0 0 1-2.83 0L4 13.33a2 2 0 0 1 0-2.83L10.5 4H17a3 3 0 0 1 3 3v6.5Z"
      />
      <circle cx="15.5" cy="8.5" r="1" />
    </svg>
  );
};

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m13 6 6 6-6 6" />
  </svg>
);

const Dashboard = () => {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    page: 1,
    limit: 1,
  });

  const { data: tagsData, isLoading: tagsLoading } = useTags({
    page: 1,
    limit: 1,
  });

  const { data: usersData, isLoading: usersLoading } = useUsers({
    page: 1,
    limit: 1,
  });

  const categories = getArray(categoriesData, ["categories"]);
  const tags = getArray(tagsData, ["tags"]);
  const users = getArray(usersData, ["users"]);

  const usersTotal = getTotal(usersData, users);
  const categoriesTotal = getTotal(categoriesData, categories);
  const tagsTotal = getTotal(tagsData, tags);

  const isLoading = categoriesLoading || tagsLoading || usersLoading;

  const stats = [
    {
      title: "Total Users",
      value: usersTotal,
      description: "Registered accounts",
      path: "/admin/users",
      type: "users",
    },
    {
      title: "Categories",
      value: categoriesTotal,
      description: "Content categories",
      path: "/dashboard/categories",
      type: "categories",
    },
    {
      title: "Tags",
      value: tagsTotal,
      description: "Content tags",
      path: "/dashboard/tags",
      type: "tags",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}

        <header className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-8 shadow-sm sm:px-8 sm:py-10">
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(245,158,11,0.6)]" />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Administration
              </p>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome to your dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Manage users, organize your content, and control your Axiom CMS
              from one central workspace.
            </p>
          </div>

          {/* Decorative element */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
        </header>

        {/* Stats */}

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Overview
              </p>

              <h2 className="mt-1 text-xl font-semibold text-foreground">
                Content statistics
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {stats.map((stat) => (
              <Link
                key={stat.title}
                to={stat.path}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-surface
                  p-6
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-primary/30
                  hover:shadow-xl
                  hover:shadow-black/5
                "
              >
                {/* Top row */}

                <div className="flex items-start justify-between">
                  <div
                    className="
                      grid
                      h-12
                      w-12
                      place-items-center
                      rounded-2xl
                      bg-primary-soft
                      text-primary
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  >
                    <StatIcon type={stat.type} />
                  </div>

                  <div
                    className="
                      rounded-full
                      border
                      border-border
                      px-2.5
                      py-1
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-muted
                    "
                  >
                    Manage
                  </div>
                </div>

                {/* Content */}

                <div className="mt-6">
                  <p className="text-sm font-medium text-muted">{stat.title}</p>

                  {isLoading ? (
                    <div className="mt-3 h-9 w-20 animate-pulse rounded-lg bg-card" />
                  ) : (
                    <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-muted">{stat.description}</p>
                </div>

                {/* Bottom action */}

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                  <span>Open section</span>
                  <ArrowIcon />
                </div>

                {/* Hover decoration */}

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
                    transition-all
                    duration-500
                    group-hover:scale-150
                  "
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions */}

        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Workspace
            </p>

            <h2 className="mt-1 text-xl font-semibold text-foreground">
              Quick actions
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/dashboard/categories"
              className="
                group
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-border
                bg-surface
                px-5
                py-5
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-primary/30
                hover:bg-card
              "
            >
              <div>
                <p className="font-semibold text-foreground">
                  Manage Categories
                </p>

                <p className="mt-1 text-xs text-muted">Organize your content</p>
              </div>

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <ArrowIcon />
              </div>
            </Link>

            <Link
              to="/dashboard/tags"
              className="
                group
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-border
                bg-surface
                px-5
                py-5
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-primary/30
                hover:bg-card
              "
            >
              <div>
                <p className="font-semibold text-foreground">Manage Tags</p>

                <p className="mt-1 text-xs text-muted">
                  Keep content discoverable
                </p>
              </div>

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <ArrowIcon />
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="
                group
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-border
                bg-surface
                px-5
                py-5
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-primary/30
                hover:bg-card
              "
            >
              <div>
                <p className="font-semibold text-foreground">Manage Users</p>

                <p className="mt-1 text-xs text-muted">
                  Control accounts and roles
                </p>
              </div>

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <ArrowIcon />
              </div>
            </Link>
          </div>
        </section>

        {/* Footer information */}

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Axiom CMS Administration</p>

          <p>Manage your content. Keep your workspace organized.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
