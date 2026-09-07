const generateAlerts = (state) => {
    const alerts = [];

    // ==========================================
    // TRAFFIC ALERTS
    // ==========================================

    state.traffic.forEach(item => {
        if (item.congestion >= 80) {
            alerts.push({
                type: "TRAFFIC",
                severity: "CRITICAL",
                title: "Severe Traffic Congestion",
                message: `${item.name} has ${item.congestion}% congestion.`,
                location: item.location,
                sourceId: item.intersectionId
            });
        }
    });

    // ==========================================
    // ENVIRONMENT ALERTS
    // ==========================================

    state.environment.forEach(item => {
        if (item.aqi >= 180) {
            alerts.push({
                type: "AIR_QUALITY",
                severity: "CRITICAL",
                title: "Critical Air Quality",
                message: `${item.locationName} has an AQI of ${item.aqi}.`,
                location: item.location,
                sourceId: item.sensorId
            });
        } else if (item.aqi >= 140) {
            alerts.push({
                type: "AIR_QUALITY",
                severity: "WARNING",
                title: "Poor Air Quality",
                message: `${item.locationName} has an AQI of ${item.aqi}.`,
                location: item.location,
                sourceId: item.sensorId
            });
        }
    });

    // ==========================================
    // WASTE ALERTS
    // ==========================================

    state.waste.forEach(item => {
        if (item.fillLevel >= 90) {
            alerts.push({
                type: "WASTE",
                severity: "CRITICAL",
                title: "Waste Bin Critical",
                message: `${item.binId} is ${item.fillLevel}% full.`,
                location: item.location,
                sourceId: item.binId
            });
        }
    });

    // ==========================================
    // WATER ALERT
    // ==========================================

    if (state.water.reservoirLevel <= 50) {
        alerts.push({
            type: "WATER",
            severity: "WARNING",
            title: "Low Reservoir Level",
            message: `Reservoir level is ${state.water.reservoirLevel}%.`,
            sourceId: "WATER-SYSTEM"
        });
    }

    // ==========================================
    // ENERGY ALERT
    // ==========================================

    if (state.energy.consumption >= 7500) {
        alerts.push({
            type: "ENERGY",
            severity: "WARNING",
            title: "High Energy Consumption",
            message: `City consumption reached ${state.energy.consumption}.`,
            sourceId: "ENERGY-SYSTEM"
        });
    }

    // ==========================================
    // INCIDENT ALERTS
    // ==========================================

    state.incidents.forEach(item => {
        if (
            item.status !== "RESOLVED" &&
            (item.priority === "HIGH" ||
                item.priority === "CRITICAL")
        ) {
            alerts.push({
                type: "INCIDENT",
                severity:
                    item.priority === "CRITICAL"
                        ? "CRITICAL"
                        : "HIGH",
                title: item.title,
                message: item.description,
                location: item.location,
                sourceId: item.incidentId
            });
        }
    });

    // ==========================================
    // VEHICLE ALERTS
    // ==========================================

    state.vehicles.forEach(item => {
        if (item.status === "EMERGENCY") {
            alerts.push({
                type: "VEHICLE",
                severity: "CRITICAL",
                title: "Emergency Vehicle Active",
                message: `${item.vehicleId} is responding to an emergency.`,
                location: item.location,
                sourceId: item.vehicleId
            });
        }
    });

    return alerts;
};

module.exports = generateAlerts;
