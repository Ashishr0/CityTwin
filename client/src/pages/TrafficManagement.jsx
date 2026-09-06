import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

const TrafficManagement = () => {
    const { user, token } = useAuth();

    const [traffic, setTraffic] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        intersectionId: "",
        lat: "",
        lng: "",
        vehicles: "",
        congestion: "",
        averageSpeed: "",
        averageWaitTime: "",
        signalStatus: "ACTIVE"
    });

    const canManage =
        user?.role === "ADMIN" ||
        user?.role === "CITY_OPERATOR";

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // FETCH TRAFFIC
    const fetchTraffic = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/traffic`,
                config
            );

            setTraffic(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load traffic data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTraffic();
        }
    }, [token]);

    // HANDLE INPUT
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // RESET FORM
    const resetForm = () => {
        setForm({
            intersectionId: "",
            lat: "",
            lng: "",
            vehicles: "",
            congestion: "",
            averageSpeed: "",
            averageWaitTime: "",
            signalStatus: "ACTIVE"
        });

        setEditingId(null);
    };

    // CREATE / UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setMessage("");
            setError("");

            const data = {
                intersectionId: form.intersectionId,
                location: {
                    lat: Number(form.lat),
                    lng: Number(form.lng)
                },
                vehicles: Number(form.vehicles),
                congestion: Number(form.congestion),
                averageSpeed: Number(form.averageSpeed),
                averageWaitTime: Number(form.averageWaitTime),
                signalStatus: form.signalStatus
            };

            if (editingId) {
                await axios.put(
                    `${API_URL}/traffic/${editingId}`,
                    data,
                    config
                );

                setMessage("Traffic data updated successfully");
            } else {
                await axios.post(
                    `${API_URL}/traffic`,
                    data,
                    config
                );

                setMessage("Traffic data created successfully");
            }

            resetForm();
            fetchTraffic();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to save traffic data"
            );
        }
    };

    // EDIT
    const handleEdit = (item) => {
        setEditingId(item._id);

        setForm({
            intersectionId: item.intersectionId || "",
            lat: item.location?.lat || "",
            lng: item.location?.lng || "",
            vehicles: item.vehicles || "",
            congestion: item.congestion || "",
            averageSpeed: item.averageSpeed || "",
            averageWaitTime: item.averageWaitTime || "",
            signalStatus: item.signalStatus || "ACTIVE"
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // DELETE
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this traffic record?"
        );

        if (!confirmed) return;

        try {
            setMessage("");
            setError("");

            await axios.delete(
                `${API_URL}/traffic/${id}`,
                config
            );

            setMessage("Traffic data deleted successfully");

            fetchTraffic();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete traffic data"
            );
        }
    };

    // ACCESS CONTROL
    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <p>Please login to continue.</p>
            </div>
        );
    }

    if (!canManage) {
        return (
            <div className="min-h-screen bg-slate-950 text-white p-6">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-xl p-8">
                    <h1 className="text-3xl font-bold mb-4">
                        Traffic Management
                    </h1>

                    <p className="text-red-400">
                        You do not have permission to manage traffic data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold">
                        Traffic Management
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Add, update and remove city traffic data.
                    </p>
                </div>

                {/* MESSAGE */}
                {message && (
                    <div className="mb-4 rounded-lg bg-green-900/40 border border-green-600 p-3 text-green-300">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-lg bg-red-900/40 border border-red-600 p-3 text-red-300">
                        {error}
                    </div>
                )}

                {/* FORM */}
                <div className="bg-slate-900 rounded-xl p-5 sm:p-6 mb-8">

                    <h2 className="text-xl font-semibold mb-5">
                        {editingId
                            ? "Update Traffic Data"
                            : "Add Traffic Data"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >

                        {/* INTERSECTION */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                Intersection ID
                            </label>

                            <input
                                type="text"
                                name="intersectionId"
                                value={form.intersectionId}
                                onChange={handleChange}
                                placeholder="INT-001"
                                required
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* LAT */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                Latitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="lat"
                                value={form.lat}
                                onChange={handleChange}
                                placeholder="26.8467"
                                required
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* LNG */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                Longitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="lng"
                                value={form.lng}
                                onChange={handleChange}
                                placeholder="80.9462"
                                required
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* VEHICLES */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                Vehicles
                            </label>

                            <input
                                type="number"
                                name="vehicles"
                                value={form.vehicles}
                                onChange={handleChange}
                                placeholder="120"
                                min="0"
                                required
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* CONGESTION */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                Congestion %
                            </label>

                            <input
                                type="number"
                                name="congestion"
                                value={form.congestion}
                                onChange={handleChange}
                                placeholder="65"
                                min="0"
                                max="100"
                                required
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* SPEED */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                Average Speed
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="averageSpeed"
                                value={form.averageSpeed}
                                onChange={handleChange}
                                placeholder="32"
                                min="0"
                                required
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* WAIT TIME */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                Average Wait Time
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="averageWaitTime"
                                value={form.averageWaitTime}
                                onChange={handleChange}
                                placeholder="45"
                                min="0"
                                required
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* SIGNAL */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                Signal Status
                            </label>

                            <select
                                name="signalStatus"
                                value={form.signalStatus}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            >
                                <option value="ACTIVE">
                                    ACTIVE
                                </option>

                                <option value="INACTIVE">
                                    INACTIVE
                                </option>

                                <option value="MAINTENANCE">
                                    MAINTENANCE
                                </option>
                            </select>
                        </div>

                        {/* BUTTONS */}
                        <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-3 mt-2">

                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium hover:bg-blue-700 transition"
                            >
                                {editingId
                                    ? "Update Traffic"
                                    : "Add Traffic"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg bg-slate-700 px-5 py-2.5 font-medium hover:bg-slate-600 transition"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>
                </div>

                {/* TABLE */}
                <div className="bg-slate-900 rounded-xl overflow-hidden">

                    <div className="p-5 border-b border-slate-800">
                        <h2 className="text-xl font-semibold">
                            Traffic Records
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-400">
                            Loading traffic data...
                        </div>
                    ) : traffic.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            No traffic records found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1000px]">

                                <thead className="bg-slate-800">

                                    <tr>
                                        <th className="text-left px-4 py-3">
                                            Intersection
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Vehicles
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Congestion
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Speed
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Wait Time
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Signal
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Actions
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {traffic.map((item) => (
                                        <tr
                                            key={item._id}
                                            className="border-t border-slate-800 hover:bg-slate-800/50"
                                        >

                                            <td className="px-4 py-3 font-medium">
                                                {item.intersectionId}
                                            </td>

                                            <td className="px-4 py-3">
                                                {item.vehicles}
                                            </td>

                                            <td className="px-4 py-3">
                                                {item.congestion}%
                                            </td>

                                            <td className="px-4 py-3">
                                                {item.averageSpeed}
                                            </td>

                                            <td className="px-4 py-3">
                                                {item.averageWaitTime}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        item.signalStatus === "ACTIVE"
                                                            ? "bg-green-900 text-green-300"
                                                            : item.signalStatus === "MAINTENANCE"
                                                            ? "bg-yellow-900 text-yellow-300"
                                                            : "bg-red-900 text-red-300"
                                                    }`}
                                                >
                                                    {item.signalStatus}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                        className="rounded-lg bg-yellow-600 px-3 py-1.5 text-sm hover:bg-yellow-700"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(item._id)
                                                        }
                                                        className="rounded-lg bg-red-600 px-3 py-1.5 text-sm hover:bg-red-700"
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

export default TrafficManagement;