const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Send connection confirmation
        socket.emit("connection_success", {
            message: "Connected to City Digital Twin",
            socketId: socket.id
        });

        // Join city dashboard room
        socket.on("join_city", (city) => {
            const room = city || "default_city";

            socket.join(room);

            console.log(
                `Socket ${socket.id} joined city room: ${room}`
            );

            socket.emit("joined_city", {
                city: room
            });
        });

        // Leave city dashboard room
        socket.on("leave_city", (city) => {
            const room = city || "default_city";

            socket.leave(room);

            console.log(
                `Socket ${socket.id} left city room: ${room}`
            );
        });

        // Handle client disconnection
        socket.on("disconnect", (reason) => {
            console.log(
                `Client disconnected: ${socket.id}`
            );

            console.log(`Reason: ${reason}`);
        });
    });
};

module.exports = setupSocket;
