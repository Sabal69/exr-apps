import { useEffect, useState } from "react";
import { adminFetch } from "../../utils/adminFetch";

/* ===============================
   STATUS CONFIG
================================ */
const STATUS_OPTIONS = [
    "pending",
    "paid",
    "shipped",
    "delivered",
    "cancelled",
];

const statusStyles = {
    pending: "bg-yellow-600 text-black",
    paid: "bg-green-600 text-white",
    shipped: "bg-blue-600 text-white",
    delivered: "bg-purple-600 text-white",
    cancelled: "bg-red-600 text-white",
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    /* ===============================
       FETCH ORDERS
    ================================ */
    const fetchOrders = async () => {
        try {
            const res = await adminFetch(
                "http://localhost:4242/api/admin/orders"
            );

            if (!res.ok) throw new Error();

            const data = await res.json();

            const normalized = data.map(order => ({
                ...order,
                orderStatus:
                    order.orderStatus ||
                    order.paymentStatus ||
                    "pending",
            }));

            setOrders(normalized);
        } catch {
            alert("Admin session expired. Please login again.");
        } finally {
            setLoading(false);
        }
    };

    /* ===============================
       UPDATE STATUS
    ================================ */
    const updateStatus = async (orderId, newStatus) => {
        setOrders(prev =>
            prev.map(o =>
                o._id === orderId
                    ? { ...o, orderStatus: newStatus }
                    : o
            )
        );

        try {
            const res = await adminFetch(
                `http://localhost:4242/api/admin/orders/${orderId}/status`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!res.ok) throw new Error();
        } catch {
            alert("Failed to update status");
            fetchOrders();
        }
    };

    /* ===============================
       ISSUE STORE CREDIT
    ================================ */
    const issueStoreCredit = async orderId => {
        if (
            !window.confirm(
                "Issue store credit for this order? This cannot be undone."
            )
        )
            return;

        try {
            const res = await adminFetch(
                `http://localhost:4242/api/admin/orders/${orderId}/refund-wallet`,
                { method: "POST" }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Refund failed");
                return;
            }

            alert("Store credit issued successfully");
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-white opacity-60">
                Loading orders…
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="p-10 text-white opacity-60 tracking-widest">
                NO ORDERS FOUND
            </div>
        );
    }

    /* ===============================
       UI
    ================================ */
    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl mb-8 tracking-widest">
                ORDERS
            </h1>

            <div className="space-y-6">
                {orders.map(order => {
                    const refunded =
                        order.refundStatus === "refunded";

                    const canIssueWalletRefund =
                        order.refundRequested === true &&
                        order.refundStatus === "requested" &&
                        (order.refundReason === "damaged_item" ||
                            order.refundReason === "wrong_item") &&
                        order.refundMethod !== "wallet";

                    return (
                        <div
                            key={order._id}
                            className={`border border-white/20 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${refunded ? "opacity-60" : ""
                                }`}
                        >
                            {/* LEFT */}
                            <div className="space-y-2">
                                <p className="text-xs opacity-50">
                                    ORDER ID
                                </p>
                                <p className="text-xs break-all opacity-80">
                                    {order._id}
                                </p>

                                <p className="mt-2">
                                    <span className="opacity-60">
                                        Total:
                                    </span>{" "}
                                    NPR {order.totalAmount}
                                </p>

                                <p className="text-sm opacity-60">
                                    Payment:{" "}
                                    {order.paymentMethod?.toUpperCase()}
                                </p>

                                {/* STATUS BADGES */}
                                <div className="flex items-center gap-3 mt-2">
                                    <span
                                        className={`px-3 py-1 text-xs tracking-widest rounded ${statusStyles[order.orderStatus]}`}
                                    >
                                        {order.orderStatus.toUpperCase()}
                                    </span>

                                    {refunded && (
                                        <span className="px-2 py-1 text-xs tracking-widest bg-white text-black rounded">
                                            REFUNDED
                                        </span>
                                    )}
                                </div>

                                {/* REFUND REQUEST INFO */}
                                {order.refundRequested && (
                                    <p className="text-xs mt-2 opacity-60">
                                        Refund requested:{" "}
                                        <strong>
                                            {order.refundReason?.replace(
                                                "_",
                                                " "
                                            )}
                                        </strong>
                                    </p>
                                )}
                            </div>

                            {/* RIGHT */}
                            <div className="space-y-3 text-sm text-right">
                                <p className="opacity-50">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleString()}
                                </p>

                                <select
                                    value={order.orderStatus}
                                    disabled={refunded}
                                    onChange={e =>
                                        updateStatus(
                                            order._id,
                                            e.target.value
                                        )
                                    }
                                    className={`bg-black border border-white/30 px-3 py-2 tracking-widest ${refunded
                                            ? "opacity-40 cursor-not-allowed"
                                            : ""
                                        }`}
                                >
                                    {STATUS_OPTIONS.map(status => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status.toUpperCase()}
                                        </option>
                                    ))}
                                </select>

                                {/* ISSUE STORE CREDIT BUTTON */}
                                {canIssueWalletRefund && (
                                    <button
                                        onClick={() =>
                                            issueStoreCredit(order._id)
                                        }
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-xs tracking-widest"
                                    >
                                        ISSUE STORE CREDIT
                                    </button>
                                )}

                                {refunded && (
                                    <p className="text-xs opacity-40">
                                        Refund credited to wallet
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}