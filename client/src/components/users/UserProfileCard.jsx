import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const UserProfileCard = ({ user, onUpdate, isUpdating = false }) => {
  const cardRef = useRef(null);
  const editPanelRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    avatar: "",
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
    });
  }, [user]);

  useGSAP(
    () => {
      if (!cardRef.current) return;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;
      const items = cardRef.current.querySelectorAll("[data-profile-item]");
      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
        },
      );
    },
    {
      scope: cardRef,
    },
  );

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.username || "User";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const normalizedRole = String(user?.role || "user").toLowerCase();
  const accountStatus = String(user?.accountStatus || "active").toLowerCase();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setError("");
  };
  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
    });
    setError("");
    setIsEditing(false);
  };
  const openEditor = () => {
    setError("");
    setIsEditing(true);
    requestAnimationFrame(() => {
      if (!editPanelRef.current) return;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      gsap.fromTo(
        editPanelRef.current,
        {
          opacity: 0,
          y: 18,
          scale: 0.985,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
        },
      );
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      bio: formData.bio.trim(),
      avatar: formData.avatar.trim(),
    };

    onUpdate(payload, {
      onSuccess: () => {
        setIsEditing(false);
      },

      onError: (mutationError) => {
        setError(
          mutationError?.response?.data?.message ||
            "Unable to update your profile.",
        );
      },
    });
  };

  if (!user) {
    return (
      <div className="w-full overflow-hidden rounded-[32px] border border-border bg-surface p-6 shadow-[0_30px_80px_rgba(0,0,0,0.08)] sm:p-8">
        <div className="animate-pulse space-y-7">
          <div className="h-28 rounded-[24px] bg-card" />
          <div className="h-8 w-48 rounded-lg bg-card" />
          <div className="h-5 w-64 rounded-lg bg-card" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-24 rounded-2xl bg-card" />
            <div className="h-24 rounded-2xl bg-card" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="
        relative
        w-full
        overflow-hidden
        rounded-[32px]
        border
        border-border
        bg-surface
        shadow-[0_30px_90px_rgba(0,0,0,0.10)]
      "
    >
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-32
          bg-gradient-to-b
          from-primary/[0.08]
          to-transparent
        "
      />

      <div
        className="
          absolute
          right-[-80px]
          top-[-80px]
          h-48
          w-48
          rounded-full
          border
          border-primary/[0.08]
        "
      />

      <div
        className="
          absolute
          left-[-100px]
          top-16
          h-56
          w-56
          rounded-full
          border
          border-border/60
        "
      />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div
          data-profile-item
          className="
            flex
            flex-col
            gap-6
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div className="flex min-w-0 items-center gap-5">
            <div className="relative shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={displayName}
                  className="
                    h-24
                    w-24
                    rounded-[28px]
                    border
                    border-border
                    object-cover
                    shadow-xl
                    shadow-black/10
                    sm:h-28
                    sm:w-28
                  "
                />
              ) : (
                <div
                  className="
                    grid
                    h-24
                    w-24
                    place-items-center
                    rounded-[28px]
                    bg-foreground
                    text-2xl
                    font-semibold
                    tracking-tight
                    text-background
                    shadow-xl
                    shadow-black/10
                    sm:h-28
                    sm:w-28
                  "
                >
                  {initials}
                </div>
              )}

              <span
                className="
                  absolute
                  bottom-2
                  right-2
                  h-3
                  w-3
                  rounded-full
                  border-2
                  border-surface
                  bg-primary
                "
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  className="
                    truncate
                    text-2xl
                    font-semibold
                    tracking-[-0.04em]
                    text-foreground
                    sm:text-3xl
                  "
                >
                  {displayName}
                </h2>

                <span
                  className="
                    rounded-full
                    bg-primary/10
                    px-2.5
                    py-1
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-primary
                  "
                >
                  {normalizedRole}
                </span>
              </div>

              <p className="mt-1 text-sm text-muted">
                @{user.username || "username"}
              </p>

              <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                {user.bio ||
                  "Share your ideas, stories and knowledge with the Axiom community."}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={openEditor}
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-border
                bg-background
                px-5
                py-2.5
                text-sm
                font-semibold
                text-foreground
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-border-hover
                hover:bg-card-hover
                hover:shadow-lg
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20h9"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                />
              </svg>
              Edit profile
            </button>
          )}
        </div>

        {!isEditing && (
          <>
            <div
              data-profile-item
              className="
                mt-8
                grid
                gap-3
                border-y
                border-border
                py-5
                sm:grid-cols-3
              "
            >
              <div className="rounded-2xl bg-background/70 px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Username
                </p>

                <p className="mt-2 truncate text-sm font-medium text-foreground">
                  @{user.username || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-background/70 px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Email
                </p>

                <p className="mt-2 truncate text-sm font-medium text-foreground">
                  {user.email || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-background/70 px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      accountStatus === "active" ? "bg-primary" : "bg-danger"
                    }`}
                  />

                  <span className="text-sm font-medium capitalize text-foreground">
                    {accountStatus}
                  </span>
                </div>
              </div>
            </div>

            <div data-profile-item className="mt-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    About
                  </p>

                  <h3 className="mt-1 text-lg font-semibold tracking-tight">
                    A little about you
                  </h3>
                </div>

                <span className="text-xs text-subtle">
                  {user.bio ? `${user.bio.length}/500` : "0/500"}
                </span>
              </div>

              <div className="mt-4 rounded-[24px] border border-border bg-background/60 p-5">
                <p className="text-sm leading-7 text-muted">
                  {user.bio ||
                    "You haven't added a bio yet. Tell the community a little about yourself."}
                </p>
              </div>
            </div>

            <div
              data-profile-item
              className="
                mt-7
                flex
                flex-col
                gap-3
                border-t
                border-border
                pt-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Profile identity
                </p>

                <p className="mt-1 text-xs text-muted">
                  Your username, role and account status are managed by Axiom.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium capitalize text-primary">
                  {normalizedRole}
                </span>

                <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium capitalize text-muted">
                  {accountStatus}
                </span>
              </div>
            </div>
          </>
        )}

        {isEditing && (
          <div ref={editPanelRef} className="mt-8">
            <div className="rounded-[28px] border border-border bg-background/70 p-5 sm:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Edit profile
                  </p>

                  <h3 className="mt-1 text-xl font-semibold tracking-tight">
                    Update your identity
                  </h3>
                </div>

                <p className="text-xs text-muted">
                  Only editable profile information will be changed.
                </p>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm leading-6 text-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted"
                    >
                      First name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="
                        h-12
                        w-full
                        rounded-2xl
                        border
                        border-border
                        bg-surface
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
                      "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted"
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="
                        h-12
                        w-full
                        rounded-2xl
                        border
                        border-border
                        bg-surface
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
                      "
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted"
                  >
                    Username
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                      @
                    </span>

                    <input
                      id="username"
                      type="text"
                      value={user.username || ""}
                      disabled
                      className="
                        h-12
                        w-full
                        cursor-not-allowed
                        rounded-2xl
                        border
                        border-border
                        bg-card
                        pl-8
                        pr-4
                        text-sm
                        text-muted
                        outline-none
                      "
                    />
                  </div>

                  <p className="mt-2 text-xs text-subtle">
                    Username cannot be changed here.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="
                      h-12
                      w-full
                      cursor-not-allowed
                      rounded-2xl
                      border
                      border-border
                      bg-card
                      px-4
                      text-sm
                      text-muted
                      outline-none
                    "
                  />

                  <p className="mt-2 text-xs text-subtle">
                    Email cannot be changed here.
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="bio"
                      className="block text-xs font-semibold uppercase tracking-wide text-muted"
                    >
                      Bio
                    </label>

                    <span className="text-xs text-subtle">
                      {formData.bio.length}/500
                    </span>
                  </div>

                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={5}
                    maxLength={500}
                    placeholder="Tell people a little about yourself..."
                    className="
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-border
                      bg-surface
                      px-4
                      py-3
                      text-sm
                      leading-6
                      text-foreground
                      outline-none
                      transition-all
                      duration-200
                      placeholder:text-subtle
                      hover:border-border-hover
                      focus:border-primary
                      focus:ring-4
                      focus:ring-primary/10
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="avatar"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted"
                  >
                    Avatar URL
                  </label>

                  <input
                    id="avatar"
                    name="avatar"
                    type="url"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="
                      h-12
                      w-full
                      rounded-2xl
                      border
                      border-border
                      bg-surface
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
                    "
                  />

                  {formData.avatar && (
                    <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-surface p-3">
                      <img
                        src={formData.avatar}
                        alt="Avatar preview"
                        className="h-14 w-14 rounded-xl object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />

                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Avatar preview
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          This image will be used on your profile.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Role
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-foreground">
                      {normalizedRole}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Account status
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-foreground">
                      {accountStatus}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="
                      rounded-full
                      border
                      border-border
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-foreground
                      transition-all
                      duration-200
                      hover:bg-card-hover
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="
                      rounded-full
                      bg-primary
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-background
                      shadow-lg
                      shadow-primary/15
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-primary-hover
                      hover:shadow-xl
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {isUpdating ? "Saving..." : "Save changes →"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;
