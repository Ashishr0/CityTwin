import { useEffect, useState } from "react";

const WasteManagement = () => {
    const [wasteData, setWasteData] = useState([]);

    const [formData, setFormData] = useState({
        binId: "",
        lat: "",
        lng: "",
        fillLevel: "",
        status: "EMPTY",
        lastCollected: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("city_twin_token");

    const fetchWaste = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/waste", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setWasteData(data);
            } else {
                alert(data.message || "Failed to fetch waste data");
            }
        } catch (error) {
            console.error("Fetch waste error:", error);
            alert("Server error while fetching waste data");
        }
    };

    useEffect(() => {
        fetchWaste();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            binId: "",
            lat: "",
            lng: "",
            fillLevel: "",
            status: "EMPTY",
            lastCollected: ""
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const payload = {
            binId: formData.binId,
            location: {
                lat: Number(formData.lat),
                lng: Number(formData.lng)
            },
            fillLevel: Number(formData.fillLevel),
            status: formData.status,
            lastCollected: formData.lastCollected || undefined
        };

        try {
            const url = editingId
                ? `http://localhost:5000/api/waste/${editingId}`
                : "http://localhost:5000/api/waste";

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Operation failed");
                return;
            }

            alert(
                editingId
                    ? "Waste data updated successfully"
                    : "Waste data created successfully"
            );

            resetForm();
            fetchWaste();
        } catch (error) {
            console.error("Save waste error:", error);
            alert("Server error while saving waste data");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);

        setFormData({
            binId: item.binId || "",
            lat: item.location?.lat ?? "",
            lng: item.location?.lng ?? "",
            fillLevel: item.fillLevel ?? "",
            status: item.status || "EMPTY",
            lastCollected: item.lastCollected
                ? new Date(item.lastCollected).toISOString().slice(0, 16)
                : ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this waste bin?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/waste/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to delete waste data");
                return;
            }

            alert("Waste data deleted successfully");

            fetchWaste();
        } catch (error) {
            console.error("Delete waste error:", error);
            alert("Server error while deleting waste data");
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "EMPTY":
                return "bg-green-600";
            case "NORMAL":
                return "bg-blue-600";
            case "ALMOST_FULL":
                return "bg-yellow-600";
            case "CRITICAL":
                return "bg-red-600";
            default:
                return "bg-slate-600";
        }
    };

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 sm:p-5 lg:p-6">
            <div className="mx-auto w-full max-w-7xl min-w-0">

                {/* HEADER */}
                <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 p-6 text-white shadow-[0_10px_30px_rgba(16,185,129,0.15)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100">
                                Smart Waste Infrastructure
                            </p>

                            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                                Waste Management
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-100">
                                Monitor waste bins, fill levels, collection activity and critical waste locations across the city.
                            </p>
                        </div>

                        <span className="w-fit shrink-0 whitespace-nowrap rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
                            ● Waste Active
                        </span>

                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Total Bins
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {wasteData.length}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-emerald-600">
                            Registered waste bins
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Average Fill Level
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {wasteData.length
                                ? (
                                    wasteData.reduce(
                                        (sum, item) =>
                                            sum + Number(item.fillLevel || 0),
                                        0
                                    ) / wasteData.length
                                ).toFixed(1)
                                : "0.0"}%
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-blue-600">
                            Current city average
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Critical Bins
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {wasteData.filter(
                                item => item.status === "CRITICAL"
                            ).length}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-red-500">
                            Require immediate collection
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Almost Full
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {wasteData.filter(
                                item => item.status === "ALMOST_FULL"
                            ).length}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-amber-600">
                            Collection recommended
                        </p>
                    </div>

                </div>

                {/* FORM */}
                <div className="mb-6 rounded-2xl  bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.06)] sm:p-6">

                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">
                            <h2 className="text-lg font-bold leading-tight text-slate-800">
                                {editingId
                                    ? "Update Waste Bin"
                                    : "Add Waste Bin"}
                            </h2>

                            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                                Enter bin location, fill level, collection status and last collection information.
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">

                            <span className="w-fit whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                                Waste Data
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
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >

                        {/* BIN ID */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Bin ID
                            </label>

                            <input
                                type="text"
                                name="binId"
                                value={formData.binId}
                                onChange={handleChange}
                                placeholder="WB001"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        {/* LATITUDE */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Latitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="lat"
                                value={formData.lat}
                                onChange={handleChange}
                                placeholder="28.6139"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        {/* LONGITUDE */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Longitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="lng"
                                value={formData.lng}
                                onChange={handleChange}
                                placeholder="77.2090"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        {/* FILL LEVEL */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Fill Level (%)
                            </label>

                            <input
                                type="number"
                                min="0"
                                max="100"
                                name="fillLevel"
                                value={formData.fillLevel}
                                onChange={handleChange}
                                placeholder="75"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        {/* STATUS */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="EMPTY">EMPTY</option>
                                <option value="NORMAL">NORMAL</option>
                                <option value="ALMOST_FULL">
                                    ALMOST FULL
                                </option>
                                <option value="CRITICAL">CRITICAL</option>
                            </select>
                        </div>

                        {/* LAST COLLECTED */}
                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Last Collected
                            </label>

                            <input
                                type="datetime-local"
                                name="lastCollected"
                                value={formData.lastCollected}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        {/* SUBMIT */}
                        <div className="flex flex-wrap items-end gap-3 sm:col-span-2 lg:col-span-3">

                            <button
                                type="submit"
                                disabled={loading}
                                className="shrink-0 whitespace-nowrap rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0"
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Waste Bin"
                                    : "Add Waste Bin"}
                            </button>

                        </div>

                    </form>
                </div>

                {/* RECORDS */}
                <div className="overflow-hidden rounded-2xl  bg-white shadow-[0_4px_18px_rgba(15,23,42,0.06)]">

                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">

                        <div className="min-w-0">
                            <h2 className="text-lg font-bold leading-tight text-slate-800">
                                Waste Bins
                            </h2>

                            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                                Review bin locations, fill levels, collection status and activity.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">

                            <input
                                type="text"
                                placeholder="Search bin..."
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 sm:w-64"
                                onChange={(e) => {
                                    const value = e.target.value.toLowerCase();

                                    document
                                        .querySelectorAll("[data-waste-row]")
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

                            <span className="w-fit shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                                {wasteData.length} Total
                            </span>

                        </div>

                    </div>

                    {wasteData.length === 0 ? (
                        <div className="p-10 text-center text-sm font-medium text-slate-600">
                            No waste bins found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1100px]">

                                <thead className="bg-slate-100">
                                    <tr>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Bin ID
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Location
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Fill Level
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Status
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Last Collected
                                        </th>

                                        <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {wasteData.map((item) => {

                                        const fill = Number(item.fillLevel || 0);

                                        return (
                                            <tr
                                                key={item._id}
                                                data-waste-row
                                                className="border-t border-slate-200 transition-colors hover:bg-emerald-50/30"
                                            >

                                                <td className="px-4 py-4 text-xs font-bold text-slate-800">
                                                    {item.binId}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="text-[10px] leading-relaxed text-slate-600">
                                                        <div>
                                                            Lat:{" "}
                                                            <span className="font-semibold text-slate-700">
                                                                {item.location?.lat}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            Lng:{" "}
                                                            <span className="font-semibold text-slate-700">
                                                                {item.location?.lng}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4">

                                                    <div className="flex min-w-[150px] items-center gap-3">

                                                        <div className="h-2.5 w-24 overflow-hidden rounded-full bg-slate-200">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${
                                                                    fill >= 80
                                                                        ? "bg-red-500"
                                                                        : fill >= 60
                                                                            ? "bg-amber-500"
                                                                            : "bg-emerald-500"
                                                                }`}
                                                                style={{
                                                                    width: `${Math.min(
                                                                        Math.max(fill, 0),
                                                                        100
                                                                    )}%`
                                                                }}
                                                            />
                                                        </div>

                                                        <span className="whitespace-nowrap text-xs font-bold text-slate-700">
                                                            {fill}%
                                                        </span>

                                                    </div>

                                                </td>

                                                <td className="px-4 py-4">

                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
                                                            item.status === "EMPTY"
                                                                ? "bg-slate-100 text-slate-600"
                                                                : item.status === "NORMAL"
                                                                    ? "bg-emerald-50 text-emerald-600"
                                                                    : item.status === "ALMOST_FULL"
                                                                        ? "bg-amber-50 text-amber-600"
                                                                        : item.status === "CRITICAL"
                                                                            ? "bg-red-50 text-red-500"
                                                                            : "bg-slate-100 text-slate-600"
                                                        }`}
                                                    >
                                                        {item.status.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </span>

                                                </td>

                                                <td className="px-4 py-4 text-xs font-medium text-slate-600">
                                                    {item.lastCollected
                                                        ? new Date(
                                                            item.lastCollected
                                                        ).toLocaleString()
                                                        : "Not collected"}
                                                </td>

                                                <td className="px-4 py-4 text-right">

                                                    <div className="flex items-center justify-end gap-2">

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
                                                                handleDelete(
                                                                    item._id
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[9px] font-bold text-red-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-500 hover:text-white hover:shadow-md active:translate-y-0"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );

};

export default WasteManagement;