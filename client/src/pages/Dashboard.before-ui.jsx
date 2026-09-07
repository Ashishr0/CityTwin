import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCity } from "../context/CityContext";
import CityMap from "../components/CityMap";
import Analytics from "../components/Analytics";

function average(items, key) {
    if (!Array.isArray(items) || items.length === 0) return 0;

    const total = items.reduce(
        (sum, item) => sum + Number(item[key] || 0),
        0
    );

    return Number((total / items.length).toFixed(2));
}

function total(items, key) {
    if (!Array.isArray(items)) return 0;

    return items.reduce(
        (sum, item) => sum + Number(item[key] || 0),
        0
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { cityData, connected } = useCity();

    const data = cityData?.data;

    const trafficCongestion = average(data?.traffic, "congestion");
    const trafficSpeed = average(data?.traffic, "averageSpeed");
    const trafficVehicles = total(data?.traffic, "vehicles");

    const environmentAQI = average(data?.environment, "aqi");
    const environmentTemperature = average(
        data?.environment,
        "temperature"
    );

    const wasteFill = average(data?.waste, "fillLevel");

    const energyConsumption = Number(
        data?.energy?.consumption || 0
    );

    const renewablePercentage = Number(
        data?.energy?.renewablePercentage || 0
    );

    const waterLevel = Number(
        data?.water?.reservoirLevel || 0
    );

    const pipelinePressure = Number(
        data?.water?.pipelinePressure || 0
    );

    const activeIncidents =
        data?.incidents?.filter(
            incident => incident.status !== "RESOLVED"
        ).length || 0;

    const alerts = [];

    if (environmentAQI >= 200) {
        alerts.push({
            title: "Air quality is critical",
            value: `AQI ${environmentAQI}`,
            icon: "🌫️",
            type: "critical",
            link: "/management/environment"
        });
    }

    if (trafficCongestion >= 80) {
        alerts.push({
            title: "Heavy traffic congestion",
            value: `${trafficCongestion}% congestion`,
            icon: "🚦",
            type: "warning",
            link: "/management/traffic"
        });
    }

    if (waterLevel <= 20) {
        alerts.push({
            title: "Reservoir level is low",
            value: `${waterLevel}% remaining`,
            icon: "💧",
            type: "critical",
            link: "/management/water"
        });
    }

    data?.incidents
        ?.filter(
            incident =>
                incident.priority === "CRITICAL" &&
                incident.status !== "RESOLVED"
        )
        .forEach(incident => {
            alerts.push({
                title: incident.title || "Critical incident",
                value: incident.incidentId || "Incident",
                icon: "🚨",
                type: "critical",
                link: "/management/incidents"
            });
        });

    data?.vehicles
        ?.filter(vehicle => vehicle.status === "EMERGENCY")
        .forEach(vehicle => {
            alerts.push({
                title: "Emergency vehicle active",
                value: vehicle.vehicleId || "Emergency vehicle",
                icon: "🚑",
                type: "critical",
                link: "/management/vehicles"
            });
        });

    data?.waste
        ?.filter(bin => bin.status === "CRITICAL")
        .forEach(bin => {
            alerts.push({
                title: "Waste bin requires attention",
                value: `${bin.fillLevel || 0}% full`,
                icon: "🗑️",
                type: "warning",
                link: "/management/waste"
            });
        });

    const navigation = [
        {
            label: "Dashboard",
            icon: "▦",
            path: "/"
        },
        {
            label: "Traffic",
            icon: "🚦",
            path: "/management/traffic"
        },
        {
            label: "Vehicles",
            icon: "🚗",
            path: "/management/vehicles"
        },
        {
            label: "Incidents",
            icon: "🚨",
            path: "/management/incidents"
        },
        {
            label: "Environment",
            icon: "🌿",
            path: "/management/environment"
        },
        {
            label: "Energy",
            icon: "⚡",
            path: "/management/energy"
        },
        {
            label: "Water",
            icon: "💧",
            path: "/management/water"
        },
        {
            label: "Waste",
            icon: "🗑️",
            path: "/management/waste"
        },
        {
            label: "Buildings",
            icon: "🏢",
            path: "/management/buildings"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f6f8fb] text-slate-800">

            {/* SIDEBAR */}

            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white xl:block">

                <div className="flex h-full flex-col">

                    <div className="border-b border-slate-100 px-6 py-6">

                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-sm">
                                🏙️
                            </div>

                            <div className="text-left">
                                <h1 className="text-lg font-bold text-slate-900">
                                    CityTwin
                                </h1>

                                <p className="text-xs text-slate-400">
                                    Smart City Platform
                                </p>
                            </div>
                        </button>

                    </div>

                    <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">

                        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Main Menu
                        </p>

                        {navigation.map(item => (

                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                    item.path === "/"
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                <span className="w-6 text-center">
                                    {item.icon}
                                </span>

                                {item.label}
                            </button>

                        ))}

                        <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Management
                        </p>

                        <button
                            onClick={() => navigate("/management")}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                            <span className="w-6 text-center">⚙️</span>
                            City Management
                        </button>

                    </nav>

                    <div className="border-t border-slate-100 p-4">

                        <div className="mb-3 rounded-xl bg-slate-50 p-3">

                            <p className="text-xs text-slate-400">
                                Signed in as
                            </p>

                            <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                                {user?.name || "Admin"}
                            </p>

                            <p className="text-xs text-slate-400">
                                {user?.role || "USER"}
                            </p>

                        </div>

                        <button
                            onClick={logout}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </aside>


            {/* MAIN */}

            <div className="xl:ml-64">

                {/* TOP BAR */}

                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

                    <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

                        <div>
                            <p className="text-sm text-slate-400">
                                Smart City Digital Twin
                            </p>

                            <h2 className="text-lg font-bold text-slate-900">
                                City Operations Dashboard
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">

                            <div
                                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
                                    connected
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-red-50 text-red-600"
                                }`}
                            >
                                <span
                                    className={`h-2 w-2 rounded-full ${
                                        connected
                                            ? "bg-emerald-500"
                                            : "bg-red-500"
                                    }`}
                                />

                                {connected ? "LIVE" : "OFFLINE"}
                            </div>

                            <div className="hidden text-right sm:block">

                                <p className="text-sm font-semibold text-slate-700">
                                    {user?.name || "Admin"}
                                </p>

                                <p className="text-xs text-slate-400">
                                    {user?.role || "USER"}
                                </p>

                            </div>

                            <button
                                onClick={logout}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </header>


                <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">

                    {!data ? (

                        <div className="flex min-h-[70vh] items-center justify-center">

                            <div className="text-center">

                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                                    🏙️
                                </div>

                                <h2 className="text-xl font-bold text-slate-800">
                                    Connecting to CityTwin
                                </h2>

                                <p className="mt-2 text-sm text-slate-400">
                                    Waiting for live city data...
                                </p>

                            </div>

                        </div>

                    ) : (

                        <>

                            {/* WELCOME */}

                            <section className="mb-7">

                                <p className="text-sm font-medium text-blue-600">
                                    LIVE CITY MONITORING
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                    Welcome back, {user?.name || "Admin"} 👋
                                </h1>

                                <p className="mt-2 text-sm text-slate-500">
                                    Monitor your city's infrastructure and
                                    real-time systems from one place.
                                </p>

                            </section>


                            {/* KPI */}

                            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                                <button
                                    onClick={() => navigate("/management/buildings")}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl">🏢</span>
                                        <span className="text-xs font-semibold text-blue-500">
                                            VIEW
                                        </span>
                                    </div>

                                    <p className="mt-5 text-sm text-slate-400">
                                        Buildings
                                    </p>

                                    <p className="mt-1 text-3xl font-bold text-slate-900">
                                        {data.buildings?.length || 0}
                                    </p>
                                </button>


                                <button
                                    onClick={() => navigate("/management/vehicles")}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl">🚗</span>
                                        <span className="text-xs font-semibold text-blue-500">
                                            VIEW
                                        </span>
                                    </div>

                                    <p className="mt-5 text-sm text-slate-400">
                                        Vehicles
                                    </p>

                                    <p className="mt-1 text-3xl font-bold text-slate-900">
                                        {data.vehicles?.length || 0}
                                    </p>
                                </button>


                                <button
                                    onClick={() => navigate("/management/incidents")}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl">🚨</span>
                                        <span className="text-xs font-semibold text-blue-500">
                                            VIEW
                                        </span>
                                    </div>

                                    <p className="mt-5 text-sm text-slate-400">
                                        Active Incidents
                                    </p>

                                    <p className="mt-1 text-3xl font-bold text-slate-900">
                                        {activeIncidents}
                                    </p>
                                </button>


                                <button
                                    onClick={() => navigate("/management/environment")}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl">🌿</span>
                                        <span className="text-xs font-semibold text-blue-500">
                                            VIEW
                                        </span>
                                    </div>

                                    <p className="mt-5 text-sm text-slate-400">
                                        Average AQI
                                    </p>

                                    <p className="mt-1 text-3xl font-bold text-slate-900">
                                        {environmentAQI}
                                    </p>
                                </button>

                            </section>


                            {/* SECOND KPI ROW */}

                            <section className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">

                                <button
                                    onClick={() => navigate("/management/traffic")}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:shadow-md"
                                >
                                    <p className="text-xs text-slate-400">
                                        Traffic
                                    </p>

                                    <p className="mt-1 text-xl font-bold">
                                        {trafficCongestion}%
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {trafficSpeed} km/h avg.
                                    </p>
                                </button>

                                <button
                                    onClick={() => navigate("/management/energy")}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:shadow-md"
                                >
                                    <p className="text-xs text-slate-400">
                                        Energy
                                    </p>

                                    <p className="mt-1 text-xl font-bold">
                                        {energyConsumption}
                                    </p>

                                    <p className="mt-1 text-xs text-emerald-500">
                                        {renewablePercentage}% renewable
                                    </p>
                                </button>

                                <button
                                    onClick={() => navigate("/management/water")}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:shadow-md"
                                >
                                    <p className="text-xs text-slate-400">
                                        Water
                                    </p>

                                    <p className="mt-1 text-xl font-bold">
                                        {waterLevel}%
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Pressure {pipelinePressure}
                                    </p>
                                </button>

                                <button
                                    onClick={() => navigate("/management/waste")}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:shadow-md"
                                >
                                    <p className="text-xs text-slate-400">
                                        Waste
                                    </p>

                                    <p className="mt-1 text-xl font-bold">
                                        {wasteFill}%
                                    </p>

                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all duration-700"
                                            style={{
                                                width: `${Math.min(
                                                    wasteFill,
                                                    100
                                                )}%`
                                            }}
                                        />
                                    </div>
                                </button>

                            </section>


                            {/* MAP + ALERTS */}

                            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]">

                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                                        <div>
                                            <h2 className="font-bold text-slate-900">
                                                Live City Map
                                            </h2>

                                            <p className="text-xs text-slate-400">
                                                Real-time infrastructure monitoring
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => navigate("/management")}
                                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                                        >
                                            Manage City
                                        </button>

                                    </div>

                                    <div className="p-2">
                                        <CityMap />
                                    </div>

                                </div>


                                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                                        <div>
                                            <h2 className="font-bold text-slate-900">
                                                Recent Alerts
                                            </h2>

                                            <p className="text-xs text-slate-400">
                                                Live system notifications
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                                            {alerts.length}
                                        </span>

                                    </div>

                                    <div className="max-h-[420px] overflow-y-auto p-4">

                                        {alerts.length === 0 ? (

                                            <div className="py-12 text-center">

                                                <div className="text-3xl">
                                                    ✅
                                                </div>

                                                <p className="mt-3 text-sm font-semibold text-emerald-600">
                                                    All systems normal
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    No critical alerts detected.
                                                </p>

                                            </div>

                                        ) : (

                                            <div className="space-y-3">

                                                {alerts.map((alert, index) => (

                                                    <button
                                                        key={`${alert.title}-${index}`}
                                                        onClick={() => navigate(alert.link)}
                                                        className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                                                    >

                                                        <div className="flex gap-3">

                                                            <span className="text-xl">
                                                                {alert.icon}
                                                            </span>

                                                            <div className="min-w-0">

                                                                <p className="text-sm font-semibold text-slate-800">
                                                                    {alert.title}
                                                                </p>

                                                                <p className="mt-1 text-xs text-slate-400">
                                                                    {alert.value}
                                                                </p>

                                                                <span
                                                                    className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                                                        alert.type === "critical"
                                                                            ? "bg-red-50 text-red-500"
                                                                            : "bg-orange-50 text-orange-500"
                                                                    }`}
                                                                >
                                                                    {alert.type.toUpperCase()}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </button>

                                                ))}

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </section>


                            {/* ANALYTICS */}

                            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

                                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <h2 className="font-bold text-slate-900">
                                            Live Analytics
                                        </h2>

                                        <p className="text-xs text-slate-400">
                                            Real-time city performance
                                        </p>
                                    </div>

                                    <span className="text-xs text-slate-400">
                                        Updates every 3 seconds
                                    </span>

                                </div>

                                <Analytics />

                            </section>


                            {/* FOOTER */}

                            <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

                                <p>
                                    CityTwin • Smart City Digital Twin
                                </p>

                                <p>
                                    Last update:{" "}
                                    {cityData?.timestamp
                                        ? new Date(
                                            cityData.timestamp
                                        ).toLocaleTimeString()
                                        : "--"
                                    }
                                </p>

                            </footer>

                        </>

                    )}

                </main>

            </div>

        </div>
    );
}
