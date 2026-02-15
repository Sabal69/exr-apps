import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function AdminSidebar() {
    const [open, setOpen] = useState(false);

    /* 🔒 Lock body scroll when sidebar open (mobile polish) */
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => (document.body.style.overflow = "");
    }, [open]);

    return (
        <>
            {/* MOBILE TOGGLE */}
            <button
                onClick={() => setOpen(true)}
                className="
          md:hidden
          fixed top-4 left-4 z-50
          rounded-md
          border border-zinc-700
          bg-black/80
          p-2
          text-white
          backdrop-blur
        "
                aria-label="Open admin menu"
            >
                <Menu size={20} />
            </button>

            {/* OVERLAY */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
          fixed md:static
          top-0 left-0 z-50
          h-screen w-64
          bg-black
          border-r border-zinc-800
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
            >
                <div className="flex h-full flex-col p-6">

                    {/* CLOSE (MOBILE) */}
                    <div className="mb-6 flex justify-end md:hidden">
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-md p-1 hover:bg-zinc-800 transition"
                            aria-label="Close admin menu"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* TITLE */}
                    <h2 className="mb-8 text-xs tracking-[0.35em] text-zinc-500">
                        ADMIN
                    </h2>

                    {/* NAV */}
                    <nav className="flex flex-col gap-4 text-sm">
                        {["Homepage", "Products", "Orders", "Settings"].map(item => (
                            <span
                                key={item}
                                className="tracking-wide text-zinc-400 hover:text-white transition cursor-pointer"
                            >
                                {item}
                            </span>
                        ))}
                    </nav>

                    {/* FOOTER */}
                    <div className="mt-auto pt-6 text-xs tracking-widest text-zinc-600">
                        © ADMIN PANEL
                    </div>
                </div>
            </aside>
        </>
    );
}