const Building = require("../models/Building");
const Traffic = require("../models/Traffic");
const Environment = require("../models/Environment");
const Energy = require("../models/Energy");
const Water = require("../models/Water");
const Waste = require("../models/Waste");
const Vehicle = require("../models/Vehicle");
const Incident = require("../models/Incident");

const getDashboard = async (req, res) => {
    try {
        const [
            buildings,
            traffic,
            environment,
            energy,
            water,
            waste,
            vehicles,
            incidents
        ] = await Promise.all([
            Building.find().sort({ createdAt: -1 }),
            Traffic.find().sort({ createdAt: -1 }),
            Environment.find().sort({ createdAt: -1 }),
            Energy.find().sort({ createdAt: -1 }),
            Water.find().sort({ createdAt: -1 }),
            Waste.find().sort({ createdAt: -1 }),
            Vehicle.find().sort({ createdAt: -1 }),
            Incident.find().sort({ createdAt: -1 })
        ]);

        const activeIncidents = incidents.filter(
            incident => incident.status !== "RESOLVED"
        );

        const criticalIncidents = incidents.filter(
            incident =>
                incident.priority === "CRITICAL" &&
                incident.status !== "RESOLVED"
        );

        const emergencyVehicles = vehicles.filter(
            vehicle => vehicle.status === "EMERGENCY"
        );

        const criticalWasteBins = waste.filter(
            bin => bin.status === "CRITICAL"
        );

        const averageAQI =
            environment.length > 0
                ? environment.reduce(
                    (sum, item) => sum + item.aqi,
                    0
                ) / environment.length
                : 0;

        const averageTrafficCongestion =
            traffic.length > 0
                ? traffic.reduce(
                    (sum, item) => sum + item.congestion,
                    0
                ) / traffic.length
                : 0;

        const totalEnergyConsumption =
            energy.reduce(
                (sum, item) => sum + item.consumption,
                0
            );

        res.json({
            summary: {
                totalBuildings: buildings.length,
                trafficPoints: traffic.length,
                environmentSensors: environment.length,
                energyPoints: energy.length,
                waterPoints: water.length,
                totalWasteBins: waste.length,
                totalVehicles: vehicles.length,
                activeIncidents: activeIncidents.length,
                criticalIncidents: criticalIncidents.length,
                emergencyVehicles: emergencyVehicles.length,
                criticalWasteBins: criticalWasteBins.length
            },

            metrics: {
                averageAQI: Number(averageAQI.toFixed(2)),
                averageTrafficCongestion:
                    Number(averageTrafficCongestion.toFixed(2)),
                totalEnergyConsumption
            },

            data: {
                buildings,
                traffic,
                environment,
                energy,
                water,
                waste,
                vehicles,
                incidents
            },

            lastUpdated: new Date()
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};

module.exports = {
    getDashboard
};
