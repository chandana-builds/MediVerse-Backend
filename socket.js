const socketIo = require('socket.io');

let io;

exports.init = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*", // Allow all for MVP
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Ambulance joins their own room for private messages
        socket.on('join_ambulance', (ambulanceId) => {
            socket.join(ambulanceId);
            console.log(`Ambulance ${ambulanceId} joined room`);
        });

        // Patient joins their request room to track ambulance
        socket.on('join_track_request', (requestId) => {
            socket.join(requestId);
            console.log(`Patient tracking request ${requestId}`);
        });

        // Live GPS Update from Ambulance
        socket.on('update_location', (data) => {
            // data: { ambulanceId, requestId, lat, lng }
            // Broadcast to everyone in the request room (i.e., the Patient)
            io.to(data.requestId).emit('ambulance_location', {
                lat: data.lat,
                lng: data.lng
            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

exports.io = io; // Access io instance globally if needed (though init returns it)
