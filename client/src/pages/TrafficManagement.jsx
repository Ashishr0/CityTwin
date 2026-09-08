import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_URL;

const TrafficManagement = () => {
    const { user, token } = useAuth();

    const [traffic, setTraffic] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

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

    // =========================
    // FETCH TRAFFIC
    // =========================

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

    // =========================
    // INPUT
    // =========================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // RESET
    // =========================

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

    // =========================
    // CREATE / UPDATE
    // =========================

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

                setMessage("Traffic data updated successfully.");
            } else {
                await axios.post(
                    `${API_URL}/traffic`,
                    data,
                    config
                );

                setMessage("Traffic data created successfully.");
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

    // =========================
    // EDIT
    // =========================

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

    // =========================
    // DELETE
    // =========================

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

            setMessage("Traffic data deleted successfully.");

            fetchTraffic();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete traffic data"
            );
        }
    };

    // =========================
    // FILTER
    // =========================

    const filteredTraffic = useMemo(() => {
        return traffic.filter((item) => {
            const matchesSearch =
                item.intersectionId
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "ALL" ||
                item.signalStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [traffic, search, statusFilter]);

    // =========================
    // KPI
    // =========================

    const totalVehicles = traffic.reduce(
        (sum, item) => sum + Number(item.vehicles || 0),
        0
    );

    const averageCongestion = traffic.length
        ? (
            traffic.reduce(
                (sum, item) => sum + Number(item.congestion || 0),
                0
            ) / traffic.length
        ).toFixed(1)
        : 0;

    const averageSpeed = traffic.length
        ? (
            traffic.reduce(
                (sum, item) => sum + Number(item.averageSpeed || 0),
                0
            ) / traffic.length
        ).toFixed(1)
        : 0;

    const activeSignals = traffic.filter(
        item => item.signalStatus === "ACTIVE"
    ).length;

    const maintenanceSignals = traffic.filter(
        item => item.signalStatus === "MAINTENANCE"
    ).length;

    const getCongestionStyle = (value) => {
        if (value >= 80) {
            return "bg-red-50 text-red-600 border-red-100";
        }

        if (value >= 60) {
            return "bg-orange-50 text-orange-600 border-orange-100";
        }

        return "bg-emerald-50 text-emerald-600 border-emerald-100";
    };

    const getSignalStyle = (status) => {
        if (status === "ACTIVE") {
            return "bg-emerald-50 text-emerald-600 border-emerald-100";
        }

        if (status === "MAINTENANCE") {
            return "bg-orange-50 text-orange-600 border-orange-100";
        }

        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    // =========================
    // ACCESS CONTROL
    // =========================

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="rounded-2xl  bg-white px-8 py-7 text-center shadow-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                        🔐
                    </div>

                    <h1 className="text-lg font-bold text-slate-800">
                        Login Required
                    </h1>

                    <p className="mt-1 text-sm text-slate-600">
                        Please login to continue.
                    </p>
                </div>
            </div>
        );
    }

    if (!canManage) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-5xl rounded-2xl  bg-white p-8 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
                        🚫
                    </div>

                    <h1 className="text-2xl font-bold text-slate-800">
                        Traffic Management
                    </h1>

                    <p className="mt-2 text-sm text-red-500">
                        You do not have permission to manage traffic data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6">

            <div className="mx-auto max-w-7xl">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-600 p-6 text-white shadow-[0_10px_30px_rgba(16,185,129,0.15)] sm:p-6">

                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

                        <div>
                            <div className="mb-2 flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-xl shadow-lg backdrop-blur">
                                    🚦
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
                                        CityTwin Management
                                    </p>

                                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                        Traffic Management
                                    </h1>
                                </div>

                            </div>

                            <p className="max-w-xl text-sm text-emerald-50">
                                Monitor intersections, congestion, vehicle flow
                                and traffic signal conditions across the city.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">

                            <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-200 shadow-[0_0_0_4px_rgba(167,243,208,0.12)]" />

                                <div>
                                    <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-100">
                                        Status
                                    </p>

                                    <p className="text-xs font-bold text-white">
                                        System Online
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center backdrop-blur">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-100">
                                    Records
                                </p>

                                <p className="text-sm font-bold text-white">
                                    {traffic.length}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* =========================
                    MESSAGES
                ========================= */}

                {message && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
                            ✓
                        </span>

                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 shadow-sm">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
                            !
                        </span>

                        {error}
                    </div>
                )}

                {/* =========================
                    KPI CARDS
                ========================= */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                    <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Intersections
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {traffic.length}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg transition group-hover:scale-110">
                                🚦
                            </div>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <div className="absolute left-0 top-0 h-full w-1 bg-purple-500" />

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Vehicles
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {totalVehicles.toLocaleString()}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-lg transition group-hover:scale-110">
                                🚗
                            </div>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <div className="absolute left-0 top-0 h-full w-1 bg-orange-500" />

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Avg Congestion
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {averageCongestion}%
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-lg transition group-hover:scale-110">
                                📊
                            </div>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-cyan-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <div className="absolute left-0 top-0 h-full w-1 bg-cyan-500" />

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Avg Speed
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {averageSpeed}
                                    <span className="ml-1 text-xs font-medium text-slate-600">
                                        km/h
                                    </span>
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-lg transition group-hover:scale-110">
                                🏎️
                            </div>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Active Signals
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {activeSignals}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg transition group-hover:scale-110">
                                🟢
                            </div>
                        </div>
                    </div>

                </div>

                {/* =========================
                    FORM
                ========================= */}

                <div className="mb-6 overflow-hidden rounded-2xl  bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">

                    <div className="border-b border-slate-300 bg-gradient-to-r from-slate-50 to-emerald-50/50 p-6">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">

                            <div className="flex min-w-0 items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                                    {editingId ? "✏️" : "➕"}
                                </div>

                                <div>
                                    <h2 className="text-base font-bold leading-tight text-slate-800 sm:text-lg">
                                        {editingId
                                            ? "Update Traffic Data"
                                            : "Add Traffic Data"}
                                    </h2>

                                    <p className="max-w-full text-[10px] leading-relaxed text-slate-600">
                                        Configure intersection traffic information
                                    </p>
                                </div>

                            </div>

                            {editingId && (
                                <span className="w-fit shrink-0 whitespace-nowrap rounded-full bg-orange-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-orange-500">
                                    Editing Record
                                </span>
                            )}

                        </div>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4"
                    >

                        {[
                            ["intersectionId", "Intersection ID", "INT-001", "text"],
                            ["lat", "Latitude", "28.6139", "number"],
                            ["lng", "Longitude", "77.2090", "number"],
                            ["vehicles", "Vehicles", "120", "number"],
                            ["congestion", "Congestion %", "65", "number"],
                            ["averageSpeed", "Average Speed", "32", "number"],
                            ["averageWaitTime", "Average Wait Time", "45", "number"]
                        ].map(([name, label, placeholder, type]) => (
                            <div key={name}>

                                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    {label}
                                </label>

                                <input
                                    type={type}
                                    step={type === "number" ? "any" : undefined}
                                    name={name}
                                    value={form[name]}
                                    onChange={handleChange}
                                    placeholder={placeholder}
                                    min={
                                        [
                                            "vehicles",
                                            "congestion",
                                            "averageSpeed",
                                            "averageWaitTime"
                                        ].includes(name)
                                            ? "0"
                                            : undefined
                                    }
                                    max={
                                        name === "congestion"
                                            ? "100"
                                            : undefined
                                    }
                                    required
                                    className="w-full rounded-xl border-2 border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                                />

                            </div>
                        ))}

                        <div>

                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Signal Status
                            </label>

                            <select
                                name="signalStatus"
                                value={form.signalStatus}
                                onChange={handleChange}
                                className="w-full rounded-xl border-2 border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                                <option value="MAINTENANCE">MAINTENANCE</option>
                            </select>

                        </div>

                        <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-4">

                            <button
                                type="submit"
                                className="group flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg"
                            >
                                <span className="transition group-hover:scale-110">
                                    {editingId ? "✓" : "+"}
                                </span>

                                {editingId
                                    ? "Update Traffic"
                                    : "Add Traffic"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="shrink-0 whitespace-nowrap rounded-xl  bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </div>

                {/* =========================
                    RECORDS
                ========================= */}

                <div className="mt-6 overflow-hidden rounded-2xl  bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">

                    {/* RECORD HEADER */}

                    <div className="border-b border-slate-300 p-6">

                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                            <div>

                                <div className="flex items-center justify-end gap-2">

                                    <h2 className="text-base font-bold leading-tight text-slate-800 sm:text-lg">
                                        Traffic Records
                                    </h2>

                                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                                        {filteredTraffic.length}
                                    </span>

                                </div>

                                <p className="mt-1 text-[10px] text-slate-600">
                                    Search and manage city traffic intersections
                                </p>

                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">

                                <div className="relative w-full min-w-0 flex-1 sm:max-w-md">

                                    <span className="pointer-events-none absolute left-3 top-0 flex h-10 items-center justify-center text-sm leading-none text-slate-600">
                                        
                                    </span>

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search intersection..."
                                        className="h-10 w-full rounded-xl border-2 border-slate-300 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                                    />

                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="rounded-xl border-2 border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-600 outline-none transition focus:border-emerald-400 focus:bg-white"
                                >
                                    <option value="ALL">All Signals</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                </select>

                            </div>

                        </div>

                    </div>

                    {/* TABLE */}

                    {loading ? (
                        <div className="flex min-h-[250px] items-center justify-center">

                            <div className="text-center">

                                <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />

                                <p className="text-xs font-medium text-slate-600">
                                    Loading traffic data...
                                </p>

                            </div>

                        </div>
                    ) : filteredTraffic.length === 0 ? (

                        <div className="flex min-h-[250px] items-center justify-center p-8">

                            <div className="text-center">

                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl">
                                    🚦
                                </div>

                                <h3 className="text-sm font-bold text-slate-700">
                                    No traffic records found
                                </h3>

                                <p className="mt-1 text-xs text-slate-600">
                                    Try changing your search or filter.
                                </p>

                            </div>

                        </div>
                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1050px]">

                                <thead className="bg-slate-50">

                                    <tr className="border-b border-slate-300">

                                        {[
                                            "Intersection",
                                            "Vehicles",
                                            "Congestion",
                                            "Speed",
                                            "Wait Time",
                                            "Signal",
                                            "Location",
                                            "Actions"
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600"
                                            >
                                                {heading}
                                            </th>
                                        ))}

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredTraffic.map((item) => (

                                        <tr
                                            key={item._id}
                                            className="group border-b border-slate-300 transition hover:bg-emerald-50/30"
                                        >

                                            <td className="px-4 py-4 text-right">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm transition group-hover:scale-110">
                                                        🚦
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700">
                                                            {item.intersectionId}
                                                        </p>

                                                        <p className="mt-0.5 text-[9px] text-slate-600">
                                                            Traffic Intersection
                                                        </p>
                                                    </div>

                                                </div>

                                            </td>

                                            <td className="px-4 py-4">

                                                <span className="text-sm font-bold text-slate-700">
                                                    {Number(item.vehicles || 0).toLocaleString()}
                                                </span>

                                            </td>

                                            <td className="px-4 py-4">

                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold ${getCongestionStyle(
                                                        Number(item.congestion || 0)
                                                    )}`}
                                                >
                                                    {item.congestion}%
                                                </span>

                                            </td>

                                            <td className="px-4 py-4">

                                                <span className="text-xs font-semibold text-slate-600">
                                                    {item.averageSpeed}
                                                </span>

                                                <span className="ml-1 text-[9px] text-slate-600">
                                                    km/h
                                                </span>

                                            </td>

                                            <td className="px-4 py-4">

                                                <span className="text-xs font-semibold text-slate-600">
                                                    {item.averageWaitTime}
                                                </span>

                                                <span className="ml-1 text-[9px] text-slate-600">
                                                    sec
                                                </span>

                                            </td>

                                            <td className="px-4 py-4">

                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold ${getSignalStyle(
                                                        item.signalStatus
                                                    )}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            item.signalStatus === "ACTIVE"
                                                                ? "animate-pulse bg-emerald-500"
                                                                : item.signalStatus === "MAINTENANCE"
                                                                    ? "bg-orange-500"
                                                                    : "bg-slate-400"
                                                        }`}
                                                    />

                                                    {item.signalStatus}
                                                </span>

                                            </td>

                                            <td className="px-4 py-4">

                                                <div className="text-[9px] text-slate-600">
                                                    <div>
                                                        {item.location?.lat}
                                                    </div>

                                                    <div>
                                                        {item.location?.lng}
                                                    </div>
                                                </div>

                                            </td>

                                            <td className="px-4 py-4">

                                                <div className="flex items-center gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-[9px] font-bold text-blue-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-md active:translate-y-0"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(item._id)
                                                        }
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

                {/* =========================
                    FOOTER
                ========================= */}

                <div className="mt-5 flex flex-col justify-between gap-2 rounded-xl  bg-white px-4 py-3 text-[9px] text-slate-600 shadow-sm sm:flex-row sm:items-center">

                    <span>
                        CityTwin Traffic Monitoring
                    </span>

                    <div className="flex items-center gap-2">

                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                        <span className="font-semibold text-emerald-600">
                            {activeSignals} Active
                        </span>

                        <span>•</span>

                        <span className="font-semibold text-orange-500">
                            {maintenanceSignals} Maintenance
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default TrafficManagement;
