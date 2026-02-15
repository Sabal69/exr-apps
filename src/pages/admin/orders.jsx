import { useEffect, useState } from "react";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4242/api/admin/orders")
            .then(res => res.json())
            .then(data => setOrders(data));
    }, []);

    return (
        <>
            <h1 className="text-2xl mb-6">Orders</h1>

            <table className="w-full border">
                <thead>
                    <tr className="border-b">
                        <th>Order ID</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map(order => (
                        <tr key={order._id} className="border-b text-center">
                            <td>{order._id.slice(-6)}</td>
                            <td>${order.totalAmount}</td>
                            <td
                                className={
                                    order.paymentStatus === "paid"
                                        ? "text-green-500"
                                        : "text-yellow-500"
                                }
                            >
                                {order.paymentStatus}
                            </td>
                            <td>
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}