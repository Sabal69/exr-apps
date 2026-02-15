export default function TermsAndConditions() {
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
                        By accessing and using our website, you agree to be
                        bound by the following terms and conditions. Please
                        read them carefully before using our services.
                    </p>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            Use of Website
                        </h2>
                        <p>
                            You agree to use this website only for lawful
                            purposes and in a way that does not infringe the
                            rights of others or restrict their use of the site.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            Products & Orders
                        </h2>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>All products are subject to availability</li>
                            <li>Prices may change without notice</li>
                            <li>We reserve the right to cancel any order</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            Payments
                        </h2>
                        <p>
                            All payments must be completed using the available
                            payment methods at checkout. We are not responsible
                            for issues caused by third-party payment providers.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            Intellectual Property
                        </h2>
                        <p>
                            All content, designs, logos, and images on this
                            website are the property of the brand and may not
                            be copied or reused without permission.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            Limitation of Liability
                        </h2>
                        <p>
                            We are not liable for any indirect, incidental, or
                            consequential damages resulting from the use of
                            this website or our products.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl text-white mb-2">
                            Changes to Terms
                        </h2>
                        <p>
                            We reserve the right to update or modify these
                            terms at any time without prior notice.
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