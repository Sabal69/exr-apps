import { useEffect, useState } from "react";

const ALL_SIZES = ["S", "M", "L", "XL"];

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ❤️ WAITLIST STATE */
    const [activeProduct, setActiveProduct] = useState(null);
    const [waitlist, setWaitlist] = useState([]);
    const [loadingWaitlist, setLoadingWaitlist] = useState(false);

    /* 📊 TOTAL WAITLIST COUNT */
    const [totalWaitlists, setTotalWaitlists] = useState(0);

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        sizes: [],
        featured: false,
    });

    const token = localStorage.getItem("adminToken");

    /* ================= LOAD PRODUCTS ================= */
    const loadProducts = async () => {
        try {
            const res = await fetch("http://localhost:4242/api/products");
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];

            setProducts(list);

            // 🔢 TOTAL WAITLIST COUNT
            const total = list.reduce(
                (sum, p) => sum + (p.waitlistCount || 0),
                0
            );
            setTotalWaitlists(total);
        } catch (err) {
            console.error("Failed to load products", err);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    /* ================= LOAD WAITLIST (ADMIN) ================= */
    const loadWaitlist = async product => {
        if (!token) return;

        setActiveProduct(product);
        setLoadingWaitlist(true);
        setWaitlist([]);

        try {
            const res = await fetch(
                `http://localhost:4242/api/products/${product._id}/waitlist`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            setWaitlist(data.waitlist || []);
        } catch (err) {
            console.error("Failed to load waitlist", err);
        } finally {
            setLoadingWaitlist(false);
        }
    };

    /* ================= DELETE PRODUCT ================= */
    const deleteProduct = async productId => {
        if (!token) return alert("Admin not authenticated");

        if (!window.confirm("Delete this product permanently?")) return;

        try {
            const res = await fetch(
                `http://localhost:4242/api/products/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const err = await res.json();
                alert(err.message || "Delete failed");
                return;
            }

            setActiveProduct(null);
            await loadProducts();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    /* ================= HELPERS ================= */
    const toggleSize = size => {
        setForm(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size],
        }));
    };

    /* ================= CREATE PRODUCT ================= */
    const handleSubmit = async e => {
        e.preventDefault();

        if (!token) return alert("Admin not authenticated");
        if (!form.title || !form.category || !form.price || form.stock === "")
            return alert("Missing fields");
        if (!form.sizes.length) return alert("Select at least one size");
        if (!images.length) return alert("At least one image required");

        setLoading(true);

        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) =>
            formData.append(k, typeof v === "boolean" ? String(v) : v)
        );
        formData.append("sizes", JSON.stringify(form.sizes));
        images.forEach(img => formData.append("images", img));

        try {
            const res = await fetch("http://localhost:4242/api/products", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.message || "Create failed");
                return;
            }

            setForm({
                title: "",
                description: "",
                category: "",
                price: "",
                stock: "",
                sizes: [],
                featured: false,
            });
            setImages([]);
            await loadProducts();
        } catch (err) {
            console.error("Create failed", err);
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-black text-white p-10">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl tracking-widest">
                    ADMIN → PRODUCTS
                </h1>

                {totalWaitlists > 0 && (
                    <div className="text-sm bg-red-600 px-4 py-2 rounded-full tracking-widest">
                        ❤️ TOTAL WAITLISTS: {totalWaitlists}
                    </div>
                )}
            </div>

            {/* ADD PRODUCT */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-16">
                <input placeholder="Title" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full p-3 bg-black border" />

                <input placeholder="Description" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full p-3 bg-black border" />

                <input placeholder="Category" value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full p-3 bg-black border" />

                <input type="number" placeholder="Price" value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full p-3 bg-black border" />

                <input type="number" placeholder="Stock" value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full p-3 bg-black border" />

                <div className="flex gap-2">
                    {ALL_SIZES.map(size => (
                        <button key={size} type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-4 py-2 border ${form.sizes.includes(size)
                                    ? "bg-white text-black"
                                    : "hover:bg-white hover:text-black"
                                }`}>
                            {size}
                        </button>
                    ))}
                </div>

                <label className="flex gap-2 items-center">
                    <input type="checkbox"
                        checked={form.featured}
                        onChange={e =>
                            setForm({ ...form, featured: e.target.checked })
                        } />
                    Featured product
                </label>

                <input type="file" multiple onChange={e => setImages([...e.target.files])} />

                <button disabled={loading}
                    className="border px-8 py-3 tracking-widest">
                    {loading ? "ADDING…" : "ADD PRODUCT"}
                </button>
            </form>

            {/* PRODUCT LIST */}
            <div className="space-y-4">
                {products.map(p => (
                    <div key={p._id}
                        className="border p-4 flex justify-between items-center">
                        <div>
                            <p className="tracking-widest">{p.title}</p>
                            <p className="opacity-70">
                                ${p.price} · Stock: {p.stock}
                            </p>

                            {p.waitlistCount > 0 && (
                                <span className="inline-block mt-1 text-xs bg-red-600 px-2 py-[2px] rounded-full">
                                    ❤️ {p.waitlistCount}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => loadWaitlist(p)}
                                className="border px-4 py-2 text-xs hover:bg-white hover:text-black">
                                VIEW WAITLIST
                            </button>

                            <button
                                onClick={() => deleteProduct(p._id)}
                                className="border px-4 py-2 text-xs hover:bg-red-600 hover:border-red-600">
                                DELETE
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* WAITLIST PANEL */}
            {activeProduct && (
                <div className="mt-16 border border-zinc-700 p-6">
                    <h2 className="tracking-widest mb-4">
                        WAITLIST → {activeProduct.title}
                    </h2>

                    {loadingWaitlist ? (
                        <p className="opacity-60">Loading waitlist…</p>
                    ) : waitlist.length ? (
                        <ul className="space-y-2 text-sm">
                            {waitlist.map((w, i) => (
                                <li key={i} className="border-b pb-2">
                                    {w.email}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="opacity-60">No waitlist emails</p>
                    )}
                </div>
            )}
        </div>
    );
}