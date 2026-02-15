import { Navigate, useLocation } from "react-router-dom";

export default function AdminRoute({ children }) {
    const location = useLocation();
    const token = localStorage.getItem("adminToken");

    // 🔒 Not logged in → redirect to login
    if (!token) {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // ✅ Logged in → allow access
    return children;
}