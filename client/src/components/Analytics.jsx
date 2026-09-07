import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { useCity } from "../context/CityContext";


function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
        minute: "2-digit",
        second: "2-digit"
    });
}


function average(items, key) {
    if (!Array.isArray(items) || items.length === 0) {
        return 0;
    }

    const total = items.reduce(
        (sum, item) => sum + Number(item[key] || 0),
        0
    );

    return Number((total / items.length).toFixed(1));
}


function latest(history, key) {
    if (!history.length) return 0;

    return Number(
        history[history.length - 1][key] || 0
    ).toFixed(1);
}


function ChartCard({
    title,
    subtitle,
    icon,
    value,
    unit,
    data,
    lines,
    dualAxis = false
}) {
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg">
                        {icon}
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-900">
                            {title}
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-400">
                            {subtitle}
                        </p>
                    </div>

                </div>

                <div className="text-right">

                    <p className="text-xl font-bold text-slate-900">
                        {value}
                        <span className="ml-1 text-xs font-medium text-slate-400">
                            {unit}
                        </span>
                    </p>

                    <div className="mt-1 flex items-center justify-end gap-1.5">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        <span className="text-[10px] font-semibold text-emerald-600">
                            LIVE
                        </span>

                    </div>

                </div>

            </div>


            <div className="mt-5 h-[230px] w-full">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 8,
                            left: -20,
                            bottom: 0
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="time"
                            stroke="#94a3b8"
                            tick={{
                                fontSize: 10
                            }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={28}
                        />

                        <YAxis
                            yAxisId="left"
                            stroke="#94a3b8"
                            tick={{
                                fontSize: 10
                            }}
                            tickLine={false}
                            axisLine={false}
                        />

                        {dualAxis && (
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#94a3b8"
                                tick={{
                                    fontSize: 10
                                }}
                                tickLine={false}
                                axisLine={false}
                            />
                        )}

                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                boxShadow:
                                    "0 8px 24px rgba(15, 23, 42, 0.08)",
                                fontSize: "12px"
                            }}
                            labelStyle={{
                                color: "#64748b",
                                marginBottom: "4px"
                            }}
                        />

                        {lines.map((line) => (
                            <Line
                                key={line.dataKey}
                                type="monotone"
                                dataKey={line.dataKey}
                                name={line.name}
                                stroke={line.stroke}
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{
                                    r: 5,
                                    strokeWidth: 2
                                }}
                                yAxisId={
                                    dualAxis && line.right
                                        ? "right"
                                        : "left"
                                }
                                animationDuration={500}
                            />
                        ))}

                    </LineChart>

                </ResponsiveContainer>

            </div>


            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3">

                {lines.map((line) => (

                    <div
                        key={line.dataKey}
                        className="flex items-center gap-2 text-[11px] text-slate-500"
                    >

                        <span
                            className="h-2 w-2 rounded-full"
                            style={{
                                backgroundColor: line.stroke
                            }}
                        />

                        {line.name}

                    </div>

                ))}

            </div>

        </div>
    );
}


const Analytics = () => {

    const {
        history,
        connected
    } = useCity();


    const chartData = history.map(
        (item) => ({
            ...item,
            time: formatTime(item.timestamp)
        })
    );


    const trafficValue = latest(
        history,
        "traffic"
    );

    const speedValue = latest(
        history,
        "speed"
    );

    const aqiValue = latest(
        history,
        "aqi"
    );

    const temperatureValue = latest(
        history,
        "temperature"
    );

    const energyValue = latest(
        history,
        "energy"
    );

    const waterValue = latest(
        history,
        "waterLevel"
    );


    return (

        <section className="mt-6">


            {/* Analytics header */}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-lg">
                            📊
                        </div>

                        <div>

                            <h2 className="text-xl font-bold text-slate-900">
                                City Analytics
                            </h2>

                            <p className="text-xs text-slate-400">
                                Live historical city performance
                            </p>

                        </div>

                    </div>

                </div>


                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">

                    <span
                        className={`h-2 w-2 rounded-full ${
                            connected
                                ? "bg-emerald-500"
                                : "bg-red-500"
                        }`}
                    />

                    <span className="text-xs font-semibold text-slate-600">
                        {connected
                            ? "Live monitoring"
                            : "Connection lost"}
                    </span>

                </div>

            </div>


            {/* Quick analytics summary */}

            <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

                <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-[11px] font-medium text-slate-400">
                        Traffic
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                        {trafficValue}%
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                        {speedValue} km/h average speed
                    </p>

                </div>


                <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-[11px] font-medium text-slate-400">
                        Air Quality
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                        {aqiValue}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                        Current average AQI
                    </p>

                </div>


                <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-[11px] font-medium text-slate-400">
                        Temperature
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                        {temperatureValue}°C
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                        Environment sensors
                    </p>

                </div>


                <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-[11px] font-medium text-slate-400">
                        Water Level
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                        {waterValue}%
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                        Reservoir level
                    </p>

                </div>

            </div>


            {/* Charts */}

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">


                <ChartCard
                    title="Traffic"
                    subtitle="Congestion and average speed"
                    icon="🚦"
                    value={trafficValue}
                    unit="%"
                    data={chartData}
                    lines={[
                        {
                            dataKey: "traffic",
                            name: "Congestion",
                            stroke: "#2563eb"
                        },
                        {
                            dataKey: "speed",
                            name: "Speed km/h",
                            stroke: "#10b981"
                        }
                    ]}
                />


                <ChartCard
                    title="Environment"
                    subtitle="Air quality and temperature"
                    icon="🌿"
                    value={aqiValue}
                    unit="AQI"
                    data={chartData}
                    lines={[
                        {
                            dataKey: "aqi",
                            name: "AQI",
                            stroke: "#f59e0b"
                        },
                        {
                            dataKey: "temperature",
                            name: "Temperature °C",
                            stroke: "#ef4444"
                        }
                    ]}
                />


                <ChartCard
                    title="Energy"
                    subtitle="Consumption and renewable energy"
                    icon="⚡"
                    value={energyValue}
                    unit="kWh"
                    data={chartData}
                    dualAxis={true}
                    lines={[
                        {
                            dataKey: "energy",
                            name: "Energy",
                            stroke: "#7c3aed"
                        },
                        {
                            dataKey: "renewable",
                            name: "Renewable %",
                            stroke: "#10b981",
                            right: true
                        }
                    ]}
                />


                <ChartCard
                    title="Water"
                    subtitle="Consumption and reservoir level"
                    icon="💧"
                    value={waterValue}
                    unit="%"
                    data={chartData}
                    dualAxis={true}
                    lines={[
                        {
                            dataKey: "waterConsumption",
                            name: "Daily Consumption",
                            stroke: "#2563eb"
                        },
                        {
                            dataKey: "waterLevel",
                            name: "Reservoir Level %",
                            stroke: "#06b6d4",
                            right: true
                        }
                    ]}
                />

            </div>


            {/* Empty history state */}

            {history.length === 0 && (

                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

                    <div className="text-3xl">
                        📡
                    </div>

                    <h3 className="mt-3 font-semibold text-slate-700">
                        Waiting for live analytics
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        CityTwin will display historical data as soon as
                        the simulator sends updates.
                    </p>

                </div>

            )}


            <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400">

                <span>
                    {history.length} live data points stored
                </span>

                <span>
                    Updates every 3 seconds
                </span>

            </div>

        </section>
    );
};


export default Analytics;
