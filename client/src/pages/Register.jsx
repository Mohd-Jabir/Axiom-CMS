import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useRegister } from "../features/auth/auth.hooks.js";
import Button from "../components/ui/Button.jsx";

const Register = () => {
  const navigate = useNavigate();

  const registerMutation = useRegister();

  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const logoRef = useRef(null);
  const formRef = useRef(null);
  const sideRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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
        .from(cardRef.current, {
          opacity: 0,
          y: 35,
          scale: 0.98,
          duration: 0.75,
        })
        .from(
          logoRef.current,
          {
            opacity: 0,
            y: -10,
            duration: 0.45,
          },
          "-=0.35",
        )
        .from(
          formRef.current?.querySelectorAll("[data-register-item]"),
          {
            opacity: 0,
            y: 15,
            duration: 0.45,
            stagger: 0.055,
            ease: "power2.out",
          },
          "-=0.2",
        );
      if (sideRef.current) {
        gsap.to(sideRef.current, {
          y: -8,
          duration: 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    },
    {
      scope: pageRef,
    },
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    registerMutation.mutate(formData, {
      onSuccess: () => {
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      },

      onError: (error) => {
        setError(
          error?.response?.data?.message || "Unable to create your account.",
        );
      },
    });
  };

  return (
    <main
      ref={pageRef}
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-background
        px-5
        py-28
        text-foreground
        sm:px-8
        lg:flex
        lg:items-center
        lg:justify-center
        lg:py-32
      "
    >
    
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-primary/[0.035]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-20
          h-72
          w-72
          rounded-full
          bg-primary/[0.025]
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-0
          h-80
          w-80
          rounded-full
          bg-primary/[0.025]
          blur-[110px]
        "
      />
      <div
        ref={cardRef}
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-5xl
          overflow-hidden
          rounded-[28px]
          border
          border-border
          bg-surface/90
          shadow-[0_25px_80px_rgba(0,0,0,0.12)]
          backdrop-blur-2xl
        "
      >
        <div
          className="
            relative
            hidden
            w-[42%]
            overflow-hidden
            bg-[#111111]
            p-10
            lg:flex
            lg:flex-col
            lg:justify-between
            xl:p-12
          "
        >
          {/* Decorative circle */}

          <div
            className="
              pointer-events-none
              absolute
              -right-32
              -top-32
              h-80
              w-80
              rounded-full
              border
              border-white/[0.08]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-40
              -left-32
              h-96
              w-96
              rounded-full
              border
              border-white/[0.06]
            "
          />

          {/* Logo */}

          <Link
            to="/"
            className="
              relative
              z-10
              w-fit
              transition-opacity
              duration-200
              hover:opacity-75
            "
          >
            <img
              src="/logo2.png"
              alt="Axiom"
              className="
                h-10
                w-auto
                object-contain
              "
            />
          </Link>

          {/* Main message */}

          <div
            ref={sideRef}
            className="
              relative
              z-10
              py-16
            "
          >
            <p
              className="
                mb-5
                text-xs
                font-medium
                uppercase
                tracking-[0.2em]
                text-white/40
              "
            >
              Welcome to Axiom
            </p>

            <h2
              className="
                max-w-sm
                text-4xl
                font-medium
                leading-[1.05]
                tracking-[-0.04em]
                text-white
                xl:text-5xl
              "
            >
              Create your space for ideas that matter.
            </h2>

            <p
              className="
                mt-6
                max-w-sm
                text-sm
                leading-6
                text-white/50
              "
            >
              Start writing, managing and publishing meaningful stories with a
              modern editorial platform.
            </p>
          </div>

          {/* Bottom */}

          <div
            className="
              relative
              z-10
              flex
              items-center
              justify-between
              border-t
              border-white/10
              pt-5
            "
          >
            <span className="text-xs text-white/40">
              A modern publishing platform
            </span>

            <span className="text-xs text-white/30">01</span>
          </div>
        </div>
       
        <div
          className="
            w-full
            p-6
            sm:p-9
            lg:w-[58%]
            lg:p-11
            xl:p-12
          "
        >
          <div
            ref={logoRef}
            className="
              mb-8
              lg:hidden
            "
          >
            <Link
              to="/"
              className="
                inline-flex
                transition-opacity
                hover:opacity-70
              "
            >
              <img
                src="/logo2.png"
                alt="Axiom"
                className="
                  h-9
                  w-auto
                  object-contain
                "
              />
            </Link>
          </div>

          <div
            data-register-item
            className="
              max-w-md
            "
          >
            <p
              className="
                mb-3
                text-xs
                font-medium
                uppercase
                tracking-[0.18em]
                text-primary
              "
            >
              Get started
            </p>

            <h1
              className="
                text-3xl
                font-semibold
                tracking-[-0.035em]
                text-foreground
                sm:text-4xl
              "
            >
              Create your account
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-muted
              "
            >
              Join Axiom and start writing, managing and publishing your ideas.
            </p>
          </div>
          {error && (
            <div
              data-register-item
              className="
                mt-6
                rounded-2xl
                border
                border-danger/20
                bg-danger/10
                px-4
                py-3
                text-sm
                leading-5
                text-danger
              "
            >
              {error}
            </div>
          )}

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="
              mt-8
              space-y-5
            "
          >
            <div
              data-register-item
              className="
                grid
                gap-5
                sm:grid-cols-2
              "
            >
              {/* First Name */}

              <div>
                <label
                  htmlFor="firstName"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  First name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="******"
                  autoComplete="given-name"
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-background
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

              {/* Last Name */}

              <div>
                <label
                  htmlFor="lastName"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  Last name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="******"
                  autoComplete="family-name"
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-background
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

            <div data-register-item>
              <label
                htmlFor="username"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-foreground
                "
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="******"
                autoComplete="username"
                required
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-background
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

            <div data-register-item>
              <label
                htmlFor="email"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-foreground
                "
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-background
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

            <div data-register-item>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="
                    block
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  Password
                </label>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-background
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

              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-subtle
                "
              >
                Use at least 8 characters with uppercase, lowercase, number and
                special character.
              </p>
            </div>

            <div data-register-item className="pt-1">
              <Button
                type="submit"
                size="lg"
                className="
                  w-full
                  rounded-xl
                "
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending
                  ? "Creating account..."
                  : "Create account →"}
              </Button>
            </div>
          </form>

          <div
            data-register-item
            className="
              mt-7
              border-t
              border-border
              pt-6
              text-center
            "
          >
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <Link
                to="/login"
                className="
                  font-medium
                  text-primary
                  transition-colors
                  hover:text-primary-hover
                "
              >
                Sign in
              </Link>
            </p>
          </div>

          <p
            data-register-item
            className="
              mt-5
              text-center
              text-[11px]
              text-subtle
            "
          >
            Designed & developed by{" "}
            <a
              href="mailto:mohdjabir.dev@gmail.com"
              className="
                text-muted
                transition-colors
                hover:text-foreground
              "
            >
              mohdjabir.dev@gmail.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
