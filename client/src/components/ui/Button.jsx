const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) => {
  const baseStyles = `
    relative
    inline-flex
    items-center
    justify-center
    gap-2
    overflow-hidden
    rounded-xl
    font-medium
    tracking-[-0.01em]
    outline-none
    select-none
    transition-all
    duration-300
    ease-[cubic-bezier(0.22,1,0.36,1)]
    focus-visible:ring-2
    focus-visible:ring-primary/30
    focus-visible:ring-offset-2
    focus-visible:ring-offset-background
    active:scale-[0.97]
    disabled:pointer-events-none
    disabled:cursor-not-allowed
    disabled:opacity-50
  `;

  const variants = {
    primary: `
      bg-primary
      text-black
      shadow-[0_6px_20px_rgba(245,158,11,0.14)]
      hover:-translate-y-[2px]
      hover:shadow-[0_10px_28px_rgba(245,158,11,0.20)]
      active:translate-y-0
    `,

    secondary: `
      border
      border-border
      bg-card
      text-foreground
      shadow-sm
      hover:-translate-y-[2px]
      hover:border-border-hover
      hover:bg-card-hover
      hover:shadow-md
      active:translate-y-0
    `,

    outline: `
      border
      border-border
      bg-transparent
      text-foreground
      hover:-translate-y-[2px]
      hover:border-primary/40
      hover:bg-primary/5
      hover:text-primary
      active:translate-y-0
    `,

    ghost: `
      bg-transparent
      text-muted
      hover:bg-card
      hover:text-foreground
    `,
  };

  const sizes = {
    sm: `
      h-9
      rounded-lg
      px-3.5
      text-xs
    `,

    md: `
      h-11
      px-5
      text-sm
    `,

    lg: `
      h-12
      px-6
      text-sm
      sm:h-13
      sm:px-7
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {variant === "primary" && (
        <span
          className="
            pointer-events-none
            absolute
            inset-0
            -translate-x-full
            bg-gradient-to-r
            from-transparent
            via-white/20
            to-transparent
            transition-transform
            duration-700
            ease-out
            group-hover:translate-x-full
          "
        />
      )}

      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;