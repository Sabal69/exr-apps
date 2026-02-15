import { Link } from "react-router-dom";

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-black text-white px-6 py-16">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* ================= HEADER ================= */}
                <div className="text-center space-y-2">
                    <p className="tracking-widest text-sm opacity-60">
                        POLICY
                    </p>
                    <h1 className="text-3xl tracking-widest">
                        Shipping <span className="text-red-500">Policy</span>
                    </h1>
                    <p className="opacity-70 text-sm">
                        Kathmandu Valley & Nepal-Wide Delivery
                    </p>
                </div>

                {/* ================= DELIVERY TYPES ================= */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="border border-zinc-800 p-6 text-center space-y-2">
                        <p className="text-lg">🚚</p>
                        <h3 className="tracking-widest">
                            Standard Delivery
                        </h3>
                        <p className="opacity-70 text-sm">
                            2–4 Business Days
                        </p>
                        <p className="text-sm">NPR 150</p>
                    </div>

                    <div className="border border-zinc-800 p-6 text-center space-y-2">
                        <p className="text-lg">⏰</p>
                        <h3 className="tracking-widest">
                            Same Day / Next Day
                        </h3>
                        <p className="opacity-70 text-sm">
                            Kathmandu Valley Only
                        </p>
                        <p className="text-sm">NPR 250</p>
                    </div>

                    <div className="border border-zinc-800 p-6 text-center space-y-2">
                        <p className="text-lg">📍</p>
                        <h3 className="tracking-widest">
                            Outside Valley
                        </h3>
                        <p className="opacity-70 text-sm">
                            3–7 Business Days
                        </p>
                        <p className="text-sm">NPR 300</p>
                    </div>
                </div>

                {/* ================= ORDER PROCESSING ================= */}
                <div className="space-y-4 text-sm">
                    <h2 className="tracking-widest text-lg">
                        Order Processing
                    </h2>
                    <p className="opacity-80">
                        Orders are typically processed within 1–2 business
                        days after payment confirmation. Orders placed on
                        weekends or public holidays may be processed on the
                        next working day.
                    </p>
                </div>

                {/* ================= SHIPPING AREAS ================= */}
                <div className="space-y-2 text-sm">
                    <h2 className="tracking-widest text-lg">
                        Shipping Areas
                    </h2>
                    <ul className="list-disc list-inside opacity-80">
                        <li>Inside Kathmandu Valley</li>
                        <li>Outside Kathmandu Valley (Nationwide)</li>
                    </ul>
                </div>

                {/* ================= DELIVERY TIME ================= */}
                <div className="space-y-2 text-sm">
                    <h2 className="tracking-widest text-lg">
                        Delivery Time
                    </h2>
                    <p className="opacity-80">
                        Delivery time may vary depending on location,
                        courier service, weather conditions, and external
                        factors. Estimated delivery ranges between 2–7
                        business days.
                    </p>
                </div>

                {/* ================= DELAYS ================= */}
                <div className="space-y-2 text-sm">
                    <h2 className="tracking-widest text-lg">
                        Delays
                    </h2>
                    <p className="opacity-80">
                        EXR is not responsible for delays caused by courier
                        issues, strikes, weather conditions, or unforeseen
                        circumstances beyond our control.
                    </p>
                </div>

                {/* ================= INCORRECT ADDRESS ================= */}
                <div className="space-y-2 text-sm">
                    <h2 className="tracking-widest text-lg">
                        Incorrect Address
                    </h2>
                    <p className="opacity-80">
                        Please ensure that your shipping details are accurate
                        at checkout. We are not responsible for orders delayed
                        or lost due to incorrect address information provided
                        by the customer.
                    </p>
                </div>

                {/* ================= SHIPPING RATES ================= */}
                <div className="space-y-4 text-sm">
                    <h2 className="tracking-widest text-lg">
                        Shipping Rates
                    </h2>

                    <p className="opacity-80">
                        Shipping charges for your order are calculated
                        automatically at checkout based on your delivery
                        location.
                    </p>

                    <ul className="list-disc list-inside opacity-80 space-y-1">
                        <li>
                            <strong>Inside Kathmandu Valley (Standard):</strong>{" "}
                            NPR 150
                        </li>
                        <li>
                            <strong>
                                Same Day / Next Day (Kathmandu Valley Only):
                            </strong>{" "}
                            NPR 250
                        </li>
                        <li>
                            <strong>Outside Kathmandu Valley:</strong> NPR 300
                        </li>
                    </ul>

                    <p className="text-green-500 font-medium">
                        🎉 FREE SHIPPING: Orders over NPR 10,000 qualify for
                        free standard shipping across Nepal.
                    </p>
                </div>

                {/* ================= ACTION BUTTONS ================= */}
                <div className="flex gap-4 pt-6">
                    <Link
                        to="/contact"
                        className="border px-6 py-3 tracking-widest hover:bg-white hover:text-black transition"
                    >
                        CONTACT SUPPORT
                    </Link>

                    <Link
                        to="/shop"
                        className="border px-6 py-3 tracking-widest hover:bg-white hover:text-black transition"
                    >
                        CONTINUE SHOPPING
                    </Link>
                </div>
            </div>
        </div>
    );
}