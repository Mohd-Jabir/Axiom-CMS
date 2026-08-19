const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-4 w-4 border-[2px]",
    md: "h-6 w-6 border-[2px]",
    lg: "h-9 w-9 border-[3px]",
    xl: "h-12 w-12 border-[3px]",
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`
        inline-flex
        items-center
        justify-center
        ${className}
      `}
    >
      <span
        className={`
          ${sizes[size] || sizes.md}
          animate-spin
          rounded-full
          border-border
          border-t-primary
        `}
      />
    </span>
  );
};

export default Spinner;
