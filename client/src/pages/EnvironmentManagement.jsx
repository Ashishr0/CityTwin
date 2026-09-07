import { useEffect, useState } from "react";

const EnvironmentManagement = () => {
    const [environmentData, setEnvironmentData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        location: "",
        aqi: "",
        pm25: "",
        pm10: "",
        co2: "",
        temperature: "",
        humidity: "",
        noise: ""
    });

    const token = localStorage.getItem("city_twin_token");

    const fetchEnvironmentData = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/environment",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch environment data"
                );
            }

            setEnvironmentData(data);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    useEffect(() => {
        fetchEnvironmentData();
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
            aqi: "",
            pm25: "",
            pm10: "",
            co2: "",
            temperature: "",
            humidity: "",
            noise: ""
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const url = editingId
                ? `http://localhost:5000/api/environment/${editingId}`
                : "http://localhost:5000/api/environment";

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    location: formData.location,
                    aqi: Number(formData.aqi),
                    pm25: Number(formData.pm25),
                    pm10: Number(formData.pm10),
                    co2: Number(formData.co2),
                    temperature: Number(formData.temperature),
                    humidity: Number(formData.humidity),
                    noise: Number(formData.noise)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save environment data"
                );
            }

            alert(
                editingId
                    ? "Environment data updated successfully"
                    : "Environment data created successfully"
            );

            resetForm();
            fetchEnvironmentData();
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
            aqi: item.aqi ?? "",
            pm25: item.pm25 ?? "",
            pm10: item.pm10 ?? "",
            co2: item.co2 ?? "",
            temperature: item.temperature ?? "",
            humidity: item.humidity ?? "",
            noise: item.noise ?? ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this environment record?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/environment/${id}`,
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
                    data.message || "Failed to delete environment data"
                );
            }

            alert("Environment data deleted successfully");

            fetchEnvironmentData();
        } catch (error) {
            console.error(error);
            alert(error.message);
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
                                Environmental Monitoring
                            </p>

                            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                                Environment Management
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-100">
                                Monitor air quality, temperature, humidity and environmental conditions across the city.
                            </p>
                        </div>

                        <span className="w-fit shrink-0 whitespace-nowrap rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
                            ● Sensors Active
                        </span>
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Total Sensors
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {environmentData.length}
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-emerald-600">
                            Environmental records
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Average AQI
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {environmentData.length
                                ? (
                                    environmentData.reduce(
                                        (sum, item) => sum + Number(item.aqi || 0),
                                        0
                                    ) / environmentData.length
                                ).toFixed(1)
                                : "0.0"}
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-blue-600">
                            Air quality index
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Avg Temperature
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {environmentData.length
                                ? (
                                    environmentData.reduce(
                                        (sum, item) => sum + Number(item.temperature || 0),
                                        0
                                    ) / environmentData.length
                                ).toFixed(1)
                                : "0.0"} °C
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-orange-600">
                            City temperature
                        </p>
                    </div>

                    <div className="rounded-2xl  bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Avg Humidity
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-800">
                            {environmentData.length
                                ? (
                                    environmentData.reduce(
                                        (sum, item) => sum + Number(item.humidity || 0),
                                        0
                                    ) / environmentData.length
                                ).toFixed(1)
                                : "0.0"}%
                        </p>
                        <p className="mt-1 text-[10px] font-medium text-cyan-600">
                            Atmospheric humidity
                        </p>
                    </div>

                </div>

                {/* FORM */}
                <div className="mb-6 rounded-2xl  bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.06)] sm:p-6">

                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold leading-tight text-slate-800">
                                {editingId
                                    ? "Update Environment Data"
                                    : "Add Environment Data"}
                            </h2>

                            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                                Enter environmental measurements for a city monitoring location.
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                            <span className="w-fit whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                                Sensor Data
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
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                AQI
                            </label>
                            <input
                                type="number"
                                name="aqi"
                                placeholder="e.g. 85"
                                value={formData.aqi}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                PM2.5
                            </label>
                            <input
                                type="number"
                                name="pm25"
                                placeholder="µg/m³"
                                value={formData.pm25}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                PM10
                            </label>
                            <input
                                type="number"
                                name="pm10"
                                placeholder="µg/m³"
                                value={formData.pm10}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                CO₂
                            </label>
                            <input
                                type="number"
                                name="co2"
                                placeholder="ppm"
                                value={formData.co2}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Temperature
                            </label>
                            <input
                                type="number"
                                name="temperature"
                                placeholder="°C"
                                value={formData.temperature}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Humidity
                            </label>
                            <input
                                type="number"
                                name="humidity"
                                placeholder="%"
                                value={formData.humidity}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Noise
                            </label>
                            <input
                                type="number"
                                name="noise"
                                placeholder="dB"
                                value={formData.noise}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2 lg:col-span-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="shrink-0 whitespace-nowrap rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0"
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
                                Environment Records
                            </h2>

                            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
                                Review environmental measurements from all registered sensors.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">

                            <input
                                type="text"
                                placeholder="Search location..."
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 sm:w-64"
                                onChange={(e) => {
                                    const value = e.target.value.toLowerCase();

                                    document
                                        .querySelectorAll("[data-environment-row]")
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
                                {environmentData.length} Total
                            </span>

                        </div>

                    </div>

                    {environmentData.length === 0 ? (
                        <div className="p-10 text-center text-sm font-medium text-slate-600">
                            No environment records found.
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
                                            AQI
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            PM2.5
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            PM10
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            CO₂
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Temp
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Humidity
                                        </th>

                                        <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Noise
                                        </th>

                                        <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {environmentData.map((item) => (
                                        <tr
                                            key={item._id}
                                            data-environment-row
                                            className="border-t border-slate-200 transition-colors hover:bg-emerald-50/30"
                                        >

                                            <td className="px-4 py-4 text-xs font-bold text-slate-800">
                                                {item.location}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
                                                        Number(item.aqi) >= 200
                                                            ? "bg-red-50 text-red-600"
                                                            : Number(item.aqi) >= 150
                                                                ? "bg-orange-50 text-orange-600"
                                                                : Number(item.aqi) >= 100
                                                                    ? "bg-amber-50 text-amber-600"
                                                                    : "bg-emerald-50 text-emerald-600"
                                                    }`}
                                                >
                                                    {item.aqi}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-700">
                                                {item.pm25}
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-700">
                                                {item.pm10}
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-700">
                                                {item.co2}
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-700">
                                                {item.temperature} °C
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-700">
                                                {item.humidity}%
                                            </td>

                                            <td className="px-4 py-4 text-xs font-medium text-slate-700">
                                                {item.noise} dB
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

export default EnvironmentManagement;
