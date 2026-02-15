export default function TermsPolicy() {
    return (
        <section className="min-h-screen bg-black text-white px-6 md:px-20 py-32">
            <div className="max-w-4xl mx-auto">

                {/* HEADER */}
                <h1 className="text-5xl font-light mb-12">
                    Terms of <span className="text-red-500">Service</span>
                </h1>

                {/* CONTENT */}
                <div className="space-y-10 text-white/80 leading-relaxed">

                    {/* 1 */}
                    <div>
                        <h2 className="text-xl text-white mb-2">
                            1. Agreement to Terms
                        </h2>
                        <p>
                            These Terms of Service constitute a legally binding
                            agreement made between you, whether personally or
                            on behalf of an entity (“you”), and EXR (“we,” “us,”
                            or “our”), concerning your access to and use of the
                            EXR website and services.
                        </p>
                    </div>

                    {/* 2 */}
                    <div>
                        <h2 className="text-xl text-white mb-2">
                            2. Intellectual Property
                        </h2>
                        <p>
                            Unless otherwise indicated, the website and all
                            source code, databases, functionality, software,
                            designs, audio, video, text, photographs, graphics,
                            and trademarks are the exclusive property of EXR
                            and are protected by copyright and trademark laws.
                        </p>
                        <p className="text-red-500 mt-2 font-medium">
                            DO NOT COPY OUR DESIGNS. LEGAL ACTION MAY BE TAKEN.
                        </p>
                    </div>

                    {/* 3 */}
                    <div>
                        <h2 className="text-xl text-white mb-2">
                            3. User Representations
                        </h2>
                        <ul className="list-disc ml-5 space-y-2">
                            <li>
                                All registration information you submit is
                                accurate and complete.
                            </li>
                            <li>
                                You have the legal capacity to comply with these
                                Terms of Service.
                            </li>
                            <li>
                                You are not a minor in the jurisdiction in which
                                you reside.
                            </li>
                            <li>
                                You will not use the website for any illegal or
                                unauthorized purpose.
                            </li>
                        </ul>
                    </div>

                    {/* 4 */}
                    <div>
                        <h2 className="text-xl text-white mb-2">
                            4. Purchases and Payment
                        </h2>
                        <p>
                            We accept payments via Visa, Mastercard, Khalti,
                            eSewa, IME Pay, and Cash on Delivery (COD) for select
                            locations in Nepal. You agree to provide accurate
                            purchase and account information for all
                            transactions.
                        </p>
                    </div>

                    {/* 5 */}
                    <div>
                        <h2 className="text-xl text-white mb-2">
                            5. Limitation of Liability
                        </h2>
                        <p>
                            In no event shall EXR, its directors, employees, or
                            agents be liable for any indirect, incidental,
                            consequential, or punitive damages arising from
                            your use of the website or products.
                        </p>
                    </div>

                    {/* 6 */}
                    <div>
                        <h2 className="text-xl text-white mb-2">
                            6. Governing Law
                        </h2>
                        <p>
                            These Terms of Service shall be governed by and
                            interpreted in accordance with the laws of Nepal.
                            You irrevocably consent to the exclusive
                            jurisdiction of the courts of Nepal.
                        </p>
                    </div>

                </div>

                {/* CTA */}
                <div className="mt-16">
                    <a
                        href="/contact"
                        className="inline-block border border-white px-10 py-3 tracking-widest hover:bg-white hover:text-black transition"
                    >
                        CONTACT SUPPORT
                    </a>
                </div>

            </div>
        </section>
    );
}