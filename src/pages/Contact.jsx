import { useEffect, useState } from "react";
import { FaEnvelope, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Contact() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    /* ===============================
       LOAD CONTACT (PUBLISHED)
    ================================ */
    useEffect(() => {
        const loadContact = async () => {
            try {
                const res = await fetch("http://localhost:4242/api/contact");

                if (!res.ok) {
                    throw new Error("Contact not available");
                }

                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
                setError("Contact not available");
            } finally {
                setLoading(false);
            }
        };

        loadContact();
    }, []);

    /* ===============================
       FORM HANDLERS
    ================================ */
    const handleChange = e => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSending(true);
        setError("");

        try {
            const res = await fetch("http://localhost:4242/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || "Failed to send message");
            }

            alert("Message sent successfully ✉️");
            setForm({ name: "", email: "", message: "" });
        } catch (err) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    };

    /* ===============================
       STATES
    ================================ */
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                {error}
            </div>
        );
    }

    /* ===============================
       RENDER
    ================================ */
    return (
        <section className="min-h-screen bg-black text-white px-6 md:px-20 py-32">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
                {/* LEFT */}
                <div>
                    <p className="tracking-widest text-sm opacity-70 mb-6">
                        GET IN TOUCH
                    </p>

                    <h1 className="text-5xl mb-8">
                        {data?.title || "Contact Us"}
                    </h1>

                    {data?.subtitle && (
                        <p className="opacity-70 mb-10">
                            {data.subtitle}
                        </p>
                    )}

                    {/* ICON LINKS */}
                    <div className="space-y-4">
                        {data?.email && (
                            <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                                    data.email
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 group"
                            >
                                <span className="icon-circle">
                                    <FaEnvelope />
                                </span>
                                <span className="opacity-80 group-hover:opacity-100">
                                    {data.email}
                                </span>
                            </a>
                        )}

                        {data?.instagram && (
                            <a
                                href={data.instagram}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 group"
                            >
                                <span className="icon-circle">
                                    <FaInstagram />
                                </span>
                                <span className="opacity-80 group-hover:opacity-100">
                                    Instagram
                                </span>
                            </a>
                        )}

                        {data?.tiktok && (
                            <a
                                href={data.tiktok}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 group"
                            >
                                <span className="icon-circle">
                                    <FaTiktok />
                                </span>
                                <span className="opacity-80 group-hover:opacity-100">
                                    TikTok
                                </span>
                            </a>
                        )}
                    </div>
                </div>

                {/* RIGHT */}
                <form
                    onSubmit={handleSubmit}
                    className="border border-zinc-800 p-10"
                >
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full mb-4 p-3 bg-transparent border"
                        required
                    />

                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        type="email"
                        className="w-full mb-4 p-3 bg-transparent border"
                        required
                    />

                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Message"
                        rows={5}
                        className="w-full mb-6 p-3 bg-transparent border"
                        required
                    />

                    <button
                        disabled={sending}
                        className="w-full border py-3 tracking-widest hover:bg-white hover:text-black transition"
                    >
                        {sending ? "SENDING..." : "SEND"}
                    </button>
                </form>
            </div>

            {/* ICON STYLES */}
            <style>{`
                .icon-circle {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9999px;
                    border: 1px solid rgba(255,255,255,0.3);
                    transition: all 0.3s ease;
                }

                .group:hover .icon-circle {
                    border-color: white;
                    box-shadow: 0 0 12px rgba(255,255,255,0.4);
                    transform: scale(1.05);
                }

                .icon-circle svg {
                    font-size: 18px;
                }
            `}</style>
        </section>
    );
}