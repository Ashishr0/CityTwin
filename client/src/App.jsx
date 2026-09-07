import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import { useCity } from "./context/CityContext";

import CityMap from "./components/CityMap";
import Analytics from "./components/Analytics";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CityManagement from "./pages/CityManagement";
import BuildingsManagement from "./pages/BuildingsManagement";
import TrafficManagement from "./pages/TrafficManagement"; 
import VehiclesManagement from "./pages/VehiclesManagement";
import IncidentsManagement from "./pages/IncidentsManagement";
import EnvironmentManagement from "./pages/EnvironmentManagement";
import EnergyManagement from "./pages/EnergyManagement";
import WaterManagement from "./pages/WaterManagement";
function average(items, key) {
    if (!Array.isArray(items) || items.length === 0) {
        return 0;
    }

    const total = items.reduce(
        (sum, item) => sum + Number(item[key] || 0),
        0
    );

    return Number((total / items.length).toFixed(2));
}


function total(items, key) {
    if (!Array.isArray(items)) {
        return 0;
    }

    return items.reduce(
        (sum, item) => sum + Number(item[key] || 0),
        0
    );
}


/* =========================================
   PROTECTED DASHBOARD
========================================= */

function Dashboard() {

    const { user, logout } = useAuth();

    const canManageCity =
        user?.role === "ADMIN" ||
        user?.role === "CITY_OPERATOR";

    const isAdmin =
        user?.role === "ADMIN";
    const { cityData, connected } = useCity();

    const data = cityData?.data;

    const trafficCongestion = average(
        data?.traffic,
        "congestion"
    );

    const trafficSpeed = average(
        data?.traffic,
        "averageSpeed"
    );

    const trafficVehicles = total(
        data?.traffic,
        "vehicles"
    );

    const environmentAQI = average(
        data?.environment,
        "aqi"
    );

    const environmentTemperature = average(
        data?.environment,
        "temperature"
    );

    const environmentPM25 = average(
        data?.environment,
        "pm25"
    );

    const environmentHumidity = average(
        data?.environment,
        "humidity"
    );

    const wasteFill = average(
        data?.waste,
        "fillLevel"
    );

    const energyConsumption =
        Number(data?.energy?.consumption || 0);

    const renewablePercentage =
        Number(
            data?.energy?.renewablePercentage || 0
        );

    const waterLevel =
        Number(
            data?.water?.reservoirLevel || 0
        );

    const pipelinePressure =
        Number(
            data?.water?.pipelinePressure || 0
        );

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 p-4 text-white sm:p-6 lg:p-8">

            <div className="mx-auto w-full max-w-7xl">

                <header className="mb-8">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <h1 className="text-3xl font-bold sm:text-4xl">
                                City Digital Twin
                            </h1>

                            <p className="mt-2 text-sm text-slate-400 sm:text-base">
                                Real-time city monitoring system
                            </p>

                           {user && (
    <>
        <p className="mt-2 text-sm text-slate-500">
            Welcome,{" "}
            <span className="font-semibold text-slate-300">
                {user.name}
            </span>
            {" "}({user.role})
        </p>

        {!canManageCity && (
            <p className="mt-2 text-xs text-slate-400">
                👁️ Viewer mode — city data management is restricted.
            </p>
        )}
    </>
)}

                        </div>

                        <div className="flex items-center gap-3">

                            <div
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                                    connected
                                        ? "bg-green-500/10 text-green-400"
                                        : "bg-red-500/10 text-red-400"
                                }`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${
                                        connected
                                            ? "bg-green-400"
                                            : "bg-red-400"
                                    }`}
                                />

                                {connected ? "LIVE" : "OFFLINE"}

                            </div>

                            <button
                                onClick={logout}
                                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </header>


                {!data && (
                    <div className="flex min-h-[50vh] items-center justify-center">

                        <div className="text-center">

                            <div className="mb-4 text-4xl">
                                🏙️
                            </div>

                            <h2 className="text-xl font-semibold">
                                Connecting to City Twin...
                            </h2>

                            <p className="mt-2 text-slate-400">
                                Waiting for live city data
                            </p>

                        </div>

                    </div>
                )}


                {data && (
                    <main>

                        {/* =========================
                            MAIN STAT CARDS
                        ========================= */}

                        <section className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                            {/* Traffic */}

                            <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                                <div className="mb-4 flex items-center justify-between">

                                    <span className="text-3xl">
                                        🚦
                                    </span>

                                    <span className="text-sm text-slate-400">
                                        Traffic
                                    </span>

                                </div>

                                <h2 className="text-3xl font-bold">
                                    {trafficCongestion}%
                                </h2>

                                <p className="mt-2 text-sm text-slate-400">
                                    Average congestion
                                </p>

                                <p className="mt-3 text-sm">

                                    Speed:{" "}

                                    <span className="font-semibold">
                                        {trafficSpeed} km/h
                                    </span>

                                </p>

                            </div>


                            {/* Environment */}

                            <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                                <div className="mb-4 flex items-center justify-between">

                                    <span className="text-3xl">
                                        🌫️
                                    </span>

                                    <span className="text-sm text-slate-400">
                                        Environment
                                    </span>

                                </div>

                                <h2 className="text-3xl font-bold">
                                    {environmentAQI}
                                </h2>

                                <p className="mt-2 text-sm text-slate-400">
                                    Average AQI
                                </p>

                                <p className="mt-3 text-sm">

                                    PM2.5:{" "}

                                    <span className="font-semibold">
                                        {environmentPM25}
                                    </span>

                                </p>

                            </div>


                            {/* Temperature */}

                            <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                                <div className="mb-4 flex items-center justify-between">

                                    <span className="text-3xl">
                                        🌡️
                                    </span>

                                    <span className="text-sm text-slate-400">
                                        Temperature
                                    </span>

                                </div>

                                <h2 className="text-3xl font-bold">
                                    {environmentTemperature}°C
                                </h2>

                                <p className="mt-2 text-sm text-slate-400">
                                    Average temperature
                                </p>

                                <p className="mt-3 text-sm">

                                    Humidity:{" "}

                                    <span className="font-semibold">
                                        {environmentHumidity}%
                                    </span>

                                </p>

                            </div>


                            {/* Energy */}

                            <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                                <div className="mb-4 flex items-center justify-between">

                                    <span className="text-3xl">
                                        ⚡
                                    </span>

                                    <span className="text-sm text-slate-400">
                                        Energy
                                    </span>

                                </div>

                                <h2 className="text-3xl font-bold">
                                    {energyConsumption}
                                </h2>

                                <p className="mt-2 text-sm text-slate-400">
                                    Consumption
                                </p>

                                <p className="mt-3 text-sm">

                                    Renewable:{" "}

                                    <span className="font-semibold">
                                        {renewablePercentage}%
                                    </span>

                                </p>

                            </div>

                        </section>


                        {/* =========================
                            SECONDARY CARDS
                        ========================= */}

                        <section className="mt-6 grid min-w-0 grid-cols-1 gap-5 md:grid-cols-3">

                            {/* Waste */}

                            <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                                <div className="flex items-center gap-4">

                                    <div className="text-4xl">
                                        🗑️
                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-400">
                                            Average Waste Fill
                                        </p>

                                        <h2 className="text-3xl font-bold">
                                            {wasteFill}%
                                        </h2>

                                    </div>

                                </div>

                                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">

                                    <div
                                        className="h-full rounded-full bg-green-500 transition-all duration-700"
                                        style={{
                                            width: `${Math.min(
                                                wasteFill,
                                                100
                                            )}%`
                                        }}
                                    />

                                </div>

                            </div>


                            {/* Traffic Vehicles */}

                            <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                                <p className="text-sm text-slate-400">
                                    Traffic Vehicles
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {trafficVehicles}
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Vehicles detected across monitored intersections
                                </p>

                            </div>


                            {/* Water */}

                            <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                                <p className="text-sm text-slate-400">
                                    Reservoir Level
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {waterLevel}%
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Pipeline pressure:{" "}
                                    {pipelinePressure}
                                </p>

                            </div>

                        </section>


                        {/* =========================
                            CITY MAP
                        ========================= */}

                        <section className="mt-6">
                            <CityMap />
                        </section>


                        {/* =========================
                            ANALYTICS
                        ========================= */}

                        <section className="mt-6">
                            <Analytics />
                        </section>


                        {/* =========================
                            FOOTER
                        ========================= */}

                        <footer className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">

                            Last update:{" "}

                            {cityData?.timestamp
                                ? new Date(
                                    cityData.timestamp
                                ).toLocaleTimeString()
                                : "--"
                            }

                            <span className="mx-2">
                                •
                            </span>

                            Updates every 3 seconds

                        </footer>

                    </main>
                )}

            </div>

        </div>
    );
}


/* =========================================
   APP ROUTER
========================================= */

function App() {

    const { user, loading } = useAuth();

    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

                <div className="text-center">

                    <div className="mb-4 text-4xl">
                        🌆
                    </div>

                    <p className="text-slate-400">
                        Loading City Twin...
                    </p>

                </div>

            </div>
        );

    }

    return (

        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/login"
                    element={
                        user
                            ? <Navigate to="/" replace />
                            : <Login />
                    }
                />


                {/* REGISTER */}

                <Route
                    path="/register"
                    element={
                        user
                            ? <Navigate to="/" replace />
                            : <Register />
                    }
                />


                {/* BUILDINGS MANAGEMENT */}

                <Route
                    path="/management/buildings"
                    element={
                        user
                            ? <BuildingsManagement />
                            : <Navigate to="/login" replace />
                    }
                />
                <Route
    path="/management/traffic"
    element={
        user
            ? <TrafficManagement />
            : <Navigate to="/login" replace />
    }
/>
<Route
    path="/management/vehicles"
    element={
        user
            ? <VehiclesManagement />
            : <Navigate to="/login" replace />
    }
/>
<Route
    path="/management/incidents"
    element={<IncidentsManagement />}
/>


                {/* ENVIRONMENT MANAGEMENT */}

                <Route
                    path="/management/environment"
                    element={
                        user
                            ? <EnvironmentManagement />
                            : <Navigate to="/login" replace />
                    }
                />

                {/* ENERGY MANAGEMENT */}

                <Route
                    path="/management/energy"
                    element={
                        user
                            ? <EnergyManagement />
                            : <Navigate to="/login" replace />
                    }
                />

                {/* WATER MANAGEMENT */}

                <Route
                    path="/management/water"
                    element={
                        user
                            ? <WaterManagement />
                            : <Navigate to="/login" replace />
                    }
                />

                {/* CITY MANAGEMENT */}

                <Route
                    path="/management"
                    element={
                        user
                            ? <CityManagement />
                            : <Navigate to="/login" replace />
                    }
                />


                {/* DASHBOARD */}

                <Route
                    path="/"
                    element={
                        user
                            ? <Dashboard />
                            : <Navigate to="/login" replace />
                    }
                />


                {/* UNKNOWN ROUTES */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;
