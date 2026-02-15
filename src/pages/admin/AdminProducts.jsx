import { useEffect, useState } from "react";
import { formatNPR } from "../../utils/formatCurrency";

const ALL_SIZES = ["S", "M", "L", "XL"];

/* ================= STOCK BADGE ================= */
const stockBadge = stock => {
    if (stock === 0) return "bg-red-600";
    if (stock <= 5) return "bg-yellow-500";
    return "bg-green-600";
};

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState([]);

    const [form, setForm] = useState({
        title: "",
        price: "",
        category: "",
        featured: false,
        sizes: [],
        stock: 0,
    });

    const token = localStorage.getItem("adminToken");

    /* ================= LOAD PRODUCTS (ADMIN) ================= */
    const loadProducts = async () => {
        if (!token) return;

        try {
            const res = await fetch(
                "http://localhost:4242/api/admin/products",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Fetch failed");
            }

            const data = await res.json();
            setProducts(data || []);
        } catch (err) {
            console.error(err);
            alert("Failed to load admin products");
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    /* ================= CREATE PRODUCT ================= */
    const handleSubmit = async e => {
        e.preventDefault();

        if (!token) {
            alert("Admin session expired. Please login again.");
            return;
        }

        if (!images.length) {
            alert("Please select at least one image");
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("price", Number(form.price));
        formData.append("category", form.category.toLowerCase());
        formData.append("featured", form.featured);
        formData.append("stock", Number(form.stock));
        formData.append("sizes", JSON.stringify(form.sizes));

        images.forEach(img => formData.append("images", img));

        try {
            const res = await fetch(
                "http://localhost:4242/api/admin/products",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to create product");
                return;
            }

            // reset form
            setForm({
                title: "",
                price: "",
                category: "",
                featured: false,
                sizes: [],
                stock: 0,
            });
            setImages([]);

            loadProducts();
        } catch (err) {
            console.error(err);
            alert("Create product failed");
        }
    };

    /* ================= DELETE PRODUCT ================= */
    const deleteProduct = async id => {
        if (!confirm("Delete this product?")) return;

        if (!token) return;

        try {
            const res = await fetch(
                `http://localhost:4242/api/admin/products/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error();
            }

            loadProducts();
        } catch {
            alert("Failed to delete product");
        }
    };

    /* ================= SIZE TOGGLE ================= */
    const toggleSize = size => {
        setForm(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size],
        }));
    };

    return (
        <div className="min-h-screen bg-black text-white p-10 max-w-5xl mx-auto">
            <h1 className="text-3xl tracking-widest mb-10">
                ADMIN → PRODUCTS
            </h1>

            {/* ================= ADD PRODUCT ================= */}
            <form
                onSubmit={handleSubmit}
                className="border border-zinc-800 p-6 mb-16 space-y-5"
            >
                <h2 className="text-sm tracking-widest opacity-60">
                    ADD PRODUCT
                </h2>

                <input
                    placeholder="Product Title"
                    value={form.title}
                    onChange={e =>
                        setForm({ ...form, title: e.target.value })
                    }
                    className="w-full bg-black border p-3"
                    required
                />

                <input
                    type="number"
                    placeholder="Price (NPR)"
                    value={form.price}
                    onChange={e =>
                        setForm({ ...form, price: e.target.value })
                    }
                    className="w-full bg-black border p-3"
                    required
                />

                <input
                    placeholder="Category"
                    value={form.category}
                    onChange={e =>
                        setForm({ ...form, category: e.target.value })
                    }
                    className="w-full bg-black border p-3"
                    required
                />

                {/* SIZES */}
                <div>
                    <p className="text-xs mb-2 opacity-60">SIZES</p>
                    <div className="flex gap-3">
                        {ALL_SIZES.map(size => (
                            <button
                                type="button"
                                key={size}
                                onClick={() => toggleSize(size)}
                                className={`border px-4 py-2 ${form.sizes.includes(size)
                                        ? "bg-white text-black"
                                        : "border-zinc-700"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <input
                    type="number"
                    placeholder="Stock quantity"
                    value={form.stock}
                    onChange={e =>
                        setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full bg-black border p-3"
                    min="0"
                />

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={e =>
                            setForm({
                                ...form,
                                featured: e.target.checked,
                            })
                        }
                    />
                    Featured product
                </label>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={e => setImages([...e.target.files])}
                    className="w-full bg-black border p-3"
                />

                <button className="border px-8 py-3 hover:bg-white hover:text-black transition">
                    ADD PRODUCT
                </button>
            </form>

            {/* ================= PRODUCT LIST ================= */}
            <div className="space-y-4">
                {products.map(p => (
                    <div
                        key={p._id}
                        className="border border-zinc-800 p-4 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-bold">{p.title}</p>

                            <span
                                className={`inline-block mt-1 px-3 py-1 text-xs rounded ${stockBadge(
                                    p.stock
                                )}`}
                            >
                                STOCK: {p.stock}
                            </span>

                            <p className="text-sm opacity-60 mt-1">
                                {formatNPR(p.price)}
                                {p.featured && " · FEATURED"}
                            </p>

                            <p className="text-xs opacity-50">
                                Sizes: {p.sizes?.join(", ") || "—"}
                            </p>
                        </div>

                        <button
                            onClick={() => deleteProduct(p._id)}
                            className="text-red-500 text-xs"
                        >
                            DELETE
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}