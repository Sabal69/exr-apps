import { Link } from "react-router-dom";

export default function HeroSection({ data }) {
    if (!data) return null; // ✅ safety guard

    return (
        <section
            className="min-h-screen flex flex-col items-center justify-center text-center text-white"
            style={{
                backgroundImage: `url(${data.heroBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <h1 className="text-5xl tracking-widest mb-4">
                {data.heroTitle || "ESSENCE X REBIRTH"}
            </h1>

            <p className="opacity-80 mb-8 max-w-xl">
                {data.heroSubtitle || "Cyber streetwear born from identity."}
            </p>

            {/* ✅ ALWAYS goes to PUBLIC store */}
            <Link
                to="/products"
                className="border px-10 py-4 tracking-widest hover:bg-white hover:text-black transition"
            >
                {data.heroButtonText || "SHOP NOW"}
            </Link>
        </section>
    );
}