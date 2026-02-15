export default function PrivacyPolicy() {
    return (
        <section className="min-h-screen bg-black text-white px-6 md:px-20 py-32">
            <div className="max-w-4xl mx-auto">

                {/* HEADER */}
                <h1 className="text-5xl mb-12 tracking-tight">
                    Privacy <span className="text-red-500">Policy</span>
                </h1>

                {/* CONTENT */}
                <div className="space-y-10 text-white/80 leading-relaxed">

                    {/* 1 */}
                    <div>
                        <h2 className="text-xl text-white mb-3">
                            1. Introduction
                        </h2>
                        <p>
                            EXR NEPAL ("we", "our", or "us") respects your privacy.
                            This Privacy Policy explains how we collect, use,
                            disclose, and safeguard your information when you
                            visit our website. We operate in accordance with the
                            laws of Nepal and applicable international data
                            protection standards.
                        </p>
                    </div>

                    {/* 2 */}
                    <div>
                        <h2 className="text-xl text-white mb-3">
                            2. Data Collection
                        </h2>
                        <p className="mb-3">
                            We collect information that you provide directly to
                            us when you:
                        </p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Register for an account or join our newsletter.</li>
                            <li>
                                Make a purchase (Name, Billing/Shipping Address,
                                Phone Number, Payment Information).
                            </li>
                            <li>Contact our customer support.</li>
                        </ul>

                        <p className="mt-4 text-red-400">
                            <strong>Note on Payment Data:</strong> We do not store
                            your credit or debit card details. All transactions
                            are processed securely through trusted third-party
                            payment gateways such as Khalti, eSewa, or IME Pay.
                        </p>
                    </div>

                    {/* 3 */}
                    <div>
                        <h2 className="text-xl text-white mb-3">
                            3. Use of Your Information
                        </h2>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Process your orders and manage payments.</li>
                            <li>
                                Send order updates, shipping notifications,
                                and invoices.
                            </li>
                            <li>
                                Prevent fraudulent transactions and monitor
                                against theft.
                            </li>
                            <li>
                                Inform you about new drops and exclusive offers
                                (you may opt out at any time).
                            </li>
                        </ul>
                    </div>

                    {/* 4 */}
                    <div>
                        <h2 className="text-xl text-white mb-3">
                            4. Disclosure of Your Information
                        </h2>
                        <p>
                            We may share information with third parties that
                            perform services on our behalf, such as payment
                            processing, data analysis, email delivery, hosting
                            services, and customer service. We do not sell your
                            personal data to third parties.
                        </p>
                    </div>

                    {/* 5 */}
                    <div className="border border-white/10 bg-white/5 p-5 rounded">
                        <h2 className="text-xl text-white mb-3 flex items-center gap-2">
                            🔒 Security
                        </h2>
                        <p>
                            We use administrative, technical, and physical
                            security measures to help protect your personal
                            information. While we take reasonable steps to
                            secure your data, no security system is perfect
                            or impenetrable.
                        </p>
                    </div>

                    {/* 6 */}
                    <div>
                        <h2 className="text-xl text-white mb-3">
                            6. Contact Us
                        </h2>
                        <p>
                            If you have questions or concerns about this Privacy
                            Policy, please contact us at:
                        </p>
                        <p className="mt-2">
                            <strong>essencexrebirth@gmail.com</strong><br />
                            Kathmandu, Nepal
                        </p>
                    </div>

                </div>

                {/* ACTION */}
                <div className="mt-16">
                    <a
                        href="/contact"
                        className="inline-block border px-8 py-3 tracking-widest hover:bg-white hover:text-black transition"
                    >
                        CONTACT SUPPORT
                    </a>
                </div>

            </div>
        </section>
    );
}