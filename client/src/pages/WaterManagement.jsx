import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const WaterManagement = () => {
    const [waterData, setWaterData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        location: "",
        reservoirLevel: "",
        dailyConsumption: "",
        pipelinePressure: "",
        leakageDetected: false,
        treatmentPlantStatus: "OPERATIONAL"
    });

    const token = localStorage.getItem("city_twin_token");

    // -----------------------------
    // Fetch Water Data
    // -----------------------------

    const fetchWaterData = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API_URL}/water`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setWaterData(response.data);
        } catch (error) {
            console.error(
                "Failed to fetch water data:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to fetch water data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWaterData();
    }, []);

    // -----------------------------
    // Handle Input
    // -----------------------------

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // -----------------------------
    // Reset Form
    // -----------------------------

    const resetForm = () => {
        setForm({
            location: "",
            reservoirLevel: "",
            dailyConsumption: "",
            pipelinePressure: "",
            leakageDetected: false,
            treatmentPlantStatus: "OPERATIONAL"
        });

        setEditingId(null);
    };

    // -----------------------------
    // Create / Update
    // -----------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                location: form.location,
                reservoirLevel: Number(form.reservoirLevel),
                dailyConsumption: Number(form.dailyConsumption),
                pipelinePressure: Number(form.pipelinePressure),
                leakageDetected: form.leakageDetected,
                treatmentPlantStatus: form.treatmentPlantStatus
            };

            if (editingId) {
                await axios.put(
                    `${API_URL}/water/${editingId}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Water data updated successfully");
            } else {
                await axios.post(
                    `${API_URL}/water`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Water data created successfully");
            }

            resetForm();
            fetchWaterData();

        } catch (error) {
            console.error(
                "Water operation failed:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Water operation failed"
            );
        }
    };

    // -----------------------------
    // Edit
    // -----------------------------

    const handleEdit = (item) => {
        setEditingId(item._id);

        setForm({
            location: item.location || "",
            reservoirLevel: item.reservoirLevel ?? "",
            dailyConsumption: item.dailyConsumption ?? "",
            pipelinePressure: item.pipelinePressure ?? "",
            leakageDetected: item.leakageDetected || false,
            treatmentPlantStatus:
                item.treatmentPlantStatus || "OPERATIONAL"
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // -----------------------------
    // Delete
    // -----------------------------

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this water record?"
        );

        if (!confirmed) return;

        try {
            await axios.delete(
                `${API_URL}/water/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Water data deleted successfully");

            fetchWaterData();

        } catch (error) {
            console.error(
                "Delete failed:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete water data"
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-8">

            {/* HEADER */}
            <div className="mx-auto max-w-7xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold sm:text-4xl">
                        Water Management
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Monitor and manage city water infrastructure.
                    </p>
                </div>

                {/* FORM */}
                <div className="mb-8 rounded-xl bg-slate-800 p-5 shadow-lg sm:p-6">

                    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                        <h2 className="text-xl font-semibold">
                            {editingId
                                ? "Update Water Data"
                                : "Add Water Data"}
                        </h2>

                        {editingId && (
                            <button
                                onClick={resetForm}
                                type="button"
                                className="rounded-lg bg-slate-600 px-4 py-2 hover:bg-slate-500"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-5 md:grid-cols-2"
                    >

                        {/* Location */}
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                required
                                placeholder="e.g. City Center"
                                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Reservoir Level */}
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Reservoir Level (%)
                            </label>

                            <input
                                type="number"
                                name="reservoirLevel"
                                value={form.reservoirLevel}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                required
                                placeholder="e.g. 78"
                                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Daily Consumption */}
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Daily Consumption
                            </label>

                            <input
                                type="number"
                                name="dailyConsumption"
                                value={form.dailyConsumption}
                                onChange={handleChange}
                                min="0"
                                required
                                placeholder="e.g. 4500"
                                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Pipeline Pressure */}
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Pipeline Pressure
                            </label>

                            <input
                                type="number"
                                name="pipelinePressure"
                                value={form.pipelinePressure}
                                onChange={handleChange}
                                min="0"
                                required
                                placeholder="e.g. 55"
                                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Treatment Plant Status */}
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Treatment Plant Status
                            </label>

                            <select
                                name="treatmentPlantStatus"
                                value={form.treatmentPlantStatus}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                            >
                                <option value="OPERATIONAL">
                                    OPERATIONAL
                                </option>

                                <option value="WARNING">
                                    WARNING
                                </option>

                                <option value="OFFLINE">
                                    OFFLINE
                                </option>
                            </select>
                        </div>

                        {/* Leakage */}
                        <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-3">

                            <input
                                type="checkbox"
                                id="leakageDetected"
                                name="leakageDetected"
                                checked={form.leakageDetected}
                                onChange={handleChange}
                                className="h-5 w-5"
                            />

                            <label
                                htmlFor="leakageDetected"
                                className="ml-3 cursor-pointer text-sm text-slate-300"
                            >
                                Leakage Detected
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-2">

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700 sm:w-auto"
                            >
                                {editingId
                                    ? "Update Water Data"
                                    : "Add Water Data"}
                            </button>

                        </div>

                    </form>
                </div>

                {/* TABLE */}
                <div className="rounded-xl bg-slate-800 shadow-lg">

                    <div className="border-b border-slate-700 p-5 sm:p-6">
                        <h2 className="text-xl font-semibold">
                            Water Records
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-400">
                            Loading water data...
                        </div>
                    ) : waterData.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            No water records found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px] text-left">

                                <thead className="bg-slate-900 text-sm text-slate-300">

                                    <tr>
                                        <th className="px-5 py-4">
                                            Location
                                        </th>

                                        <th className="px-5 py-4">
                                            Reservoir
                                        </th>

                                        <th className="px-5 py-4">
                                            Consumption
                                        </th>

                                        <th className="px-5 py-4">
                                            Pressure
                                        </th>

                                        <th className="px-5 py-4">
                                            Leakage
                                        </th>

                                        <th className="px-5 py-4">
                                            Plant Status
                                        </th>

                                        <th className="px-5 py-4">
                                            Actions
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {waterData.map((item) => (

                                        <tr
                                            key={item._id}
                                            className="border-t border-slate-700 hover:bg-slate-700/40"
                                        >

                                            <td className="px-5 py-4 font-medium">
                                                {item.location}
                                            </td>

                                            <td className="px-5 py-4">
                                                {item.reservoirLevel}%
                                            </td>

                                            <td className="px-5 py-4">
                                                {item.dailyConsumption}
                                            </td>

                                            <td className="px-5 py-4">
                                                {item.pipelinePressure}
                                            </td>

                                            <td className="px-5 py-4">
                                                {item.leakageDetected ? (
                                                    <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-400">
                                                        Detected
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                                                        Normal
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs ${
                                                        item.treatmentPlantStatus ===
                                                        "OPERATIONAL"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : item.treatmentPlantStatus ===
                                                              "WARNING"
                                                            ? "bg-yellow-500/20 text-yellow-400"
                                                            : "bg-red-500/20 text-red-400"
                                                    }`}
                                                >
                                                    {item.treatmentPlantStatus}
                                                </span>

                                            </td>

                                            <td className="px-5 py-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                        className="rounded-lg bg-yellow-600 px-3 py-2 text-sm hover:bg-yellow-700"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item._id
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-600 px-3 py-2 text-sm hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default WaterManagement;