import { useEffect, useState } from "react";
import { userFetch } from "../utils/userFetch";

export default function Wallet() {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const res = await userFetch("/api/auth/profile");

                if (!res) return;

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to load wallet");
                }

                setWallet(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWallet();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white px-8 py-16">
            <h1 className="text-4xl font-bold mb-10">
                Refund Credit (Wallet)
            </h1>

            {loading && <p className="opacity-60">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && wallet && (
                <>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">
                        <p className="text-white/60 mb-2">
                            Available Balance
                        </p>
                        <p className="text-3xl font-bold text-green-500">
                            Rs {wallet.walletBalance || 0}
                        </p>
                    </div>

                    {/* TRANSACTION HISTORY */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                        <h2 className="text-xl mb-6">Transaction History</h2>

                        {wallet.walletTransactions?.length === 0 && (
                            <p className="text-white/60">
                                No transactions yet.
                            </p>
                        )}

                        <div className="space-y-4">
                            {wallet.walletTransactions?.map((tx, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between border-b border-zinc-800 pb-3 text-sm"
                                >
                                    <div>
                                        <p className="capitalize">
                                            {tx.type.replace("_", " ")}
                                        </p>
                                        <p className="text-white/40 text-xs">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <p
                                        className={
                                            tx.type === "purchase"
                                                ? "text-red-500"
                                                : "text-green-500"
                                        }
                                    >
                                        {tx.type === "purchase" ? "-" : "+"}
                                        Rs {tx.amount}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}