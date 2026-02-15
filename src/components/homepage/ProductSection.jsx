import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductSection({ data }) {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================= SAFE DATA ================= */
    const {
        title = "Featured Products",
        limit = 4,
        category = "",
        source = "latest", // latest | featured
    } = data || {};

    /* ================= LOAD PRODUCTS ================= */
    useEffect(() => {
        let mounted = true;

        axios
            .get("http://localhost:4242/api/products")
            .then(res => {
                if (!mounted) return;

                let list = Array.isArray(res.data) ? res.data : [];

                /* CATEGORY FILTER */
                if (category) {
                    list = list.filter(
                        p =>
                            p.category &&
                            p.category.toLowerCase() === category.toLowerCase()
                    );
                }

                /* FEATURED FILTER */
                if (source === "featured") {
                    list = list.filter(p => p.featured === true);
                }

                /* SORT */
                if (source === "latest") {
                    list = [...list].sort(
                        (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                    );
                }

                /* LIMIT */
                list = list.slice(0, Number(limit) || 4);

                setProducts(list);
            })
            .catch(err => {
                console.error("ProductSection load failed:", err);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [limit, category, source]);

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <section className="py-24 text-center text-zinc-500">
                Loading products…
            </section>
        );
    }

    /* ================= EMPTY ================= */
    if (!products.length) {
        return (
            <section className="py-24 text-center text-zinc-500">
                No products match this section settings.
            </section>
        );
    }

    /* ================= RENDER ================= */
    return (
        <section className="bg-black text-white py-24 px-6 md:px-12">
            {title && (
                <h2 className="text-2xl md:text-3xl tracking-[0.35em] text-center mb-16">
                    {title}
                </h2>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {products.map(product => {
                    const image =
                        Array.isArray(product.images) &&
                            product.images.length > 0
                            ? product.images[0]
                            : null;

                    return (
                        <div
                            key={product._id}
                            onClick={() =>
                                navigate(`/products/${product._id}`)
                            }
                            className="
                                cursor-pointer
                                border border-zinc-800
                                p-4
                                hover:border-white
                                transition
                            "
                        >
                            {/* IMAGE */}
                            {image && (
                                <div className="mb-4 overflow-hidden">
                                    <img
                                        src={`http://localhost:4242${image}`}
                                        alt={product.title}
                                        className="w-full h-48 object-cover transition hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* TITLE */}
                            <h3 className="text-sm tracking-wide mb-1">
                                {product.title}
                            </h3>

                            {/* PRICE */}
                            <p className="text-sm opacity-60">
                                ${product.price}
                            </p>

                            {/* SOLD OUT */}
                            {product.stock === 0 && (
                                <p className="text-xs text-red-500 mt-1">
                                    SOLD OUT
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}