import { Link } from "react-router-dom";

export default function ReturnRefundPolicy() {
    return (
        <section className="min-h-screen bg-black text-white px-6 md:px-20 py-32">
            <div className="max-w-4xl mx-auto">

                {/* HEADER */}
                <p className="tracking-widest text-sm opacity-60 mb-4">
                    POLICY
                </p>

                <h1 className="text-5xl mb-4 tracking-tight">
                    Refund & <span className="text-red-500">Returns</span>
                </h1>

                <p className="text-white/60 mb-12">
                    Standard Policy for Nepal & International Orders
                </p>

                {/* ALERT */}
                <div className="border border-red-500/40 bg-red-500/10 p-6 mb-12">
                    <h3 className="text-red-500 mb-2 font-semibold">
                        ⚠️ Crucial Information
                    </h3>
                    <p className="text-white/80">
                        Due to the limited nature of our drops, we do not offer
                        refunds for “change of mind”. We only offer exchanges
                        for sizing issues or store credit for defective items.
                    </p>
                </div>

                {/* CONTENT */}
                <div className="space-y-10 text-white/80 leading-relaxed">

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            1. Returns & Exchanges
                        </h2>
                        <p>
                            We have a 7-day return policy, which means you have
                            7 days after receiving your item to request a return
                            or exchange. To be eligible, your item must be in
                            the same condition that you received it — unworn,
                            unused, with tags, and in its original packaging.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            2. How to Start a Return
                        </h2>
                        <p>
                            To start a return, contact us at{" "}
                            <span className="text-white font-medium">
                                essencexrebirth@gmail.com
                            </span>{" "}
                            with your Order ID. If your return is accepted, we
                            will send you instructions on how and where to send
                            your package.
                        </p>
                        <p className="mt-2 text-sm opacity-70">
                            Items sent back without first requesting a return
                            will not be accepted. Customers are responsible for
                            return shipping costs unless the item was received
                            damaged.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            3. Damages and Issues
                        </h2>
                        <p>
                            Please inspect your order upon reception and contact
                            us immediately if the item is defective, damaged,
                            or if you receive the wrong item, so we can evaluate
                            the issue and make it right.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            4. Non-returnable Items
                        </h2>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Sale items or gift cards</li>
                            <li>Underwear or socks (for hygiene reasons)</li>
                            <li>Customized or personalized items</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            5. Refunds (If Applicable)
                        </h2>
                        <p>
                            We will notify you once we’ve received and inspected
                            your return and let you know if the refund was
                            approved or not. If approved, you’ll be automatically
                            refunded on your original payment method or provided
                            with Store Credit (EXR Wallet).
                        </p>
                        <p className="mt-2 text-sm opacity-70">
                            Please remember it can take some time for your bank
                            or credit card company to process and post the
                            refund.
                        </p>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-16 flex gap-6 flex-wrap">
                    <Link
                        to="/contact"
                        className="border px-8 py-3 tracking-widest hover:bg-white hover:text-black transition"
                    >
                        CONTACT SUPPORT
                    </Link>

                    <Link
                        to="/shop"
                        className="border px-8 py-3 tracking-widest opacity-70 hover:opacity-100 transition"
                    >
                        CONTINUE SHOPPING
                    </Link>
                </div>

            </div>
        </section>
    );
}