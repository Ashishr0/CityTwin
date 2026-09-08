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
import WasteManagement from "./pages/WasteManagement";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import Alerts from "./pages/Alerts";
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


                {/* CITY MAP */}

                <Route
                    path="/map"
                    element={<MapPage />}
                />

                {/* BUILDINGS MANAGEMENT */}

                <Route
                    path="/management/buildings"
                    element={<BuildingsManagement />}
                />
                <Route
    path="/management/traffic"
    element={<TrafficManagement />}
/>
<Route
    path="/management/vehicles"
    element={<VehiclesManagement />}
/>
<Route
    path="/management/incidents"
    element={<IncidentsManagement />}
/>


                {/* ENVIRONMENT MANAGEMENT */}

                <Route
                    path="/management/environment"
                    element={<EnvironmentManagement />}
                />

                {/* ENERGY MANAGEMENT */}

                <Route
                    path="/management/energy"
                    element={<EnergyManagement />}
                />

                {/* WATER MANAGEMENT */}

                <Route
                    path="/management/water"
                    element={<WaterManagement />}
                />

                {/* WASTE MANAGEMENT */}

                <Route
                    path="/management/waste"
                    element={<WasteManagement />}
                />

                {/* CITY MANAGEMENT */}

                <Route
                    path="/management"
                    element={<CityManagement />}
                />


                {/* ALERT CENTER */}

                <Route
                    path="/alerts"
                    element={<Alerts />}
                />


                {/* DASHBOARD */}

                <Route
                    path="/"
                    element={<Dashboard />}
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
