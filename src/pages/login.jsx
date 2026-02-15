import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async e => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                "http://localhost:4242/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // ✅ Save token
            localStorage.setItem("token", data.token);

            // Redirect to dashboard/orders
            navigate("/orders");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md border border-zinc-800 p-8 space-y-6"
            >
                <h1 className="text-3xl tracking-widest">
                    LOGIN
                </h1>

                {error && (
                    <p className="text-red-500 text-sm">
                        {error}
                    </p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-3 outline-none focus:border-white"
                />

                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-3 outline-none focus:border-white"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full border border-white py-3 tracking-widest hover:bg-white hover:text-black transition"
                >
                    {loading ? "Signing in…" : "LOGIN"}
                </button>

                <p className="text-sm opacity-60">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="underline"
                    >
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}