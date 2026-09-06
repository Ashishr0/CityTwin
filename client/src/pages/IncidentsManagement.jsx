import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

const IncidentsManagement = () => {
    const { user, token } = useAuth();

    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        type: "ACCIDENT",
        title: "",
        description: "",
        priority: "MEDIUM",
        lat: "",
        lng: "",
        status: "ACTIVE",
        reportedBy: ""
    });

    const canManage =
        user?.role === "ADMIN" ||
        user?.role === "CITY_OPERATOR";

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // Fetch incidents
    const fetchIncidents = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/incidents`,
                config
            );

            setIncidents(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch incidents"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchIncidents();
        }
    }, [token]);

    // Handle form input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Reset form
    const resetForm = () => {
        setForm({
            type: "ACCIDENT",
            title: "",
            description: "",
            priority: "MEDIUM",
            lat: "",
            lng: "",
            status: "ACTIVE",
            reportedBy: ""
        });

        setEditingId(null);
    };

    // Create / Update
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canManage) {
            setError("You do not have permission to manage incidents.");
            return;
        }

        try {
            setMessage("");
            setError("");

            const data = {
                type: form.type,
                title: form.title,
                description: form.description,
                priority: form.priority,
                status: form.status,
                reportedBy: form.reportedBy,
                location: {
                    lat: Number(form.lat),
                    lng: Number(form.lng)
                }
            };

            if (editingId) {
                const response = await axios.put(
                    `${API_URL}/incidents/${editingId}`,
                    data,
                    config
                );

                setMessage(
                    response.data.message ||
                    "Incident updated successfully"
                );
            } else {
                const response = await axios.post(
                    `${API_URL}/incidents`,
                    data,
                    config
                );

                setMessage(
                    response.data.message ||
                    "Incident created successfully"
                );
            }

            resetForm();
            fetchIncidents();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to save incident"
            );
        }
    };

    // Edit incident
    const handleEdit = (incident) => {
        setEditingId(incident._id);

        setForm({
            type: incident.type || "ACCIDENT",
            title: incident.title || "",
            description: incident.description || "",
            priority: incident.priority || "MEDIUM",
            lat: incident.location?.lat ?? "",
            lng: incident.location?.lng ?? "",
            status: incident.status || "ACTIVE",
            reportedBy: incident.reportedBy || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete incident
    const handleDelete = async (id) => {
        if (!canManage) {
            setError("You do not have permission to delete incidents.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this incident?"
        );

        if (!confirmed) return;

        try {
            setMessage("");
            setError("");

            const response = await axios.delete(
                `${API_URL}/incidents/${id}`,
                config
            );

            setMessage(
                response.data.message ||
                "Incident deleted successfully"
            );

            fetchIncidents();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete incident"
            );
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 text-white">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-3xl font-bold">
                        Incidents Management
                    </h1>

                    <p className="mt-4 text-slate-400">
                        Please login to access incident management.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold sm:text-4xl">
                        Incidents Management
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Monitor and manage city incidents.
                    </p>
                </div>

                {/* ACCESS DENIED */}
                {!canManage && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                        You have view-only access to incidents.
                    </div>
                )}

                {/* MESSAGES */}
                {message && (
                    <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                        {error}
                    </div>
                )}

                {/* FORM */}
                {canManage && (
                    <div className="mb-8 rounded-xl bg-slate-800 p-4 sm:p-6">
                        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <h2 className="text-xl font-semibold">
                                {editingId
                                    ? "Update Incident"
                                    : "Create Incident"}
                            </h2>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg bg-slate-700 px-4 py-2 hover:bg-slate-600"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        >

                            {/* TYPE */}
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Incident Type
                                </label>

                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="ACCIDENT">
                                        ACCIDENT
                                    </option>

                                    <option value="FIRE">
                                        FIRE
                                    </option>

                                    <option value="WATER_LEAK">
                                        WATER LEAK
                                    </option>

                                    <option value="POWER_OUTAGE">
                                        POWER OUTAGE
                                    </option>

                                    <option value="POLLUTION">
                                        POLLUTION
                                    </option>

                                    <option value="OTHER">
                                        OTHER
                                    </option>
                                </select>
                            </div>

                            {/* TITLE */}
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter incident title"
                                    required
                                    className="w-full rounded-lg bg-slate-700 px-4 py-3 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm text-slate-300">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Describe the incident"
                                    rows="3"
                                    className="w-full rounded-lg bg-slate-700 px-4 py-3 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* PRIORITY */}
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="LOW">
                                        LOW
                                    </option>

                                    <option value="MEDIUM">
                                        MEDIUM
                                    </option>

                                    <option value="HIGH">
                                        HIGH
                                    </option>

                                    <option value="CRITICAL">
                                        CRITICAL
                                    </option>
                                </select>
                            </div>

                            {/* STATUS */}
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="ACTIVE">
                                        ACTIVE
                                    </option>

                                    <option value="IN_PROGRESS">
                                        IN PROGRESS
                                    </option>

                                    <option value="RESOLVED">
                                        RESOLVED
                                    </option>
                                </select>
                            </div>

                            {/* LATITUDE */}
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Latitude
                                </label>

                                <input
                                    type="number"
                                    step="any"
                                    name="lat"
                                    value={form.lat}
                                    onChange={handleChange}
                                    placeholder="28.6139"
                                    required
                                    className="w-full rounded-lg bg-slate-700 px-4 py-3 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* LONGITUDE */}
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Longitude
                                </label>

                                <input
                                    type="number"
                                    step="any"
                                    name="lng"
                                    value={form.lng}
                                    onChange={handleChange}
                                    placeholder="77.2090"
                                    required
                                    className="w-full rounded-lg bg-slate-700 px-4 py-3 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* REPORTED BY */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm text-slate-300">
                                    Reported By
                                </label>

                                <input
                                    type="text"
                                    name="reportedBy"
                                    value={form.reportedBy}
                                    onChange={handleChange}
                                    placeholder="Admin / Operator / Citizen"
                                    className="w-full rounded-lg bg-slate-700 px-4 py-3 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* SUBMIT */}
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-700 sm:w-auto"
                                >
                                    {editingId
                                        ? "Update Incident"
                                        : "Create Incident"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* INCIDENT TABLE */}
                <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            City Incidents
                        </h2>

                        <span className="rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-300">
                            {incidents.length} Total
                        </span>
                    </div>

                    {loading ? (
                        <p className="text-slate-400">
                            Loading incidents...
                        </p>
                    ) : incidents.length === 0 ? (
                        <p className="text-slate-400">
                            No incidents found.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] text-left">
                                <thead>
                                    <tr className="border-b border-slate-700 text-sm text-slate-400">
                                        <th className="px-4 py-3">
                                            Type
                                        </th>

                                        <th className="px-4 py-3">
                                            Title
                                        </th>

                                        <th className="px-4 py-3">
                                            Priority
                                        </th>

                                        <th className="px-4 py-3">
                                            Status
                                        </th>

                                        <th className="px-4 py-3">
                                            Location
                                        </th>

                                        <th className="px-4 py-3">
                                            Reported By
                                        </th>

                                        {canManage && (
                                            <th className="px-4 py-3">
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>

                                <tbody>
                                    {incidents.map((incident) => (
                                        <tr
                                            key={incident._id}
                                            className="border-b border-slate-700 last:border-0 hover:bg-slate-700/40"
                                        >
                                            <td className="px-4 py-4">
                                                {incident.type}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="font-medium">
                                                    {incident.title}
                                                </div>

                                                {incident.description && (
                                                    <div className="mt-1 max-w-xs truncate text-sm text-slate-400">
                                                        {incident.description}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-4 py-4">
                                                {incident.priority}
                                            </td>

                                            <td className="px-4 py-4">
                                                {incident.status}
                                            </td>

                                            <td className="px-4 py-4">
                                                {incident.location?.lat},{" "}
                                                {incident.location?.lng}
                                            </td>

                                            <td className="px-4 py-4">
                                                {incident.reportedBy || "-"}
                                            </td>

                                            {canManage && (
                                                <td className="px-4 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    incident
                                                                )
                                                            }
                                                            className="rounded-lg bg-yellow-600 px-3 py-2 text-sm hover:bg-yellow-700"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    incident._id
                                                                )
                                                            }
                                                            className="rounded-lg bg-red-600 px-3 py-2 text-sm hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
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

export default IncidentsManagement;