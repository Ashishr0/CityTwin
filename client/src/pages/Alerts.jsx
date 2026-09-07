import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCity } from "../context/CityContext";

const Alerts = () => {
    const navigate = useNavigate();

    const {
        alerts,
        alertHistory,
        connected,
        markAlertAsRead,
        markAllAlertsAsRead,
        clearAlert,
        unreadAlertCount
    } = useCity();

    const [filter, setFilter] = useState("ALL");

    const filteredAlerts = useMemo(() => {
        if (filter === "ALL") {
            return alertHistory;
        }

        return alertHistory.filter(
            alert => alert.severity === filter
        );
    }, [alertHistory, filter]);

    const getSeverityClass = (severity) => {
        if (severity === "CRITICAL") {
            return "bg-red-50 text-red-700";
        }

        if (severity === "HIGH") {
            return "bg-orange-50 text-orange-700";
        }

        return "bg-amber-50 text-amber-700";
    };

    const getRoute = (type) => {
        const routes = {
            TRAFFIC: "/management/traffic",
            AIR_QUALITY: "/management/environment",
            WASTE: "/management/waste",
            WATER: "/management/water",
            ENERGY: "/management/energy",
            INCIDENT: "/management/incidents",
            VEHICLE: "/management/vehicles"
        };

        return routes[type] || "/";
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "Unknown time";

        return new Date(timestamp).toLocaleString();
    };

    const criticalCount = alertHistory.filter(
        alert => alert.severity === "CRITICAL"
    ).length;

    const highCount = alertHistory.filter(
        alert => alert.severity === "HIGH"
    ).length;

    const warningCount = alertHistory.filter(
        alert => alert.severity === "WARNING"
    ).length;

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <div className="flex flex-wrap items-center gap-3">

                                <h1 className="text-2xl font-bold text-slate-900">
                                    Alert Center
                                </h1>

                                {unreadAlertCount > 0 && (
                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                        {unreadAlertCount} unread
                                    </span>
                                )}

                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Real-time alerts and alert history from connected city systems
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">

                            <div className="flex items-center gap-2">

                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${
                                        connected
                                            ? "bg-emerald-500"
                                            : "bg-red-500"
                                    }`}
                                />

                                <span className="text-sm font-medium text-slate-600">
                                    {connected
                                        ? "Live monitoring"
                                        : "Offline"}
                                </span>

                            </div>

                            {unreadAlertCount > 0 && (
                                <button
                                    onClick={markAllAlertsAsRead}
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                                >
                                    Mark all as read
                                </button>
                            )}

                        </div>

                    </div>

                </div>


                {/* SUMMARY */}

                <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total History
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {alertHistory.length}
                        </p>
                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Unread
                        </p>

                        <p className="mt-2 text-3xl font-bold text-blue-600">
                            {unreadAlertCount}
                        </p>
                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Critical
                        </p>

                        <p className="mt-2 text-3xl font-bold text-red-600">
                            {criticalCount}
                        </p>
                    </div>


                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            High / Warnings
                        </p>

                        <p className="mt-2 text-3xl font-bold text-orange-600">
                            {highCount + warningCount}
                        </p>
                    </div>

                </div>


                {/* LIVE ALERT SUMMARY */}

                <div className="mb-5 rounded-2xl bg-white p-5 shadow-sm">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Current Live Alerts
                            </h2>

                            <p className="text-sm text-slate-500">
                                Alerts currently being generated by the city simulator
                            </p>
                        </div>

                        <span className="text-sm font-medium text-slate-600">
                            {alerts.length} active
                        </span>

                    </div>

                </div>


                {/* FILTERS */}

                <div className="mb-5 flex flex-wrap items-center gap-2">

                    {["ALL", "CRITICAL", "HIGH", "WARNING"].map(
                        option => (
                            <button
                                key={option}
                                onClick={() => setFilter(option)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    filter === option
                                        ? "bg-slate-900 text-white"
                                        : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
                                }`}
                            >
                                {option}
                            </button>
                        )
                    )}

                </div>


                {/* ALERT LIST */}

                <div className="space-y-3">

                    {filteredAlerts.length === 0 ? (

                        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

                            <div className="text-4xl">
                                ✓
                            </div>

                            <h2 className="mt-3 text-lg font-semibold text-slate-900">
                                No alerts
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                No alerts currently match this filter.
                            </p>

                        </div>

                    ) : (

                        filteredAlerts.map(alert => (

                            <div
                                key={alert.id}
                                className={`rounded-2xl bg-white p-5 shadow-sm transition ${
                                    alert.read
                                        ? ""
                                        : "ring-1 ring-blue-100"
                                }`}
                            >

                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-center gap-2">

                                            {!alert.read && (
                                                <span className="h-2 w-2 rounded-full bg-blue-600" />
                                            )}

                                            <h2 className="font-semibold text-slate-900">
                                                {alert.title}
                                            </h2>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getSeverityClass(
                                                    alert.severity
                                                )}`}
                                            >
                                                {alert.severity}
                                            </span>

                                            {!alert.read && (
                                                <span className="text-xs font-semibold text-blue-600">
                                                    NEW
                                                </span>
                                            )}

                                        </div>

                                        <p className="mt-2 text-sm text-slate-600">
                                            {alert.message}
                                        </p>

                                        {alert.location && (
                                            <p className="mt-2 text-xs text-slate-400">
                                                Location:{" "}
                                                {alert.location.lat},{" "}
                                                {alert.location.lng}
                                            </p>
                                        )}

                                        <p className="mt-2 text-xs text-slate-400">
                                            {formatTimestamp(alert.timestamp)}
                                        </p>

                                    </div>


                                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">

                                        {!alert.read && (
                                            <button
                                                onClick={() =>
                                                    markAlertAsRead(alert.id)
                                                }
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                            >
                                                Mark as read
                                            </button>
                                        )}

                                        <button
                                            onClick={() => clearAlert(alert.id)}
                                            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                                        >
                                            Clear
                                        </button>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    getRoute(alert.type)
                                                )
                                            }
                                            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                                        >
                                            View system →
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </div>


                {/* BACK BUTTON */}

                <div className="mt-6">

                    <button
                        onClick={() => navigate("/")}
                        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Alerts;
