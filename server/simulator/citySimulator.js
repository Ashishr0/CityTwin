const randomChange = (value, min, max, step = 5) => {
    const direction = Math.random() < 0.5 ? -1 : 1;

    const change =
        Math.random() * step * direction;

    const newValue = value + change;

    return Number(
        Math.max(min, Math.min(max, newValue)).toFixed(2)
    );
};

const randomBetween = (min, max) => {
    return Number(
        (Math.random() * (max - min) + min).toFixed(2)
    );
};


// ======================================================
// CITY LOCATIONS
// ======================================================

const cityLocations = {

    traffic: [
        {
            intersectionId: "TR-001",
            name: "Central Junction",
            location: {
                lat: 28.6139,
                lng: 77.2090
            }
        },
        {
            intersectionId: "TR-002",
            name: "North Avenue",
            location: {
                lat: 28.6258,
                lng: 77.2185
            }
        },
        {
            intersectionId: "TR-003",
            name: "East Market",
            location: {
                lat: 28.6129,
                lng: 77.2295
            }
        },
        {
            intersectionId: "TR-004",
            name: "South Gate",
            location: {
                lat: 28.5985,
                lng: 77.2080
            }
        },
        {
            intersectionId: "TR-005",
            name: "West Circle",
            location: {
                lat: 28.6155,
                lng: 77.1920
            }
        }
    ],

    environment: [
        {
            sensorId: "ENV-001",
            locationName: "Central Park",
            location: {
                lat: 28.6200,
                lng: 77.2100
            }
        },
        {
            sensorId: "ENV-002",
            locationName: "Industrial Area",
            location: {
                lat: 28.6050,
                lng: 77.2350
            }
        },
        {
            sensorId: "ENV-003",
            locationName: "Residential Zone",
            location: {
                lat: 28.6350,
                lng: 77.1950
            }
        }
    ],

    waste: [
        {
            binId: "BIN-001",
            location: {
                lat: 28.6180,
                lng: 77.2050
            }
        },
        {
            binId: "BIN-002",
            location: {
                lat: 28.6080,
                lng: 77.2180
            }
        },
        {
            binId: "BIN-003",
            location: {
                lat: 28.6250,
                lng: 77.2250
            }
        },
        {
            binId: "BIN-004",
            location: {
                lat: 28.6300,
                lng: 77.2050
            }
        }
    ],

    vehicles: [
        {
            vehicleId: "BUS-001",
            type: "BUS",
            route: "Route A",
            location: {
                lat: 28.6150,
                lng: 77.2150
            }
        },
        {
            vehicleId: "BUS-002",
            type: "BUS",
            route: "Route B",
            location: {
                lat: 28.6200,
                lng: 77.2200
            }
        },
        {
            vehicleId: "AMB-001",
            type: "AMBULANCE",
            route: "Emergency",
            location: {
                lat: 28.6080,
                lng: 77.2100
            }
        },
        {
            vehicleId: "POL-001",
            type: "POLICE",
            route: "Patrol",
            location: {
                lat: 28.6250,
                lng: 77.2000
            }
        }
    ],

    incidents: [
        {
            incidentId: "INC-001",
            type: "ACCIDENT",
            title: "Traffic Accident",
            description:
                "Minor traffic accident reported.",
            priority: "HIGH",
            status: "ACTIVE",
            location: {
                lat: 28.6100,
                lng: 77.2150
            }
        },
        {
            incidentId: "INC-002",
            type: "POLLUTION",
            title: "High Pollution",
            description:
                "Pollution level above normal range.",
            priority: "MEDIUM",
            status: "ACTIVE",
            location: {
                lat: 28.6250,
                lng: 77.2150
            }
        }
    ],

    buildings: [
        {
            buildingId: "BLD-001",
            name: "City Hospital",
            type: "HOSPITAL",
            floors: 8,
            occupancy: 420,
            location: {
                lat: 28.6180,
                lng: 77.2250
            }
        },
        {
            buildingId: "BLD-002",
            name: "City School",
            type: "SCHOOL",
            floors: 4,
            occupancy: 850,
            location: {
                lat: 28.6300,
                lng: 77.2150
            }
        },
        {
            buildingId: "BLD-003",
            name: "Tech Business Center",
            type: "COMMERCIAL",
            floors: 12,
            occupancy: 1200,
            location: {
                lat: 28.6100,
                lng: 77.2050
            }
        }
    ]
};


// ======================================================
// INITIAL CITY STATE
// ======================================================

const createInitialCityState = () => {

    return {

        traffic: cityLocations.traffic.map(item => ({
            ...item,

            vehicles: Math.round(
                randomBetween(80, 220)
            ),

            congestion: randomBetween(30, 75),

            averageSpeed: randomBetween(25, 60),

            averageWaitTime: randomBetween(10, 60),

            signalStatus: "ACTIVE"
        })),

        environment: cityLocations.environment.map(item => ({
            ...item,

            aqi: randomBetween(70, 150),

            pm25: randomBetween(20, 70),

            pm10: randomBetween(30, 100),

            temperature: randomBetween(25, 35),

            humidity: randomBetween(40, 75),

            noise: randomBetween(40, 80)
        })),

        waste: cityLocations.waste.map(item => ({
            ...item,

            fillLevel: randomBetween(30, 80),

            status: "NORMAL"
        })),

        vehicles: cityLocations.vehicles.map(item => ({
            ...item,

            speed: randomBetween(20, 60),

            passengers:
                item.type === "BUS"
                    ? Math.round(randomBetween(10, 50))
                    : 0,

            status: "ON_ROUTE"
        })),

        incidents: cityLocations.incidents,

        buildings: cityLocations.buildings.map(item => ({
            ...item,

            energyConsumption:
                randomBetween(100, 1000),

            waterConsumption:
                randomBetween(50, 500),

            status: "NORMAL"
        })),

        energy: {
            consumption: 5200,
            renewablePercentage: 32
        },

        water: {
            reservoirLevel: 76,
            dailyConsumption: 4200,
            pipelinePressure: 72
        }
    };
};


// ======================================================
// UPDATE CITY STATE
// ======================================================

const updateCityState = (state) => {

    // -----------------------------------------
    // TRAFFIC
    // -----------------------------------------

    state.traffic.forEach(item => {

        item.congestion = randomChange(
            item.congestion,
            10,
            95,
            5
        );

        item.averageSpeed = randomChange(
            item.averageSpeed,
            10,
            70,
            3
        );

        item.averageWaitTime = randomChange(
            item.averageWaitTime,
            5,
            120,
            5
        );

        item.vehicles = Math.round(
            randomBetween(50, 250)
        );
    });


    // -----------------------------------------
    // ENVIRONMENT
    // -----------------------------------------

    state.environment.forEach(item => {

        item.aqi = randomChange(
            item.aqi,
            40,
            200,
            6
        );

        item.pm25 = randomChange(
            item.pm25,
            10,
            120,
            4
        );

        item.pm10 = randomChange(
            item.pm10,
            20,
            150,
            5
        );

        item.temperature = randomChange(
            item.temperature,
            20,
            42,
            0.5
        );

        item.humidity = randomChange(
            item.humidity,
            30,
            90,
            2
        );

        item.noise = randomChange(
            item.noise,
            30,
            100,
            3
        );
    });


    // -----------------------------------------
    // WASTE
    // -----------------------------------------

    state.waste.forEach(item => {

        item.fillLevel = randomChange(
            item.fillLevel,
            10,
            100,
            4
        );

        if (item.fillLevel >= 90) {
            item.status = "CRITICAL";
        } else if (item.fillLevel >= 70) {
            item.status = "ALMOST_FULL";
        } else if (item.fillLevel >= 30) {
            item.status = "NORMAL";
        } else {
            item.status = "EMPTY";
        }
    });


    // -----------------------------------------
    // VEHICLES
    // -----------------------------------------

    state.vehicles.forEach(item => {

        item.speed = randomChange(
            item.speed,
            0,
            80,
            5
        );

        if (item.type === "BUS") {

            item.passengers = Math.round(
                randomBetween(5, 60)
            );

        }

        // Slight movement around current location
        item.location.lat = Number(
            (
                item.location.lat +
                randomBetween(-0.0005, 0.0005)
            ).toFixed(6)
        );

        item.location.lng = Number(
            (
                item.location.lng +
                randomBetween(-0.0005, 0.0005)
            ).toFixed(6)
        );
    });


    // -----------------------------------------
    // BUILDINGS
    // -----------------------------------------

    state.buildings.forEach(item => {

        item.energyConsumption =
            randomChange(
                item.energyConsumption,
                50,
                1500,
                50
            );

        item.waterConsumption =
            randomChange(
                item.waterConsumption,
                20,
                800,
                30
            );
    });


    // -----------------------------------------
    // ENERGY
    // -----------------------------------------

    state.energy.consumption =
        randomChange(
            state.energy.consumption,
            3000,
            8000,
            150
        );

    state.energy.renewablePercentage =
        randomChange(
            state.energy.renewablePercentage,
            20,
            70,
            2
        );


    // -----------------------------------------
    // WATER
    // -----------------------------------------

    state.water.reservoirLevel =
        randomChange(
            state.water.reservoirLevel,
            40,
            95,
            1
        );

    state.water.dailyConsumption =
        randomChange(
            state.water.dailyConsumption,
            2500,
            6500,
            100
        );

    state.water.pipelinePressure =
        randomChange(
            state.water.pipelinePressure,
            40,
            90,
            2
        );


    return state;
};


// ======================================================
// START SIMULATOR
// ======================================================

const startCitySimulator = (io) => {

    const cityState =
        createInitialCityState();

    console.log(
        "City Simulator started 🤖"
    );

    setInterval(() => {

        updateCityState(cityState);

        io.emit("city_update", {

            timestamp: new Date(),

            data: cityState
        });

        // console.log(
        //     "Live city state updated"
        // );

    }, 3000);
};


module.exports = startCitySimulator;