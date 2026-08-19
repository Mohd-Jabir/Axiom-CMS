import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Button from "../components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();
  const homeRef = useRef(null);

  useGSAP(
    () => {
    
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;
      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      heroTimeline
        .from(".hero-badge", {
          opacity: 0,
          y: 20,
          duration: 0.7,
        })

        .from(
          ".hero-title-line",
          {
            opacity: 0,
            y: 60,
            duration: 0.8,
            stagger: 0.12,
          },
          "-=0.35",
        )

        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 20,
            duration: 0.65,
          },
          "-=0.4",
        )

        .from(
          ".hero-actions",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.35",
        )

        .from(
          ".hero-meta",
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
          },
          "-=0.3",
        )

        .from(
          ".floating-card-left",
          {
            opacity: 0,
            x: -70,
            rotate: -4,
            duration: 0.9,
          },
          "-=0.8",
        )

        .from(
          ".floating-card-right",
          {
            opacity: 0,
            x: 70,
            rotate: 4,
            duration: 0.9,
          },
          "<",
        )

        .from(
          ".creator-label",
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.45,
            ease: "back.out(1.7)",
          },
          "-=0.4",
        )

        .from(
          ".author-label",
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.45,
            ease: "back.out(1.7)",
          },
          "<",
        );

      /*
       * Very subtle continuous movement.
       * Only the desktop floating cards move.
       */

      gsap.to(".floating-card-left", {
        y: -10,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      gsap.to(".floating-card-right", {
        y: 10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      });
      
      gsap.from(".workflow-heading", {
        scrollTrigger: {
          trigger: ".workflow-section",
          start: "top 75%",
          once: true,
        },

        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".workflow-item", {
        scrollTrigger: {
          trigger: ".workflow-items",
          start: "top 80%",
          once: true,
        },

        opacity: 0,
        y: 30,
        duration: 0.65,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from(".philosophy-heading", {
        scrollTrigger: {
          trigger: ".philosophy-section",
          start: "top 75%",
          once: true,
        },

        opacity: 0,
        x: -40,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".philosophy-item", {
        scrollTrigger: {
          trigger: ".philosophy-items",
          start: "top 80%",
          once: true,
        },

        opacity: 0,
        x: 35,
        duration: 0.65,
        stagger: 0.15,
        ease: "power3.out",
      });
    },
    {
      scope: homeRef,
    },
  );

  return (
    <main
      ref={homeRef}
      className="
        min-h-screen
        overflow-hidden
        bg-background
        text-foreground
      "
    >
      <section
        className="
           relative
    flex
    min-h-[calc(100svh-300px)]
    items-center
    justify-center
    overflow-hidden
    px-6
    py-16
    lg:py-20
        "
      >
        {/* Background glow */}

        <div
          className="
            pointer-events-none
            absolute
            -left-64
            top-20
            h-[500px]
            w-[500px]
            rounded-full
            bg-primary/5
            blur-[120px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-64
            top-20
            h-[500px]
            w-[500px]
            rounded-full
            bg-primary/5
            blur-[120px]
          "
        />
        <article
          className="
            floating-card-left
            absolute
            left-[-180px]
            top-[20%]
            hidden
            w-[390px]
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-card
            shadow-2xl
            xl:block
          "
        >
          <div
            className="
              h-[190px]
              bg-gradient-to-br
              from-blue-600
              via-blue-500
              to-blue-900
            "
          />

          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                Development
              </span>

              <span className="text-sm text-subtle">Aug 10</span>
            </div>

            <h3 className="mt-4 text-xl font-semibold tracking-tight">
              Building Better Digital Experiences
            </h3>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
              Explore modern approaches to building fast, accessible and
              meaningful digital experiences for the web.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-primary-soft
                    text-sm
                    font-semibold
                    text-primary
                  "
                >
                  M
                </div>

                <span className="text-sm text-muted">Mohd Jabir</span>
              </div>

              <span className="text-sm text-subtle">View ↗</span>
            </div>
          </div>
        </article>
        <article
          className="
            floating-card-right
            absolute
            right-[-180px]
            top-[12%]
            hidden
            w-[390px]
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-card
            shadow-2xl
            xl:block
          "
        >
          <div
            className="
              h-[190px]
              bg-gradient-to-br
              from-primary
              via-orange-600
              to-red-900
            "
          />

          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                Technology
              </span>

              <span className="text-sm text-subtle">Aug 08</span>
            </div>

            <h3 className="mt-4 text-xl font-semibold tracking-tight">
              The Future of Modern Web Development
            </h3>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
              Discover the technologies, patterns and ideas shaping the next
              generation of web applications.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-primary-soft
                    text-sm
                    font-semibold
                    text-primary
                  "
                >
                  A
                </div>

                <span className="text-sm text-muted">Alex Morgan</span>
              </div>

              <span className="text-sm text-subtle">View ↗</span>
            </div>
          </div>
        </article>
        <div
          className="
            creator-label
            absolute
            left-[18%]
            top-[58%]
            hidden
            items-center
            gap-2
            xl:flex
          "
        >
          <span className="text-xl text-muted">↖</span>

          <span
            className="
              rounded-md
              bg-primary
              px-3
              py-1
              text-xs
              font-semibold
              text-black
            "
          >
            Creator
          </span>
        </div>
        <div
          className="
            author-label
            absolute
            right-[18%]
            top-[42%]
            hidden
            items-center
            gap-2
            xl:flex
          "
        >
          <span
            className="
              rounded-md
              bg-primary
              px-3
              py-1
              text-xs
              font-semibold
              text-black
            "
          >
            Author
          </span>

          <span className="text-xl text-muted">↗</span>
        </div>

        {/* ===================================================
            HERO CONTENT
        =================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            max-w-5xl
            flex-col
            items-center
            text-center
          "
        >
          {/* Badge */}

          <div
            className="
              hero-badge
              inline-flex
              items-center
              gap-4
              rounded-full
              border
              border-border
              bg-surface
              px-5
              py-2.5
              text-sm
              text-muted
              shadow-lg
            "
          >
            <span>Modern Publishing Platform</span>

            <span className="h-4 w-px bg-border" />

            <span
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-card
                text-foreground
              "
            >
              →
            </span>
          </div>

          {/* Heading */}

          <h1
            className="
              mt-10
              max-w-4xl
              text-5xl
              font-bold
              leading-[0.92]
              tracking-[-0.055em]
              sm:text-6xl
              md:text-7xl
              lg:text-[7rem]
            "
          >
            <span className="hero-title-line block">Write.</span>

            <span className="hero-title-line block">Publish.</span>

            <span className="hero-title-line block text-primary">
              Build Your Voice.
            </span>
          </h1>

          {/* Description */}

          <p
            className="
              hero-description
              mx-auto
              mt-8
              max-w-xl
              text-base
              leading-7
              text-muted
              sm:text-lg
            "
          >
            Axiom CMS gives creators and teams a powerful place to write, manage
            and publish meaningful content.
          </p>

          {/* Buttons */}

          <div
            className="
              hero-actions
              mt-9
              flex
              flex-col
              items-center
              justify-center
              gap-3
              sm:flex-row
            "
          >
            <Button size="lg" onClick={() => navigate("/register")}>
              Start Writing →
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/posts")}
            >
              Explore Posts
            </Button>
          </div>

          {/* Meta */}

          <div
            className="
              hero-meta
              mt-8
              flex
              flex-wrap
              justify-center
              gap-x-5
              gap-y-2
              text-xs
              text-subtle
            "
          >
            <span>Built for creators</span>

            <span>•</span>

            <span>Secure authentication</span>

            <span>•</span>

            <span>Powerful publishing</span>
          </div>
        </div>
      </section>
      <section
        className="
          workflow-section
          border-t
          border-border
          px-6
          py-28
        "
      >
        <div className="mx-auto max-w-6xl">
          {/* Heading */}

          <div className="workflow-heading text-center">
            <p
              className="
                text-sm
                uppercase
                tracking-[0.25em]
                text-primary
              "
            >
              Built around your content
            </p>

            <h2
              className="
                mx-auto
                mt-6
                max-w-4xl
                text-4xl
                font-semibold
                leading-tight
                tracking-[-0.04em]
                sm:text-5xl
                md:text-6xl
              "
            >
              Everything you need to{" "}
              <span className="text-muted">
                turn ideas into published work.
              </span>
            </h2>

            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-base
                leading-7
                text-muted
              "
            >
              Axiom keeps the publishing process focused, organized and easy to
              manage from the first draft to the final article.
            </p>
          </div>

          {/* Features */}

          <div
            className="
              workflow-items
              mt-20
              grid
              divide-y
              divide-border
              border-y
              border-border
              md:grid-cols-3
              md:divide-x
              md:divide-y-0
            "
          >
            {/* 01 */}

            <article
              className="
                workflow-item
                px-8
                py-10
                text-center
                md:text-left
              "
            >
              <span className="text-sm text-primary">01</span>

              <h3 className="mt-4 text-xl font-semibold">Create</h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                Write and structure meaningful content with a focused publishing
                workflow.
              </p>

              <div className="mt-8 h-px w-10 bg-primary" />
            </article>

            {/* 02 */}

            <article
              className="
                workflow-item
                px-8
                py-10
                text-center
                md:text-left
              "
            >
              <span className="text-sm text-primary">02</span>

              <h3 className="mt-4 text-xl font-semibold">Manage</h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                Organize posts, categories, tags and authors from one clean
                workspace.
              </p>

              <div className="mt-8 h-px w-10 bg-primary" />
            </article>

            {/* 03 */}

            <article
              className="
                workflow-item
                px-8
                py-10
                text-center
                md:text-left
              "
            >
              <span className="text-sm text-primary">03</span>

              <h3 className="mt-4 text-xl font-semibold">Publish</h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                Take your content from draft to published and share it with your
                audience.
              </p>

              <div className="mt-8 h-px w-10 bg-primary" />
            </article>
          </div>
        </div>
      </section>
     
      <section
        className="
          philosophy-section
          border-y
          border-border
          px-6
          py-28
        "
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-2">
            {/* LEFT */}

            <div className="philosophy-heading">
              <p
                className="
                  text-sm
                  uppercase
                  tracking-[0.2em]
                  text-primary
                "
              >
                Our philosophy
              </p>

              <h2
                className="
                  mt-6
                  text-4xl
                  font-semibold
                  tracking-tight
                  sm:text-5xl
                "
              >
                Good tools
                <br />
                disappear.
              </h2>
            </div>

            {/* RIGHT */}

            <div className="philosophy-items space-y-8">
              {/* 01 */}

              <div
                className="
                  philosophy-item
                  border-b
                  border-border
                  pb-8
                "
              >
                <span className="text-sm text-primary">01</span>

                <h3 className="mt-3 text-xl font-semibold">
                  Focus on the work
                </h3>

                <p className="mt-3 leading-7 text-muted">
                  Your CMS should never become the center of your creative
                  process. Your ideas should.
                </p>
              </div>

              {/* 02 */}

              <div
                className="
                  philosophy-item
                  border-b
                  border-border
                  pb-8
                "
              >
                <span className="text-sm text-primary">02</span>

                <h3 className="mt-3 text-xl font-semibold">
                  Keep things simple
                </h3>

                <p className="mt-3 leading-7 text-muted">
                  Powerful doesn't have to mean complicated. Axiom keeps
                  publishing workflows clean and understandable.
                </p>
              </div>

              {/* 03 */}

              <div className="philosophy-item">
                <span className="text-sm text-primary">03</span>

                <h3 className="mt-3 text-xl font-semibold">
                  Give creators ownership
                </h3>

                <p className="mt-3 leading-7 text-muted">
                  Your content belongs to you. Axiom exists to help you create,
                  organize and share it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
