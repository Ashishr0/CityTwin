# CityTwin

A real-time smart city digital twin and monitoring platform built with
the MERN stack and Socket.IO.

# Overview

CityTwin is a full-stack smart city monitoring and digital twin
platform designed to digitally represent and monitor important city
infrastructure and services through a centralized dashboard.

The platform combines CRUD-based management, real-time simulation,
interactive maps, analytics, authentication, and automated alerts into
one application.

# Objectives

Build a centralized smart-city monitoring platform.

Digitally represent major city infrastructure and services.

Provide CRUD management for city systems.

Display live city conditions through Socket.IO.

Simulate changing city data in real time.

Generate alerts when critical thresholds are reached.

Provide map-based visualization of city entities.

Implement authentication and role-based access control.

Present city analytics through an interactive dashboard.

# Features
# Authentication & Authorization
    JWT-based authentication
    Protected routes
    Role-based access control

# Admin login
    City operator access support
    Buildings Management
    Manage city buildings with:
    Create
    Read
    Update
    Delete
    Building details and location

# Traffic Management
    Manage and monitor traffic intersections:
    Intersection information
    Traffic congestion
    Average speed
    Traffic status
    Location data

# Vehicles Management
    Manage city vehicles:
    Vehicle ID
    Vehicle type
     Status
     Location
    Real-time vehicle movement simulation

🚨 Incidents Management

Manage city incidents:

Incident details

Priority

Status

Location

Reporter information

Incidents are also displayed on the interactive city map.

🌱 Environment Management

Monitor environmental conditions:

AQI

Temperature

Humidity

Sensor information

Location

⚡ Energy Management

Monitor city energy data:

Energy consumption

Renewable energy percentage

Energy source

Energy measurements

💧 Water Management

Monitor water infrastructure:

Reservoir level

Daily consumption

Water quality

Water system information

♻️ Waste Management

Monitor waste infrastructure:

Waste bin information

Fill level

Collection status

Location

Critical bin detection

📊 Live Dashboard

The dashboard provides a centralized real-time view of:

Traffic

Air quality

Temperature

Energy

Water

Waste

Vehicles

Incidents

Analytics

Live values are updated through Socket.IO.

🚨 Alert Center

CityTwin automatically generates alerts for conditions such as:

Severe traffic congestion

Poor or critical air quality

Critical waste bins

Low reservoir levels

High energy consumption

High-priority incidents

Emergency vehicles

The Alert Center provides:

Live alerts

Alert history

Read/unread state

Severity filtering

Clear alert functionality

Navigation to related systems

🗺️ Interactive Map

The map provides visual monitoring of city entities including:

Buildings

Vehicles

Incidents

Traffic

Environmental information

Vehicle locations can change through the real-time simulator.

🛠️ Technology Stack

Frontend

React

Vite

React Router

Tailwind CSS

Axios

Socket.IO Client

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

Socket.IO

Development Tools

Git

GitHub

VS Code

MongoDB

🏗️ System Architecture

                         CityTwin
                            │
              ┌─────────────┴─────────────┐
              │                           │
         React Frontend              Node.js Backend
         Vite + Tailwind             Express + Socket.IO
              │                           │
              │ REST API                  │
              └──────────────┬────────────┘
                             │
                     ┌───────┴───────┐
                     │               │
                  MongoDB       City Simulator
                     │               │
                     │          Live Updates
                     │               │
                     └───────┬───────┘
                             │
                       Alert Generator

📂 Project Structure

CityTwin/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Analytics.jsx
│       │   └── CityMap.jsx
│       │
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CityContext.jsx
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── CityManagement.jsx
│       │   ├── BuildingsManagement.jsx
│       │   ├── TrafficManagement.jsx
│       │   ├── VehiclesManagement.jsx
│       │   ├── IncidentsManagement.jsx
│       │   ├── EnvironmentManagement.jsx
│       │   ├── EnergyManagement.jsx
│       │   ├── WaterManagement.jsx
│       │   ├── WasteManagement.jsx
│       │   ├── MapPage.jsx
│       │   ├── Alerts.jsx
│       │   └── Login.jsx
│       │
│       └── App.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── simulator/
│   ├── sockets/
│   └── utils/
│
└── README.md

⚙️ Installation

1. Clone the repository

git clone https://github.com/Ashishr0/CityTwin.git
cd CityTwin

2. Install backend dependencies

cd server
npm install

3. Install frontend dependencies

Open another terminal:

cd CityTwin/client
npm install

🔑 Environment Variables

Create a .env file inside the server directory.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

Never commit real database credentials or secrets to GitHub.

▶️ Running the Project

Start the Backend

cd server
npm run dev

The backend uses:

npm start

for a production-style start.

Start the Frontend

Open another terminal:

cd client
npm run dev

The frontend normally runs at:

http://localhost:5173

👤 Local Demo Login

For local development, the project currently uses:

Email: admin@citytwin.com
Password: Admin@12345

This is a development/demo credential. Change or remove it before
production deployment.

🔄 Real-Time Simulation

CityTwin uses Socket.IO to continuously update simulated city data.

The simulator sends updates approximately every 3 seconds.

The live system can update:

Traffic congestion

Traffic speed

AQI

Temperature

Energy consumption

Renewable energy percentage

Water levels

Water consumption

Waste fill levels

Vehicle positions

Alerts

The React application receives these updates through the Socket.IO
connection.

🚨 Alert Generation

The alert generator evaluates live city conditions and creates alerts
when configured thresholds are reached.

Examples include:

Traffic congestion >= 80%
AQI >= 140
Waste fill level >= 90%
Reservoir level <= 50%
Energy consumption >= 7500
High/Critical incidents
Emergency vehicles

Alerts are sent with live city updates and maintained by the frontend
Alert Center.

📊 Dashboard Analytics

The dashboard maintains a rolling history of recent live measurements
and uses that information to display interactive analytics.

The dashboard can visualize trends in:

Traffic congestion

Traffic speed

AQI

Temperature

Energy

Renewable energy

Water

Waste

🔒 Security

CityTwin includes:

JWT authentication

Protected API routes

Role-based authorization

Environment variables for sensitive configuration

Password authentication

Server-side authorization middleware

🧪 Build Verification

To verify the frontend production build:

cd client
npm run build

To check repository status:

cd ..
git status

🚀 Deployment

CityTwin can be deployed using separate frontend and backend services.

The backend requires support for:

Node.js

Express

Socket.IO/WebSockets

Environment variables

MongoDB connectivity

When deploying the backend, configure:

MONGO_URI
JWT_SECRET
CLIENT_URL

The frontend must use the deployed backend URL for API and Socket.IO
communication.

🔮 Future Scope

Possible future improvements include:

IoT sensor integration

Real-world traffic APIs

Predictive analytics

Machine-learning-based forecasting

Smart energy optimization

Automated emergency response

Historical reporting

Cloud deployment

Mobile application

Advanced GIS integration

🎓 Academic Use

CityTwin is suitable as a BTech Computer Science Engineering project
and demonstrates:

Full-stack web development

REST API development

MongoDB database management

Authentication and authorization

Real-time communication

Data visualization

Simulation

Interactive maps

Modular software architecture

👨‍💻 Author

Ashish Kumar Raw

BTech Computer Science Engineering Student

Interests

Full Stack Development

Java

Web Development

Software Development

📄 License

This project is intended primarily for educational and academic
purposes.
