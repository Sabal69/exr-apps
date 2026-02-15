import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminFetch } from "../../utils/adminFetch";

export default function AdminWallet() {
    const navigate = useNavigate();

    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [type, setType] = useState("credit");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    /* ===============================
       LOAD WALLET
    ================================ */
    const fetchWallet = async () => {
        try {
            const res = await adminFetch(
                "http://localhost:4242/api/admin/wallet"
            );

            if (!res.ok) throw new Error();

            const data = await res.json();
            setWallet(data);
        } catch {
            alert("Failed to load wallet");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    /* ===============================
       ADJUST WALLET
    ================================ */
    const adjustWallet = async () => {
        if (!amount || Number(amount) <= 0) {
            alert("Enter a valid amount");
            return;
        }

        setSaving(true);

        try {
            const res = await adminFetch(
                "http://localhost:4242/api/admin/wallet/adjust",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type,
                        amount: Number(amount),
                        note,
                    }),
                }
            );

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Wallet update failed");
                return;
            }

            setAmount("");
            setNote("");
            fetchWallet();
        } catch {
            alert("Wallet update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !wallet) {
        return (
            <div className="p-10 text-white opacity-60">
                Loading wallet…
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-10 max-w-5xl mx-auto">
            {/* HEADER */}
            <div className="mb-12">
                <p className="tracking-widest text-sm opacity-60">
                    ADMIN PANEL
                </p>
                <h1 className="text-4xl mt-2">Wallet</h1>
            </div>

            {/* BALANCE */}
            <div className="border border-white/10 p-8 mb-16">
                <p className="text-xs tracking-widest opacity-60 mb-2">
                    CURRENT BALANCE
                </p>
                <p className="text-5xl font-semibold">
                    {wallet.currency} {wallet.balance}
                </p>
            </div>

            {/* ADJUST WALLET */}
            <div className="border border-white/10 p-6 mb-16 space-y-6">
                <p className="tracking-widest text-sm opacity-60">
                    MANUAL ADJUSTMENT
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={() => setType("credit")}
                        disabled={saving}
                        className={`px-6 py-2 border tracking-widest transition ${type === "credit"
                                ? "bg-green-600 border-green-600"
                                : "border-white/30 hover:border-green-600"
                            }`}
                    >
                        CREDIT
                    </button>

                    <button
                        onClick={() => setType("debit")}
                        disabled={saving}
                        className={`px-6 py-2 border tracking-widest transition ${type === "debit"
                                ? "bg-red-600 border-red-600"
                                : "border-white/30 hover:border-red-600"
                            }`}
                    >
                        DEBIT
                    </button>
                </div>

                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="bg-black border border-white/30 px-4 py-3 w-full"
                />

                <input
                    placeholder="Note (optional)"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="bg-black border border-white/30 px-4 py-3 w-full"
                />

                <button
                    onClick={adjustWallet}
                    disabled={saving}
                    className="border px-8 py-3 tracking-widest hover:bg-white hover:text-black transition"
                >
                    {saving ? "APPLYING…" : "APPLY"}
                </button>
            </div>

            {/* TRANSACTIONS */}
            <div>
                <p className="tracking-widest text-sm opacity-60 mb-6">
                    TRANSACTION HISTORY
                </p>

                <div className="space-y-4">
                    {wallet.transactions.length === 0 && (
                        <p className="opacity-50 text-sm">
                            No transactions yet
                        </p>
                    )}

                    {wallet.transactions.map(tx => {
                        const isPositive =
                            tx.type === "credit" ||
                            tx.type === "refund" ||
                            tx.type === "coupon";

                        return (
                            <div
                                key={tx._id}
                                className="border border-white/10 p-4 flex justify-between items-center"
                            >
                                <div>
                                    <p
                                        className={`text-sm font-medium ${isPositive
                                                ? "text-green-500"
                                                : "text-red-500"
                                            }`}
                                    >
                                        {isPositive ? "↑" : "↓"}{" "}
                                        {tx.type.toUpperCase()} —{" "}
                                        {wallet.currency} {tx.amount}
                                    </p>

                                    {/* 🔗 ORDER LINK FOR REFUNDS */}
                                    {tx.relatedOrderId ? (
                                        <button
                                            onClick={() =>
                                                navigate("/admin/orders")
                                            }
                                            className="text-xs text-blue-400 hover:underline mt-1"
                                        >
                                            Order #{tx.relatedOrderId
                                                .toString()
                                                .slice(-6)}
                                        </button>
                                    ) : (
                                        <p className="text-xs opacity-50">
                                            {tx.note || "—"}
                                        </p>
                                    )}
                                </div>

                                <p className="text-xs opacity-40">
                                    {new Date(
                                        tx.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}