"use client";

import { useEffect, useState } from "react";

export default function BibleVersePage() {

    // VERSES STATE
    const [verses, setVerses] = useState<any[]>([]);

    // EDIT STATE
    const [editingId, setEditingId] = useState("");

    // FORM STATE
    const [formData, setFormData] = useState({
        verseTamil: "",
        referenceTamil: "",
        verseDate: "",
        isTodayVerse: false,
    });

    // GET ALL VERSES
    const fetchVerses = async () => {

        try {

            const res = await fetch(
                "/api/priest/BibleVerse"
            );

            const data = await res.json();

            setVerses(data.data);

        } catch (error) {

            console.log(error);

        }

    };

    // LOAD DATA
    useEffect(() => {

        fetchVerses();

    }, []);

    // HANDLE INPUT CHANGE
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement
        >
    ) => {

        const { name, value, type } = e.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        });

    };

    // CREATE OR UPDATE
    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            // UPDATE
            if (editingId) {

                await fetch(
                    `/api/priest/BibleVerse/${editingId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(formData),
                    }
                );

                alert("இறைவசனம் புதுப்பிக்கப்பட்டது");

            }

            // CREATE
            else {

                await fetch(
                    "/api/priest/BibleVerse",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(formData),
                    }
                );

                alert("இறைவசனம் சேர்க்கப்பட்டது");

            }

            // RESET FORM
            setFormData({
                verseTamil: "",
                referenceTamil: "",
                verseDate: "",
                isTodayVerse: false,
            });

            // RESET EDIT MODE
            setEditingId("");

            // REFRESH
            fetchVerses();

        } catch (error) {

            console.log(error);

        }

    };

    // DELETE VERSE
    const deleteVerse = async (
        id: string
    ) => {

        const confirmDelete = confirm(
            "நீக்க வேண்டுமா?"
        );

        if (!confirmDelete) return;

        try {

            await fetch(
                `/api/priest/BibleVerse/${id}`,
                {
                    method: "DELETE",
                }
            );

            alert("நீக்கப்பட்டது");

            fetchVerses();

        } catch (error) {

            console.log(error);

        }

    };

    // EDIT VERSE
    const editVerse = (verse: any) => {

        setEditingId(verse._id);

        setFormData({
            verseTamil: verse.verseTamil,
            referenceTamil:
                verse.referenceTamil,

            verseDate:
                verse.verseDate?.split("T")[0],

            isTodayVerse:
                verse.isTodayVerse,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };

    return (

        <div className="max-w-5xl mx-auto p-6 space-y-8">

            {/* FORM SECTION */}

            <div className="bg-white shadow-lg rounded-2xl p-6 border">

                <h1 className="text-3xl font-bold mb-6">

                    📖 இறைவசன மேலாண்மை

                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* VERSE */}

                    <div>

                        <label className="block mb-2 font-medium">
                            இறைவசனம்
                        </label>

                        <textarea
                            name="verseTamil"
                            placeholder="இறைவசனம் எழுதவும்"
                            value={formData.verseTamil}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl outline-none"
                            rows={4}
                            required
                        />

                    </div>

                    {/* REFERENCE */}

                    <div>

                        <label className="block mb-2 font-medium">
                            வசன குறிப்பு
                        </label>

                        <input
                            type="text"
                            name="referenceTamil"
                            placeholder="உதா: சங்கீதம் 23:1"
                            value={formData.referenceTamil}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl outline-none"
                            required
                        />

                    </div>

                    {/* DATE */}

                    <div>

                        <label className="block mb-2 font-medium">
                            தேதி
                        </label>

                        <input
                            type="date"
                            name="verseDate"
                            value={formData.verseDate}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl outline-none"
                            required
                        />

                    </div>

                    {/* TODAY VERSE */}

                    <label className="flex items-center gap-3">

                        <input
                            type="checkbox"
                            name="isTodayVerse"
                            checked={formData.isTodayVerse}
                            onChange={handleChange}
                        />

                        இன்றைய இறைவசனம்

                    </label>

                    {/* BUTTONS */}

                    <div className="flex gap-4">

                        <button
                            type="submit"
                            className="bg-black text-white px-6 py-3 rounded-xl"
                        >

                            {editingId
                                ? "புதுப்பிக்கவும்"
                                : "சேமிக்கவும்"}

                        </button>

                        {editingId && (

                            <button
                                type="button"
                                onClick={() => {

                                    setEditingId("");

                                    setFormData({
                                        verseTamil: "",
                                        referenceTamil: "",
                                        verseDate: "",
                                        isTodayVerse: false,
                                    });

                                }}
                                className="bg-gray-300 px-6 py-3 rounded-xl"
                            >

                                ரத்து செய்

                            </button>

                        )}

                    </div>

                </form>

            </div>

            {/* VERSE LIST */}

            <div className="space-y-5">

                {verses.map((verse) => (

                    <div
                        key={verse._id}
                        className="bg-white shadow rounded-2xl p-6 border"
                    >

                        {/* VERSE */}

                        <p className="text-lg leading-8">

                            {verse.verseTamil}

                        </p>

                        {/* REFERENCE */}

                        <p className="mt-4 text-gray-600">

                            {verse.referenceTamil}

                        </p>

                        {/* DATE */}

                        <p className="mt-2 text-sm text-gray-500">

                            தேதி :
                            {" "}

                            {new Date(
                                verse.verseDate
                            ).toLocaleDateString()}

                        </p>

                        {/* TODAY BADGE */}

                        {verse.isTodayVerse && (

                            <div className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm">

                                இன்றைய இறைவசனம்

                            </div>

                        )}

                        {/* ACTION BUTTONS */}

                        <div className="flex gap-3 mt-6">

                            <button
                                onClick={() => editVerse(verse)}
                                className="bg-blue-500 text-white px-5 py-2 rounded-xl"
                            >

                                திருத்து

                            </button>

                            <button
                                onClick={() =>
                                    deleteVerse(verse._id)
                                }
                                className="bg-red-500 text-white px-5 py-2 rounded-xl"
                            >

                                நீக்கு

                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
}