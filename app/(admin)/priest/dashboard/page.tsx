"use client";

import { useEffect, useState } from "react";

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);

    const [form, setForm] = useState({
        titleEnglish: "",
        titleTamil: "",
        descriptionEnglish: "",
        descriptionTamil: "",
        bannerImage: "",
        eventDate: "",
        location: "",
        createdBy: "",
    });

    const [editId, setEditId] = useState("");

    const fetchEvents = async () => {
        const res = await fetch("/api/priest/event");
        const data = await res.json();

        setEvents(data.event);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        if (editId) {
            await fetch(`/api/priest/event/${editId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });


        } else {
            await fetch("/api/priest/event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });


        }

        setForm({
            titleEnglish: "",
            titleTamil: "",
            descriptionEnglish: "",
            descriptionTamil: "",
            bannerImage: "",
            eventDate: "",
            location: "",
            createdBy: "",
        });

        setEditId("");

        fetchEvents();
    };

    const handleEdit = (event: any) => {
        setForm({
            titleEnglish: event.titleEnglish,
            titleTamil: event.titleTamil,
            descriptionEnglish: event.descriptionEnglish,
            descriptionTamil: event.descriptionTamil,
            bannerImage: event.bannerImage,
            eventDate: event.eventDate.split("T")[0],
            location: event.location,
            createdBy: event.createdBy,
        });

        setEditId(event._id);
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/priest/event/${id}`, {
            method: "DELETE",
        });

        fetchEvents();
    };

    return (
        <div className="p-10 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">
                Priest Event Dashboard
            </h1>

            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    name="titleEnglish"
                    placeholder="Title English"
                    value={form.titleEnglish}
                    onChange={handleChange}
                    className="border p-3 rounded"
                />

                <input
                    type="text"
                    name="titleTamil"
                    placeholder="தமிழ் தலைப்பு"
                    value={form.titleTamil}
                    onChange={handleChange}
                    className="border p-3 rounded"
                />

                <textarea
                    name="descriptionEnglish"
                    placeholder="Description English"
                    value={form.descriptionEnglish}
                    onChange={handleChange}
                    className="border p-3 rounded"
                />

                <textarea
                    name="descriptionTamil"
                    placeholder="தமிழ் விளக்கம்"
                    value={form.descriptionTamil}
                    onChange={handleChange}
                    className="border p-3 rounded"
                />

                <input
                    type="text"
                    name="bannerImage"
                    placeholder="Banner Image URL"
                    value={form.bannerImage}
                    onChange={handleChange}
                    className="border p-3 rounded"
                />

                <input
                    type="date"
                    name="eventDate"
                    value={form.eventDate}
                    onChange={handleChange}
                    className="border p-3 rounded"
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                    className="border p-3 rounded"
                />

                <input
                    type="text"
                    name="createdBy"
                    placeholder="Priest Name"
                    value={form.createdBy}
                    onChange={handleChange}
                    className="border p-3 rounded"
                />

                <button
                    onClick={handleSubmit}
                    className="bg-black text-white p-3 rounded"
                >
                    {editId ? "Update Event" : "Create Event"}
                </button>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">
                    Posted Events
                </h2>

                <div className="flex flex-col gap-4">
                    {events.map((event) => (
                        <div
                            key={event._id}
                            className="border p-4 rounded"
                        >
                            <h3 className="font-bold text-xl">
                                {event.titleEnglish}
                            </h3>

                            <p>{event.titleTamil}</p>

                            <p>{event.eventDate?.split("T")[0]}</p>

                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(event._id)
                                    }
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}