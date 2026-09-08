# 🏙️ CityTwin — Smart City Digital Twin

> A real-time smart-city monitoring and management platform built with the MERN stack, Socket.IO, and MongoDB.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-CityTwin-blue?style=for-the-badge)](https://citytwin-2.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge\&logo=github)](https://github.com/Ashishr0/CityTwin)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Real--Time-Socket.IO-010101?style=for-the-badge\&logo=socket.io)](https://socket.io/)

---

## 🌐 Live Application

### [Live App](https://citytwin-2.onrender.com)

CityTwin is deployed using **Render**.

The application provides a real-time digital view of a smart city, including:

* 🏢 Buildings
* 🚦 Traffic
* 🚗 Vehicles
* 🚨 Incidents
* 🌱 Environment
* ⚡ Energy
* 💧 Water
* ♻️ Waste
* 🗺️ Interactive city map
* 📊 Live analytics
* 🔔 Real-time alerts

> **Note:** The Render free tier may take some time to wake up after a period of inactivity.

---

## 📌 About the Project

**CityTwin** is a full-stack smart-city digital twin system designed to monitor and manage different city components from a centralized web application.

The platform combines traditional CRUD-based city management with **real-time simulation using Socket.IO**.

The dashboard continuously receives simulated city updates, allowing users to observe changing:

* Traffic congestion
* Vehicle positions
* Air quality
* Temperature
* Energy consumption
* Water levels
* Waste levels
* City alerts

The goal is to demonstrate how a digital-twin architecture can combine **data management, visualization, simulation, real-time communication, and interactive monitoring** in a single application.

---

## ✨ Features

### 📊 Real-Time Dashboard

The dashboard provides a live overview of the city.

It displays:

* Traffic statistics
* Air Quality Index (AQI)
* Temperature
* Energy consumption
* Water levels
* Waste levels
* Vehicle activity
* Incident statistics
* Live analytics

City data is updated automatically through **Socket.IO**.

---

### 🏢 Buildings Management

Manage city buildings through CRUD operations.

Supported operations:

* Create building
* View buildings
* Update building
* Delete building
* Track building location
* Track occupancy
* Track energy consumption
* Track water consumption
* Track building status

---

### 🚦 Traffic Management

Monitor and manage traffic information including:

* Traffic congestion
* Average speed
* Road information
* Traffic status
* Location data

---

### 🚗 Vehicle Management

Manage city vehicles with information such as:

* Vehicle ID
* Vehicle type
* Status
* Speed
* Location
* Emergency status

Vehicle locations are also visualized on the city map.

---

### 🚨 Incident Management

Track and manage city incidents.

Features include:

* Incident creation
* Incident updates
* Incident deletion
* Priority levels
* Incident status
* Location
* Reporter information

Incidents are also represented on the map.

---

### 🌱 Environment Management

Monitor environmental conditions such as:

* AQI
* Temperature
* Humidity
* Sensor information
* Location

---

### ⚡ Energy Management

Manage energy monitoring data including:

* Energy consumption
* Renewable energy percentage
* Energy source
* Location
* Status

---

### 💧 Water Management

Monitor water infrastructure including:

* Reservoir level
* Daily consumption
* Water quality
* Location
* Status

---

### ♻️ Waste Management

Manage waste collection information including:

* Bin ID
* Fill level
* Capacity
* Collection status
* Location

The system can identify critical waste bins based on their fill level.

---

### 🗺️ Interactive City Map

The map provides a geographic view of city entities.

It can display:

* Buildings
* Vehicles
* Incidents
* City locations

Vehicle movement can be observed during the live simulation.

---

### 🔔 Real-Time Alert Center

CityTwin includes a real-time alert system that detects abnormal city conditions.

Alerts can be generated for conditions such as:

* High traffic congestion
* Poor air quality
* High waste-bin fill levels
* Low water reservoir levels
* High energy consumption
* Active high/critical incidents
* Emergency vehicles

The Alert Center supports:

* Viewing alerts
* Marking alerts as read
* Marking all alerts as read
* Clearing alerts

---

## 🔄 Real-Time Simulation

CityTwin includes a city-state simulator that continuously updates city data.

The simulator runs every **3 seconds** and sends updates through Socket.IO.

The live system can simulate changes in:

```text
Traffic
   ↓
Environment
   ↓
Energy
   ↓
Water
   ↓
Waste
   ↓
Vehicles
   ↓
Alerts
   ↓
Dashboard
```

This allows the dashboard and analytics components to behave like a continuously changing smart-city monitoring system.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Socket.IO Client
* CSS

### Backend

* Node.js
* Express.js
* Socket.IO
* JWT
* REST APIs

### Database

* MongoDB
* Mongoose
* MongoDB Atlas

### Deployment

* Render
* GitHub

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      CityTwin       │
                    │   React Frontend    │
                    └──────────┬───────────┘
                               │
                    REST API / Socket.IO
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Express Server    │
                    │      Node.js         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       REST Controllers   Socket.IO       City Simulator
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │    MongoDB Atlas     │
                    └──────────────────────┘
```

---

## 📁 Project Structure

```text
CityTwin/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Analytics.jsx
│   │   │   └── CityMap.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CityContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CityManagement.jsx
│   │   │   ├── BuildingsManagement.jsx
│   │   │   ├── TrafficManagement.jsx
│   │   │   ├── VehiclesManagement.jsx
│   │   │   ├── IncidentsManagement.jsx
│   │   │   ├── EnvironmentManagement.jsx
│   │   │   ├── EnergyManagement.jsx
│   │   │   ├── WaterManagement.jsx
│   │   │   ├── WasteManagement.jsx
│   │   │   ├── MapPage.jsx
│   │   │   ├── Alerts.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── sockets/
│   │   └── socketHandler.js
│   │
│   ├── simulator/
│   │   └── citySimulator.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── seedData.js
│   │   └── alertGenerator.js
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

---
