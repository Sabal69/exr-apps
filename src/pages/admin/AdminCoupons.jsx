import { useEffect, useState } from "react";
import { adminFetch } from "../../utils/adminFetch";

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        code: "",
        type: "fixed",
        value: "",
        maxUses: "",
        expiresAt: "",
        note: "",
    });

    /* ================= FETCH COUPONS ================= */
    const fetchCoupons = async () => {
        try {
            const res = await adminFetch(
                "http://localhost:4242/api/admin/coupons"
            );
            const data = await res.json();
            setCoupons(data || []);
        } catch (err) {
            console.error("Failed to fetch coupons");
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    /* ================= CREATE COUPON ================= */
    const createCoupon = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                code: form.code,
                type: form.type,
                value: Number(form.value),
                maxUses: form.maxUses
                    ? Number(form.maxUses)
                    : null,
                expiresAt: form.expiresAt || null,
                note: form.note,
            };

            const res = await adminFetch(
                "http://localhost:4242/api/admin/coupons",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Failed to create coupon");
                setLoading(false);
                return;
            }

            setForm({
                code: "",
                type: "fixed",
                value: "",
                maxUses: "",
                expiresAt: "",
                note: "",
            });

            fetchCoupons();
        } catch {
            alert("Coupon creation failed");
        } finally {
            setLoading(false);
        }
    };

    /* ================= TOGGLE ACTIVE ================= */
    const toggleCoupon = async id => {
        try {
            await adminFetch(
                `http://localhost:4242/api/admin/coupons/${id}/toggle`,
                { method: "PATCH" }
            );
            fetchCoupons();
        } catch {
            alert("Failed to toggle coupon");
        }
    };

    /* ================= DELETE COUPON ================= */
    const deleteCoupon = async id => {
        if (!confirm("Delete this coupon?")) return;

        try {
            await adminFetch(
                `http://localhost:4242/api/admin/coupons/${id}`,
                { method: "DELETE" }
            );
            fetchCoupons();
        } catch {
            alert("Failed to delete coupon");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-10 max-w-5xl mx-auto">
            <h1 className="text-3xl tracking-widest mb-10">
                ADMIN → COUPONS
            </h1>

            {/* CREATE COUPON */}
            <form
                onSubmit={createCoupon}
                className="border border-white/20 p-6 mb-12 space-y-4"
            >
                <h2 className="text-sm tracking-widest opacity-60">
                    CREATE COUPON
                </h2>

                <input
                    placeholder="CODE (EXR10)"
                    value={form.code}
                    onChange={e =>
                        setForm({ ...form, code: e.target.value })
                    }
                    className="w-full bg-black border p-3"
                    required
                />

                <select
                    value={form.type}
                    onChange={e =>
                        setForm({ ...form, type: e.target.value })
                    }
                    className="w-full bg-black border p-3"
                >
                    <option value="fixed">Fixed (NPR)</option>
                    <option value="percent">Percent (%)</option>
                </select>

                <input
                    type="number"
                    placeholder="Value"
                    value={form.value}
                    onChange={e =>
                        setForm({ ...form, value: e.target.value })
                    }
                    className="w-full bg-black border p-3"
                    required
                />

                <input
                    type="number"
                    placeholder="Max Uses (optional)"
                    value={form.maxUses}
                    onChange={e =>
                        setForm({
                            ...form,
                            maxUses: e.target.value,
                        })
                    }
                    className="w-full bg-black border p-3"
                />

                <input
                    type="date"
                    value={form.expiresAt}
                    onChange={e =>
                        setForm({
                            ...form,
                            expiresAt: e.target.value,
                        })
                    }
                    className="w-full bg-black border p-3"
                />

                <input
                    placeholder="Note (optional)"
                    value={form.note}
                    onChange={e =>
                        setForm({ ...form, note: e.target.value })
                    }
                    className="w-full bg-black border p-3"
                />

                <button
                    disabled={loading}
                    className="border px-8 py-3 hover:bg-white hover:text-black transition"
                >
                    {loading ? "CREATING..." : "CREATE COUPON"}
                </button>
            </form>

            {/* COUPON LIST */}
            <div className="space-y-4">
                {coupons.map(c => (
                    <div
                        key={c._id}
                        className="border border-white/20 p-4 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-bold tracking-widest">
                                {c.code}
                            </p>
                            <p className="text-sm opacity-60">
                                {c.type === "percent"
                                    ? `${c.value}% OFF`
                                    : `NPR ${c.value} OFF`}
                            </p>
                            <p className="text-xs opacity-50">
                                Used {c.usedCount}
                                {c.maxUses
                                    ? ` / ${c.maxUses}`
                                    : ""}
                            </p>
                        </div>

                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => toggleCoupon(c._id)}
                                className={`px-4 py-2 text-xs tracking-widest ${c.active
                                        ? "bg-green-600"
                                        : "bg-gray-600"
                                    }`}
                            >
                                {c.active ? "ACTIVE" : "INACTIVE"}
                            </button>

                            <button
                                onClick={() => deleteCoupon(c._id)}
                                className="text-red-500 text-xs"
                            >
                                DELETE
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}