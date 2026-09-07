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
        <div className="min-h-screen bg-slate-950 p-6 text-white">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Waste Management
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Monitor and manage city waste collection bins.
                    </p>
                </div>

                {/* FORM */}

                <div className="mb-8 rounded-xl bg-slate-800 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        {editingId
                            ? "Update Waste Bin"
                            : "Add Waste Bin"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                    >

                        {/* BIN ID */}

                        <div>
                            <label className="mb-1 block text-sm text-slate-300">
                                Bin ID
                            </label>

                            <input
                                type="text"
                                name="binId"
                                value={formData.binId}
                                onChange={handleChange}
                                placeholder="WB001"
                                required
                                className="w-full rounded-lg bg-slate-700 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* LATITUDE */}

                        <div>
                            <label className="mb-1 block text-sm text-slate-300">
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
                                className="w-full rounded-lg bg-slate-700 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* LONGITUDE */}

                        <div>
                            <label className="mb-1 block text-sm text-slate-300">
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
                                className="w-full rounded-lg bg-slate-700 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* FILL LEVEL */}

                        <div>
                            <label className="mb-1 block text-sm text-slate-300">
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
                                className="w-full rounded-lg bg-slate-700 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* STATUS */}

                        <div>
                            <label className="mb-1 block text-sm text-slate-300">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-700 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
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
                            <label className="mb-1 block text-sm text-slate-300">
                                Last Collected
                            </label>

                            <input
                                type="datetime-local"
                                name="lastCollected"
                                value={formData.lastCollected}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-700 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* BUTTONS */}

                        <div className="flex items-end gap-3 lg:col-span-3">

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-blue-600 px-5 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Waste Bin"
                                    : "Add Waste Bin"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg bg-slate-600 px-5 py-2 font-medium hover:bg-slate-500"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>
                </div>

                {/* TABLE */}

                <div className="overflow-hidden rounded-xl bg-slate-800">

                    <div className="border-b border-slate-700 p-6">
                        <h2 className="text-xl font-semibold">
                            Waste Bins
                        </h2>
                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px] text-left">

                            <thead className="bg-slate-700">
                                <tr>
                                    <th className="px-6 py-4">
                                        Bin ID
                                    </th>

                                    <th className="px-6 py-4">
                                        Location
                                    </th>

                                    <th className="px-6 py-4">
                                        Fill Level
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4">
                                        Last Collected
                                    </th>

                                    <th className="px-6 py-4">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {wasteData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-10 text-center text-slate-400"
                                        >
                                            No waste bins found.
                                        </td>
                                    </tr>
                                ) : (
                                    wasteData.map((item) => (
                                        <tr
                                            key={item._id}
                                            className="border-t border-slate-700 hover:bg-slate-750"
                                        >

                                            <td className="px-6 py-4 font-medium">
                                                {item.binId}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div>
                                                    <div>
                                                        Lat:{" "}
                                                        {item.location?.lat}
                                                    </div>

                                                    <div>
                                                        Lng:{" "}
                                                        {item.location?.lng}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">

                                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-600">
                                                        <div
                                                            className="h-full bg-blue-500"
                                                            style={{
                                                                width: `${item.fillLevel}%`
                                                            }}
                                                        />
                                                    </div>

                                                    <span>
                                                        {item.fillLevel}%
                                                    </span>

                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                        item.status
                                                    )}`}
                                                >
                                                    {item.status.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                {item.lastCollected
                                                    ? new Date(
                                                          item.lastCollected
                                                      ).toLocaleString()
                                                    : "Not collected"}
                                            </td>

                                            <td className="px-6 py-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                        className="rounded-lg bg-yellow-600 px-3 py-2 text-sm hover:bg-yellow-700"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item._id
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-600 px-3 py-2 text-sm hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    ))
                                )}

                            </tbody>

                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WasteManagement;