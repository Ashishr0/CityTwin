import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCity } from "../context/CityContext";
import CityMap from "../components/CityMap";

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

export default function MapPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { connected } = useCity();

    return (
        <div className="fixed inset-0 z-[9999] flex h-screen w-screen overflow-hidden bg-slate-50">
<div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">

                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-4 sm:px-6">

                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            City Map
                        </h2>

                        <p className="hidden text-xs text-blue-100 sm:block">
                            Real-time city monitoring
                        </p>
                    </div>

                    <div className="flex items-center gap-2">

                        <span
                            className={`h-2.5 w-2.5 rounded-full ${
                                connected
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                            }`}
                        />

                        <span className="text-sm text-white">
                            {connected ? "Live" : "Offline"}
                        </span>

                    </div>
                </header>

                <main className="min-h-0 flex-1 overflow-hidden p-3 sm:p-5">

                    <div className="h-full w-full overflow-hidden rounded-2xl">

                        <CityMap />

                    </div>

                </main>

            </div>
        </div>
    );
}
