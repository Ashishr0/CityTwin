import { useEffect, useState } from "react";

const EnergyManagement = () => {
    const [energyData, setEnergyData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        location: "",
        consumption: "",
        residential: "",
        commercial: "",
        industrial: "",
        public: "",
        renewablePercentage: ""
    });

    const token = localStorage.getItem("city_twin_token");

    const fetchEnergyData = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/energy",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch energy data"
                );
            }

            setEnergyData(data);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    useEffect(() => {
        fetchEnergyData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData({
            location: "",
            consumption: "",
            residential: "",
            commercial: "",
            industrial: "",
            public: "",
            renewablePercentage: ""
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const url = editingId
                ? `http://localhost:5000/api/energy/${editingId}`
                : "http://localhost:5000/api/energy";

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    location: formData.location,
                    consumption: Number(formData.consumption),
                    residential: Number(formData.residential),
                    commercial: Number(formData.commercial),
                    industrial: Number(formData.industrial),
                    public: Number(formData.public),
                    renewablePercentage: Number(
                        formData.renewablePercentage
                    )
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save energy data"
                );
            }

            alert(
                editingId
                    ? "Energy data updated successfully"
                    : "Energy data created successfully"
            );

            resetForm();
            fetchEnergyData();
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);

        setFormData({
            location: item.location || "",
            consumption: item.consumption ?? "",
            residential: item.residential ?? "",
            commercial: item.commercial ?? "",
            industrial: item.industrial ?? "",
            public: item.public ?? "",
            renewablePercentage:
                item.renewablePercentage ?? ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this energy record?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/energy/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete energy data"
                );
            }

            alert("Energy data deleted successfully");

            fetchEnergyData();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 p-3 sm:p-5 lg:p-6">
            <div className="mx-auto w-full max-w-7xl min-w-0">

                {/* HEADER */}
                <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-6 text-white shadow-[0_10px_30px_rgba(245,158,11,0.15)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100">
                                Smart Energy Monitoring
                            </p>

                            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                                Energy Management
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-amber-100">
                                Monitor electricity consumption, sector usage and renewable energy across the city.
                            </p>
                        </div>

                        <span className="w-fit shrink-0 whitespace-nowrap rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
                            ● Energy Active
                        </span>
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Energy Points
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {energyData.length}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-amber-600">
                            Registered locations
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Total Consumption
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {energyData
                                .reduce(
                                    (sum, item) =>
                                        sum + Number(item.consumption || 0),
                                    0
                                )
                                .toLocaleString()}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-orange-600">
                            Recorded energy usage
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Renewable Share
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {energyData.length
                                ? (
                                    energyData.reduce(
                                        (sum, item) =>
                                            sum +
                                            Number(
                                                item.renewablePercentage || 0
                                            ),
                                        0
                                    ) / energyData.length
                                ).toFixed(1)
                                : "0.0"}%
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-emerald-600">
                            Average renewable energy
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Active Locations
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {energyData.length}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-blue-600">
                            Monitoring energy usage
                        </p>
                    </div>

                </div>

                {/* FORM */}
                <div className="mb-6 rounded-2xl  bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.06)] sm:p-6">

                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold leading-tight text-slate-800">
                                {editingId
                                    ? "Update Energy Data"
                                    : "Add Energy Data"}
                            </h2>

                            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                                Enter electricity consumption and renewable energy information for a location.
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                            <span className="w-fit whitespace-nowrap rounded-full bg-amber-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-600">
                                Energy Data
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
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    >

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. Central Delhi"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Total Consumption
                            </label>

                            <input
                                type="number"
                                name="consumption"
                                placeholder="e.g. 5200"
                                value={formData.consumption}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Residential
                            </label>

                            <input
                                type="number"
                                name="residential"
                                placeholder="Residential usage"
                                value={formData.residential}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Commercial
                            </label>

                            <input
                                type="number"
                                name="commercial"
                                placeholder="Commercial usage"
                                value={formData.commercial}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Industrial
                            </label>

                            <input
                                type="number"
                                name="industrial"
                                placeholder="Industrial usage"
                                value={formData.industrial}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Public
                            </label>

                            <input
                                type="number"
                                name="public"
                                placeholder="Public usage"
                                value={formData.public}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Renewable %
                            </label>

                            <input
                                type="number"
                                name="renewablePercentage"
                                placeholder="0 - 100"
                                value={formData.renewablePercentage}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
                            />
                        </div>

                        <div className="flex flex-wrap items-end gap-3 sm:col-span-2 lg:col-span-4">

                            <button
                                type="submit"
                                disabled={loading}
                                className="shrink-0 whitespace-nowrap rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-amber-600 hover:to-orange-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0"
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Data"
                                    : "Add Data"}
                            </button>

                        </div>

                    </form>
                </div>

                {/* RECORDS */}
                <div className="overflow-hidden rounded-2xl  bg-white shadow-[0_4px_18px_rgba(15,23,42,0.06)]">

                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">

                        <div className="min-w-0">
                            <h2 className="text-lg font-bold leading-tight text-slate-800">
                                Energy Records
                            </h2>

                            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                                Review energy consumption by location and sector.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">

                            <input
                                type="text"
                                placeholder="Search location..."
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100 sm:w-64"
                                onChange={(e) => {
                                    const value = e.target.value.toLowerCase();

                                    document
                                        .querySelectorAll("[data-energy-row]")
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

                            <span className="w-fit shrink-0 whitespace-nowrap rounded-full bg-amber-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-600">
                                {energyData.length} Total
                            </span>

                        </div>

                    </div>

                    {energyData.length === 0 ? (
                        <div className="p-10 text-center text-sm font-medium text-slate-600">
                            No energy records found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1050px]">

                                <thead className="bg-slate-100">
                                    <tr>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Location
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Consumption
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Residential
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Commercial
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Industrial
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Public
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Renewable %
                                        </th>

                                        <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {energyData.map((item) => (
                                        <tr
                                            key={item._id}
                                            data-energy-row
                                            className="border-t border-slate-200 transition-colors hover:bg-amber-50/30"
                                        >

                                            <td className="px-4 py-4 text-xs font-bold text-slate-800">
                                                {item.location}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold text-orange-600">
                                                    {item.consumption}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-700">
                                                {item.residential}
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-700">
                                                {item.commercial}
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-700">
                                                {item.industrial}
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-700">
                                                {item.public}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
                                                        Number(item.renewablePercentage) >= 50
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : Number(item.renewablePercentage) >= 25
                                                                ? "bg-amber-50 text-amber-600"
                                                                : "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {item.renewablePercentage}%
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">

                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-[9px] font-bold text-blue-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-md active:translate-y-0"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(item._id)}
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

export default EnergyManagement;
