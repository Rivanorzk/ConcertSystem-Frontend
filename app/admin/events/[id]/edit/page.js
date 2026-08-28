"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus, X } from "lucide-react";

import {
    getEventById,
    updateEvent,
} from "@/services/eventService";

export default function EditEventPage() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        poster: "",
        event_date: "",
        start_time: "",
        status: "draft",
    });

    const [newPoster, setNewPoster] =
        useState(null);

    const [previewPoster, setPreviewPoster] =
        useState("");

    useEffect(() => {
        if (!id) return;

        const loadEvent = async () => {
            try {
                const event =
                    await getEventById(id);

                setForm({
                    title: event.title || "",
                    description:
                        event.description || "",
                    location:
                        event.location || "",
                    poster: event.poster || "",
                    event_date:
                        event.event_date || "",
                    start_time:
                        event.start_time || "",
                    status:
                        event.status || "draft",
                });

                setPreviewPoster(
                    event.poster || ""
                );
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadEvent();
    }, [id]);

    const handleChange = (e) => {
        setForm((current) => ({
            ...current,
            [e.target.name]:
                e.target.value,
        }));
    };

    const handlePosterChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setNewPoster(file);

        const previewUrl =
            URL.createObjectURL(file);

        setPreviewPoster(previewUrl);
    };

    const removeNewPoster = () => {
        setNewPoster(null);

        setPreviewPoster(
            form.poster || ""
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const formData = new FormData();

            formData.append(
                "title",
                form.title
            );

            formData.append(
                "description",
                form.description
            );

            formData.append(
                "location",
                form.location
            );

            formData.append(
                "event_date",
                form.event_date
            );

            formData.append(
                "start_time",
                form.start_time
            );

            formData.append(
                "status",
                form.status
            );

            if (newPoster) {
                formData.append(
                    "poster",
                    newPoster
                );
            }

            await updateEvent(id, formData);

            router.push(
                `/admin/events/${id}`
            );
        } catch (error) {
            console.error(error);

            alert(
                "Failed to update event"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                Loading event...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-5 lg:p-8">
            <div className="max-w-4xl mx-auto">

                <Link
                    href={`/admin/events/${id}`}
                    className="flex items-center gap-2 text-sm text-[#7A1F2B] mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>

                <h1 className="text-3xl font-bold text-black">
                    Edit Event
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="mt-7 bg-white border border-[#E5D6D0] rounded-2xl p-6 space-y-5 text-black"
                >

                    <Field
                        label="Title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                    />

                    <Field
                        label="Location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                    />

                    {/* POSTER */}
                    <div>
                        <label className="text-sm font-semibold">
                            Poster
                        </label>

                        {previewPoster && (
                            <div className="relative mt-2 w-full max-w-sm overflow-hidden rounded-xl border border-[#E5D6D0]">
                                <img
                                    src={previewPoster}
                                    alt="Event poster"
                                    className="w-full aspect-video object-cover"
                                />

                                {newPoster && (
                                    <button
                                        type="button"
                                        onClick={
                                            removeNewPoster
                                        }
                                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}

                        <label className="mt-3 flex items-center justify-center gap-2 w-full max-w-sm border border-dashed border-[#D8A7A7] rounded-xl px-4 py-4 cursor-pointer hover:bg-[#F8F1E7] transition">
                            <ImagePlus className="w-5 h-5 text-[#7A1F2B]" />

                            <span className="text-sm text-[#7A1F2B] font-medium">
                                {newPoster
                                    ? "Ganti Poster"
                                    : "Pilih Poster Baru"}
                            </span>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                    handlePosterChange
                                }
                                className="hidden"
                            />
                        </label>

                        <p className="mt-2 text-xs text-[#8C7777]">
                            Kosongkan jika ingin
                            menggunakan poster lama.
                        </p>

                        {newPoster && (
                            <p className="mt-1 text-xs text-[#5B0F18] font-medium">
                                File baru:{" "}
                                {newPoster.name}
                            </p>
                        )}
                    </div>

                    {/* DATE & TIME */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field
                            label="Event Date"
                            type="date"
                            name="event_date"
                            value={
                                form.event_date
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <Field
                            label="Start Time"
                            type="time"
                            name="start_time"
                            value={
                                form.start_time
                            }
                            onChange={
                                handleChange
                            }
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="text-sm font-semibold">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={
                                form.description
                            }
                            onChange={
                                handleChange
                            }
                            rows={5}
                            className="mt-2 w-full border border-[#E5D6D0] rounded-xl p-3 outline-none focus:border-[#7A1F2B]"
                        />
                    </div>

                    {/* STATUS */}
                    <div>
                        <label className="text-sm font-semibold">
                            Status
                        </label>

                        <select
                            name="status"
                            value={form.status}
                            onChange={
                                handleChange
                            }
                            className="mt-2 w-full border border-[#E5D6D0] rounded-xl p-3"
                        >
                            <option value="draft">
                                Draft
                            </option>

                            <option value="published">
                                Published
                            </option>

                            <option value="finished">
                                Finished
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-semibold disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </form>
            </div>
        </div>
    );
}

function Field({
    label,
    ...props
}) {
    return (
        <div>
            <label className="text-sm font-semibold">
                {label}
            </label>

            <input
                {...props}
                className="mt-2 w-full border border-[#E5D6D0] rounded-xl p-3 outline-none focus:border-[#7A1F2B]"
            />
        </div>
    );
}