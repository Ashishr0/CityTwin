import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CityManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const canManage =
        user?.role === "ADMIN" ||
        user?.role === "CITY_OPERATOR";

    const modules = [
        {
            name: "Buildings",
            description: "Manage city buildings and infrastructure.",
            path: "/management/buildings",
            color: "indigo"
        },
        {
            name: "Traffic",
            description: "Manage traffic conditions and intersections.",
            path: "/management/traffic",
            color: "red"
        },
        {
            name: "Vehicles",
            description: "Manage city vehicles and their status.",
            path: "/management/vehicles",
            color: "blue"
        },
        {
            name: "Incidents",
            description: "Monitor and manage city incidents.",
            path: "/management/incidents",
            color: "orange"
        },
        {
            name: "Environment",
            description: "Manage air quality and environmental sensors.",
            path: "/management/environment",
            color: "green"
        },
        {
            name: "Energy",
            description: "Manage energy consumption and renewable data.",
            path: "/management/energy",
            color: "amber"
        },
        {
            name: "Water",
            description: "Manage water levels, consumption and alerts.",
            path: "/management/water",
            color: "cyan"
        },
        {
            name: "Waste",
            description: "Manage waste bins and collection data.",
            path: "/management/waste",
            color: "emerald"
        }
    ];

    const colorClasses = {
        indigo: {
            accent: "bg-indigo-500",
            text: "text-indigo-600",
            soft: "bg-indigo-50",
            button: "bg-indigo-600 hover:bg-indigo-700"
        },
        red: {
            accent: "bg-red-500",
            text: "text-red-600",
            soft: "bg-red-50",
            button: "bg-red-600 hover:bg-red-700"
        },
        blue: {
            accent: "bg-blue-500",
            text: "text-blue-600",
            soft: "bg-blue-50",
            button: "bg-blue-600 hover:bg-blue-700"
        },
        orange: {
            accent: "bg-orange-500",
            text: "text-orange-600",
            soft: "bg-orange-50",
            button: "bg-orange-600 hover:bg-orange-700"
        },
        green: {
            accent: "bg-green-500",
            text: "text-green-600",
            soft: "bg-green-50",
            button: "bg-green-600 hover:bg-green-700"
        },
        amber: {
            accent: "bg-amber-500",
            text: "text-amber-600",
            soft: "bg-amber-50",
            button: "bg-amber-500 hover:bg-amber-600"
        },
        cyan: {
            accent: "bg-cyan-500",
            text: "text-cyan-600",
            soft: "bg-cyan-50",
            button: "bg-cyan-600 hover:bg-cyan-700"
        },
        emerald: {
            accent: "bg-emerald-500",
            text: "text-emerald-600",
            soft: "bg-emerald-50",
            button: "bg-emerald-600 hover:bg-emerald-700"
        }
    };

    if (!canManage) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
                <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Access Denied
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        You do not have permission to manage city data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">

            <div className="mx-auto w-full max-w-7xl">

                {/* HEADER */}

                <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 px-6 py-7 text-white shadow-lg sm:px-8 sm:py-8">

                    <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

                    <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <p className="text-sm font-medium tracking-wide text-cyan-200">
                                CityTwin Control Center
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                City Management
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                                Welcome, {user.name}. Manage all connected city
                                systems from one place.
                            </p>
                        </div>

                        <div className="w-fit rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md">

                            <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
                                Access Level
                            </p>

                            <p className="mt-1 text-lg font-bold">
                                {user.role}
                            </p>

                        </div>

                    </div>

                </section>

                {/* SUMMARY */}

                <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Management Modules
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            8
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Connected city systems
                        </p>

                    </div>

                    <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Infrastructure
                        </p>

                        <p className="mt-2 text-xl font-bold text-indigo-600">
                            Buildings
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Physical city assets
                        </p>

                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Mobility
                        </p>

                        <p className="mt-2 text-xl font-bold text-blue-600">
                            Traffic
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Traffic and vehicles
                        </p>

                    </div>

                    <div className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Utilities
                        </p>

                        <p className="mt-2 text-3xl font-bold text-cyan-600">
                            4
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Energy, water, waste and environment
                        </p>

                    </div>

                </section>

                {/* TITLE */}

                <section className="mb-5">

                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                        City Systems
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Select a system to open its management dashboard.
                    </p>

                </section>

                {/* MODULES */}

                <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    {modules.map((module) => {

                        const colors = colorClasses[module.color];

                        return (
                            <article
                                key={module.name}
                                className="group relative flex min-h-[215px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                            >

                                {/* Accent */}

                                <div
                                    className={`absolute left-0 top-0 h-1 w-full ${colors.accent}`}
                                />

                                <div className="flex items-center justify-between">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.soft} ${colors.text}`}
                                    >
                                        CITY SYSTEM
                                    </span>

                                    <span
                                        className={`h-2.5 w-2.5 rounded-full ${colors.accent} opacity-70 transition-all duration-300 group-hover:scale-125 group-hover:opacity-100`}
                                    />

                                </div>

                                <h3 className="mt-5 text-lg font-bold text-slate-900">
                                    {module.name}
                                </h3>

                                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                                    {module.description}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => navigate(module.path)}
                                    className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${colors.button}`}
                                >
                                    Manage {module.name}
                                </button>

                            </article>
                        );
                    })}

                </section>

                {/* FOOTER NAVIGATION */}

                <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <p className="text-sm font-medium text-slate-700">
                            CityTwin Management
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            All management systems are connected to the CityTwin backend.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="w-fit rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        Back to Dashboard
                    </button>

                </section>

            </div>
        </div>
    );
};

export default CityManagement;
