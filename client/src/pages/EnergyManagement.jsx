import { useEffect, useState } from "react";

const EnergyManagement = () => {
    const [energyData, setEnergyData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        location: "",
        consumption: "",
        residential: "",
        commercial: "",
        industrial: "",
        public: "",
        renewablePercentage: ""
    });

    const token = localStorage.getItem("city_twin_token");

    const fetchEnergyData = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/energy",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch energy data"
                );
            }

            setEnergyData(data);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    useEffect(() => {
        fetchEnergyData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData({
            location: "",
            consumption: "",
            residential: "",
            commercial: "",
            industrial: "",
            public: "",
            renewablePercentage: ""
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const url = editingId
                ? `http://localhost:5000/api/energy/${editingId}`
                : "http://localhost:5000/api/energy";

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    location: formData.location,
                    consumption: Number(formData.consumption),
                    residential: Number(formData.residential),
                    commercial: Number(formData.commercial),
                    industrial: Number(formData.industrial),
                    public: Number(formData.public),
                    renewablePercentage: Number(
                        formData.renewablePercentage
                    )
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save energy data"
                );
            }

            alert(
                editingId
                    ? "Energy data updated successfully"
                    : "Energy data created successfully"
            );

            resetForm();
            fetchEnergyData();
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);

        setFormData({
            location: item.location || "",
            consumption: item.consumption ?? "",
            residential: item.residential ?? "",
            commercial: item.commercial ?? "",
            industrial: item.industrial ?? "",
            public: item.public ?? "",
            renewablePercentage:
                item.renewablePercentage ?? ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this energy record?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/energy/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete energy data"
                );
            }

            alert("Energy data deleted successfully");

            fetchEnergyData();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-8">

            <div className="mx-auto max-w-7xl">

                <h1 className="mb-8 text-3xl font-bold sm:text-4xl">
                    Energy Management
                </h1>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">

                    <h2 className="mb-6 text-xl font-semibold">
                        {editingId
                            ? "Update Energy Data"
                            : "Add Energy Data"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    >

                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="consumption"
                            placeholder="Total Consumption"
                            value={formData.consumption}
                            onChange={handleChange}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="residential"
                            placeholder="Residential"
                            value={formData.residential}
                            onChange={handleChange}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="commercial"
                            placeholder="Commercial"
                            value={formData.commercial}
                            onChange={handleChange}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="industrial"
                            placeholder="Industrial"
                            value={formData.industrial}
                            onChange={handleChange}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="public"
                            placeholder="Public"
                            value={formData.public}
                            onChange={handleChange}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="renewablePercentage"
                            placeholder="Renewable %"
                            value={formData.renewablePercentage}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-4 sm:flex-row">

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-500 disabled:opacity-50"
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Data"
                                    : "Add Data"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg bg-slate-700 px-5 py-3 font-semibold transition hover:bg-slate-600"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>
                </div>

                <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">

                    <h2 className="mb-6 text-xl font-semibold">
                        Energy Records
                    </h2>

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[850px] text-left">

                            <thead className="border-b border-slate-700 text-sm text-slate-400">

                                <tr>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Consumption</th>
                                    <th className="px-4 py-3">Residential</th>
                                    <th className="px-4 py-3">Commercial</th>
                                    <th className="px-4 py-3">Industrial</th>
                                    <th className="px-4 py-3">Public</th>
                                    <th className="px-4 py-3">Renewable %</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {energyData.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-4 py-8 text-center text-slate-500"
                                        >
                                            No energy records found
                                        </td>
                                    </tr>

                                ) : (

                                    energyData.map((item) => (

                                        <tr
                                            key={item._id}
                                            className="border-b border-slate-800"
                                        >

                                            <td className="px-4 py-4">
                                                {item.location}
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.consumption}
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.residential}
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.commercial}
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.industrial}
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.public}
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.renewablePercentage}%
                                            </td>

                                            <td className="px-4 py-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                        className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-500"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(item._id)
                                                        }
                                                        className="rounded bg-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-500"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default EnergyManagement;
