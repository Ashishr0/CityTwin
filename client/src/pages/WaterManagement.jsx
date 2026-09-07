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
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 sm:p-5 lg:p-6">
            <div className="mx-auto w-full max-w-7xl min-w-0">

                {/* HEADER */}
                <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-500 p-6 text-white shadow-[0_10px_30px_rgba(6,182,212,0.15)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100">
                                Smart Water Infrastructure
                            </p>

                            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                                Water Management
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cyan-100">
                                Monitor reservoirs, water consumption, pipeline pressure, leakage and treatment plants across the city.
                            </p>
                        </div>

                        <span className="w-fit shrink-0 whitespace-nowrap rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
                            ● Water Active
                        </span>

                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Water Points
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {waterData.length}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-cyan-600">
                            Registered locations
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Reservoir Level
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {waterData.length
                                ? (
                                    waterData.reduce(
                                        (sum, item) =>
                                            sum + Number(item.reservoirLevel || 0),
                                        0
                                    ) / waterData.length
                                ).toFixed(1)
                                : "0.0"}%
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-blue-600">
                            Average storage level
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Daily Consumption
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {waterData
                                .reduce(
                                    (sum, item) =>
                                        sum + Number(item.dailyConsumption || 0),
                                    0
                                )
                                .toLocaleString()}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-indigo-600">
                            Total recorded usage
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Leakage Alerts
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {waterData.filter(
                                item => item.leakageDetected
                            ).length}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-red-500">
                            Locations with leakage
                        </p>
                    </div>

                </div>

                {/* FORM */}
                <div className="mb-6 rounded-2xl  bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.06)] sm:p-6">

                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">
                            <h2 className="text-lg font-bold leading-tight text-slate-800">
                                {editingId
                                    ? "Update Water Data"
                                    : "Add Water Data"}
                            </h2>

                            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                                Enter water infrastructure information for a city location.
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">

                            <span className="w-fit whitespace-nowrap rounded-full bg-cyan-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-cyan-600">
                                Water Data
                            </span>

                            {editingId && (
                                <button
                                    onClick={resetForm}
                                    type="button"
                                    className="shrink-0 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[9px] font-bold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm"
                                >
                                    Cancel Edit
                                </button>
                            )}

                        </div>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >

                        {/* LOCATION */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                required
                                placeholder="e.g. City Center"
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                            />
                        </div>

                        {/* RESERVOIR */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
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
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                            />
                        </div>

                        {/* CONSUMPTION */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
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
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                            />
                        </div>

                        {/* PRESSURE */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
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
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                            />
                        </div>

                        {/* PLANT STATUS */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Treatment Plant Status
                            </label>

                            <select
                                name="treatmentPlantStatus"
                                value={form.treatmentPlantStatus}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
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

                        {/* LEAKAGE */}
                        <div className="flex min-h-[68px] items-center rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 transition hover:border-red-200 hover:bg-red-50/40">

                            <input
                                type="checkbox"
                                id="leakageDetected"
                                name="leakageDetected"
                                checked={form.leakageDetected}
                                onChange={handleChange}
                                className="h-4 w-4 accent-red-500"
                            />

                            <label
                                htmlFor="leakageDetected"
                                className="ml-3 cursor-pointer"
                            >
                                <span className="block text-xs font-bold text-slate-800">
                                    Leakage Detected
                                </span>

                                <span className="block text-[9px] text-slate-500">
                                    Mark this location if leakage is present.
                                </span>
                            </label>

                        </div>

                        {/* SUBMIT */}
                        <div className="flex flex-wrap items-end gap-3 sm:col-span-2 lg:col-span-3">

                            <button
                                type="submit"
                                className="shrink-0 whitespace-nowrap rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-cyan-700 hover:to-blue-700 hover:shadow-md active:translate-y-0"
                            >
                                {editingId
                                    ? "Update Water Data"
                                    : "Add Water Data"}
                            </button>

                        </div>

                    </form>
                </div>

                {/* RECORDS */}
                <div className="overflow-hidden rounded-2xl  bg-white shadow-[0_4px_18px_rgba(15,23,42,0.06)]">

                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">

                        <div className="min-w-0">
                            <h2 className="text-lg font-bold leading-tight text-slate-800">
                                Water Records
                            </h2>

                            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                                Review reservoirs, pressure, leakage and treatment plant status.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">

                            <input
                                type="text"
                                placeholder="Search location..."
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 sm:w-64"
                                onChange={(e) => {
                                    const value = e.target.value.toLowerCase();

                                    document
                                        .querySelectorAll("[data-water-row]")
                                        .forEach(row => {
                                            row.style.display =
                                                row.innerText
                                                    .toLowerCase()
                                                    .includes(value)
                                                    ? ""
                                                    : "none";
                                        });
                                }}
                            />

                            <span className="w-fit shrink-0 whitespace-nowrap rounded-full bg-cyan-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-cyan-600">
                                {waterData.length} Total
                            </span>

                        </div>

                    </div>

                    {loading ? (
                        <div className="p-10 text-center">
                            <p className="text-sm font-semibold text-slate-700">
                                Loading water data...
                            </p>

                            <p className="mt-1 text-[10px] text-slate-500">
                                Connecting to the city water system.
                            </p>
                        </div>
                    ) : waterData.length === 0 ? (
                        <div className="p-10 text-center text-sm font-medium text-slate-600">
                            No water records found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1050px]">

                                <thead className="bg-slate-100">
                                    <tr>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Location
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Reservoir
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Consumption
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Pressure
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Leakage
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Plant Status
                                        </th>

                                        <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {waterData.map((item) => (
                                        <tr
                                            key={item._id}
                                            data-water-row
                                            className="border-t border-slate-200 transition-colors hover:bg-cyan-50/30"
                                        >

                                            <td className="px-4 py-4 text-xs font-bold text-slate-800">
                                                {item.location}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
                                                        Number(item.reservoirLevel) >= 60
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : Number(item.reservoirLevel) >= 30
                                                                ? "bg-amber-50 text-amber-600"
                                                                : "bg-red-50 text-red-500"
                                                    }`}
                                                >
                                                    {item.reservoirLevel}%
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-700">
                                                {item.dailyConsumption}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold text-blue-600">
                                                    {item.pipelinePressure}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">

                                                {item.leakageDetected ? (
                                                    <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-bold text-red-500">
                                                        Detected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-600">
                                                        Normal
                                                    </span>
                                                )}

                                            </td>

                                            <td className="px-4 py-4">

                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
                                                        item.treatmentPlantStatus === "OPERATIONAL"
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : item.treatmentPlantStatus === "WARNING"
                                                                ? "bg-amber-50 text-amber-600"
                                                                : "bg-red-50 text-red-500"
                                                    }`}
                                                >
                                                    {item.treatmentPlantStatus}
                                                </span>

                                            </td>

                                            <td className="px-4 py-4 text-right">

                                                <div className="flex items-center justify-end gap-2">

                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-[9px] font-bold text-blue-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-md active:translate-y-0"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[9px] font-bold text-red-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-500 hover:text-white hover:shadow-md active:translate-y-0"
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