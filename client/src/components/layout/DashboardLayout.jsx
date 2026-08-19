import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    {
      label: "Overview",
      path: "/dashboard",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-[18px] w-[18px]"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },

    {
      label: "Categories",
      path: "/dashboard/categories",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-[18px] w-[18px]"
        >
          <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h5A1.5 1.5 0 0 1 12 5.5v5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 10.5v-5Z" />
          <path d="M12 13.5a1.5 1.5 0 0 1 1.5-1.5h5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-5a1.5 1.5 0 0 1-1.5-1.5v-5Z" />
          <path d="M15 4v8M19 8h-8" />
        </svg>
      ),
    },

    {
      label: "Tags",
      path: "/dashboard/tags",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-[18px] w-[18px]"
        >
          <path d="m20.5 13.5-7 7a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1-.5-1.9l1.1-5.1a2 2 0 0 1 1.5-1.5l5.1-1.1a2 2 0 0 1 1.9.5l7.9 7.9a2 2 0 0 1 0 2.8Z" />
          <circle cx="8.5" cy="8.5" r="1.2" />
        </svg>
      ),
    },

    {
      label: "Users",
      path: "/admin/users",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-[18px] w-[18px]"
        >
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8" />
          <path d="M17 14.5a5.2 5.2 0 0 1 3.5 4.5" />
        </svg>
      ),
    },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside
          className="
            hidden
            w-[260px]
            shrink-0
            border-r
            border-border
            bg-surface
            lg:block
          "
        >
          <div className="sticky top-0 flex h-screen flex-col">
            <div className="flex h-[88px] items-center border-b border-border px-6">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="
                  group
                  flex
                  items-center
                  outline-none
                "
              >
                <img
                  src="/logo2.png"
                  alt="Axiom"
                  className="
                    h-9
                    w-auto
                    max-w-[150px]
                    object-contain
                    transition-transform
                    duration-300
                    group-hover:scale-[1.03]
                  "
                />
              </button>
            </div>
            <div className="px-5 pt-8">
              <p
                className="
                  mb-3
                  px-3
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-muted
                "
              >
                Workspace
              </p>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`
                        group
                        relative
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-sm
                        font-medium
                        transition-all
                        duration-200
                        ${
                          active
                            ? "bg-primary-soft text-primary"
                            : "text-muted hover:bg-card-hover hover:text-foreground"
                        }
                      `}
                    >
                      {active && (
                        <span
                          className="
                            absolute
                            left-0
                            top-1/2
                            h-5
                            w-[3px]
                            -translate-y-1/2
                            rounded-r-full
                            bg-primary
                          "
                        />
                      )}

                      <span
                        className={`
                          grid
                          h-9
                          w-9
                          shrink-0
                          place-items-center
                          rounded-lg
                          transition-all
                          duration-200
                          ${
                            active
                              ? "bg-primary text-background"
                              : "bg-background text-muted group-hover:text-foreground"
                          }
                        `}
                      >
                        {item.icon}
                      </span>

                      <span>{item.label}</span>

                      {active && (
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          className="ml-auto h-4 w-4"
                        >
                          <path
                            d="m7.5 5 5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
            <div className="flex-1" />
            <div className="border-t border-border p-5">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-3
                  py-3
                  text-left
                  transition-all
                  duration-200
                  hover:border-primary/30
                  hover:bg-primary-soft
                "
              >
                <span
                  className="
                    grid
                    h-9
                    w-9
                    place-items-center
                    rounded-lg
                    bg-surface
                    text-muted
                    transition
                    group-hover:text-primary
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-[17px] w-[17px]"
                  >
                    <path d="M14 5h5v5" />
                    <path d="M19 5 11 13" />
                    <path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
                  </svg>
                </span>

                <span>
                  <span className="block text-xs font-semibold text-foreground">
                    View website
                  </span>

                  <span className="mt-0.5 block text-[11px] text-muted">
                    Open public site
                  </span>
                </span>
              </button>
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-1">
         
          <header
            className="
              sticky
              top-0
              z-50
              border-b
              border-border
              bg-surface/90
              backdrop-blur-xl
              lg:hidden
            "
          >
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center"
                >
                  <img
                    src="/logo2.png"
                    alt="Axiom"
                    className="h-8 w-auto max-w-[125px] object-contain"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="
                    rounded-lg
                    border
                    border-border
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-muted
                    transition
                    hover:border-primary/30
                    hover:bg-primary-soft
                    hover:text-primary
                  "
                >
                  Website ↗
                </button>
              </div>
              <nav className="mt-4 flex gap-1 overflow-x-auto pb-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`
                        flex
                        shrink-0
                        items-center
                        gap-2
                        rounded-lg
                        px-3
                        py-2
                        text-xs
                        font-medium
                        transition
                        ${
                          active
                            ? "bg-primary-soft text-primary"
                            : "text-muted hover:bg-card-hover hover:text-foreground"
                        }
                      `}
                    >
                      {item.icon}

                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </header>
          <div className="min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
