import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import StoreFooter from "../components/StoreFooter";

export default function StoreLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            {/* TOP NAVBAR */}
            <Navbar />

            {/* PAGE CONTENT */}
            <div className="flex-1">
                <Outlet />
            </div>

            {/* FOOTER */}
            <StoreFooter />
        </div>
    );
}