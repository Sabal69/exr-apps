export default function Coupons() {
    return (
        <div className="min-h-screen bg-black text-white px-8 py-16">
            <h1 className="text-4xl font-bold mb-8">My Coupons</h1>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <p className="text-white/60">
                    You don’t have any coupons yet.
                </p>
            </div>
        </div>
    );
}