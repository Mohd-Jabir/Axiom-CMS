import { Link } from "react-router-dom";

const Admin = () => {
  const sections = [
    {
      title: "Dashboard",
      description:
        "Get an overview of your CMS activity, content and administration.",
      path: "/dashboard",
      label: "Overview",
      icon: (
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
      ),
    },

    {
      title: "Users",
      description:
        "Manage registered users, roles and access across your platform.",
      path: "/admin/users",
      label: "User management",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-6 w-6"
        >
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8" />
          <path d="M17 14.5a5.2 5.2 0 0 1 3.5 4.5" />
        </svg>
      ),
    },

    {
      title: "Categories",
      description:
        "Organize your articles into clear and manageable content categories.",
      path: "/dashboard/categories",
      label: "Content organization",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-6 w-6"
        >
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11l2 3h4.5A2.5 2.5 0 0 1 20 9.5v8A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z" />
        </svg>
      ),
    },

    {
      title: "Tags",
      description:
        "Create and maintain tags to improve content discovery and filtering.",
      path: "/dashboard/tags",
      label: "Content discovery",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-6 w-6"
        >
          <path d="m20.5 13.5-7 7a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1-.5-1.9l1.1-5.1a2 2 0 0 1 1.5-1.5l5.1-1.1a2 2 0 0 1 1.9.5l7.9 7.9a2 2 0 0 1 0 2.8Z" />
          <circle cx="8.5" cy="8.5" r="1.2" />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        
        <header className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Administration
            </p>
          </div>

          <h1
            className="
              mt-4
              text-4xl
              font-semibold
              tracking-[-0.03em]
              text-foreground
              sm:text-5xl
            "
          >
            Admin Panel
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
            Manage your Axiom CMS, organize content and control administrative
            resources from one place.
          </p>
        </header>
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Quick access
              </h2>

              <p className="mt-1 text-xs text-muted">
                Choose an area to manage.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <Link
                key={section.path}
                to={section.path}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-surface
                  p-6
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-primary/30
                  hover:shadow-xl
                  hover:shadow-black/5
                "
              >
                {/* Hover glow */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-32
                    w-32
                    rounded-full
                    bg-primary/5
                    opacity-0
                    blur-2xl
                    transition
                    duration-500
                    group-hover:opacity-100
                  "
                />

                <div className="relative">
                  {/* Icon + arrow */}

                  <div className="flex items-start justify-between">
                    <div
                      className="
                        grid
                        h-12
                        w-12
                        place-items-center
                        rounded-xl
                        border
                        border-border
                        bg-background
                        text-muted
                        transition-all
                        duration-300
                        group-hover:border-primary/20
                        group-hover:bg-primary-soft
                        group-hover:text-primary
                      "
                    >
                      {section.icon}
                    </div>

                    <span
                      className="
                        grid
                        h-9
                        w-9
                        place-items-center
                        rounded-full
                        border
                        border-border
                        text-muted
                        transition-all
                        duration-300
                        group-hover:border-primary/20
                        group-hover:bg-primary-soft
                        group-hover:text-primary
                      "
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="
                          h-4
                          w-4
                          transition-transform
                          duration-300
                          group-hover:translate-x-0.5
                          group-hover:-translate-y-0.5
                        "
                      >
                        <path
                          d="M6 14 14 6M8 6h6v6"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>

                  {/* Content */}

                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {section.label}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                    {section.title}
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                    {section.description}
                  </p>

                  {/* Bottom action */}

                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-medium
                      text-foreground
                      transition-colors
                      group-hover:text-primary
                    "
                  >
                    <span>Open section</span>

                    <span
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="mt-8">
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-border
              bg-surface
            "
          >
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-start gap-4">
                <div
                  className="
                    grid
                    h-10
                    w-10
                    shrink-0
                    place-items-center
                    rounded-xl
                    bg-primary-soft
                    text-primary
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 10v6" />
                    <path d="M12 7.5h.01" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Administration workspace
                  </h2>

                  <p className="mt-1 max-w-xl text-xs leading-5 text-muted">
                    Use the navigation to manage users and organize the content
                    structure of your CMS.
                  </p>
                </div>
              </div>

              <Link
                to="/"
                className="
                  inline-flex
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-border
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-foreground
                  transition-all
                  duration-200
                  hover:border-primary/30
                  hover:bg-primary-soft
                  hover:text-primary
                "
              >
                View website ↗
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Admin;
