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

    const token = localStorage.getItem("token");

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
        <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-8">

            <div className="mx-auto max-w-7xl">

                <h1 className="mb-8 text-3xl font-bold sm:text-4xl">
                    Environment Management
                </h1>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">

                    <h2 className="mb-6 text-xl font-semibold">
                        {editingId
                            ? "Update Environment Data"
                            : "Add Environment Data"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    >

                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="aqi"
                            placeholder="AQI"
                            value={formData.aqi}
                            onChange={handleChange}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="pm25"
                            placeholder="PM2.5"
                            value={formData.pm25}
                            onChange={handleChange}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="pm10"
                            placeholder="PM10"
                            value={formData.pm10}
                            onChange={handleChange}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="co2"
                            placeholder="CO₂"
                            value={formData.co2}
                            onChange={handleChange}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="temperature"
                            placeholder="Temperature °C"
                            value={formData.temperature}
                            onChange={handleChange}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="humidity"
                            placeholder="Humidity %"
                            value={formData.humidity}
                            onChange={handleChange}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <input
                            type="number"
                            name="noise"
                            placeholder="Noise dB"
                            value={formData.noise}
                            onChange={handleChange}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-green-500"
                        />

                        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-4 sm:flex-row">

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-500 disabled:opacity-50"
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Data"
                                    : "Add Data"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg bg-slate-700 px-5 py-3 font-semibold transition hover:bg-slate-600"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>
                </div>

                <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">

                    <h2 className="mb-6 text-xl font-semibold">
                        Environment Records
                    </h2>

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px] text-left">

                            <thead className="border-b border-slate-700 text-sm text-slate-400">

                                <tr>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">AQI</th>
                                    <th className="px-4 py-3">PM2.5</th>
                                    <th className="px-4 py-3">PM10</th>
                                    <th className="px-4 py-3">CO₂</th>
                                    <th className="px-4 py-3">Temp</th>
                                    <th className="px-4 py-3">Humidity</th>
                                    <th className="px-4 py-3">Noise</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {environmentData.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="px-4 py-8 text-center text-slate-500"
                                        >
                                            No environment records found
                                        </td>
                                    </tr>

                                ) : (

                                    environmentData.map((item) => (

                                        <tr
                                            key={item._id}
                                            className="border-b border-slate-800"
                                        >

                                            <td className="px-4 py-4">
                                                {item.location}
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.aqi}
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.pm25}
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.pm10}
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.co2}
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.temperature} °C
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.humidity}%
                                            </td>

                                            <td className="px-4 py-4">
                                                {item.noise} dB
                                            </td>

                                            <td className="px-4 py-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                        className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-500"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(item._id)
                                                        }
                                                        className="rounded bg-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-500"
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

export default EnvironmentManagement;
