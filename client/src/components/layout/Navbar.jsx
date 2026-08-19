import { useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAuth } from "../../hooks/useAuth.js";
const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Blog", to: "/posts" },
];

function MenuLine({ className = "" }) {
  return (
    <span
      className={`
        block
        h-[1.5px]
        w-4
        bg-current
        transition-transform
        duration-200
        ${className}
      `}
    />
  );
}
function Navbar() {
  const { isAuthenticated, user, logout, isAuthResolved, isLoggingOut } =
    useAuth();

  const location = useLocation();
  const navRef = useRef(null);
  const linksWrapRef = useRef(null);
  const indicatorRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const profileMenuRef = useRef(null);
  const linkRefs = useRef({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const firstName = user?.firstName || user?.identity?.firstName || "";
  const lastName = user?.lastName || user?.identity?.lastName || "";
  const username = user?.username || user?.identity?.username || "";
  const email = user?.email || user?.identity?.email || "";
  const role = user?.role || user?.identity?.role || "user";

  const normalizedRole = String(role).toLowerCase();
  const isAdmin = normalizedRole === "admin";
  const canAccessDashboard = isAdmin;
  const displayName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || username || email || "User";

  const profileImage =
    user?.avatarUrl ||
    user?.avatar ||
    user?.profileImage ||
    user?.profilePicture ||
    user?.imageUrl ||
    null;

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          navRef.current,
          {
            y: -20,
            opacity: 0,
            scale: 0.97,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
          },
        )
        .fromTo(
          navRef.current.querySelectorAll("[data-nav-item]"),
          {
            opacity: 0,
            y: -6,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.3",
        );
    },
    {
      scope: navRef,
    },
  );

  useGSAP(
    () => {
      const activeEl =
        linkRefs.current[location.pathname] || linkRefs.current["/"];

      const wrap = linksWrapRef.current;
      const indicator = indicatorRef.current;

      if (!activeEl || !wrap || !indicator) return;

      const wrapBox = wrap.getBoundingClientRect();
      const elBox = activeEl.getBoundingClientRect();

      gsap.to(indicator, {
        x: elBox.left - wrapBox.left,
        width: elBox.width,
        duration: 0.4,
        ease: "power3.out",
      });
    },
    {
      scope: navRef,
      dependencies: [location.pathname],
    },
  );

  useGSAP(
    () => {
      const panel = mobilePanelRef.current;

      if (!panel) return;

      if (menuOpen) {
        gsap.set(panel, {
          display: "flex",
        });

        gsap.fromTo(
          panel,
          {
            height: 0,
            opacity: 0,
            y: -8,
          },
          {
            height: "auto",
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power3.out",
          },
        );

        gsap.fromTo(
          panel.querySelectorAll("[data-mobile-item]"),
          {
            opacity: 0,
            y: -6,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            stagger: 0.04,
            delay: 0.06,
            ease: "power2.out",
          },
        );
      } else {
        gsap.to(panel, {
          height: 0,
          opacity: 0,
          y: -8,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(panel, {
              display: "none",
            });
          },
        });
      }
    },
    {
      scope: mobilePanelRef,
      dependencies: [menuOpen],
    },
  );

  useGSAP(
    () => {
      const menu = profileMenuRef.current;

      if (!menu) return;

      if (profileOpen) {
        gsap.set(menu, {
          display: "block",
        });

        gsap.fromTo(
          menu,
          {
            opacity: 0,
            y: -8,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          },
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: -8,
          scale: 0.97,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(menu, {
              display: "none",
            });
          },
        });
      }
    },
    {
      scope: profileMenuRef,
      dependencies: [profileOpen],
    },
  );

  const handleLogout = () => {
    setProfileOpen(false);
    setMenuOpen(false);

    logout();
  };

  const closeMenus = () => {
    setProfileOpen(false);
    setMenuOpen(false);
  };

  return (
    <header
      className="
        fixed
        inset-x-0
        top-4
        z-50
        flex
        justify-center
        px-4
        sm:top-5
      "
    >
      <nav
        ref={navRef}
        className="
          relative
          flex
          w-full
          max-w-4xl
          items-center
          gap-1.5
          rounded-full
          border
          border-border/80
          bg-surface/75
          px-2
          py-2
          shadow-[0_12px_45px_rgba(0,0,0,0.14)]
          backdrop-blur-2xl
          supports-[backdrop-filter]:bg-surface/60
        "
      >
        <NavLink
          to="/"
          aria-label="Axiom Home"
          data-nav-item
          onClick={closeMenus}
          className="
            group
            flex
            shrink-0
            items-center
            rounded-full
            px-3
            py-1.5
            transition-all
            duration-200
            hover:bg-foreground/[0.04]
          "
        >
          <img
            src="/logo.png"
            alt="Axiom"
            className="
              h-8
              w-auto
              object-contain
              transition-transform
              duration-300
              group-hover:scale-[1.04]
            "
          />
        </NavLink>

        <div
          ref={linksWrapRef}
          className="
            relative
            hidden
            items-center
            gap-0.5
            rounded-full
            bg-background/40
            p-1
            md:flex
          "
        >
          <span
            ref={indicatorRef}
            className="
              pointer-events-none
              absolute
              left-0
              top-1
              h-[calc(100%-8px)]
              rounded-full
              border
              border-border/70
              bg-foreground/[0.07]
              shadow-sm
            "
            style={{
              width: 0,
            }}
          />

          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              ref={(el) => {
                linkRefs.current[link.to] = el;
              }}
              data-nav-item
              onClick={closeMenus}
              className={({ isActive }) =>
                `
                  relative
                  z-10
                  rounded-full
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "text-foreground"
                      : "text-muted hover:bg-foreground/[0.04] hover:text-foreground"
                  }
                `
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="flex-1" />

        <div
          data-nav-item
          className="
            hidden
            items-center
            gap-1
            md:flex
          "
        >
          {!isAuthResolved ? (
            <div
              className="
                h-9
                w-20
                animate-pulse
                rounded-full
                bg-card
              "
            />
          ) : isAuthenticated ? (
            <div className="relative">
              {/* USER BUTTON */}

              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((value) => !value)}
                className="
                  group
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-border
                  bg-background/40
                  py-1
                  pl-1
                  pr-2.5
                  transition-all
                  duration-200
                  hover:border-border-hover
                  hover:bg-card-hover
                "
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={displayName}
                    className="
                      h-7
                      w-7
                      rounded-full
                      object-cover
                      ring-1
                      ring-border
                    "
                  />
                ) : (
                  <span
                    className="
                      grid
                      h-7
                      w-7
                      place-items-center
                      rounded-full
                      bg-primary-soft
                      text-xs
                      font-semibold
                      text-primary
                    "
                  >
                    {initials}
                  </span>
                )}

                <span
                  className="
                    hidden
                    max-w-28
                    truncate
                    text-sm
                    font-medium
                    text-foreground
                    lg:block
                  "
                >
                  {displayName}
                </span>

                <svg
                  className={`
                    h-3.5
                    w-3.5
                    text-muted
                    transition-transform
                    duration-200
                    ${profileOpen ? "rotate-180" : ""}
                  `}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="
                      M5.23 7.21
                      a.75.75 0 011.06.02
                      L10 11.168
                      l3.71-3.938
                      a.75.75 0 111.08 1.04
                      l-4.25 4.51
                      a.75.75 0 01-1.08 1.04
                      l-4.25-4.51
                      a.75.75 0 01.02-1.06z
                    "
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div
                ref={profileMenuRef}
                className="
                  absolute
                  right-0
                  top-12
                  hidden
                  w-64
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-surface/95
                  p-1
                  shadow-2xl
                  shadow-black/30
                  backdrop-blur-2xl
                "
              >
                <div
                  className="
                    border-b
                    border-border
                    px-3
                    py-3
                  "
                >
                  <div className="flex items-center gap-3">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={displayName}
                        className="
                          h-10
                          w-10
                          shrink-0
                          rounded-full
                          object-cover
                        "
                      />
                    ) : (
                      <span
                        className="
                          grid
                          h-10
                          w-10
                          shrink-0
                          place-items-center
                          rounded-full
                          bg-primary-soft
                          text-sm
                          font-semibold
                          text-primary
                        "
                      >
                        {initials}
                      </span>
                    )}

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-foreground
                        "
                      >
                        {displayName}
                      </p>

                      {email && (
                        <p
                          className="
                            mt-0.5
                            truncate
                            text-xs
                            text-muted
                          "
                        >
                          {email}
                        </p>
                      )}

                      <p className="mt-1 text-[11px] uppercase tracking-wide text-primary">
                        {normalizedRole}
                      </p>
                    </div>
                  </div>
                </div>
                <NavLink
                  to="/my-posts"
                  onClick={closeMenus}
                  className={({ isActive }) =>
                    `
                      mt-1
                      block
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition-colors
                      ${
                        isActive
                          ? "bg-foreground/[0.08] text-foreground"
                          : "text-foreground hover:bg-card-hover"
                      }
                    `
                  }
                >
                  My Posts
                </NavLink>
                <NavLink
                  to="/posts/create"
                  onClick={closeMenus}
                  className="
                    block
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-foreground
                    transition-colors
                    hover:bg-card-hover
                  "
                >
                  Create Post
                </NavLink>

                {canAccessDashboard && (
                  <>
                    <div className="my-1 border-t border-border" />

                    <NavLink
                      to="/dashboard"
                      onClick={closeMenus}
                      className="
                        block
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        text-foreground
                        transition-colors
                        hover:bg-card-hover
                      "
                    >
                      Admin Dashboard
                    </NavLink>
                  </>
                )}
                <NavLink
                  to="/profile"
                  onClick={closeMenus}
                  className="
                    block
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    text-foreground
                    transition-colors
                    hover:bg-card-hover
                  "
                >
                  Profile
                </NavLink>

                <div className="my-1 border-t border-border" />

                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="
                    block
                    w-full
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-danger
                    transition-colors
                    hover:bg-danger/10
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={closeMenus}
                className="
                  rounded-full
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-muted
                  transition-all
                  duration-200
                  hover:bg-foreground/[0.04]
                  hover:text-foreground
                "
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                onClick={closeMenus}
                className="
                  rounded-full
                  bg-primary
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-background
                  shadow-md
                  shadow-primary/10
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-primary-hover
                  hover:shadow-lg
                  hover:shadow-primary/20
                "
              >
                Register
              </NavLink>
            </>
          )}
        </div>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
          className="
            grid
            h-9
            w-9
            shrink-0
            place-items-center
            rounded-full
            border
            border-border
            bg-background/40
            text-foreground
            transition-all
            duration-200
            hover:bg-card-hover
            hover:scale-105
            md:hidden
          "
        >
          <span
            className="
              flex
              flex-col
              items-center
              gap-[5px]
            "
          >
            <MenuLine
              className={menuOpen ? "translate-y-[3px] rotate-45" : ""}
            />

            <MenuLine
              className={menuOpen ? "-translate-y-[3px] -rotate-45" : ""}
            />
          </span>
        </button>
      </nav>
      <div
        className="
          absolute
          top-[68px]
          flex
          w-full
          justify-center
          px-4
        "
      >
        <div
          ref={mobilePanelRef}
          className="
            hidden
            w-full
            max-w-4xl
            flex-col
            gap-1
            overflow-hidden
            rounded-3xl
            border
            border-border
            bg-surface/95
            p-3
            shadow-2xl
            shadow-black/30
            backdrop-blur-2xl
            md:hidden
          "
          style={{
            height: 0,
            opacity: 0,
          }}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              data-mobile-item
              onClick={closeMenus}
              className={({ isActive }) =>
                `
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  ${
                    isActive
                      ? "bg-foreground/[0.08] text-foreground"
                      : "text-muted hover:bg-card-hover hover:text-foreground"
                  }
                `
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div
            data-mobile-item
            className="
              mt-1
              border-t
              border-border
              pt-3
            "
          >
            {!isAuthResolved ? (
              <div
                className="
                  h-10
                  w-full
                  animate-pulse
                  rounded-full
                  bg-card
                "
              />
            ) : isAuthenticated ? (
              <div className="space-y-2">
                {/* MOBILE USER */}

                <div
                  className="
                    mb-2
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    bg-background/50
                    px-3
                    py-3
                  "
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={displayName}
                      className="
                        h-10
                        w-10
                        shrink-0
                        rounded-full
                        object-cover
                      "
                    />
                  ) : (
                    <span
                      className="
                        grid
                        h-10
                        w-10
                        shrink-0
                        place-items-center
                        rounded-full
                        bg-primary-soft
                        text-sm
                        font-semibold
                        text-primary
                      "
                    >
                      {initials}
                    </span>
                  )}

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      {displayName}
                    </p>

                    {email && (
                      <p
                        className="
                          truncate
                          text-xs
                          text-muted
                        "
                      >
                        {email}
                      </p>
                    )}

                    <p className="mt-1 text-[10px] uppercase tracking-wide text-primary">
                      {normalizedRole}
                    </p>
                  </div>
                </div>

                <NavLink
                  to="/my-posts"
                  onClick={closeMenus}
                  className="
                    block
                    w-full
                    rounded-full
                    border
                    border-border
                    py-2.5
                    text-center
                    text-sm
                    font-medium
                    text-foreground
                    transition-colors
                    hover:bg-card-hover
                  "
                >
                  My Posts
                </NavLink>

                <NavLink
                  to="/posts/create"
                  onClick={closeMenus}
                  className="
                    block
                    w-full
                    rounded-full
                    bg-primary
                    py-2.5
                    text-center
                    text-sm
                    font-semibold
                    text-background
                    transition-colors
                    hover:bg-primary-hover
                  "
                >
                  Create Post
                </NavLink>

                {canAccessDashboard && (
                  <NavLink
                    to="/dashboard"
                    onClick={closeMenus}
                    className="
                      block
                      w-full
                      rounded-full
                      border
                      border-border
                      py-2.5
                      text-center
                      text-sm
                      font-medium
                      text-foreground
                      transition-colors
                      hover:bg-card-hover
                    "
                  >
                    Admin Dashboard
                  </NavLink>
                )}
                <NavLink
                  to="/profile"
                  onClick={closeMenus}
                  className="
                    block
                    w-full
                    rounded-full
                    border
                    border-border
                    py-2.5
                    text-center
                    text-sm
                    font-medium
                    text-foreground
                    transition-colors
                    hover:bg-card-hover
                  "
                >
                  Profile
                </NavLink>

                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="
                    mt-1
                    w-full
                    rounded-full
                    bg-danger/10
                    py-2.5
                    text-center
                    text-sm
                    font-medium
                    text-danger
                    transition-colors
                    hover:bg-danger/15
                    disabled:opacity-50
                  "
                >
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  onClick={closeMenus}
                  className="
                    flex-1
                    rounded-full
                    border
                    border-border
                    py-2.5
                    text-center
                    text-sm
                    font-medium
                    text-foreground
                    transition-colors
                    hover:bg-card-hover
                  "
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={closeMenus}
                  className="
                    flex-1
                    rounded-full
                    bg-primary
                    py-2.5
                    text-center
                    text-sm
                    font-semibold
                    text-background
                    transition-colors
                    hover:bg-primary-hover
                  "
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export { Navbar };
