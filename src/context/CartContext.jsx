import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

/* ================= PROVIDER ================= */
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem("cart");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    /* ================= PERSIST CART ================= */
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    /* ================= ❤️ WAITLIST AUTO-REMOVE (AFTER PURCHASE ONLY) ================= */
    const removeFromWaitlistAfterPurchase = productId => {
        try {
            const stored =
                JSON.parse(localStorage.getItem("waitlistedProducts")) || [];

            if (!stored.includes(productId)) return;

            const updated = stored.filter(id => id !== productId);

            localStorage.setItem(
                "waitlistedProducts",
                JSON.stringify(updated)
            );

            // 🔔 sync navbar badge
            window.dispatchEvent(new Event("waitlist-updated"));
        } catch (err) {
            console.error("Waitlist cleanup failed", err);
        }
    };

    /* ================= ADD TO CART ================= */
    const addToCart = product => {
        if (!product.selectedSize) {
            alert("Please select a size");
            return;
        }

        // ❤️ remove from waitlist ONLY when added to cart
        removeFromWaitlistAfterPurchase(product._id);

        setCart(prev => {
            const existing = prev.find(
                item =>
                    item._id === product._id &&
                    item.selectedSize === product.selectedSize
            );

            if (existing) {
                if (existing.quantity >= product.stock) {
                    alert("No more stock available");
                    return prev;
                }

                return prev.map(item =>
                    item._id === product._id &&
                        item.selectedSize === product.selectedSize
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [
                ...prev,
                {
                    _id: product._id,
                    title: product.title,
                    price: product.price,
                    images: Array.isArray(product.images)
                        ? product.images
                        : [], // ✅ SAFE
                    stock: product.stock,
                    selectedSize: product.selectedSize,
                    quantity: 1,
                },
            ];
        });
    };

    /* ================= DECREASE ================= */
    const decreaseQty = (id, size) => {
        setCart(prev =>
            prev
                .map(item =>
                    item._id === id && item.selectedSize === size
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    /* ================= REMOVE ================= */
    const removeFromCart = (id, size) => {
        setCart(prev =>
            prev.filter(
                item =>
                    !(
                        item._id === id &&
                        item.selectedSize === size
                    )
            )
        );
    };

    /* ================= CLEAR ================= */
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    /* ================= TOTALS ================= */
    const cartCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const cartTotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                decreaseQty,
                removeFromCart,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

/* ================= HOOK ================= */
export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used inside CartProvider");
    }
    return ctx;
};