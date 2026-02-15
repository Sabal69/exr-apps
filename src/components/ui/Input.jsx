export default function Input({
    label,
    className = "",
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5">

            {/* LABEL */}
            {label && (
                <label className="
                    text-[11px]
                    uppercase
                    tracking-[0.28em]
                    text-zinc-400
                ">
                    {label}
                </label>
            )}

            {/* INPUT */}
            <input
                {...props}
                className={`
                    w-full
                    rounded-md
                    bg-black
                    border border-zinc-800
                    px-4 py-3
                    text-sm
                    tracking-wide
                    text-white
                    placeholder-zinc-500
                    transition

                    focus:outline-none
                    focus:border-white
                    focus:ring-1
                    focus:ring-white

                    /* MOBILE POLISH */
                    sm:px-5
                    sm:py-3.5

                    ${className}
                `}
            />
        </div>
    );
}