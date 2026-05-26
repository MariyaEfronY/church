"use client";

import { useEffect, useState } from "react";

export default function MassTimingPage() {

    // MASS STATE
    const [masses, setMasses] = useState<any[]>([]);

    // EDIT STATE
    const [editingId, setEditingId] = useState("");

    // FORM STATE
    const [formData, setFormData] = useState({
        titleTamil: "",
        massTypeTamil: "வழக்கமான திருப்பலி",
        dayTamil: "",
        massDate: "",
        timeTamil: "",
        placeTypeTamil: "பங்கு ஆலயம்",
        placeNameTamil: "",
        priestNameTamil: "",
        descriptionTamil: "",
    });

    // GET ALL MASS
    const fetchMasses = async () => {

        try {

            const res = await fetch(
                "/api/priest/MassTiming"
            );

            const data = await res.json();

            setMasses(data.data);

        } catch (error) {

            console.log(error);

        }

    };

    // LOAD DATA
    useEffect(() => {

        fetchMasses();

    }, []);

    // HANDLE INPUT
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
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
                    `/api/priest/MassTiming/${editingId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(formData),
                    }
                );

                alert("திருப்பலி புதுப்பிக்கப்பட்டது");

            }

            // CREATE
            else {

                await fetch(
                    "/api/priest/MassTiming",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(formData),
                    }
                );

                alert("திருப்பலி சேர்க்கப்பட்டது");

            }

            // RESET
            setFormData({
                titleTamil: "",
                massTypeTamil:
                    "வழக்கமான திருப்பலி",
                dayTamil: "",
                massDate: "",
                timeTamil: "",
                placeTypeTamil:
                    "பங்கு ஆலயம்",
                placeNameTamil: "",
                priestNameTamil: "",
                descriptionTamil: "",
            });

            setEditingId("");

            fetchMasses();

        } catch (error) {

            console.log(error);

        }

    };

    // DELETE MASS
    const deleteMass = async (
        id: string
    ) => {

        const confirmDelete = confirm(
            "நீக்க வேண்டுமா?"
        );

        if (!confirmDelete) return;

        try {

            await fetch(
                `/api/priest/MassTiming/${id}`,
                {
                    method: "DELETE",
                }
            );

            alert("திருப்பலி நீக்கப்பட்டது");

            fetchMasses();

        } catch (error) {

            console.log(error);

        }

    };

    // EDIT MASS
    const editMass = (mass: any) => {

        setEditingId(mass._id);

        setFormData({
            titleTamil: mass.titleTamil,

            massTypeTamil:
                mass.massTypeTamil,

            dayTamil: mass.dayTamil,

            massDate:
                mass.massDate?.split("T")[0] || "",

            timeTamil: mass.timeTamil,

            placeTypeTamil:
                mass.placeTypeTamil,

            placeNameTamil:
                mass.placeNameTamil,

            priestNameTamil:
                mass.priestNameTamil,

            descriptionTamil:
                mass.descriptionTamil,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };

    return (

        <div className="max-w-5xl mx-auto p-6 space-y-8">

            {/* FORM */}

            <div className="bg-white shadow-lg rounded-2xl p-6 border">

                <h1 className="text-3xl font-bold mb-6">

                    ⛪ திருப்பலி மேலாண்மை

                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* TITLE */}

                    <div>

                        <label className="block mb-2 font-medium">
                            திருப்பலி பெயர்
                        </label>

                        <input
                            type="text"
                            name="titleTamil"
                            placeholder="திருப்பலி பெயர்"
                            value={formData.titleTamil}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl"
                            required
                        />

                    </div>

                    {/* MASS TYPE */}

                    <div>

                        <label className="block mb-2 font-medium">
                            திருப்பலி வகை
                        </label>

                        <select
                            name="massTypeTamil"
                            value={formData.massTypeTamil}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl"
                        >

                            <option>
                                வழக்கமான திருப்பலி
                            </option>

                            <option>
                                சிறப்பு திருப்பலி
                            </option>

                        </select>

                    </div>

                    {/* DAY */}

                    <div>

                        <label className="block mb-2 font-medium">
                            கிழமை
                        </label>

                        <input
                            type="text"
                            name="dayTamil"
                            placeholder="ஞாயிற்றுக்கிழமை"
                            value={formData.dayTamil}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl"
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
                            name="massDate"
                            value={formData.massDate}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl"
                        />

                    </div>

                    {/* TIME */}

                    <div>

                        <label className="block mb-2 font-medium">
                            நேரம்
                        </label>

                        <input
                            type="text"
                            name="timeTamil"
                            placeholder="07:00 காலை"
                            value={formData.timeTamil}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl"
                            required
                        />

                    </div>

                    {/* PLACE TYPE */}

                    <div>

                        <label className="block mb-2 font-medium">
                            ஆலய வகை
                        </label>

                        <select
                            name="placeTypeTamil"
                            value={formData.placeTypeTamil}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl"
                        >

                            <option>
                                பங்கு ஆலயம்
                            </option>

                            <option>
                                கிராம ஆலயம்
                            </option>

                        </select>

                    </div>

                    {/* PLACE */}

                    <div>

                        <label className="block mb-2 font-medium">
                            ஆலய பெயர்
                        </label>

                        <input
                            type="text"
                            name="placeNameTamil"
                            placeholder="ஆலய பெயர்"
                            value={formData.placeNameTamil}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl"
                            required
                        />

                    </div>

                    {/* PRIEST */}

                    <div>

                        <label className="block mb-2 font-medium">
                            அருட்தந்தை பெயர்
                        </label>

                        <input
                            type="text"
                            name="priestNameTamil"
                            placeholder="அருட்தந்தை பெயர்"
                            value={formData.priestNameTamil}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl"
                        />

                    </div>

                    {/* DESCRIPTION */}

                    <div>

                        <label className="block mb-2 font-medium">
                            விளக்கம்
                        </label>

                        <textarea
                            name="descriptionTamil"
                            placeholder="திருப்பலி விளக்கம்"
                            value={formData.descriptionTamil}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl"
                            rows={4}
                        />

                    </div>

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
                                        titleTamil: "",
                                        massTypeTamil:
                                            "வழக்கமான திருப்பலி",
                                        dayTamil: "",
                                        massDate: "",
                                        timeTamil: "",
                                        placeTypeTamil:
                                            "பங்கு ஆலயம்",
                                        placeNameTamil: "",
                                        priestNameTamil: "",
                                        descriptionTamil: "",
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

            {/* MASS LIST */}

            <div className="space-y-5">

                {masses.map((mass) => (

                    <div
                        key={mass._id}
                        className="bg-white shadow rounded-2xl p-6 border"
                    >

                        <h2 className="text-2xl font-bold">

                            {mass.titleTamil}

                        </h2>

                        <p className="mt-3">
                            {mass.massTypeTamil}
                        </p>

                        <p>
                            {mass.dayTamil}
                        </p>

                        <p>
                            {mass.timeTamil}
                        </p>

                        <p>
                            {mass.placeNameTamil}
                        </p>

                        <p>
                            {mass.priestNameTamil}
                        </p>

                        {mass.descriptionTamil && (

                            <p className="mt-3 text-gray-600">

                                {mass.descriptionTamil}

                            </p>

                        )}

                        {/* ACTION BUTTONS */}

                        <div className="flex gap-3 mt-6">

                            <button
                                onClick={() => editMass(mass)}
                                className="bg-blue-500 text-white px-5 py-2 rounded-xl"
                            >

                                திருத்து

                            </button>

                            <button
                                onClick={() =>
                                    deleteMass(mass._id)
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