import { useNavigate } from "react-router-dom";

/* ===============================
   POLICY ORDER (GLOBAL)
================================ */
const POLICY_ORDER = [
    { key: "shipping", title: "Shipping Policy" },
    { key: "refund", title: "Refund Policy" },
    { key: "privacy", title: "Privacy Policy" },
    { key: "terms", title: "Terms & Conditions" },
];

export default function PolicyNavigation({ currentKey }) {
    const navigate = useNavigate();

    const index = POLICY_ORDER.findIndex(p => p.key === currentKey);

    if (index === -1) return null;

    const prev = POLICY_ORDER[index - 1];
    const next = POLICY_ORDER[index + 1];

    return (
        <div className="flex justify-between items-center border-t border-zinc-800 pt-8 mt-20">
            {prev ? (
                <button
                    onClick={() => navigate(`/policy/${prev.key}`)}
                    className="border px-6 py-3 tracking-widest hover:bg-white hover:text-black transition"
                >
                    ← {prev.title}
                </button>
            ) : (
                <div />
            )}

            {next && (
                <button
                    onClick={() => navigate(`/policy/${next.key}`)}
                    className="border px-6 py-3 tracking-widest hover:bg-white hover:text-black transition"
                >
                    {next.title} →
                </button>
            )}
        </div>
    );
}