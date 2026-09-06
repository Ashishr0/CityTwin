import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

import { useCity } from "../context/CityContext";


const Analytics = () => {

    const { history } = useCity();


    const chartData = history.map(
        (item, index) => ({

            ...item,

            time: new Date(
                item.timestamp
            ).toLocaleTimeString([], {
                minute: "2-digit",
                second: "2-digit"
            })

        })
    );


    return (

        <section className="mt-6">

            {/* Section Header */}

            <div className="mb-6">

                <h2 className="text-2xl font-bold text-white">
                    📊 City Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Live historical city data
                </p>

            </div>


            {/* Charts */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">


                {/* Traffic */}

                <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                    <h3 className="mb-4 text-lg font-semibold text-white">
                        🚦 Traffic Congestion
                    </h3>

                    <div className="h-[300px] w-full">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <LineChart
                                data={chartData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#334155"
                                />

                                <XAxis
                                    dataKey="time"
                                    stroke="#94a3b8"
                                />

                                <YAxis
                                    stroke="#94a3b8"
                                />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="traffic"
                                    name="Congestion %"
                                    strokeWidth={3}
                                    dot={false}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="speed"
                                    name="Speed km/h"
                                    strokeWidth={2}
                                    dot={false}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* Environment */}

                <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                    <h3 className="mb-4 text-lg font-semibold text-white">
                        🌳 Environment
                    </h3>

                    <div className="h-[300px] w-full">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <LineChart
                                data={chartData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#334155"
                                />

                                <XAxis
                                    dataKey="time"
                                    stroke="#94a3b8"
                                />

                                <YAxis
                                    stroke="#94a3b8"
                                />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="aqi"
                                    name="AQI"
                                    strokeWidth={3}
                                    dot={false}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="temperature"
                                    name="Temperature °C"
                                    strokeWidth={2}
                                    dot={false}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* Energy */}

                <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                    <h3 className="mb-4 text-lg font-semibold text-white">
                        ⚡ Energy Consumption
                    </h3>

                    <div className="h-[300px] w-full">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <LineChart
                                data={chartData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#334155"
                                />

                                <XAxis
                                    dataKey="time"
                                    stroke="#94a3b8"
                                />

                                <YAxis
                                    stroke="#94a3b8"
                                />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="energy"
                                    name="Energy"
                                    strokeWidth={3}
                                    dot={false}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="renewable"
                                    name="Renewable %"
                                    strokeWidth={2}
                                    dot={false}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* Water */}

                <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5">

                    <h3 className="mb-4 text-lg font-semibold text-white">
                        💧 Water Monitoring
                    </h3>

                    <div className="h-[300px] w-full">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <LineChart
                                data={chartData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#334155"
                                />

                                <XAxis
                                    dataKey="time"
                                    stroke="#94a3b8"
                                />

                                <YAxis
                                    stroke="#94a3b8"
                                />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="waterLevel"
                                    name="Reservoir Level %"
                                    strokeWidth={3}
                                    dot={false}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="waterConsumption"
                                    name="Daily Consumption"
                                    strokeWidth={2}
                                    dot={false}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>


            </div>

        </section>
    );
};


export default Analytics;