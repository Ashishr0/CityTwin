import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCity } from "../context/CityContext";
import CityMap from "../components/CityMap";
import Analytics from "../components/Analytics";

function average(items, key) {
    if (!Array.isArray(items) || !items.length) return 0;

    return Number(
        (
            items.reduce(
                (sum, item) => sum + Number(item[key] || 0),
                0
            ) / items.length
        ).toFixed(2)
    );
}

function total(items, key) {
    if (!Array.isArray(items)) return 0;

    return items.reduce(
        (sum, item) => sum + Number(item[key] || 0),
        0
    );
}

const navigation = [
    { label: "Dashboard", icon: "▦", path: "/" },
    { label: "Traffic", icon: "🚦", path: "/management/traffic" },
    { label: "Vehicles", icon: "🚗", path: "/management/vehicles" },
    { label: "Incidents", icon: "🚨", path: "/management/incidents" },
    { label: "Environment", icon: "🌿", path: "/management/environment" },
    { label: "Energy", icon: "⚡", path: "/management/energy" },
    { label: "Water", icon: "💧", path: "/management/water" },
    { label: "Waste", icon: "🗑️", path: "/management/waste" },
    { label: "Buildings", icon: "🏢", path: "/management/buildings" }
];

function StatCard({
    icon,
    label,
    value,
    description,
    trend,
    trendUp = true,
    onClick,
    accent = "blue"
}) {
    const accents = {
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        red: "bg-red-50 text-red-500",
        green: "bg-emerald-50 text-emerald-600",
        cyan: "bg-cyan-50 text-cyan-600",
        orange: "bg-orange-50 text-orange-500",
        yellow: "bg-yellow-50 text-yellow-600"
    };

    return (
        <button
            onClick={onClick}
            className="group w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
        >
            <div className="flex items-start justify-between gap-2">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${accents[accent]}`}
                >
                    {icon}
                </div>

                {trend !== undefined && (
                    <span
                        className={`text-xs font-bold ${
                            trendUp
                                ? "text-emerald-500"
                                : "text-red-500"
                        }`}
                    >
                        {trendUp ? "↑" : "↓"} {trend}
                    </span>
                )}
            </div>

            <p className="mt-4 text-xs font-medium text-slate-400">
                {label}
            </p>

            <div className="mt-1 flex items-end justify-between gap-2">
                <p className="text-2xl font-bold tracking-tight text-slate-900">
                    {value}
                </p>

                <span className="text-xs font-semibold text-slate-300 transition group-hover:text-blue-500">
                    VIEW →
                </span>
            </div>

            {description && (
                <p className="mt-1 text-[11px] text-slate-400">
                    {description}
                </p>
            )}
        </button>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    const { user, logout } = useAuth();
    const { cityData, connected } = useCity();

    const data = cityData?.data;

    const traffic = average(data?.traffic, "congestion");
    const speed = average(data?.traffic, "averageSpeed");

    const aqi = average(data?.environment, "aqi");
    const temperature = average(
        data?.environment,
        "temperature"
    );

    const energy = Number(
        data?.energy?.consumption || 0
    );

    const renewable = Number(
        data?.energy?.renewablePercentage || 0
    );

    const water = Number(
        data?.water?.reservoirLevel || 0
    );

    const pressure = Number(
        data?.water?.pipelinePressure || 0
    );

    const waste = average(data?.waste, "fillLevel");

    const activeIncidents =
        data?.incidents?.filter(
            item => item.status !== "RESOLVED"
        ).length || 0;

    const alerts = [];

    data?.waste
        ?.filter(item => item.status === "CRITICAL")
        .slice(0, 3)
        .forEach(item => {
            alerts.push({
                icon: "🗑️",
                title: "Waste bin requires attention",
                detail: `${item.fillLevel || 0}% full`,
                type: "WARNING",
                path: "/management/waste"
            });
        });

    if (traffic >= 80) {
        alerts.push({
            icon: "🚦",
            title: "Traffic congestion",
            detail: `${traffic}% average congestion`,
            type: "WARNING",
            path: "/management/traffic"
        });
    }

    if (aqi >= 200) {
        alerts.push({
            icon: "🌿",
            title: "Air quality critical",
            detail: `AQI ${aqi}`,
            type: "CRITICAL",
            path: "/management/environment"
        });
    }

    data?.incidents
        ?.filter(
            item =>
                item.priority === "CRITICAL" &&
                item.status !== "RESOLVED"
        )
        .slice(0, 2)
        .forEach(item => {
            alerts.push({
                icon: "🚨",
                title: item.title || "Critical incident",
                detail: item.incidentId || "Active incident",
                type: "CRITICAL",
                path: "/management/incidents"
            });
        });

    data?.vehicles
        ?.filter(item => item.status === "EMERGENCY")
        .slice(0, 2)
        .forEach(item => {
            alerts.push({
                icon: "🚑",
                title: "Emergency vehicle active",
                detail: item.vehicleId || "Emergency vehicle",
                type: "CRITICAL",
                path: "/management/vehicles"
            });
        });

    return (
        <div className="min-h-screen bg-[#f7f9fc] text-slate-800">

            {/* DESKTOP SIDEBAR */}

            <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 border-r border-slate-200 bg-white lg:flex">
                <div className="flex w-full flex-col">

                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 text-left"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg text-white shadow-sm">
                            🏙️
                        </div>

                        <div>
                            <p className="text-lg font-bold text-slate-900">
                                CityTwin
                            </p>

                            <p className="text-[10px] text-slate-400">
                                Smart City Platform
                            </p>
                        </div>
                    </button>

                    <div className="flex-1 overflow-y-auto px-3 py-5">

                        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Main Menu
                        </p>

                        <div className="space-y-1">
                            {navigation.map(item => {
                                const active =
                                    location.pathname === item.path;

                                return (
                                    <button
                                        key={item.path}
                                        onClick={() =>
                                            navigate(item.path)
                                        }
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                            active
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                    >
                                        <span className="w-5 text-center">
                                            {item.icon}
                                        </span>

                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>

                        <p className="mb-3 mt-7 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Management
                        </p>

                        <button
                            onClick={() => navigate("/management")}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                            <span className="w-5 text-center">
                                ⚙️
                            </span>

                            City Management
                        </button>
                    </div>

                    <div className="border-t border-slate-100 p-3">

                        <div className="mb-3 rounded-xl bg-slate-50 p-3">
                            <p className="text-[10px] text-slate-400">
                                Signed in as
                            </p>

                            <p className="mt-1 truncate text-sm font-bold text-slate-800">
                                {user?.name || "City Admin"}
                            </p>

                            <p className="text-[10px] uppercase text-slate-400">
                                {user?.role || "ADMIN"}
                            </p>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-red-500"
                        >
                            ↪ Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN */}

            <div className="lg:ml-56">

                {/* TOP BAR */}

                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
                    <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6">

                        <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]" />

                            <div>
                                <p className="text-xs font-bold text-slate-700">
                                    LIVE CITY MONITORING
                                </p>

                                <p className="hidden text-[10px] text-slate-400 sm:block">
                                    Real-time digital twin
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">

                            <div
                                className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                                    connected
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-red-50 text-red-500"
                                }`}
                            >
                                ● {connected ? "LIVE" : "OFFLINE"}
                            </div>

                            <div className="hidden text-right sm:block">
                                <p className="text-xs font-bold text-slate-800">
                                    {user?.name || "City Admin"}
                                </p>

                                <p className="text-[10px] text-slate-400">
                                    {user?.role || "ADMIN"}
                                </p>
                            </div>

                            <button
                                onClick={logout}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-7">

                    {/* WELCOME */}

                    <section className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-white px-5 py-6 sm:px-7">

                        <div className="relative z-10 max-w-xl">

                            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                LIVE CITY MONITORING
                            </p>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Welcome back, {user?.name || "City Admin"} 👋
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Monitor your city's infrastructure and
                                real-time systems from one place.
                            </p>
                        </div>

                        <div className="absolute -right-5 -top-12 hidden text-[130px] opacity-10 sm:block">
                            🏙️
                        </div>

                        <div className="absolute right-5 top-5 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-bold text-emerald-600 shadow-sm">
                            ● System Online
                        </div>
                    </section>

                    {/* KPI GRID */}

                    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">

                        <StatCard
                            icon="🏢"
                            label="Buildings"
                            value={data?.buildings?.length || 0}
                            description="Active buildings"
                            trend="0"
                            onClick={() =>
                                navigate("/management/buildings")
                            }
                        />

                        <StatCard
                            icon="🚗"
                            label="Vehicles"
                            value={data?.vehicles?.length || 0}
                            description="Active vehicles"
                            trend="1"
                            onClick={() =>
                                navigate("/management/vehicles")
                            }
                            accent="purple"
                        />

                        <StatCard
                            icon="🚨"
                            label="Active Incidents"
                            value={activeIncidents}
                            description="Requires attention"
                            trend="1"
                            trendUp={false}
                            onClick={() =>
                                navigate("/management/incidents")
                            }
                            accent="red"
                        />

                        <StatCard
                            icon="🌿"
                            label="Average AQI"
                            value={aqi}
                            description={`${temperature}°C average temperature`}
                            trend="5.2"
                            onClick={() =>
                                navigate("/management/environment")
                            }
                            accent="green"
                        />

                        <StatCard
                            icon="💧"
                            label="Water"
                            value={`${water}%`}
                            description={`Pressure ${pressure}`}
                            trend="1.3%"
                            onClick={() =>
                                navigate("/management/water")
                            }
                            accent="cyan"
                        />

                        <StatCard
                            icon="🗑️"
                            label="Waste"
                            value={`${waste}%`}
                            description="Average collection level"
                            trend="2.1%"
                            onClick={() =>
                                navigate("/management/waste")
                            }
                            accent="yellow"
                        />

                        <StatCard
                            icon="⚡"
                            label="Energy"
                            value={energy}
                            description="Consumption (kWh)"
                            trend="4.7%"
                            onClick={() =>
                                navigate("/management/energy")
                            }
                            accent="orange"
                        />

                        <button
                            onClick={() =>
                                navigate("/management")
                            }
                            className="group w-full rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-600">
                                💚
                            </div>

                            <p className="mt-4 text-xs font-medium text-slate-400">
                                City Health
                            </p>

                            <div className="mt-1 flex items-center justify-between">
                                <p className="text-2xl font-bold text-slate-900">
                                    Good
                                </p>

                                <span className="text-xl text-emerald-500">
                                    →
                                </span>
                            </div>

                            <p className="mt-1 text-[11px] text-slate-400">
                                Overall city status
                            </p>
                        </button>

                    </section>

                    {/* MAP + ALERTS */}

                    <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    🗺️ City Digital Map
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Real-time city infrastructure monitoring
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 text-[10px] font-medium text-slate-500">
                                <span>🔴 Traffic</span>
                                <span>🟢 Environment</span>
                                <span>🟡 Waste</span>
                                <span>🔵 Vehicle</span>
                                <span>🟣 Incident</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_310px]">

                            <div className="min-w-0 p-2 sm:p-3">
                                <CityMap />
                            </div>

                            <div className="border-t border-slate-100 xl:border-l xl:border-t-0">

                                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            🔔 Recent Alerts
                                        </h3>

                                        <p className="text-[10px] text-slate-400">
                                            Live system notifications
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-500">
                                        {alerts.length}
                                    </span>
                                </div>

                                <div className="max-h-[500px] overflow-y-auto p-3">

                                    {alerts.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <div className="text-3xl">
                                                ✅
                                            </div>

                                            <p className="mt-2 text-sm font-bold text-emerald-600">
                                                All systems normal
                                            </p>

                                            <p className="mt-1 text-[10px] text-slate-400">
                                                No critical alerts detected.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {alerts.map((alert, index) => (
                                                <button
                                                    key={`${alert.title}-${index}`}
                                                    onClick={() =>
                                                        navigate(alert.path)
                                                    }
                                                    className="group w-full rounded-xl border border-slate-100 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                                                >
                                                    <div className="flex gap-3">

                                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-sm">
                                                            {alert.icon}
                                                        </span>

                                                        <div className="min-w-0 flex-1">

                                                            <div className="flex items-start justify-between gap-2">
                                                                <p className="text-xs font-bold text-slate-800">
                                                                    {alert.title}
                                                                </p>

                                                                <span className="text-slate-300 group-hover:text-blue-500">
                                                                    →
                                                                </span>
                                                            </div>

                                                            <p className="mt-1 text-[10px] text-slate-400">
                                                                {alert.detail}
                                                            </p>

                                                            <span
                                                                className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[8px] font-bold ${
                                                                    alert.type === "CRITICAL"
                                                                        ? "bg-red-50 text-red-500"
                                                                        : "bg-orange-50 text-orange-500"
                                                                }`}
                                                            >
                                                                {alert.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={() =>
                                            navigate("/management/incidents")
                                        }
                                        className="mt-3 w-full rounded-lg py-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50"
                                    >
                                        View All Alerts →
                                    </button>

                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ANALYTICS */}

                    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                        <div className="mb-4 flex items-center justify-between">

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    📊 Live Analytics
                                </h2>

                                <p className="mt-1 text-[10px] text-slate-400">
                                    Real-time city performance and trends
                                </p>
                            </div>

                            <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-600">
                                ● Live monitoring
                            </div>

                        </div>

                        <Analytics />

                    </section>

                    <footer className="mt-5 flex flex-col justify-between gap-2 border-t border-slate-200 py-4 text-[10px] text-slate-400 sm:flex-row">
                        <span>
                            CityTwin • Smart City Digital Twin
                        </span>

                        <span>
                            Last update:{" "}
                            {cityData?.timestamp
                                ? new Date(
                                      cityData.timestamp
                                  ).toLocaleTimeString()
                                : "--"}
                        </span>
                    </footer>

                </main>
            </div>
        </div>
    );
}
