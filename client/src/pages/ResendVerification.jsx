import { useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useResendVerification } from "../features/auth/auth.hooks.js";
import Button from "../components/ui/Button.jsx";
const ResendVerification = () => {
  const resendMutation = useResendVerification();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".resend-brand", {
        opacity: 0,
        y: -12,
        duration: 0.45,
      })
        .from(
          ".resend-heading",
          {
            opacity: 0,
            y: 25,
            duration: 0.65,
          },
          "-=0.15",
        )
        .from(
          ".resend-description",
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
          },
          "-=0.3",
        )
        .from(
          ".resend-form",
          {
            opacity: 0,
            y: 20,
            duration: 0.55,
          },
          "-=0.2",
        )
        .from(
          ".resend-footer",
          {
            opacity: 0,
            y: 12,
            duration: 0.4,
          },
          "-=0.2",
        );
    });

    return () => ctx.revert();
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setError("");

    resendMutation.mutate(trimmedEmail, {
      onError: (mutationError) => {
        setError(
          mutationError?.response?.data?.message ||
            "Unable to send the verification email.",
        );
      },
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-20 text-foreground sm:px-6">
      {/* Background decoration */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[420px]
          w-[420px]
          -translate-x-1/2
          rounded-full
          bg-primary/5
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          right-0
          h-72
          w-72
          rounded-full
          bg-primary/5
          blur-3xl
        "
      />

      <div className="relative w-full max-w-lg">
        {/* Brand */}

        <div className="resend-brand text-center">
          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-1
              text-2xl
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
        </div>

        {/* Main content */}

        <div className="mt-10">
          <div className="resend-heading">
            <div className="mb-5 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-border" />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-primary
                "
              >
                Account security
              </span>

              <span className="h-px w-8 bg-border" />
            </div>

            <h1
              className="
                text-center
                text-3xl
                font-semibold
                tracking-[-0.03em]
                sm:text-4xl
              "
            >
              Verify your email
            </h1>
          </div>

          <p
            className="
              resend-description
              mx-auto
              mt-4
              max-w-md
              text-center
              text-sm
              leading-7
              text-muted
            "
          >
            Enter the email address associated with your account and we'll send
            you a fresh verification link.
          </p>

          {/* Form area */}

          <div
            className="
              resend-form
              mt-9
              border-y
              border-border
              py-8
            "
          >
            {/* Success */}

            {resendMutation.isSuccess && (
              <div
                className="
                  mb-6
                  flex
                  items-start
                  gap-3
                  border
                  border-success/20
                  bg-success/5
                  px-4
                  py-4
                  text-sm
                  text-success
                "
              >
                <span
                  className="
                    mt-0.5
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-success/15
                    text-xs
                    font-bold
                  "
                >
                  ✓
                </span>

                <div>
                  <p className="font-semibold">Verification email sent</p>

                  <p className="mt-1 text-xs leading-5 opacity-80">
                    Check your inbox and follow the verification link.
                  </p>
                </div>
              </div>
            )}

            {/* Error */}

            {error && (
              <div
                className="
                  mb-6
                  flex
                  items-start
                  gap-3
                  border
                  border-danger/20
                  bg-danger/5
                  px-4
                  py-4
                  text-sm
                  text-danger
                "
              >
                <span
                  className="
                    mt-0.5
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-danger/15
                    text-xs
                    font-bold
                  "
                >
                  !
                </span>

                <p className="leading-6">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2.5
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-muted
                  "
                >
                  Email address
                </label>

                <div className="group relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    disabled={resendMutation.isPending}
                    className="
                      h-13
                      w-full
                      rounded-none
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
                      focus:ring-primary/5
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      bottom-0
                      left-0
                      h-px
                      w-0
                      bg-primary
                      transition-all
                      duration-300
                      group-focus-within:w-full
                    "
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="
                  w-full
                  rounded-none
                  !py-3.5
                  !shadow-none
                "
                disabled={resendMutation.isPending}
              >
                {resendMutation.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-current
                        border-t-transparent
                      "
                    />
                    Sending...
                  </span>
                ) : (
                  <>
                    Send verification email
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}

          <div className="resend-footer mt-7 text-center">
            <p className="text-sm text-muted">
              Already verified?
              <Link
                to="/login"
                className="
                  ml-1
                  font-semibold
                  text-foreground
                  underline
                  decoration-border
                  underline-offset-4
                  transition
                  hover:text-primary
                  hover:decoration-primary
                "
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Security note */}

          <div className="mt-10 text-center">
            <p
              className="
                text-[11px]
                leading-5
                text-subtle
              "
            >
              For your security, verification links expire after a limited
              period.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResendVerification;
