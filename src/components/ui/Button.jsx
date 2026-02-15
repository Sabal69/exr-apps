export default function Button({
    children,
    type = "button",
    variant = "primary",
    className = "",
    ...props
}) {
    const base = `
    inline-flex items-center justify-center
    px-10 py-3
    sm:px-12 sm:py-3.5
    text-xs
    uppercase
    tracking-[0.32em]
    sm:tracking-[0.35em]
    rounded-md
    transition
    focus:outline-none
    focus:ring-1 focus:ring-white
    disabled:opacity-50
    disabled:cursor-not-allowed
  `;

    const variants = {
        primary: `
      bg-white text-black
      hover:bg-gray-200
    `,
        outline: `
      border border-white text-white
      hover:bg-white hover:text-black
    `,
        ghost: `
      text-white/70
      hover:text-white
      hover:bg-white/5
    `,
    };

    return (
        <button
            type={type}
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}