import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_URL;

const VehiclesManagement = () => {
    const { user, token } = useAuth();

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        vehicleId: "",
        type: "BUS",
        route: "",
        speed: "",
        passengers: "",
        status: "IDLE",
        lat: "",
        lng: ""
    });

    const canManage =
        user?.role === "ADMIN" ||
        user?.role === "CITY_OPERATOR";

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // FETCH VEHICLES
    const fetchVehicles = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/vehicles`,
                config
            );

            setVehicles(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load vehicles"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchVehicles();
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
            vehicleId: "",
            type: "BUS",
            route: "",
            speed: "",
            passengers: "",
            status: "IDLE",
            lat: "",
            lng: ""
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
                vehicleId: form.vehicleId,
                type: form.type,
                route: form.route,
                speed: Number(form.speed),
                passengers: Number(form.passengers),
                status: form.status,
                location: {
                    lat: Number(form.lat),
                    lng: Number(form.lng)
                }
            };

            if (editingId) {
                await axios.put(
                    `${API_URL}/vehicles/${editingId}`,
                    data,
                    config
                );

                setMessage("Vehicle updated successfully");
            } else {
                await axios.post(
                    `${API_URL}/vehicles`,
                    data,
                    config
                );

                setMessage("Vehicle created successfully");
            }

            resetForm();
            fetchVehicles();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to save vehicle"
            );
        }
    };

    // EDIT VEHICLE
    const handleEdit = (vehicle) => {
        setEditingId(vehicle._id);

        setForm({
            vehicleId: vehicle.vehicleId || "",
            type: vehicle.type || "BUS",
            route: vehicle.route || "",
            speed: vehicle.speed ?? "",
            passengers: vehicle.passengers ?? "",
            status: vehicle.status || "IDLE",
            lat: vehicle.location?.lat ?? "",
            lng: vehicle.location?.lng ?? ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // DELETE VEHICLE
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this vehicle?"
        );

        if (!confirmed) return;

        try {
            setMessage("");
            setError("");

            await axios.delete(
                `${API_URL}/vehicles/${id}`,
                config
            );

            setMessage("Vehicle deleted successfully");

            fetchVehicles();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete vehicle"
            );
        }
    };

    // ACCESS CONTROL
    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
                <p>Please login to continue.</p>
            </div>
        );
    }

    if (!canManage) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6">
                <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-bold mb-4">
                        Vehicles Management
                    </h1>

                    <p className="text-red-400">
                        You do not have permission to manage vehicles.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-6 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 p-6 text-white shadow-[0_10px_30px_rgba(37,99,235,0.15)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
                                Fleet Monitoring
                            </p>

                            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                                Vehicles Management
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
                                Add, update and monitor city vehicles in real time.
                            </p>
                        </div>

                        <span className="w-fit shrink-0 whitespace-nowrap rounded-full border border-emerald-200/40 bg-emerald-400/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-100">
                            ● Fleet Active
                        </span>
                    </div>
                </div>

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
                            Total Vehicles
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {vehicles.length}
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-blue-600">
                            Registered fleet
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            On Route
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {vehicles.filter(v => v.status === "ON_ROUTE").length}
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-emerald-600">
                            Currently active
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Emergency
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {vehicles.filter(v => v.status === "EMERGENCY").length}
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-red-600">
                            Requires attention
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Passengers
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {vehicles.reduce(
                                (sum, vehicle) =>
                                    sum + Number(vehicle.passengers || 0),
                                0
                            )}
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-indigo-600">
                            Current onboard count
                        </p>
                    </div>

                </div>

                {/* FORM */}
                <div className="mb-6 rounded-2xl  bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.06)] sm:p-6">

                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold leading-tight text-slate-800">
                                {editingId ? "Update Vehicle" : "Add Vehicle Data"}
                            </h2>

                            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                                Enter vehicle information and location details.
                            </p>
                        </div>

                        <span className="w-fit shrink-0 whitespace-nowrap rounded-full bg-blue-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-600">
                            Fleet Data
                        </span>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    >

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Vehicle ID
                            </label>
                            <input
                                type="text"
                                name="vehicleId"
                                value={form.vehicleId}
                                onChange={handleChange}
                                placeholder="BUS-001"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Vehicle Type
                            </label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="BUS">BUS</option>
                                <option value="AMBULANCE">AMBULANCE</option>
                                <option value="FIRE_TRUCK">FIRE TRUCK</option>
                                <option value="POLICE">POLICE</option>
                                <option value="EV">EV</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Route
                            </label>
                            <input
                                type="text"
                                name="route"
                                value={form.route}
                                onChange={handleChange}
                                placeholder="Route A"
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Speed
                            </label>
                            <input
                                type="number"
                                step="any"
                                name="speed"
                                value={form.speed}
                                onChange={handleChange}
                                placeholder="45"
                                min="0"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Passengers
                            </label>
                            <input
                                type="number"
                                name="passengers"
                                value={form.passengers}
                                onChange={handleChange}
                                placeholder="40"
                                min="0"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Status
                            </label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="ON_ROUTE">ON ROUTE</option>
                                <option value="IDLE">IDLE</option>
                                <option value="EMERGENCY">EMERGENCY</option>
                                <option value="OFFLINE">OFFLINE</option>
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
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2 lg:col-span-4">
                            <button
                                type="submit"
                                className="shrink-0 whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md active:translate-y-0"
                            >
                                {editingId ? "Update Vehicle" : "Add Vehicle"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="shrink-0 whitespace-nowrap rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm active:translate-y-0"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                    </form>
                </div>

                {/* VEHICLE RECORDS */}
                <div className="overflow-hidden rounded-2xl  bg-white shadow-[0_4px_18px_rgba(15,23,42,0.06)]">

                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">

                        <div className="min-w-0">
                            <h2 className="text-lg font-bold leading-tight text-slate-800">
                                Vehicle Records
                            </h2>
                            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                                Monitor registered vehicles, status and current locations.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <div className="w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search vehicle..."
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    onChange={(e) => {
                                        const value = e.target.value.toLowerCase();
                                        document
                                            .querySelectorAll("[data-vehicle-row]")
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
                            </div>
                        </div>

                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-sm font-medium text-slate-600">
                            Loading vehicles...
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="p-10 text-center text-sm font-medium text-slate-600">
                            No vehicles found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1100px]">

                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Vehicle ID
                                        </th>
                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Route
                                        </th>
                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Speed
                                        </th>
                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Passengers
                                        </th>
                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Location
                                        </th>
                                        <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {vehicles.map((vehicle) => (
                                        <tr
                                            key={vehicle._id}
                                            data-vehicle-row
                                            className="border-t border-slate-200 transition-colors hover:bg-blue-50/40"
                                        >

                                            <td className="px-4 py-4 text-sm font-bold text-slate-800">
                                                {vehicle.vehicleId}
                                            </td>

                                            <td className="px-4 py-4 text-xs font-semibold text-slate-700">
                                                {vehicle.type}
                                            </td>

                                            <td className="px-4 py-4 text-xs text-slate-700">
                                                {vehicle.route || "-"}
                                            </td>

                                            <td className="px-4 py-4 text-xs font-semibold text-slate-700">
                                                {vehicle.speed}
                                            </td>

                                            <td className="px-4 py-4 text-xs font-semibold text-slate-700">
                                                {vehicle.passengers}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
                                                        vehicle.status === "EMERGENCY"
                                                            ? "bg-red-50 text-red-600"
                                                            : vehicle.status === "ON_ROUTE"
                                                                ? "bg-emerald-50 text-emerald-600"
                                                                : vehicle.status === "IDLE"
                                                                    ? "bg-amber-50 text-amber-600"
                                                                    : "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {vehicle.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-600">
                                                {vehicle.location?.lat},{" "}
                                                {vehicle.location?.lng}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">

                                                    <button
                                                        onClick={() => handleEdit(vehicle)}
                                                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-[9px] font-bold text-blue-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-md active:translate-y-0"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(vehicle._id)}
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

export default VehiclesManagement;