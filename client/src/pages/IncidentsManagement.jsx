import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_URL;

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
            <div className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6">
                <div className="mx-auto w-full max-w-7xl min-w-0">
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
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 sm:p-5 lg:p-6">
            <div className="mx-auto w-full max-w-7xl min-w-0">

                {/* HEADER */}
                <div className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 p-6 text-white shadow-[0_10px_30px_rgba(239,68,68,0.15)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-100">
                                Emergency Monitoring
                            </p>

                            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                                Incidents Management
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-red-100">
                                Monitor, create and manage incidents across the city.
                            </p>
                        </div>

                        <span className="w-fit shrink-0 whitespace-nowrap rounded-full border border-emerald-200/40 bg-emerald-400/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-100">
                            ● System Active
                        </span>
                    </div>
                </div>

                {/* ACCESS */}
                {!canManage && (
                    <div className="mb-5 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm font-medium text-orange-700 shadow-sm">
                        You have view-only access to incidents.
                    </div>
                )}

                {/* MESSAGES */}
                {message && (
                    <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700 shadow-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 shadow-sm">
                        {error}
                    </div>
                )}

                {/* KPI CARDS */}
                <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Total Incidents
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {incidents.length}
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-blue-600">
                            Registered incidents
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Active
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {incidents.filter(v => v.status === "ACTIVE").length}
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-red-600">
                            Requiring attention
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Critical
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {incidents.filter(v => v.priority === "CRITICAL").length}
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-red-600">
                            Highest priority
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Resolved
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {incidents.filter(v => v.status === "RESOLVED").length}
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-emerald-600">
                            Successfully handled
                        </p>
                    </div>

                </div>

                {/* FORM */}
                {canManage && (
                    <div className="mb-6 rounded-2xl  bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.06)] sm:p-6">

                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <h2 className="text-lg font-bold leading-tight text-slate-800">
                                    {editingId ? "Update Incident" : "Add Incident Data"}
                                </h2>

                                <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                                    Enter incident details, priority, status and location.
                                </p>
                            </div>

                            <div className="flex shrink-0 flex-wrap gap-2">
                                <span className="w-fit whitespace-nowrap rounded-full bg-red-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-red-600">
                                    Incident Data
                                </span>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="shrink-0 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[9px] font-bold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        >

                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Incident Type
                                </label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                                >
                                    <option value="ACCIDENT">ACCIDENT</option>
                                    <option value="FIRE">FIRE</option>
                                    <option value="WATER_LEAK">WATER LEAK</option>
                                    <option value="POWER_OUTAGE">POWER OUTAGE</option>
                                    <option value="POLLUTION">POLLUTION</option>
                                    <option value="OTHER">OTHER</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter incident title"
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Describe the incident"
                                    rows="3"
                                    className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                                >
                                    <option value="LOW">LOW</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="HIGH">HIGH</option>
                                    <option value="CRITICAL">CRITICAL</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="IN_PROGRESS">IN PROGRESS</option>
                                    <option value="RESOLVED">RESOLVED</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
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
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
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
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Reported By
                                </label>
                                <input
                                    type="text"
                                    name="reportedBy"
                                    value={form.reportedBy}
                                    onChange={handleChange}
                                    placeholder="Admin / Operator / Citizen"
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2 md:col-span-2">
                                <button
                                    type="submit"
                                    className="shrink-0 whitespace-nowrap rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-red-700 hover:to-orange-600 hover:shadow-md active:translate-y-0"
                                >
                                    {editingId ? "Update Incident" : "Add Incident"}
                                </button>
                            </div>

                        </form>
                    </div>
                )}

                {/* INCIDENT RECORDS */}
                <div className="overflow-hidden rounded-2xl  bg-white shadow-[0_4px_18px_rgba(15,23,42,0.06)]">

                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">

                        <div className="min-w-0">
                            <h2 className="text-lg font-bold leading-tight text-slate-800">
                                City Incidents
                            </h2>
                            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                                Monitor incident type, priority, status and location.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                            <input
                                type="text"
                                placeholder="Search incidents..."
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 sm:w-64"
                                onChange={(e) => {
                                    const value = e.target.value.toLowerCase();

                                    document
                                        .querySelectorAll("[data-incident-row]")
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

                            <span className="w-fit shrink-0 whitespace-nowrap rounded-full bg-red-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-red-600">
                                {incidents.length} Total
                            </span>
                        </div>

                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-sm font-medium text-slate-600">
                            Loading incidents...
                        </div>
                    ) : incidents.length === 0 ? (
                        <div className="p-10 text-center text-sm font-medium text-slate-600">
                            No incidents found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1100px]">

                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Type
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Title
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Priority
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Status
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Location
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Reported By
                                        </th>

                                        {canManage && (
                                            <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>

                                <tbody>
                                    {incidents.map((incident) => (
                                        <tr
                                            key={incident._id}
                                            data-incident-row
                                            className="border-t border-slate-200 transition-colors hover:bg-red-50/30"
                                        >

                                            <td className="px-4 py-4 text-xs font-bold text-slate-800">
                                                {incident.type}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="max-w-xs text-sm font-bold text-slate-800">
                                                    {incident.title}
                                                </div>

                                                {incident.description && (
                                                    <div className="mt-1 max-w-xs truncate text-[10px] text-slate-600">
                                                        {incident.description}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
                                                        incident.priority === "CRITICAL"
                                                            ? "bg-red-50 text-red-600"
                                                            : incident.priority === "HIGH"
                                                                ? "bg-orange-50 text-orange-600"
                                                                : incident.priority === "MEDIUM"
                                                                    ? "bg-amber-50 text-amber-600"
                                                                    : "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {incident.priority}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
                                                        incident.status === "ACTIVE"
                                                            ? "bg-red-50 text-red-600"
                                                            : incident.status === "IN_PROGRESS"
                                                                ? "bg-blue-50 text-blue-600"
                                                                : "bg-emerald-50 text-emerald-600"
                                                    }`}
                                                >
                                                    {incident.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-600">
                                                {incident.location?.lat},{" "}
                                                {incident.location?.lng}
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-700">
                                                {incident.reportedBy || "-"}
                                            </td>

                                            {canManage && (
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">

                                                        <button
                                                            onClick={() => handleEdit(incident)}
                                                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-[9px] font-bold text-blue-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-md active:translate-y-0"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(incident._id)}
                                                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[9px] font-bold text-red-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-500 hover:text-white hover:shadow-md active:translate-y-0"
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