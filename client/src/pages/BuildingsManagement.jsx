import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

const initialForm = {
    buildingId: "",
    name: "",
    type: "RESIDENTIAL",
    floors: 1,
    occupancy: 0,
    energyConsumption: 0,
    waterConsumption: 0,
    lat: "",
    lng: "",
    status: "NORMAL"
};

const BuildingsManagement = () => {
    const { user, token } = useAuth();

    const [buildings, setBuildings] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const canManage =
        user?.role === "ADMIN" ||
        user?.role === "CITY_OPERATOR";

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const loadBuildings = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API_URL}/buildings`,
                config
            );

            setBuildings(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load buildings"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && canManage) {
            loadBuildings();
        } else {
            setLoading(false);
        }
    }, [token, canManage]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError("");
            setMessage("");

            const payload = {
                buildingId: form.buildingId,
                name: form.name,
                type: form.type,
                floors: Number(form.floors),
                occupancy: Number(form.occupancy),
                energyConsumption: Number(form.energyConsumption),
                waterConsumption: Number(form.waterConsumption),
                location: {
                    lat: Number(form.lat),
                    lng: Number(form.lng)
                },
                status: form.status
            };

            if (editingId) {
                await axios.put(
                    `${API_URL}/buildings/${editingId}`,
                    payload,
                    config
                );

                setMessage("Building updated successfully.");
            } else {
                await axios.post(
                    `${API_URL}/buildings`,
                    payload,
                    config
                );

                setMessage("Building added successfully.");
            }

            setForm(initialForm);
            setEditingId(null);

            await loadBuildings();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Operation failed"
            );
        }
    };

    const handleEdit = (building) => {
        setEditingId(building._id);

        setForm({
            buildingId: building.buildingId || "",
            name: building.name || "",
            type: building.type || "RESIDENTIAL",
            floors: building.floors ?? 1,
            occupancy: building.occupancy ?? 0,
            energyConsumption: building.energyConsumption ?? 0,
            waterConsumption: building.waterConsumption ?? 0,
            lat: building.location?.lat ?? "",
            lng: building.location?.lng ?? "",
            status: building.status || "NORMAL"
        });

        setMessage("");
        setError("");
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this building?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await axios.delete(
                `${API_URL}/buildings/${id}`,
                config
            );

            setMessage("Building deleted successfully.");

            await loadBuildings();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete building"
            );
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(initialForm);
        setMessage("");
        setError("");
    };

    if (!canManage) {
        return (
            <div className="min-h-screen bg-slate-950 p-8 text-white">
                <h1 className="text-3xl font-bold">
                    Access Denied
                </h1>

                <p className="mt-3 text-slate-400">
                    Only ADMIN and CITY_OPERATOR users can manage buildings.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-4 text-white md:p-8">

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Buildings Management
                </h1>

                <p className="mt-2 text-slate-400">
                    Add, update and remove city buildings.
                </p>
            </div>

            {message && (
                <div className="mb-4 rounded-lg bg-green-900/40 p-4 text-green-300">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-lg bg-red-900/40 p-4 text-red-300">
                    {error}
                </div>
            )}

            {/* FORM */}

            <div className="mb-8 rounded-xl bg-slate-900 p-6">

                <h2 className="mb-5 text-xl font-semibold">
                    {editingId
                        ? "Edit Building"
                        : "Add Building"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                >

                    <input
                        name="buildingId"
                        value={form.buildingId}
                        onChange={handleChange}
                        placeholder="Building ID"
                        required
                        className="rounded-lg bg-slate-800 p-3 outline-none"
                    />

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Building Name"
                        required
                        className="rounded-lg bg-slate-800 p-3 outline-none"
                    />

                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="rounded-lg bg-slate-800 p-3"
                    >
                        <option value="RESIDENTIAL">Residential</option>
                        <option value="COMMERCIAL">Commercial</option>
                        <option value="INDUSTRIAL">Industrial</option>
                        <option value="HOSPITAL">Hospital</option>
                        <option value="SCHOOL">School</option>
                        <option value="GOVERNMENT">Government</option>
                    </select>

                    <input
                        type="number"
                        name="floors"
                        value={form.floors}
                        onChange={handleChange}
                        placeholder="Floors"
                        min="1"
                        className="rounded-lg bg-slate-800 p-3"
                    />

                    <input
                        type="number"
                        name="occupancy"
                        value={form.occupancy}
                        onChange={handleChange}
                        placeholder="Occupancy"
                        min="0"
                        className="rounded-lg bg-slate-800 p-3"
                    />

                    <input
                        type="number"
                        name="energyConsumption"
                        value={form.energyConsumption}
                        onChange={handleChange}
                        placeholder="Energy Consumption"
                        min="0"
                        className="rounded-lg bg-slate-800 p-3"
                    />

                    <input
                        type="number"
                        name="waterConsumption"
                        value={form.waterConsumption}
                        onChange={handleChange}
                        placeholder="Water Consumption"
                        min="0"
                        className="rounded-lg bg-slate-800 p-3"
                    />

                    <input
                        type="number"
                        step="any"
                        name="lat"
                        value={form.lat}
                        onChange={handleChange}
                        placeholder="Latitude"
                        required
                        className="rounded-lg bg-slate-800 p-3"
                    />

                    <input
                        type="number"
                        step="any"
                        name="lng"
                        value={form.lng}
                        onChange={handleChange}
                        placeholder="Longitude"
                        required
                        className="rounded-lg bg-slate-800 p-3"
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="rounded-lg bg-slate-800 p-3"
                    >
                        <option value="NORMAL">Normal</option>
                        <option value="WARNING">Warning</option>
                        <option value="CRITICAL">Critical</option>
                    </select>

                    <div className="flex gap-3 md:col-span-2 lg:col-span-3">

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
                        >
                            {editingId
                                ? "Update Building"
                                : "Add Building"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-lg bg-slate-700 px-6 py-3 font-semibold"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>
            </div>

            {/* BUILDINGS LIST */}

            <div className="rounded-xl bg-slate-900 p-6">

                <h2 className="mb-5 text-xl font-semibold">
                    City Buildings
                </h2>

                {loading ? (
                    <p className="text-slate-400">
                        Loading buildings...
                    </p>
                ) : buildings.length === 0 ? (
                    <p className="text-slate-400">
                        No buildings found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px] text-left">

                            <thead>
                                <tr className="border-b border-slate-700 text-slate-400">
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Floors</th>
                                    <th className="p-3">Occupancy</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {buildings.map((building) => (
                                    <tr
                                        key={building._id}
                                        className="border-b border-slate-800"
                                    >

                                        <td className="p-3">
                                            {building.buildingId}
                                        </td>

                                        <td className="p-3">
                                            {building.name}
                                        </td>

                                        <td className="p-3">
                                            {building.type}
                                        </td>

                                        <td className="p-3">
                                            {building.floors}
                                        </td>

                                        <td className="p-3">
                                            {building.occupancy}
                                        </td>

                                        <td className="p-3">
                                            {building.status}
                                        </td>

                                        <td className="p-3">

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleEdit(building)
                                                    }
                                                    className="rounded bg-yellow-600 px-3 py-2 text-sm"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(building._id)
                                                    }
                                                    className="rounded bg-red-600 px-3 py-2 text-sm"
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
    );
};

export default BuildingsManagement;
