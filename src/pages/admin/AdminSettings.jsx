import { useEffect, useState } from "react";
import { adminFetch } from "../../utils/adminFetch";

const DEFAULT_FORM = {
    storeEmail: "",
    codEnabled: false,
    stripeEnabled: false,
    esewaEnabled: false,
    khaltiEnabled: false,
    shippingInsideValley: 150,
    shippingOutsideValley: 300,
    maintenanceMode: false,
};

export default function AdminSettings() {
    const [form, setForm] = useState(DEFAULT_FORM);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    /* ===============================
       LOAD SETTINGS
    ================================ */
    const fetchSettings = async () => {
        try {
            const res = await adminFetch(
                "http://localhost:4242/api/admin/settings"
            );

            if (!res.ok) throw new Error();

            const data = await res.json();

            // ✅ BACKEND RETURNS SETTINGS DIRECTLY
            setForm({
                storeEmail: data.storeEmail || "",
                codEnabled: !!data.codEnabled,
                stripeEnabled: !!data.stripeEnabled,
                esewaEnabled: !!data.esewaEnabled,
                khaltiEnabled: !!data.khaltiEnabled,
                shippingInsideValley:
                    data.shippingInsideValley ?? 150,
                shippingOutsideValley:
                    data.shippingOutsideValley ?? 300,
                maintenanceMode: !!data.maintenanceMode,
            });
        } catch (err) {
            alert("❌ Failed to load admin settings");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    /* ===============================
       SAVE SETTINGS
    ================================ */
    const saveSettings = async () => {
        setSaving(true);

        try {
            const res = await adminFetch(
                "http://localhost:4242/api/admin/settings",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            if (!res.ok) throw new Error();

            const { settings } = await res.json();

            // ✅ RELOAD SAVED SETTINGS
            setForm({
                storeEmail: settings.storeEmail || "",
                codEnabled: !!settings.codEnabled,
                stripeEnabled: !!settings.stripeEnabled,
                esewaEnabled: !!settings.esewaEnabled,
                khaltiEnabled: !!settings.khaltiEnabled,
                shippingInsideValley:
                    settings.shippingInsideValley ?? 150,
                shippingOutsideValley:
                    settings.shippingOutsideValley ?? 300,
                maintenanceMode: !!settings.maintenanceMode,
            });

            alert("✅ Settings saved successfully");
        } catch (err) {
            alert("❌ Failed to save settings");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-white opacity-60">
                Loading settings…
            </div>
        );
    }

    /* ===============================
       TOGGLE
    ================================ */
    const Toggle = ({ value, onChange }) => (
        <button
            onClick={() => onChange(!value)}
            className={`px-4 py-2 text-xs tracking-widest border transition ${value
                    ? "bg-white text-black"
                    : "border-white/30 text-white"
                }`}
        >
            {value ? "ON" : "OFF"}
        </button>
    );

    return (
        <div className="min-h-screen bg-black text-white p-10 max-w-5xl mx-auto">
            <div className="mb-12">
                <p className="tracking-widest text-sm opacity-60">
                    ADMIN PANEL
                </p>
                <h1 className="text-4xl mt-2">
                    Store Settings
                </h1>
            </div>

            {/* STORE EMAIL */}
            <div className="border border-white/10 p-6 mb-10">
                <p className="text-sm tracking-widest opacity-60 mb-4">
                    STORE EMAIL
                </p>
                <input
                    value={form.storeEmail}
                    onChange={e =>
                        setForm({
                            ...form,
                            storeEmail: e.target.value,
                        })
                    }
                    className="w-full bg-black border border-white/30 px-4 py-3"
                />
            </div>

            {/* PAYMENTS */}
            <div className="border border-white/10 p-6 mb-10 space-y-6">
                <p className="text-sm tracking-widest opacity-60">
                    PAYMENT METHODS
                </p>

                {[
                    ["codEnabled", "Cash on Delivery"],
                    ["stripeEnabled", "Stripe Payments"],
                    ["esewaEnabled", "eSewa Payments"],
                    ["khaltiEnabled", "Khalti Payments"],
                ].map(([key, label]) => (
                    <div
                        key={key}
                        className="flex justify-between items-center"
                    >
                        <span>{label}</span>
                        <Toggle
                            value={form[key]}
                            onChange={val =>
                                setForm({
                                    ...form,
                                    [key]: val,
                                })
                            }
                        />
                    </div>
                ))}
            </div>

            {/* SHIPPING */}
            <div className="border border-white/10 p-6 mb-10 space-y-6">
                <p className="text-sm tracking-widest opacity-60">
                    SHIPPING FEES (NPR)
                </p>

                <input
                    type="number"
                    value={form.shippingInsideValley}
                    onChange={e =>
                        setForm({
                            ...form,
                            shippingInsideValley: Number(e.target.value),
                        })
                    }
                    className="w-full bg-black border border-white/30 px-4 py-2"
                />

                <input
                    type="number"
                    value={form.shippingOutsideValley}
                    onChange={e =>
                        setForm({
                            ...form,
                            shippingOutsideValley: Number(e.target.value),
                        })
                    }
                    className="w-full bg-black border border-white/30 px-4 py-2"
                />
            </div>

            {/* MAINTENANCE */}
            <div className="border border-red-500/30 p-6 mb-10">
                <div className="flex justify-between items-center">
                    <span>Maintenance Mode</span>
                    <Toggle
                        value={form.maintenanceMode}
                        onChange={val =>
                            setForm({
                                ...form,
                                maintenanceMode: val,
                            })
                        }
                    />
                </div>
            </div>

            <button
                onClick={saveSettings}
                disabled={saving}
                className="border px-10 py-3 tracking-widest hover:bg-white hover:text-black transition"
            >
                {saving ? "SAVING…" : "SAVE SETTINGS"}
            </button>
        </div>
    );
}