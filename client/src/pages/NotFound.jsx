import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main
      className="
        flex
        min-h-[70vh]
        items-center
        justify-center
        px-5
        py-20
      "
    >
      <div className="w-full max-w-lg text-left">
        {/* 404 */}
        <p
          className="
            text-sm
            font-semibold
            uppercase
            tracking-[0.25em]
            text-primary
          "
        >
          Error 404
        </p>

        {/* Heading */}
        <h1
          className="
            mt-4
            text-4xl
            font-bold
            tracking-tight
            text-foreground
            sm:text-5xl
          "
        >
          Page not found
        </h1>

        {/* Description */}
        <p
          className="
            mt-4
            max-w-md
            text-sm
            leading-6
            text-muted
            sm:text-base
          "
        >
          The page you are looking for doesn't exist, has been moved, or the URL
          may be incorrect.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="
              rounded-xl
              bg-primary
              px-5
              py-3
              text-sm
              font-semibold
              text-background
              transition
              hover:bg-primary-hover
            "
          >
            Back to Home
          </Link>

          <Link
            to="/posts"
            className="
              rounded-xl
              border
              border-border
              px-5
              py-3
              text-sm
              font-medium
              text-foreground
              transition
              hover:bg-card-hover
            "
          >
            Explore Blog
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
