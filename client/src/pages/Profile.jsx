import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAuth } from "../hooks/useAuth.js";
import {
  useUpdateProfile,
  useDeleteAccount,
} from "../features/users/users.hooks.js";
import UserProfileCard from "../components/users/UserProfileCard.jsx";
const Profile = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, isAuthResolved } = useAuth();

  const updateMutation = useUpdateProfile();
  const deleteMutation = useDeleteAccount();

  useGSAP(() => {
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
      .from("[data-profile-hero]", {
        opacity: 0,
        y: 30,
        duration: 0.7,
      })
      .from(
        "[data-profile-section]",
        {
          opacity: 0,
          y: 24,
          duration: 0.55,
          stagger: 0.1,
        },
        "-=0.35",
      );
  });

  if (!isAuthResolved) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-32">
        <div className="w-full max-w-md rounded-[32px] border border-border bg-surface p-9 text-center shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-foreground text-background">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
              />

              <circle
                cx="9"
                cy="7"
                r="4"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
              />
            </svg>
          </div>

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Axiom account
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            Sign in required
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted">
            Sign in to manage your profile, identity and account settings.
          </p>

          <Link
            to="/login"
            className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-semibold text-background shadow-lg shadow-primary/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
          >
            Sign in →
          </Link>
        </div>
      </main>
    );
  }

  const handleUpdate = (profileData, options = {}) => {
    updateMutation.mutate(profileData, options);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    deleteMutation.mutate(
      {},
      {
        onSuccess: () => {
          navigate("/login", {
            replace: true,
          });
        },

        onError: (error) => {
          window.alert(
            error?.response?.data?.message ||
              "Unable to delete your account.",
          );
        },
      },
    );
  };

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName ||
        user?.username ||
        user?.email ||
        "User";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const role = String(user?.role || "user").toLowerCase();

  const accountStatus = String(
    user?.accountStatus || "active",
  ).toLowerCase();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-5 pb-24 pt-28 text-foreground sm:px-8 sm:pt-32">
      <div className="pointer-events-none absolute left-1/2 top-32 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/[0.035] blur-[140px]" />

      <div className="pointer-events-none absolute -left-48 top-[40%] h-96 w-96 rounded-full border border-primary/[0.035]" />

      <div className="pointer-events-none absolute -right-48 top-[25%] h-96 w-96 rounded-full border border-border/50" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div
          data-profile-hero
          className="
            relative
            mb-10
            overflow-hidden
            rounded-[32px]
            border
            border-border
            bg-[#111111]
            px-6
            py-8
            text-white
            shadow-[0_30px_90px_rgba(0,0,0,0.18)]
            sm:px-10
            sm:py-10
            lg:px-12
          "
        >
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/[0.08]" />

          <div className="absolute -bottom-40 left-1/3 h-72 w-72 rounded-full border border-white/[0.05]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sm font-semibold text-black">
                  {initials}
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Axiom account
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    @{user.username || "username"}
                  </p>
                </div>
              </div>

              <h1 className="mt-8 text-4xl font-medium tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Your profile.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
                Your identity, your story and your presence on Axiom — all in
                one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  Role
                </p>

                <p className="mt-2 text-sm font-medium capitalize text-white">
                  {role}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  Status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />

                  <p className="text-sm font-medium capitalize text-white">
                    {accountStatus}
                  </p>
                </div>
              </div>

              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 sm:col-span-1">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  Identity
                </p>

                <p className="mt-2 text-sm font-medium text-white">
                  Verified profile
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          data-profile-section
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"
        >
          <UserProfileCard
            user={user}
            onUpdate={handleUpdate}
            isUpdating={updateMutation.isPending}
          />

          <div className="space-y-6">
            <section className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(0,0,0,0.07)] sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                Account
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                Your details
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Full name
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {displayName}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-foreground">
                    {user.email || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Username
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    @{user.username || "Not available"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-border bg-foreground p-6 text-background shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-background/40">
                Axiom
              </p>

              <h2 className="mt-3 text-xl font-medium tracking-tight">
                Keep creating.
              </h2>

              <p className="mt-3 text-sm leading-6 text-background/50">
                Your profile is the home for your identity and everything you
                publish.
              </p>

              <Link
                to="/posts/create"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-background px-5 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
              >
                Create a post →
              </Link>
            </section>
          </div>
        </div>

        <section
          data-profile-section
          className="
            mt-8
            overflow-hidden
            rounded-[28px]
            border
            border-danger/15
            bg-surface
            shadow-[0_20px_60px_rgba(0,0,0,0.06)]
          "
        >
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-danger">
                Danger zone
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                Delete your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                Permanently delete your account and associated information.
                This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleteMutation.isPending}
              className="
                shrink-0
                rounded-full
                border
                border-danger/25
                bg-danger/10
                px-6
                py-3
                text-sm
                font-semibold
                text-danger
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-danger/15
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {deleteMutation.isPending
                ? "Deleting account..."
                : "Delete account"}
            </button>
          </div>
        </section>

        <footer
          data-profile-section
          className="mt-12 border-t border-border pt-6 text-center"
        >
          <p className="text-[11px] text-subtle">
            Designed & developed by{" "}
            <a
              href="mailto:mohdjabir.dev@gmail.com"
              className="text-muted transition-colors hover:text-foreground"
            >
              mohdjabir.dev@gmail.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Profile;