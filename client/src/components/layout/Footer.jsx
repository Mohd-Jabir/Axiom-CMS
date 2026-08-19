import { useRef } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const brandRef = useRef(null);
  const linksRef = useRef(null);
  const dividerRef = useRef(null);
  const bottomBrandRef = useRef(null);

  useGSAP(
    () => {
      // Respect user's reduced-motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from(brandRef.current, {
          y: 25,
          opacity: 0,
          duration: 0.7,
        })
        .from(
          linksRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.45"
        )
        .from(
          dividerRef.current,
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.7,
          },
          "-=0.35"
        )
        .from(
          bottomBrandRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.9,
            ease: "power4.out",
          },
          "-=0.2"
        );
      gsap.to(bottomBrandRef.current, {
        y: -6,
        duration: 3.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    {
      scope: footerRef,
    }
  );

  return (
    <footer
      ref={footerRef}
      className="
        mt-20
        overflow-hidden
        bg-black
      "
    >
      <div
        className="
          relative
          z-10
          rounded-b-[28px]
          bg-[#f7f5f2]
          px-6
          py-12
          sm:px-10
          sm:py-14
          lg:px-14
          lg:py-16
          xl:px-16
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-1
            gap-12
            lg:grid-cols-[1.5fr_1fr]
            lg:gap-16
          "
        >
          <div
            ref={brandRef}
            className="
              flex
              flex-col
              justify-start
            "
          >
            <NavLink
              to="/"
              className="
                inline-flex
                w-fit
                items-center
                transition-opacity
                duration-200
                hover:opacity-70
              "
            >
              <img
                src="/logo.png"
                alt="Axiom"
                className="
                  h-10
                  w-auto
                  object-contain
                "
              />
            </NavLink>

            <p
              className="
                mt-7
                max-w-xl
                text-2xl
                font-medium
                leading-[1.15]
                tracking-[-0.03em]
                text-[#111111]
                sm:text-3xl
                lg:text-4xl
              "
            >
              A modern publishing platform for sharing
              ideas, knowledge, and meaningful stories.
            </p>
          </div>
          <div
            ref={linksRef}
            className="
              grid
              grid-cols-2
              gap-10
              sm:gap-14
            "
          >
           
            <div>
              <h3
                className="
                  text-sm
                  font-medium
                  text-[#777777]
                "
              >
                Explore
              </h3>

              <div className="mt-5 flex flex-col gap-3">
                <NavLink
                  to="/"
                  className="
                    w-fit
                    text-sm
                    text-[#111111]
                    transition-opacity
                    duration-200
                    hover:opacity-50
                  "
                >
                  Home
                </NavLink>

                <NavLink
                  to="/posts"
                  className="
                    w-fit
                    text-sm
                    text-[#111111]
                    transition-opacity
                    duration-200
                    hover:opacity-50
                  "
                >
                  Blog
                </NavLink>

                <NavLink
                  to="/login"
                  className="
                    w-fit
                    text-sm
                    text-[#111111]
                    transition-opacity
                    duration-200
                    hover:opacity-50
                  "
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="
                    w-fit
                    text-sm
                    text-[#111111]
                    transition-opacity
                    duration-200
                    hover:opacity-50
                  "
                >
                  Register
                </NavLink>
              </div>
            </div>
            <div>
              <h3
                className="
                  text-sm
                  font-medium
                  text-[#777777]
                "
              >
                Account
              </h3>

              <div className="mt-5 flex flex-col gap-3">
                <NavLink
                  to="/profile"
                  className="
                    w-fit
                    text-sm
                    text-[#111111]
                    transition-opacity
                    duration-200
                    hover:opacity-50
                  "
                >
                  Profile
                </NavLink>

                <NavLink
                  to="/my-posts"
                  className="
                    w-fit
                    text-sm
                    text-[#111111]
                    transition-opacity
                    duration-200
                    hover:opacity-50
                  "
                >
                  My Posts
                </NavLink>

                <NavLink
                  to="/posts/create"
                  className="
                    w-fit
                    text-sm
                    text-[#111111]
                    transition-opacity
                    duration-200
                    hover:opacity-50
                  "
                >
                  Create Post
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        <div
          ref={dividerRef}
          className="
            mx-auto
            mt-10
            max-w-7xl
            border-t
            border-[#dedbd7]
            pt-5
          "
        >
          <div
            className="
              flex
              flex-col
              gap-2
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p className="text-xs text-[#555555]">
              © {currentYear} Axiom. All rights reserved.
            </p>

            <p className="text-xs text-[#777777]">
              Designed & developed by{" "}
              <a
                href="mailto:mohdjabir.dev@gmail.com"
                className="
                  text-[#111111]
                  transition-opacity
                  duration-200
                  hover:opacity-50
                "
              >
                mohdjabir.dev@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <div
        className="
          relative
          flex
          min-h-[190px]
          items-end
          overflow-hidden
          bg-black
          px-4
          pt-8
          sm:min-h-[230px]
          sm:px-8
          sm:pt-10
          lg:min-h-[280px]
          lg:px-10
          lg:pt-12
        "
      >
        {/* ===================================================
            LARGE AXIOM TEXT
        =================================================== */}

        <div
          ref={bottomBrandRef}
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[-2vw]
            left-1/2
            w-full
            -translate-x-1/2
            select-none
            whitespace-nowrap
            text-center
            text-[25vw]
            font-bold
            leading-[0.72]
            tracking-[-0.09em]
            text-white
            will-change-transform
            sm:text-[23vw]
            lg:text-[21vw]
          "
        >
          AXIOM
        </div>
      </div>
    </footer>
  );
};

export default Footer;