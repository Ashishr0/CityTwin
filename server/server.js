const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const buildingRoutes = require("./routes/buildingRoutes");
const trafficRoutes = require("./routes/trafficRoutes");
const environmentRoutes = require("./routes/environmentRoutes");
const energyRoutes = require("./routes/energyRoutes");
const waterRoutes = require("./routes/waterRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const setupSocket = require("./sockets/socketHandler");
const startCitySimulator = require("./simulator/citySimulator");

dotenv.config();

// Connect MongoDB
connectDB();

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL
    })
);

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/traffic", trafficRoutes);
app.use("/api/environment", environmentRoutes);
app.use("/api/energy", energyRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "City Digital Twin API is running",
        status: "success"
    });
});

// Socket.IO
setupSocket(io);

// City Simulator
startCitySimulator(io);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
