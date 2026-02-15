import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import SectionRenderer from "../../components/homepage/SectionRenderer";

/* ===============================
   ADMIN FETCH (SAFE)
================================ */
const adminFetch = async (url, options = {}) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return (window.location.href = "/admin/login");

    const res = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    if (res.status === 403) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
    }

    return res;
};

/* ===============================
   SORTABLE ITEM
================================ */
function SortableItem({ section, active, onSelect, onToggle }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: section._id });

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            onClick={() => onSelect(section._id)}
            className={`relative mb-8 border cursor-pointer
                ${active ? "border-white" : "border-zinc-800"}
                ${section.enabled === false ? "opacity-40" : ""}
            `}
        >
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 right-2 text-xs text-zinc-500 cursor-move"
            >
                ⠿ DRAG
            </div>

            <button
                onClick={e => {
                    e.stopPropagation();
                    onToggle(section._id);
                }}
                className="absolute top-2 left-2 text-xs px-3 py-1 border"
            >
                {section.enabled ? "ENABLED" : "DISABLED"}
            </button>

            <SectionRenderer section={section} />
        </div>
    );
}

/* ===============================
   HOMEPAGE EDITOR (FINAL)
================================ */
export default function HomepageEditor() {
    const [sections, setSections] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [saving, setSaving] = useState(false);

    const activeSection = sections.find(s => s._id === activeId);

    /* ---------- LOAD ---------- */
    const loadDraft = async () => {
        const res = await adminFetch("http://localhost:4242/api/homepage/admin");
        if (!res) return;

        const data = await res.json();
        setSections(data.sections || []);
        setActiveId(data.sections?.[0]?._id || null);
    };

    useEffect(() => {
        loadDraft();
    }, []);

    /* ---------- SAVE (LIVE) ---------- */
    const persistSections = async updated => {
        setSections(updated);
        await adminFetch("http://localhost:4242/api/homepage", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sections: updated }),
        });
    };

    /* ---------- ADD HERO ---------- */
    const addHeroSection = async () => {
        const hero = {
            _id: crypto.randomUUID(),
            type: "hero",
            enabled: true,
            order: sections.length,
            data: {
                heroTitle: "NEW HERO",
                heroSubtitle: "",
                heroBackground: "",
                heroButtonText: "SHOP NOW",
                heroButtonLink: "/products",
                heroLayout: "classic",
                heroProducts: [],
            },
        };

        const updated = [...sections, hero];
        await persistSections(updated);
        setActiveId(hero._id);
    };

    /* ---------- ADD CONTACT ---------- */
    const addContactSection = async () => {
        const contact = {
            _id: crypto.randomUUID(),
            type: "contact",
            enabled: true,
            order: sections.length,
            data: {
                title: "Talk To The Brand.",
                subtitle:
                    "For inquiries regarding orders, collaborations, or general questions.",
                email: "",
                instagram: "",
                tiktok: "",
            },
        };

        const updated = [...sections, contact];
        await persistSections(updated);
        setActiveId(contact._id);
    };

    /* ---------- DELETE ---------- */
    const deleteSection = async () => {
        if (!activeSection) return;
        if (!confirm("Delete this section permanently?")) return;

        const updated = sections.filter(s => s._id !== activeId);
        await persistSections(updated);
        setActiveId(updated[0]?._id || null);
    };

    /* ---------- TOGGLE ---------- */
    const toggleSection = async id => {
        const updated = sections.map(s =>
            s._id === id ? { ...s, enabled: !s.enabled } : s
        );
        await persistSections(updated);
    };

    /* ---------- UPDATE FIELD ---------- */
    const updateField = async (key, value) => {
        const updated = sections.map(s =>
            s._id === activeId
                ? { ...s, data: { ...s.data, [key]: value } }
                : s
        );
        await persistSections(updated);
    };

    /* ---------- PUBLISH ---------- */
    const publishHomepage = async () => {
        setSaving(true);
        await adminFetch("http://localhost:4242/api/homepage/publish", {
            method: "POST",
        });
        setSaving(false);
        alert("Homepage published 🌍");
    };

    /* ================= RENDER ================= */
    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* SIDEBAR */}
            <aside className="w-80 border-r border-zinc-800 p-8 space-y-4">
                <Button onClick={addHeroSection}>+ Add Hero</Button>
                <Button onClick={addContactSection}>+ Add Contact</Button>
                <Button onClick={deleteSection} disabled={!activeSection}>
                    Delete
                </Button>

                {/* HERO SETTINGS */}
                {activeSection?.type === "hero" && (
                    <>
                        <Input
                            label="Hero Title"
                            value={activeSection.data.heroTitle}
                            onChange={e =>
                                updateField("heroTitle", e.target.value)
                            }
                        />
                        <Input
                            label="Hero Subtitle"
                            value={activeSection.data.heroSubtitle}
                            onChange={e =>
                                updateField("heroSubtitle", e.target.value)
                            }
                        />
                        <Input
                            label="Button Text"
                            value={activeSection.data.heroButtonText}
                            onChange={e =>
                                updateField(
                                    "heroButtonText",
                                    e.target.value
                                )
                            }
                        />
                        <Input
                            label="Button Link"
                            value={activeSection.data.heroButtonLink}
                            onChange={e =>
                                updateField(
                                    "heroButtonLink",
                                    e.target.value
                                )
                            }
                        />
                    </>
                )}

                {/* CONTACT SETTINGS */}
                {activeSection?.type === "contact" && (
                    <>
                        <Input
                            label="Title"
                            value={activeSection.data.title}
                            onChange={e =>
                                updateField("title", e.target.value)
                            }
                        />
                        <Input
                            label="Subtitle"
                            value={activeSection.data.subtitle}
                            onChange={e =>
                                updateField("subtitle", e.target.value)
                            }
                        />
                        <Input
                            label="Email"
                            value={activeSection.data.email}
                            onChange={e =>
                                updateField("email", e.target.value)
                            }
                        />
                        <Input
                            label="Instagram"
                            value={activeSection.data.instagram}
                            onChange={e =>
                                updateField("instagram", e.target.value)
                            }
                        />
                        <Input
                            label="TikTok"
                            value={activeSection.data.tiktok}
                            onChange={e =>
                                updateField("tiktok", e.target.value)
                            }
                        />
                    </>
                )}
            </aside>

            {/* PREVIEW */}
            <main className="flex-1 p-10">
                <Button onClick={publishHomepage} disabled={saving}>
                    Publish
                </Button>

                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={({ active, over }) => {
                        if (!over || active.id === over.id) return;

                        const updated = arrayMove(
                            sections,
                            sections.findIndex(s => s._id === active.id),
                            sections.findIndex(s => s._id === over.id)
                        );
                        persistSections(updated);
                    }}
                >
                    <SortableContext
                        items={sections.map(s => s._id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {sections.map(section => (
                            <SortableItem
                                key={section._id}
                                section={section}
                                active={section._id === activeId}
                                onSelect={setActiveId}
                                onToggle={toggleSection}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </main>
        </div>
    );
}