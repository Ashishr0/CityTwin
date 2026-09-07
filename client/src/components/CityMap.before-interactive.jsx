import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useCity } from "../context/CityContext";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const trafficIcon = L.divIcon({
    className: "",
    html: `
        <div style="
            width: 18px;
            height: 18px;
            background: #ef4444;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(239,68,68,0.8);
        "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
});

const environmentIcon = L.divIcon({
    className: "",
    html: `
        <div style="
            width: 18px;
            height: 18px;
            background: #22c55e;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(34,197,94,0.8);
        "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
});

const wasteIcon = L.divIcon({
    className: "",
    html: `
        <div style="
            width: 18px;
            height: 18px;
            background: #eab308;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(234,179,8,0.8);
        "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
});

const vehicleIcon = L.divIcon({
    className: "",
    html: `
        <div style="
            width: 18px;
            height: 18px;
            background: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(59,130,246,0.8);
        "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
});

const incidentIcon = L.divIcon({
    className: "",
    html: `
        <div style="
            width: 20px;
            height: 20px;
            background: #a855f7;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 12px rgba(168,85,247,0.9);
        "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const MapResizeHandler = () => {
    const map = useMap();

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
            map.setView([28.6139, 77.2090], 13);
        }, 150);

        return () => clearTimeout(timer);
    }, [map]);

    return null;
};

const CityMap = () => {

    const { cityData } = useCity();

    const traffic = cityData?.data?.traffic || [];
    const environment = cityData?.data?.environment || [];
    const waste = cityData?.data?.waste || [];
    const vehicles = cityData?.data?.vehicles || [];
    const incidents = cityData?.data?.incidents || [];
    const buildings = cityData?.data?.buildings || [];

    // Temporary city center
    // We will replace this with the actual city later.
    const cityCenter = [28.6139, 77.2090];

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">

            {/* Map Header */}

            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        🗺️ City Digital Map
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Real-time city infrastructure monitoring
                    </p>
                </div>

                {/* Legend */}

                <div className="flex flex-wrap gap-4 text-xs text-slate-600">

                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-500"></span>
                        Traffic
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-500"></span>
                        Environment
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                        Waste
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                        Vehicle
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                        Incident
                    </div>

                </div>

            </div>

            {/* Map */}

            <div className="h-[320px] w-full sm:h-[360px] lg:h-[420px]">

                <MapContainer
                    center={cityCenter}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >

                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Traffic */}

                    {traffic.map((item, index) => {

                        if (!item.location?.lat || !item.location?.lng) {
                            return null;
                        }

                        return (
                            <Marker
                                key={`traffic-${item._id || index}`}
                                position={[
                                    item.location.lat,
                                    item.location.lng
                                ]}
                                icon={trafficIcon}
                            >
                                <Popup>

                                    <strong>
                                        🚦 Traffic Intersection
                                    </strong>

                                    <br />

                                    Intersection:
                                    {" "}
                                    {item.intersectionId}

                                    <br />

                                    Congestion:
                                    {" "}
                                    {item.congestion}%

                                    <br />

                                    Speed:
                                    {" "}
                                    {item.averageSpeed} km/h

                                </Popup>

                                <Circle
                                    center={[
                                        item.location.lat,
                                        item.location.lng
                                    ]}
                                    radius={300}
                                    pathOptions={{
                                        color: "red",
                                        fillOpacity: 0.08
                                    }}
                                />

                            </Marker>
                        );
                    })}

                    {/* Environment */}

                    {environment.map((item, index) => {

                        if (!item.location?.lat || !item.location?.lng) {
                            return null;
                        }

                        return (
                            <Marker
                                key={`environment-${item._id || index}`}
                                position={[
                                    item.location.lat,
                                    item.location.lng
                                ]}
                                icon={environmentIcon}
                            >
                                <Popup>

                                    <strong>
                                        🌳 Environment Sensor
                                    </strong>

                                    <br />

                                    Location:
                                    {" "}
                                    {item.location}

                                    <br />

                                    AQI:
                                    {" "}
                                    {item.aqi}

                                    <br />

                                    PM2.5:
                                    {" "}
                                    {item.pm25}

                                    <br />

                                    Temperature:
                                    {" "}
                                    {item.temperature}°C

                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* Waste */}

                    {waste.map((item, index) => {

                        if (!item.location?.lat || !item.location?.lng) {
                            return null;
                        }

                        return (
                            <Marker
                                key={`waste-${item._id || index}`}
                                position={[
                                    item.location.lat,
                                    item.location.lng
                                ]}
                                icon={wasteIcon}
                            >
                                <Popup>

                                    <strong>
                                        🗑️ Waste Bin
                                    </strong>

                                    <br />

                                    Bin:
                                    {" "}
                                    {item.binId}

                                    <br />

                                    Fill Level:
                                    {" "}
                                    {item.fillLevel}%

                                    <br />

                                    Status:
                                    {" "}
                                    {item.status}

                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* Vehicles */}

                    {vehicles.map((item, index) => {

                        if (!item.location?.lat || !item.location?.lng) {
                            return null;
                        }

                        return (
                            <Marker
                                key={`vehicle-${item._id || index}`}
                                position={[
                                    item.location.lat,
                                    item.location.lng
                                ]}
                                icon={vehicleIcon}
                            >
                                <Popup>

                                    <strong>
                                        🚍 Vehicle
                                    </strong>

                                    <br />

                                    Vehicle:
                                    {" "}
                                    {item.vehicleId}

                                    <br />

                                    Type:
                                    {" "}
                                    {item.type}

                                    <br />

                                    Speed:
                                    {" "}
                                    {item.speed} km/h

                                    <br />

                                    Status:
                                    {" "}
                                    {item.status}

                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* Incidents */}

                    {incidents.map((item, index) => {

                        if (!item.location?.lat || !item.location?.lng) {
                            return null;
                        }

                        return (
                            <Marker
                                key={`incident-${item._id || index}`}
                                position={[
                                    item.location.lat,
                                    item.location.lng
                                ]}
                                icon={incidentIcon}
                            >
                                <Popup>

                                    <strong>
                                        🚨 {item.title}
                                    </strong>

                                    <br />

                                    Type:
                                    {" "}
                                    {item.type}

                                    <br />

                                    Priority:
                                    {" "}
                                    {item.priority}

                                    <br />

                                    Status:
                                    {" "}
                                    {item.status}

                                </Popup>
                            </Marker>
                        );
                    })}

                </MapContainer>

            </div>

        </div>
    );
};

export default CityMap;