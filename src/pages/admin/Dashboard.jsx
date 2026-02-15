import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminFetch } from "../../utils/adminFetch";
import { formatNPR } from "../../utils/formatCurrency";

/* ===============================
   STATUS COLORS
================================ */
const statusColor = status => {
    switch (status) {
        case "paid":
            return "text-green-400";
        case "shipped":
            return "text-blue-400";
        case "delivered":
            return "text-purple-400";
        case "cancelled":
            return "text-red-400";
        default:
            return "text-yellow-400";
    }
};

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [users, setUsers] = useState([]);

    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);

    /* ===============================
       FETCH STATS
    ================================ */
    const fetchStats = async () => {
        try {
            const res = await adminFetch(
                "http://localhost:4242/api/admin/dashboard/stats"
            );

            if (!res.ok) throw new Error("Stats failed");

            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Stats error:", err);
            setStats(null);
        } finally {
            setLoadingStats(false);
        }
    };

    /* ===============================
       FETCH RECENT ORDERS
    ================================ */
    const fetchRecentOrders = async () => {
        try {
            const res = await adminFetch(
                "http://localhost:4242/api/admin/dashboard/recent"
            );

            if (!res.ok) throw new Error("Recent orders failed");

            const data = await res.json();
            setRecentOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Recent orders error:", err);
            setRecentOrders([]);
        } finally {
            setLoadingOrders(false);
        }
    };

    /* ===============================
       FETCH USERS (FIXED)
    ================================ */
    const fetchUsers = async () => {
        try {
            const res = await adminFetch(
                "http://localhost:4242/api/admin/users"
            );

            if (!res.ok) throw new Error("Users fetch failed");

            const data = await res.json();

            // ✅ Safe handling
            if (Array.isArray(data)) {
                setUsers(data);
            } else if (Array.isArray(data.users)) {
                setUsers(data.users);
            } else {
                setUsers([]);
            }
        } catch (err) {
            console.error("Users fetch error:", err);
            setUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    };

    /* ===============================
       TOGGLE USER ACTIVE
    ================================ */
    const toggleUser = async id => {
        try {
            await adminFetch(
                `http://localhost:4242/api/admin/users/${id}/toggle`,
                { method: "PATCH" }
            );
            fetchUsers();
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchRecentOrders();
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-10">

            {/* HEADER */}
            <div className="mb-12">
                <p className="tracking-widest text-sm opacity-60">
                    ADMIN PANEL
                </p>
                <h1 className="text-4xl mt-2">
                    Dashboard
                </h1>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                <StatCard title="TOTAL ORDERS" value={loadingStats ? "…" : stats?.totalOrders ?? 0} />
                <StatCard title="TOTAL REVENUE" value={loadingStats ? "…" : formatNPR(stats?.totalRevenue ?? 0)} />
                <StatCard title="PENDING ORDERS" value={loadingStats ? "…" : stats?.pendingOrders ?? 0} />
                <StatCard title="LOW STOCK" value={loadingStats ? "…" : stats?.lowStock ?? 0} />
            </div>

            {/* RECENT ORDERS */}
            <div className="border border-white/10 p-8 mb-16">
                <h2 className="tracking-widest mb-6">
                    RECENT ORDERS
                </h2>

                {loadingOrders && (
                    <p className="text-white/60">Loading…</p>
                )}

                {!loadingOrders && recentOrders.length === 0 && (
                    <p className="text-white/60">No recent orders</p>
                )}

                <div className="space-y-4">
                    {recentOrders.map(order => (
                        <div
                            key={order._id}
                            className="border border-white/10 p-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="text-xs opacity-60 break-all">
                                    {order._id}
                                </p>
                                <p>{formatNPR(order.totalAmount)}</p>
                            </div>

                            <div className="text-right">
                                <p className={statusColor(order.orderStatus)}>
                                    {order.orderStatus?.toUpperCase()}
                                </p>
                                <p className="opacity-50 text-sm">
                                    {order.paymentMethod?.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* USERS SECTION */}
            <div className="border border-white/10 p-8">
                <h2 className="tracking-widest mb-6">
                    REGISTERED USERS
                </h2>

                {loadingUsers && (
                    <p className="text-white/60">
                        Loading users…
                    </p>
                )}

                {!loadingUsers && users.length === 0 && (
                    <p className="text-white/60">
                        No users found
                    </p>
                )}

                <div className="space-y-4">
                    {users.map(user => (
                        <div
                            key={user._id}
                            className="border border-white/10 p-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium">
                                    {user.name}
                                </p>
                                <p className="text-sm opacity-60">
                                    {user.email}
                                </p>
                                <p className="text-xs opacity-50">
                                    Wallet: {formatNPR(user.walletBalance ?? 0)}
                                </p>
                            </div>

                            <button
                                onClick={() => toggleUser(user._id)}
                                className={`px-4 py-2 text-sm border transition ${user.isActive
                                        ? "border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
                                        : "border-red-500 text-red-400 hover:bg-red-500 hover:text-black"
                                    }`}
                            >
                                {user.isActive ? "ACTIVE" : "BLOCKED"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ===============================
   STAT CARD
================================ */
function StatCard({ title, value }) {
    return (
        <div className="border border-white/10 p-6">
            <p className="text-sm tracking-widest opacity-60 mb-2">
                {title}
            </p>
            <p className="text-3xl font-medium">
                {value}
            </p>
        </div>
    );
}