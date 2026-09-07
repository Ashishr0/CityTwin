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
    const [search, setSearch] = useState("");

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

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
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

    const filteredBuildings = buildings.filter((building) => {
        const value = search.toLowerCase();

        return (
            building.buildingId?.toLowerCase().includes(value) ||
            building.name?.toLowerCase().includes(value) ||
            building.type?.toLowerCase().includes(value) ||
            building.status?.toLowerCase().includes(value)
        );
    });

    const totalOccupancy = buildings.reduce(
        (sum, building) =>
            sum + Number(building.occupancy || 0),
        0
    );

    const totalEnergy = buildings.reduce(
        (sum, building) =>
            sum + Number(building.energyConsumption || 0),
        0
    );

    const totalWater = buildings.reduce(
        (sum, building) =>
            sum + Number(building.waterConsumption || 0),
        0
    );

    const activeBuildings = buildings.filter(
        (building) => building.status === "NORMAL"
    ).length;

    if (!canManage) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
                <div className="mx-auto max-w-7xl rounded-2xl bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-bold">
                        Access Denied
                    </h1>

                    <p className="mt-3 text-slate-500">
                        Only ADMIN and CITY_OPERATOR users can manage buildings.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 sm:p-5 lg:p-6">
            <div className="mx-auto w-full max-w-7xl min-w-0">

                {/* HEADER */}

                <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-5 text-white shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-100">
                                City Infrastructure
                            </p>

                            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                                Buildings Management
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base">
                                Add, update and monitor city buildings.
                            </p>
                        </div>

                        <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-wide text-blue-100">
                                Total Buildings
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                                {buildings.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* KPI CARDS */}

                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Total Buildings
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {buildings.length}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Active Buildings
                        </p>

                        <p className="mt-2 text-2xl font-bold text-green-600">
                            {activeBuildings}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Total Occupancy
                        </p>

                        <p className="mt-2 text-2xl font-bold text-indigo-600">
                            {totalOccupancy}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Energy Consumption
                        </p>

                        <p className="mt-2 text-2xl font-bold text-orange-500">
                            {totalEnergy}
                        </p>
                    </div>
                </div>

                {/* MESSAGES */}

                {message && (
                    <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                {/* FORM */}

                <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingId
                                    ? "Edit Building"
                                    : "Add Building"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Enter building information below.
                            </p>
                        </div>

                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="w-fit rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                    >
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Building ID
                            </label>

                            <input
                                name="buildingId"
                                value={form.buildingId}
                                onChange={handleChange}
                                required
                                placeholder="B001"
                                className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Building Name
                            </label>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="City Tower"
                                className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Type
                            </label>

                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="RESIDENTIAL">Residential</option>
                                <option value="COMMERCIAL">Commercial</option>
                                <option value="INDUSTRIAL">Industrial</option>
                                <option value="GOVERNMENT">Government</option>
                                <option value="HOSPITAL">Hospital</option>
                                <option value="SCHOOL">School</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Floors
                            </label>

                            <input
                                type="number"
                                name="floors"
                                value={form.floors}
                                onChange={handleChange}
                                min="1"
                                required
                                className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Occupancy
                            </label>

                            <input
                                type="number"
                                name="occupancy"
                                value={form.occupancy}
                                onChange={handleChange}
                                min="0"
                                className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Energy Consumption
                            </label>

                            <input
                                type="number"
                                name="energyConsumption"
                                value={form.energyConsumption}
                                onChange={handleChange}
                                min="0"
                                className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Water Consumption
                            </label>

                            <input
                                type="number"
                                name="waterConsumption"
                                value={form.waterConsumption}
                                onChange={handleChange}
                                min="0"
                                className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Latitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="lat"
                                value={form.lat}
                                onChange={handleChange}
                                required
                                placeholder="28.6139"
                                className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Longitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="lng"
                                value={form.lng}
                                onChange={handleChange}
                                required
                                placeholder="77.2090"
                                className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Status
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="NORMAL">Normal</option>
                                <option value="WARNING">Warning</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>

                        <div className="flex items-end md:col-span-2 lg:col-span-3">
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
                            >
                                {editingId
                                    ? "Update Building"
                                    : "Add Building"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* RECORDS */}

                <div className="rounded-2xl bg-white shadow-sm">
                    <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Building Records
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage registered city buildings.
                            </p>
                        </div>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search buildings..."
                            className="w-full rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-indigo-500 lg:w-72"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-sm text-slate-500">
                                Loading buildings...
                            </div>
                        ) : filteredBuildings.length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-500">
                                No buildings found.
                            </div>
                        ) : (
                            <table className="w-full min-w-[1050px] text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                        <th className="px-5 py-3 font-semibold">
                                            Building
                                        </th>

                                        <th className="px-5 py-3 font-semibold">
                                            Type
                                        </th>

                                        <th className="px-5 py-3 font-semibold">
                                            Floors
                                        </th>

                                        <th className="px-5 py-3 font-semibold">
                                            Occupancy
                                        </th>

                                        <th className="px-5 py-3 font-semibold">
                                            Energy
                                        </th>

                                        <th className="px-5 py-3 font-semibold">
                                            Water
                                        </th>

                                        <th className="px-5 py-3 font-semibold">
                                            Location
                                        </th>

                                        <th className="px-5 py-3 font-semibold">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-right font-semibold">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredBuildings.map((building) => (
                                        <tr
                                            key={building._id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {building.name}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {building.buildingId}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                    {building.type}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-700">
                                                {building.floors}
                                            </td>

                                            <td className="px-5 py-4 text-sm font-medium text-slate-700">
                                                {building.occupancy}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-700">
                                                {building.energyConsumption}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-700">
                                                {building.waterConsumption}
                                            </td>

                                            <td className="px-5 py-4 text-xs text-slate-500">
                                                <div>
                                                    {building.location?.lat}
                                                </div>

                                                <div>
                                                    {building.location?.lng}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        building.status === "CRITICAL"
                                                            ? "bg-red-50 text-red-700"
                                                            : building.status === "WARNING"
                                                                ? "bg-amber-50 text-amber-700"
                                                                : "bg-green-50 text-green-700"
                                                    }`}
                                                >
                                                    {building.status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(building)
                                                        }
                                                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(building._id)
                                                        }
                                                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* SMALL SUMMARY */}

                <div className="mt-5 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:justify-between">
                    <span>
                        Showing {filteredBuildings.length} of {buildings.length} buildings
                    </span>

                    <span>
                        Water consumption: {totalWater}
                    </span>
                </div>

            </div>
        </div>
    );
};

export default BuildingsManagement;
