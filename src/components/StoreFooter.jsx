import { Link } from "react-router-dom";

export default function StoreFooter() {
    return (
        <footer className="border-t border-white/10 px-6 md:px-20 py-16 bg-black text-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* ================= BRAND ================= */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">EXR</h2>

                    <p className="text-white/70 max-w-sm leading-relaxed">
                        ESSENCE X REBIRTH. Luxury streetwear born in
                        Kathmandu. Redefining the standard.
                    </p>

                    {/* SOCIAL */}
                    <div className="flex gap-6 mt-6 text-sm tracking-widest">
                        <a
                            href="https://instagram.com/essencexrebirth"
                            target="_blank"
                            rel="noreferrer"
                            className="social-link"
                        >
                            IG
                        </a>

                        <a
                            href="https://tiktok.com/@essence.x.rebirth"
                            target="_blank"
                            rel="noreferrer"
                            className="social-link"
                        >
                            TT
                        </a>
                    </div>
                </div>

                {/* ================= SHOP ================= */}
                <div>
                    <h3 className="tracking-widest mb-6 text-white/80">
                        SHOP
                    </h3>

                    <ul className="space-y-3 text-white/70">
                        <li>
                            <Link to="/products" className="footer-link">
                                All Products
                            </Link>
                        </li>
                        <li>
                            <Link to="/shop" className="footer-link">
                                New Arrivals
                            </Link>
                        </li>
                        <li>
                            <Link to="/shop" className="footer-link">
                                Best Sellers
                            </Link>
                        </li>
                        <li>
                            <Link to="/products" className="footer-link">
                                Accessories
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* ================= SUPPORT ================= */}
                <div>
                    <h3 className="tracking-widest mb-6 text-white/80">
                        SUPPORT
                    </h3>

                    <ul className="space-y-3 text-white/70">
                        <li>
                            <Link to="/wallet" className="footer-link">
                                My Wallet
                            </Link>
                        </li>

                        <li>
                            <Link to="/orders" className="footer-link">
                                My Orders
                            </Link>
                        </li>

                        <li>
                            <Link to="/contact" className="footer-link">
                                Contact Us
                            </Link>
                        </li>

                        <li>
                            <Link to="/shipping-policy" className="footer-link">
                                Shipping Policy
                            </Link>
                        </li>

                        <li>
                            <Link to="/refund-policy" className="footer-link">
                                Refund Policy
                            </Link>
                        </li>

                        <li>
                            <Link to="/privacy-policy" className="footer-link">
                                Privacy Policy
                            </Link>
                        </li>

                        <li>
                            <Link to="/terms-and-conditions" className="footer-link">
                                Terms of Service
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* ================= BOTTOM ================= */}
            <div className="mt-16 text-center text-white/40 text-xs tracking-widest">
                © {new Date().getFullYear()} EXR NEPAL. ALL RIGHTS RESERVED.
            </div>

            {/* ================= STYLES ================= */}
            <style>{`
                .footer-link {
                    transition: color 0.3s ease;
                }

                .footer-link:hover {
                    color: white;
                }

                .social-link {
                    position: relative;
                    opacity: 0.7;
                    transition: opacity 0.3s ease, text-shadow 0.3s ease;
                }

                .social-link::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: -4px;
                    width: 0;
                    height: 1px;
                    background: white;
                    transition: width 0.3s ease;
                }

                .social-link:hover {
                    opacity: 1;
                    text-shadow: 0 0 10px rgba(255,255,255,0.6);
                }

                .social-link:hover::after {
                    width: 100%;
                }
            `}</style>
        </footer>
    );
}