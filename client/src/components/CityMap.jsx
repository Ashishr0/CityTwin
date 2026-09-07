import {
    Circle,
    MapContainer,
    Marker,
    Popup,
    TileLayer
} from "react-leaflet";
import L from "leaflet";
import { useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import { useCity } from "../context/CityContext";

const createIcon = (color) =>
    L.divIcon({
        className: "",
        html: `
            <div style="
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: ${color};
                border: 3px solid white;
                box-shadow: 0 3px 10px rgba(15,23,42,0.25);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 13px;
                font-weight: 700;
            ">
                •
            </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
    });

const icons = {
    traffic: createIcon("#ef4444"),
    environment: createIcon("#10b981"),
    waste: createIcon("#f59e0b"),
    vehicles: createIcon("#3b82f6"),
    incidents: createIcon("#8b5cf6"),
    buildings: createIcon("#6366f1")
};

const filters = [
    { key: "all", label: "All" },
    { key: "traffic", label: "Traffic" },
    { key: "environment", label: "Environment" },
    { key: "waste", label: "Waste" },
    { key: "vehicles", label: "Vehicles" },
    { key: "incidents", label: "Incidents" },
    { key: "buildings", label: "Buildings" }
];

const CityMap = () => {
    const { cityData, connected } = useCity();
    const [activeFilter, setActiveFilter] = useState("all");

    const data = cityData?.data || {};

    const traffic = data.traffic || [];
    const environment = data.environment || [];
    const waste = data.waste || [];
    const vehicles = data.vehicles || [];
    const incidents = data.incidents || [];
    const buildings = data.buildings || [];

    const counts = useMemo(
        () => ({
            traffic: traffic.length,
            environment: environment.length,
            waste: waste.length,
            vehicles: vehicles.length,
            incidents: incidents.length,
            buildings: buildings.length
        }),
        [
            traffic.length,
            environment.length,
            waste.length,
            vehicles.length,
            incidents.length,
            buildings.length
        ]
    );

    const show = (type) =>
        activeFilter === "all" || activeFilter === type;

    const formatNumber = (value) => {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "—";
        }

        return number.toLocaleString(undefined, {
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm">

            {/* HEADER */}

            <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                            City Map
                        </h2>

                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                connected
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    connected
                                        ? "bg-emerald-500"
                                        : "bg-red-500"
                                }`}
                            />

                            {connected ? "Live" : "Offline"}
                        </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        Monitor and analyze real-time city activity.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">

                    {[
                        ["Traffic", counts.traffic, "text-red-600"],
                        ["Sensors", counts.environment, "text-emerald-600"],
                        ["Waste", counts.waste, "text-amber-600"],
                        ["Vehicles", counts.vehicles, "text-blue-600"],
                        ["Incidents", counts.incidents, "text-violet-600"],
                        ["Buildings", counts.buildings, "text-indigo-600"]
                    ].map(([label, value, color]) => (
                        <div
                            key={label}
                            className="min-w-0 rounded-lg bg-slate-50 px-2 py-2 text-center"
                        >
                            <p
                                className={`text-sm font-bold ${color}`}
                            >
                                {value}
                            </p>

                            <p className="truncate text-[9px] font-medium uppercase tracking-wide text-slate-400">
                                {label}
                            </p>
                        </div>
                    ))}

                </div>
            </div>

            {/* FILTERS */}

            <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-5">
                {filters.map((filter) => {
                    const isActive = activeFilter === filter.key;

                    return (
                        <button
                            key={filter.key}
                            type="button"
                            onClick={() => setActiveFilter(filter.key)}
                            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                isActive
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {filter.label}
                        </button>
                    );
                })}
            </div>

            {/* MAP */}

            <div className="relative h-[360px] w-full sm:h-[430px] lg:h-[500px]">

                <MapContainer
                    center={[28.6139, 77.209]}
                    zoom={12}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >

                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* TRAFFIC */}

                    {show("traffic") &&
                        traffic.map((item, index) => {
                            const lat = Number(item.location?.lat);
                            const lng = Number(item.location?.lng);

                            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                                return null;
                            }

                            return (
                                <Circle
                                    key={`traffic-${item._id || index}`}
                                    center={[lat, lng]}
                                    radius={180}
                                    pathOptions={{
                                        color: "#ef4444",
                                        fillColor: "#ef4444",
                                        fillOpacity: 0.14,
                                        weight: 2
                                    }}
                                />
                            );
                        })}

                    {show("traffic") &&
                        traffic.map((item, index) => {
                            const lat = Number(item.location?.lat);
                            const lng = Number(item.location?.lng);

                            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                                return null;
                            }

                            return (
                                <Marker
                                    key={`traffic-marker-${item._id || index}`}
                                    position={[lat, lng]}
                                    icon={icons.traffic}
                                >
                                    <Popup>
                                        <div className="min-w-[180px]">
                                            <p className="text-xs font-bold uppercase tracking-wide text-red-500">
                                                Traffic
                                            </p>

                                            <p className="mt-1 font-bold text-slate-900">
                                                {item.intersection ||
                                                    "Traffic Point"}
                                            </p>

                                            <div className="mt-2 space-y-1 text-sm text-slate-600">
                                                <p>
                                                    Congestion:{" "}
                                                    <strong>
                                                        {formatNumber(
                                                            item.congestion
                                                        )}
                                                        %
                                                    </strong>
                                                </p>

                                                <p>
                                                    Average speed:{" "}
                                                    <strong>
                                                        {formatNumber(
                                                            item.averageSpeed
                                                        )}{" "}
                                                        km/h
                                                    </strong>
                                                </p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                    {/* ENVIRONMENT */}

                    {show("environment") &&
                        environment.map((item, index) => {
                            const lat = Number(item.location?.lat);
                            const lng = Number(item.location?.lng);

                            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                                return null;
                            }

                            return (
                                <Marker
                                    key={`environment-${item._id || index}`}
                                    position={[lat, lng]}
                                    icon={icons.environment}
                                >
                                    <Popup>
                                        <div className="min-w-[180px]">
                                            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                                                Environment
                                            </p>

                                            <p className="mt-1 font-bold text-slate-900">
                                                {item.sensorId ||
                                                    "Environment Sensor"}
                                            </p>

                                            <div className="mt-2 space-y-1 text-sm text-slate-600">
                                                <p>
                                                    AQI:{" "}
                                                    <strong>
                                                        {formatNumber(item.aqi)}
                                                    </strong>
                                                </p>

                                                <p>
                                                    Temperature:{" "}
                                                    <strong>
                                                        {formatNumber(
                                                            item.temperature
                                                        )}
                                                        °C
                                                    </strong>
                                                </p>

                                                <p>
                                                    Humidity:{" "}
                                                    <strong>
                                                        {formatNumber(
                                                            item.humidity
                                                        )}
                                                        %
                                                    </strong>
                                                </p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                    {/* WASTE */}

                    {show("waste") &&
                        waste.map((item, index) => {
                            const lat = Number(item.location?.lat);
                            const lng = Number(item.location?.lng);

                            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                                return null;
                            }

                            return (
                                <Marker
                                    key={`waste-${item._id || index}`}
                                    position={[lat, lng]}
                                    icon={icons.waste}
                                >
                                    <Popup>
                                        <div className="min-w-[180px]">
                                            <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                                                Waste Bin
                                            </p>

                                            <p className="mt-1 font-bold text-slate-900">
                                                {item.binId || "Waste Bin"}
                                            </p>

                                            <div className="mt-2 space-y-1 text-sm text-slate-600">
                                                <p>
                                                    Fill level:{" "}
                                                    <strong>
                                                        {formatNumber(
                                                            item.fillLevel
                                                        )}
                                                        %
                                                    </strong>
                                                </p>

                                                <p>
                                                    Status:{" "}
                                                    <strong>
                                                        {item.status || "—"}
                                                    </strong>
                                                </p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                    {/* VEHICLES */}

                    {show("vehicles") &&
                        vehicles.map((item, index) => {
                            const lat = Number(item.location?.lat);
                            const lng = Number(item.location?.lng);

                            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                                return null;
                            }

                            return (
                                <Marker
                                    key={`vehicle-${item._id || index}`}
                                    position={[lat, lng]}
                                    icon={icons.vehicles}
                                >
                                    <Popup>
                                        <div className="min-w-[180px]">
                                            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                                                Vehicle
                                            </p>

                                            <p className="mt-1 font-bold text-slate-900">
                                                {item.vehicleId ||
                                                    "City Vehicle"}
                                            </p>

                                            <div className="mt-2 space-y-1 text-sm text-slate-600">
                                                <p>
                                                    Status:{" "}
                                                    <strong>
                                                        {item.status || "—"}
                                                    </strong>
                                                </p>

                                                <p>
                                                    Speed:{" "}
                                                    <strong>
                                                        {formatNumber(item.speed)}{" "}
                                                        km/h
                                                    </strong>
                                                </p>

                                                <p>
                                                    Passengers:{" "}
                                                    <strong>
                                                        {formatNumber(
                                                            item.passengers
                                                        )}
                                                    </strong>
                                                </p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                    {/* INCIDENTS */}

                    {show("incidents") &&
                        incidents.map((item, index) => {
                            const lat = Number(item.location?.lat);
                            const lng = Number(item.location?.lng);

                            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                                return null;
                            }

                            return (
                                <Marker
                                    key={`incident-${item._id || index}`}
                                    position={[lat, lng]}
                                    icon={icons.incidents}
                                >
                                    <Popup>
                                        <div className="min-w-[180px]">
                                            <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                                                Incident
                                            </p>

                                            <p className="mt-1 font-bold text-slate-900">
                                                {item.title ||
                                                    item.type ||
                                                    "City Incident"}
                                            </p>

                                            <div className="mt-2 space-y-1 text-sm text-slate-600">
                                                <p>
                                                    Priority:{" "}
                                                    <strong>
                                                        {item.priority || "—"}
                                                    </strong>
                                                </p>

                                                <p>
                                                    Status:{" "}
                                                    <strong>
                                                        {item.status || "—"}
                                                    </strong>
                                                </p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                    {/* BUILDINGS */}

                    {show("buildings") &&
                        buildings.map((item, index) => {
                            const lat = Number(item.location?.lat);
                            const lng = Number(item.location?.lng);

                            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                                return null;
                            }

                            return (
                                <Marker
                                    key={`building-${item._id || index}`}
                                    position={[lat, lng]}
                                    icon={icons.buildings}
                                >
                                    <Popup>
                                        <div className="min-w-[180px]">
                                            <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                                                Building
                                            </p>

                                            <p className="mt-1 font-bold text-slate-900">
                                                {item.name ||
                                                    item.buildingId ||
                                                    "City Building"}
                                            </p>

                                            <div className="mt-2 space-y-1 text-sm text-slate-600">
                                                <p>
                                                    Type:{" "}
                                                    <strong>
                                                        {item.type || "—"}
                                                    </strong>
                                                </p>

                                                <p>
                                                    Floors:{" "}
                                                    <strong>
                                                        {formatNumber(
                                                            item.floors
                                                        )}
                                                    </strong>
                                                </p>

                                                <p>
                                                    Occupancy:{" "}
                                                    <strong>
                                                        {formatNumber(
                                                            item.occupancy
                                                        )}
                                                    </strong>
                                                </p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                </MapContainer>

                {/* MAP STATUS */}

                <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-lg bg-white/95 px-3 py-2 text-xs shadow-md backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <span
                            className={`h-2 w-2 rounded-full ${
                                connected
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                            }`}
                        />

                        <span className="font-semibold text-slate-700">
                            {connected
                                ? "Live city data"
                                : "Waiting for connection"}
                        </span>
                    </div>
                </div>

            </div>

            {/* LEGEND */}

            <div className="flex flex-wrap gap-x-5 gap-y-2 px-4 py-4 sm:px-5">

                {[
                    ["Traffic", "#ef4444"],
                    ["Environment", "#10b981"],
                    ["Waste", "#f59e0b"],
                    ["Vehicles", "#3b82f6"],
                    ["Incidents", "#8b5cf6"],
                    ["Buildings", "#6366f1"]
                ].map(([label, color]) => (
                    <div
                        key={label}
                        className="flex items-center gap-2 text-xs font-medium text-slate-500"
                    >
                        <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                        />

                        {label}
                    </div>
                ))}

            </div>

        </div>
    );
};

export default CityMap;
