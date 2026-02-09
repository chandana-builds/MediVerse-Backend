const io = require("socket.io-client");

// Connect to the backend
const socket = io("http://localhost:3000");

console.log("Attempting to connect to Socket.io server...");

socket.on("connect", () => {
    console.log("✅ Connected to Server! Socket ID:", socket.id);

    // Simulate joining a request room (Patient side)
    const testRequestId = "REQ-123";
    socket.emit("join_track_request", testRequestId);
    console.log(`Joined room for Request ID: ${testRequestId}`);

    // Test: Trigger an emergency to see if we get updates
    // Note: This requires the backend 'Mock Mode' or DB to be running and triggering events.
    // We can manually listen for the event that the controller would emit.
});

// Listen for Ambulance assignment
socket.on("emergency_assigned", (data) => {
    console.log("🚨 EVENT RECEIVED: emergency_assigned");
    console.log("Data:", data);
});

// Listen for GPS updates
socket.on("ambulance_location", (data) => {
    console.log("📍 EVENT RECEIVED: ambulance_location");
    console.log("New Coords:", data);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
});

socket.on("connect_error", (err) => {
    console.log("Connection Error:", err.message);
});
