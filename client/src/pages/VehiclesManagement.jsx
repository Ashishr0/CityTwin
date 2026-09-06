import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

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
        <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold">
                        Vehicles Management
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Add, update and remove city vehicles.
                    </p>
                </div>

                {/* SUCCESS MESSAGE */}
                {message && (
                    <div className="mb-4 rounded-lg bg-green-900/40 border border-green-600 p-3 text-green-300">
                        {message}
                    </div>
                )}

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-900/40 border border-red-600 p-3 text-red-300">
                        {error}
                    </div>
                )}

                {/* FORM */}
                <div className="bg-slate-900 rounded-xl p-5 sm:p-6 mb-8">

                    <h2 className="text-xl font-semibold mb-5">
                        {editingId
                            ? "Update Vehicle"
                            : "Add Vehicle"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >

                        {/* VEHICLE ID */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                Vehicle ID
                            </label>

                            <input
                                type="text"
                                name="vehicleId"
                                value={form.vehicleId}
                                onChange={handleChange}
                                placeholder="BUS-001"
                                required
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* TYPE */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                Vehicle Type
                            </label>

                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            >
                                <option value="BUS">BUS</option>
                                <option value="AMBULANCE">
                                    AMBULANCE
                                </option>
                                <option value="FIRE_TRUCK">
                                    FIRE TRUCK
                                </option>
                                <option value="POLICE">
                                    POLICE
                                </option>
                                <option value="EV">EV</option>
                            </select>
                        </div>

                        {/* ROUTE */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                Route
                            </label>

                            <input
                                type="text"
                                name="route"
                                value={form.route}
                                onChange={handleChange}
                                placeholder="Route A"
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* SPEED */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
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
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* PASSENGERS */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
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
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* STATUS */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                Status
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-blue-500"
                            >
                                <option value="ON_ROUTE">
                                    ON ROUTE
                                </option>

                                <option value="IDLE">
                                    IDLE
                                </option>

                                <option value="EMERGENCY">
                                    EMERGENCY
                                </option>

                                <option value="OFFLINE">
                                    OFFLINE
                                </option>
                            </select>
                        </div>

                        {/* LATITUDE */}
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

                        {/* LONGITUDE */}
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

                        {/* BUTTONS */}
                        <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-3 mt-2">

                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium hover:bg-blue-700 transition"
                            >
                                {editingId
                                    ? "Update Vehicle"
                                    : "Add Vehicle"}
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

                {/* VEHICLE TABLE */}
                <div className="bg-slate-900 rounded-xl overflow-hidden">

                    <div className="p-5 border-b border-slate-800">
                        <h2 className="text-xl font-semibold">
                            Vehicle Records
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-400">
                            Loading vehicles...
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            No vehicles found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1100px]">

                                <thead className="bg-slate-800">

                                    <tr>
                                        <th className="text-left px-4 py-3">
                                            Vehicle ID
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Type
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Route
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Speed
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Passengers
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Status
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Location
                                        </th>

                                        <th className="text-left px-4 py-3">
                                            Actions
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {vehicles.map((vehicle) => (
                                        <tr
                                            key={vehicle._id}
                                            className="border-t border-slate-800 hover:bg-slate-800/50"
                                        >

                                            <td className="px-4 py-3 font-medium">
                                                {vehicle.vehicleId}
                                            </td>

                                            <td className="px-4 py-3">
                                                {vehicle.type}
                                            </td>

                                            <td className="px-4 py-3">
                                                {vehicle.route || "-"}
                                            </td>

                                            <td className="px-4 py-3">
                                                {vehicle.speed}
                                            </td>

                                            <td className="px-4 py-3">
                                                {vehicle.passengers}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-900 text-blue-300">
                                                    {vehicle.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">
                                                {vehicle.location?.lat},{" "}
                                                {vehicle.location?.lng}
                                            </td>

                                            <td className="px-4 py-3">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(vehicle)
                                                        }
                                                        className="rounded-lg bg-yellow-600 px-3 py-1.5 text-sm hover:bg-yellow-700"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                vehicle._id
                                                            )
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

export default VehiclesManagement;