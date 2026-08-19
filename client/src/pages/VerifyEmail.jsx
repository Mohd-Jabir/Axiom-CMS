import { Link, useSearchParams } from "react-router-dom";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useVerifyEmail } from "../features/auth/auth.hooks.js";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const containerRef = useRef(null);
  const token = searchParams.get("token");
  const verifyQuery = useVerifyEmail(token);
  const isLoading = verifyQuery.isLoading;
  const isSuccess = verifyQuery.isSuccess;
  const isError = verifyQuery.isError;

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      const ctx = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

        timeline
          .from(".verify-orb", {
            opacity: 0,
            scale: 0.5,
            duration: 0.8,
          })
          .from(
            ".verify-card",
            {
              opacity: 0,
              y: 35,
              scale: 0.97,
              duration: 0.65,
            },
            "-=0.45",
          )
          .from(
            ".verify-logo",
            {
              opacity: 0,
              y: 10,
              duration: 0.35,
            },
            "-=0.3",
          )
          .from(
            ".verify-status",
            {
              opacity: 0,
              scale: 0.7,
              y: 10,
              duration: 0.45,
              ease: "back.out(1.7)",
            },
            "-=0.15",
          )
          .from(
            ".verify-content",
            {
              opacity: 0,
              y: 12,
              duration: 0.4,
              stagger: 0.07,
            },
            "-=0.2",
          );
      }, containerRef);

      return () => ctx.revert();
    },
    {
      scope: containerRef,
    },
  );

  return (
    <main
      ref={containerRef}
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-background
        px-5
        py-16
        text-foreground
        sm:px-6
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            verify-orb
            absolute
            left-1/2
            top-1/2
            h-[420px]
            w-[420px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-primary/5
            blur-3xl
          "
        />

        <div
          className="
            absolute
            left-[10%]
            top-[15%]
            h-32
            w-32
            rounded-full
            bg-primary/[0.025]
            blur-2xl
          "
        />

        <div
          className="
            absolute
            bottom-[10%]
            right-[10%]
            h-40
            w-40
            rounded-full
            bg-primary/[0.025]
            blur-3xl
          "
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        <div
          className="
            verify-card
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-border
            bg-surface
            shadow-2xl
            shadow-black/10
          "
        >
          {/* Top accent */}

          <div
            className="
              h-1
              w-full
              bg-gradient-to-r
              from-primary/30
              via-primary
              to-primary/30
            "
          />

          <div className="p-7 sm:p-10">
         
            <div className="verify-logo text-center">
              <Link
                to="/"
                className="
                  inline-flex
                  items-center
                  text-xl
                  font-bold
                  tracking-tight
                  text-foreground
                  transition
                  hover:opacity-80
                "
              >
                Axiom
                <span className="text-primary">.</span>
              </Link>

              <p className="mt-2 text-xs text-muted">Editorial platform</p>
            </div>

            {isLoading && (
              <div className="mt-12 text-center">
                <div
                  className="
                    verify-status
                    mx-auto
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-primary/15
                    bg-primary-soft
                  "
                >
                  <div
                    className="
                      h-9
                      w-9
                      animate-spin
                      rounded-full
                      border-[3px]
                      border-primary/20
                      border-t-primary
                    "
                  />
                </div>

                <div className="mt-7">
                  <h1 className="verify-content text-2xl font-semibold tracking-tight">
                    Verifying your email
                  </h1>

                  <p className="verify-content mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
                    We're confirming your email address. This will only take a
                    moment.
                  </p>
                </div>

                {/* Progress */}

                <div className="verify-content mx-auto mt-8 max-w-[220px]">
                  <div className="h-1 overflow-hidden rounded-full bg-card">
                    <div
                      className="
                        h-full
                        w-1/2
                        animate-pulse
                        rounded-full
                        bg-primary
                      "
                    />
                  </div>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="mt-12 text-center">
                <div
                  className="
                    verify-status
                    mx-auto
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-primary/20
                    bg-primary-soft
                  "
                >
                  <span
                    className="
                      text-3xl
                      font-semibold
                      text-primary
                    "
                  >
                    ✓
                  </span>
                </div>

                <div className="mt-7">
                  <p
                    className="
                      verify-content
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-primary
                    "
                  >
                    Verification complete
                  </p>

                  <h1
                    className="
                      verify-content
                      mt-2
                      text-2xl
                      font-semibold
                      tracking-tight
                      text-foreground
                    "
                  >
                    Your email is verified
                  </h1>

                  <p
                    className="
                      verify-content
                      mx-auto
                      mt-3
                      max-w-sm
                      text-sm
                      leading-6
                      text-muted
                    "
                  >
                    Your Axiom account is ready. You can now sign in and start
                    creating content.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="
                    verify-content
                    mt-8
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-primary
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-background
                    shadow-lg
                    shadow-primary/10
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-primary-hover
                    hover:shadow-xl
                    hover:shadow-primary/15
                    active:translate-y-0
                  "
                >
                  Continue to login
                  <span>→</span>
                </Link>
              </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {isError && (
              <div className="mt-12 text-center">
                <div
                  className="
                    verify-status
                    mx-auto
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-danger/15
                    bg-danger/10
                  "
                >
                  <span
                    className="
                      text-3xl
                      font-semibold
                      text-danger
                    "
                  >
                    !
                  </span>
                </div>

                <div className="mt-7">
                  <p
                    className="
                      verify-content
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-danger
                    "
                  >
                    Verification unsuccessful
                  </p>

                  <h1
                    className="
                      verify-content
                      mt-2
                      text-2xl
                      font-semibold
                      tracking-tight
                    "
                  >
                    We couldn't verify your email
                  </h1>

                  <p
                    className="
                      verify-content
                      mx-auto
                      mt-3
                      max-w-sm
                      text-sm
                      leading-6
                      text-muted
                    "
                  >
                    {verifyQuery.error?.response?.data?.message ||
                      verifyQuery.error?.message ||
                      "This verification link is invalid or has expired."}
                  </p>
                </div>

                <div className="verify-content mt-8 flex flex-col gap-3">
                  <Link
                    to="/resend-verification"
                    className="
                      inline-flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-primary
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-background
                      shadow-lg
                      shadow-primary/10
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-primary-hover
                      hover:shadow-xl
                      active:translate-y-0
                    "
                  >
                    Resend verification
                    <span>→</span>
                  </Link>

                  <Link
                    to="/login"
                    className="
                      inline-flex
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-border
                      bg-transparent
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-foreground
                      transition-all
                      duration-200
                      hover:bg-card-hover
                    "
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            )}

            <div
              className="
                verify-content
                mt-10
                border-t
                border-border
                pt-6
                text-center
              "
            >
              <p className="text-xs leading-5 text-muted">
                Having trouble? You can request a new verification link from the
                resend page.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom branding */}

        <p className="mt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Axiom
        </p>
      </div>
    </main>
  );
};

export default VerifyEmail;
