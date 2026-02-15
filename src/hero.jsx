export default function App() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">

            {/* glow background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,245,0.12),transparent_60%)]"></div>

            <div className="relative text-center font-cyber">
                <h1 className="text-6xl md:text-7xl font-extrabold text-neon drop-shadow-[0_0_25px_#00fff5] tracking-widest">
                    ESSENCE <span className="text-cyberred">×</span> REBIRTH
                </h1>

                <p className="mt-6 text-cyberpink text-lg tracking-wide">
                    Cyber streetwear born from identity, culture, rebellion.
                </p>

                <div className="mt-10 flex justify-center gap-6">
                    <button className="px-8 py-3 border border-neon text-neon shadow-neon hover:bg-neon hover:text-black transition">
                        Shop Now
                    </button>

                    <button className="px-8 py-3 border border-cyberpink text-cyberpink shadow-pink hover:bg-cyberpink hover:text-black transition">
                        Login
                    </button>
                </div>

                <div className="mt-10 h-[2px] w-40 mx-auto bg-gradient-to-r from-transparent via-cyberred to-transparent"></div>
            </div>
        </div>
    );
}