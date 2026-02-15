import { useEffect, useState } from "react";
import { userFetch } from "../utils/userFetch";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState(null);

    /* ================= LOAD ORDERS ================= */
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await userFetch("/api/orders/my-orders");

                if (!res) return; // auto logout triggered

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch orders");
                }

                setOrders(data.orders);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    /* ================= REQUEST REFUND ================= */
    const requestRefund = async (orderId) => {
        try {
            setProcessingId(orderId);

            const res = await userFetch(
                `/api/orders/${orderId}/refund-request`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reason: "size_issue",
                    }),
                }
            );

            if (!res) return;

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Refund failed");
            }

            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId
                        ? {
                            ...order,
                            refundRequested: true,
                            refundStatus: "requested",
                        }
                        : order
                )
            );
        } catch (err) {
            alert(err.message);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white px-8 py-16">
            <h1 className="text-4xl font-bold mb-10">My Orders</h1>

            {loading && (
                <p className="text-white/60">Loading orders...</p>
            )}

            {error && <p className="text-red-500">{error}</p>}

            {!loading && orders.length === 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                    <p className="text-white/60">
                        You haven’t placed any orders yet.
                    </p>
                </div>
            )}

            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between mb-4">
                            <div>
                                <p className="text-sm text-white/50">
                                    Order ID: {order._id}
                                </p>
                                <p className="text-sm text-white/50">
                                    Date: {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-lg font-semibold">
                                    Rs {order.totalAmount}
                                </p>
                                <p className="text-sm text-white/60 capitalize">
                                    {order.orderStatus}
                                </p>
                            </div>
                        </div>

                        {/* ITEMS */}
                        <div className="space-y-2">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between text-sm border-t border-zinc-800 pt-2"
                                >
                                    <span>
                                        {item.title} × {item.quantity}
                                    </span>
                                    <span>
                                        Rs {item.price * item.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* REFUND SECTION */}
                        <div className="mt-6 flex justify-end">
                            {order.refundRequested ? (
                                <span className="text-sm text-yellow-500">
                                    Refund {order.refundStatus}
                                </span>
                            ) : order.orderStatus === "delivered" ? (
                                <button
                                    onClick={() => requestRefund(order._id)}
                                    disabled={processingId === order._id}
                                    className="border border-red-500 text-red-500 px-4 py-2 text-sm tracking-widest hover:bg-red-500 hover:text-black transition disabled:opacity-50"
                                >
                                    {processingId === order._id
                                        ? "Processing..."
                                        : "REQUEST REFUND"}
                                </button>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}