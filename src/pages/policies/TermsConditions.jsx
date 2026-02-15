export default function TermsConditions() {
    return (
        <section className="min-h-screen bg-black text-white px-6 md:px-20 py-32">
            <div className="max-w-4xl mx-auto">

                {/* HEADER */}
                <p className="tracking-widest text-sm opacity-60 mb-4">
                    POLICY
                </p>

                <h1 className="text-5xl mb-10 tracking-tight">
                    Terms & Conditions
                </h1>

                {/* CONTENT */}
                <div className="space-y-8 text-white/80 leading-relaxed">

                    <p>
                        By accessing or using this website, you agree to be
                        bound by the following terms and conditions. Please
                        read them carefully before making a purchase.
                    </p>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            General Conditions
                        </h2>
                        <p>
                            We reserve the right to refuse service to anyone
                            for any reason at any time. All content on this
                            website is owned by the brand and may not be
                            reused without permission.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            Products & Pricing
                        </h2>
                        <p>
                            Prices, product availability, and descriptions
                            are subject to change without notice. We strive
                            to display accurate information but do not
                            guarantee that all details are error-free.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            Orders & Payments
                        </h2>
                        <p>
                            By placing an order, you confirm that all payment
                            and shipping information provided is accurate.
                            Orders may be canceled or refunded at our
                            discretion in case of suspected fraud or error.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            Shipping & Delivery
                        </h2>
                        <p>
                            Delivery timelines are estimates and may vary due
                            to location, courier delays, or unforeseen
                            circumstances. We are not responsible for delays
                            beyond our control.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            Returns & Refunds
                        </h2>
                        <p>
                            Returns are accepted only if they comply with our
                            return policy. Items must be unused, unworn, and
                            in original packaging unless otherwise stated.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            Limitation of Liability
                        </h2>
                        <p>
                            We shall not be liable for any indirect,
                            incidental, or consequential damages arising
                            from the use of our products or website.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            Changes to Terms
                        </h2>
                        <p>
                            We reserve the right to update or modify these
                            terms at any time. Continued use of the website
                            constitutes acceptance of those changes.
                        </p>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-16 flex gap-6">
                    <a
                        href="/contact"
                        className="border px-8 py-3 tracking-widest hover:bg-white hover:text-black transition"
                    >
                        CONTACT US
                    </a>

                    <a
                        href="/shop"
                        className="border px-8 py-3 tracking-widest opacity-70 hover:opacity-100 transition"
                    >
                        CONTINUE SHOPPING
                    </a>
                </div>

            </div>
        </section>
    );
}