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
    { label: "Buildings", icon: "🏢", path: "/management/buildings" },
    { label: "City Map", icon: "🗺️", path: "/map" }
];

function StatCard({
    icon,
    label,
    value,
    description,
    trend,
    trendUp = true,
    onClick,
    accent = "blue",
    live = false
}) {
    const accents = {
        blue: {
            icon: "bg-blue-50 text-blue-600 border-blue-100",
            line: "bg-blue-500",
            glow: "hover:border-blue-300 hover:shadow-blue-100/70"
        },
        purple: {
            icon: "bg-purple-50 text-purple-600 border-purple-100",
            line: "bg-purple-500",
            glow: "hover:border-purple-300 hover:shadow-purple-100/70"
        },
        red: {
            icon: "bg-red-50 text-red-500 border-red-100",
            line: "bg-red-500",
            glow: "hover:border-red-200 hover:shadow-red-100/70"
        },
        green: {
            icon: "bg-emerald-50 text-emerald-600 border-emerald-100",
            line: "bg-emerald-500",
            glow: "hover:border-emerald-300 hover:shadow-emerald-100/70"
        },
        cyan: {
            icon: "bg-cyan-50 text-cyan-600 border-cyan-100",
            line: "bg-cyan-500",
            glow: "hover:border-cyan-300 hover:shadow-cyan-100/70"
        },
        orange: {
            icon: "bg-orange-50 text-orange-500 border-orange-100",
            line: "bg-orange-500",
            glow: "hover:border-orange-300 hover:shadow-orange-100/70"
        },
        yellow: {
            icon: "bg-yellow-50 text-yellow-600 border-yellow-100",
            line: "bg-yellow-500",
            glow: "hover:border-yellow-300 hover:shadow-yellow-100/70"
        }
    };

    const style = accents[accent] || accents.blue;

    return (
        <button
            onClick={onClick}
            className={`group relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:bg-slate-50/70 hover:shadow-xl ${style.glow}`}
        >
            <div
                className={`absolute left-0 top-0 h-full w-1 ${style.line} opacity-70 transition-all duration-200 group-hover:w-1.5`}
            />

            <div className="flex items-start justify-between gap-3">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition-transform duration-200 group-hover:scale-110 ${style.icon}`}
                >
                    {icon}
                </div>

                {live && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        LIVE
                    </span>
                )}

                {trend !== undefined && !live && (
                    <span
                        className={`text-[10px] font-bold ${
                            trendUp
                                ? "text-emerald-500"
                                : "text-red-500"
                        }`}
                    >
                        {trendUp ? "↑" : "↓"} {trend}
                    </span>
                )}
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-400">
                {label}
            </p>

            <div className="mt-1 flex items-end justify-between gap-2">
                <p
                    key={String(value)}
                    className={`text-2xl font-bold tracking-tight text-slate-900 ${
                        live ? "animate-pulse" : ""
                    }`}
                >
                    {value}
                </p>

                <span className="shrink-0 text-lg text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue-500">
                    →
                </span>
            </div>

            {description && (
                <p className="mt-2 truncate text-[11px] text-slate-400">
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
        <div className="min-h-screen w-full overflow-x-hidden bg-[#f7f9fc] text-slate-800">

            {/* DESKTOP SIDEBAR */}

            <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-56 p-2 lg:flex">

                <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]">

                    {/* SIDEBAR HEADER */}

                    <button
                        onClick={() => navigate("/")}
                        className="group border-b border-blue-100 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 px-4 py-5 text-left transition hover:from-blue-700 hover:via-blue-600 hover:to-indigo-600"
                    >
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/15 text-lg text-white shadow-lg backdrop-blur transition duration-300 group-hover:scale-110 group-hover:rotate-2">
                                🏙️
                            </div>

                            <div className="min-w-0">
                                <p className="text-lg font-bold tracking-tight text-white">
                                    CityTwin
                                </p>

                                <p className="text-[10px] font-medium text-blue-100">
                                    Smart City Platform
                                </p>
                            </div>

                        </div>

                        <div className="mt-4 h-px bg-white/20" />

                        <div className="mt-3 flex items-center gap-2">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,0.15)]" />

                            <span className="text-[9px] font-bold uppercase tracking-widest text-blue-100">
                                System Online
                            </span>
                        </div>
                    </button>

                    {/* SIDEBAR MIDDLE */}

                    <div className="flex-1 overflow-y-auto bg-slate-50/70 px-2.5 py-4">

                        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">

                            <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
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
                                            className={`group relative flex w-full items-center gap-3 rounded-lg border px-2.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                                                active
                                                    ? "border-blue-200 bg-blue-50 text-blue-600 shadow-sm"
                                                    : "border-transparent text-slate-500 hover:-translate-y-0.5 hover:border-blue-100 hover:bg-blue-50/60 hover:text-blue-600 hover:shadow-sm"
                                            }`}
                                        >

                                            {active && (
                                                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-500" />
                                            )}

                                            <span
                                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm transition-all duration-200 ${
                                                    active
                                                        ? "bg-blue-100 shadow-sm"
                                                        : "bg-slate-50 group-hover:bg-blue-100 group-hover:scale-110"
                                                }`}
                                            >
                                                {item.icon}
                                            </span>

                                            <span className="truncate">
                                                {item.label}
                                            </span>

                                            <span
                                                className={`ml-auto text-xs transition-all duration-200 ${
                                                    active
                                                        ? "translate-x-0 text-blue-400"
                                                        : "-translate-x-1 text-transparent group-hover:translate-x-0 group-hover:text-blue-300"
                                                }`}
                                            >
                                                →
                                            </span>

                                        </button>
                                    );
                                })}

                            </div>

                        </div>

                    </div>

                </div>

            </aside>

            {/* MAIN */}

            <div className="min-h-screen min-w-0 lg:fixed lg:inset-y-0 lg:left-[14.25rem] lg:right-0 lg:overflow-y-auto">

                {/* TOP BAR */}

                <header className="sticky top-0 z-30 px-3 py-3 sm:px-5 lg:px-6">

                    <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-600 px-4 py-3 shadow-[0_6px_25px_rgba(37,99,235,0.16)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(37,99,235,0.22)]">

                        {/* CITYTWIN BRAND */}

                        <button
                            onClick={() => navigate("/")}
                            className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-2.5 py-2 text-left backdrop-blur transition-all duration-200 hover:bg-white/20"
                        >

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-lg shadow-sm transition duration-300 group-hover:scale-110 group-hover:rotate-2">
                                🏙️
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold tracking-tight text-white">
                                    CityTwin
                                </p>

                                <p className="hidden text-[9px] font-medium text-emerald-100 sm:block">
                                    Smart City Platform
                                </p>
                            </div>

                        </button>

                        {/* LIVE MONITORING */}

                        <div className="hidden items-center gap-3 md:flex">

                            <div className="h-8 w-px bg-white/20" />

                            <div>
                                <p className="text-xs font-bold tracking-wide text-white">
                                    LIVE CITY MONITORING
                                </p>

                                <p className="text-[9px] font-medium text-emerald-100">
                                    Real-time digital twin
                                </p>
                            </div>

                        </div>

                        {/* HEADER ACTIONS */}

                        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">

                            <button
                                onClick={() => navigate("/map")}
                                className="hidden items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[9px] font-bold text-white backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 sm:flex"
                            >
                                🗺️
                                <span>City Map</span>
                            </button>

                            <div className="hidden rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur lg:block">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-100">
                                    Status
                                </p>

                                <p className="mt-0.5 text-[10px] font-bold text-white">
                                    All Systems Active
                                </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl border border-emerald-200/40 bg-emerald-400/20 px-3 py-2 shadow-sm backdrop-blur transition-all duration-200 hover:bg-emerald-400/30">

                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(167,243,208,0.15)]" />

                                <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                                    LIVE
                                </span>

                            </div>

                        </div>

                    </div>

                </header>

                <main className="w-full min-w-0 overflow-x-hidden px-3 py-5 sm:px-6 lg:px-7">

                    {/* WELCOME */}

                    <section className="relative mb-5 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-sky-50 to-white shadow-sm px-5 py-6 sm:px-7">

                        <div className="relative z-10 max-w-xl">

                            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                LIVE CITY MONITORING
                            </p>

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
                            live
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
                            live
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
                            live
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
                            live
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
                            live
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
                            live
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
                            live
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

                    {/* RECENT ALERTS */}

                    <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">

                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    🔔 Recent Alerts
                                </h2>

                                <p className="mt-1 text-[10px] text-slate-400">
                                    Live system notifications
                                </p>
                            </div>

                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-500">
                                {alerts.length} Active
                            </span>

                        </div>

                        <div className="p-3 sm:p-4">

                            {alerts.length === 0 ? (

                                <div className="py-10 text-center">

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

                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">

                                    {alerts.map((alert, index) => (

                                        <button
                                            key={`${alert.title}-${index}`}
                                            onClick={() =>
                                                navigate(alert.path)
                                            }
                                            className={`group relative w-full overflow-hidden rounded-xl border bg-white p-3 text-left shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                                                alert.type === "CRITICAL"
                                                    ? "border-red-100 hover:border-red-300 hover:bg-red-50/30"
                                                    : "border-orange-100 hover:border-orange-300 hover:bg-orange-50/30"
                                            }`}
                                        >

                                            <div
                                                className={`absolute left-0 top-0 h-full w-1 transition-all duration-200 group-hover:w-1.5 ${
                                                    alert.type === "CRITICAL"
                                                        ? "bg-red-500"
                                                        : "bg-orange-400"
                                                }`}
                                            />

                                            <div className="flex gap-3">

                                                <span
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm shadow-sm transition-transform duration-200 group-hover:scale-110 ${
                                                        alert.type === "CRITICAL"
                                                            ? "border-red-100 bg-red-50"
                                                            : "border-orange-100 bg-orange-50"
                                                    }`}
                                                >
                                                    {alert.icon}
                                                </span>

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex items-start justify-between gap-2">

                                                        <p className="truncate text-xs font-bold text-slate-800">
                                                            {alert.title}
                                                        </p>

                                                        <span className="shrink-0 text-base text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-blue-500">
                                                            →
                                                        </span>

                                                    </div>

                                                    <p className="mt-1 truncate text-[10px] text-slate-400">
                                                        {alert.detail}
                                                    </p>

                                                    <div className="mt-2 flex items-center justify-between gap-2">

                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold ${
                                                                alert.type === "CRITICAL"
                                                                    ? "bg-red-50 text-red-500"
                                                                    : "bg-orange-50 text-orange-500"
                                                            }`}
                                                        >
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${
                                                                    alert.type === "CRITICAL"
                                                                        ? "animate-pulse bg-red-500"
                                                                        : "bg-orange-400"
                                                                }`}
                                                            />

                                                            {alert.type}
                                                        </span>

                                                        <span className="text-[9px] font-semibold text-slate-300 transition group-hover:text-slate-500">
                                                            View details
                                                        </span>

                                                    </div>

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
                                className="mt-3 w-full rounded-lg py-2 text-[10px] font-bold text-blue-600 transition hover:bg-blue-50"
                            >
                                View All Alerts →
                            </button>

                        </div>

                    </section>

                    {/* ANALYTICS */}

                    <section className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/60 p-4 shadow-sm shadow-slate-200/50 sm:p-5">

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

                    <footer className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-r from-white via-blue-50/40 to-indigo-50/60 p-4 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_8px_25px_rgba(37,99,235,0.08)]">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-sm shadow-sm transition-transform duration-300 hover:scale-110">
                                    🏙️
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-700">
                                        CityTwin
                                    </p>

                                    <p className="text-[9px] text-slate-400">
                                        Smart City Digital Twin
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">

                                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                                        <span className="text-[9px] font-bold text-emerald-600">
                                            SYSTEM LIVE
                                        </span>
                                    </div>
                                </div>

                                <div className="group rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-100/70 hover:shadow-md">
                                    <div className="flex items-center gap-2">

                                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-xs shadow-sm transition-transform duration-200 group-hover:scale-110">
                                            🕐
                                        </span>

                                        <div>
                                            <p className="text-[8px] font-bold uppercase tracking-wider text-blue-100">
                                                Last update
                                            </p>

                                            <p className="mt-0.5 text-[10px] font-bold text-blue-700">
                                                {cityData?.timestamp
                                                    ? new Date(
                                                          cityData.timestamp
                                                      ).toLocaleTimeString()
                                                    : "--"}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>
                    </footer>

                </main>
            </div>
        </div>
    );
}
