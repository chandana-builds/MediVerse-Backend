const { EmergencyRequest } = require('../models');

exports.triggerEmergency = async (req, res) => {
    try {
        const { userId, location } = req.body;

        console.log(`[EMERGENCY] Triggered by Patient: ${userId} at`, location);

        // 1. Mock Assignment Logic
        const hospitalName = "City General Hospital";
        const eta = "12 mins";

        // 2. Persist to Database
        const request = await EmergencyRequest.create({
            patient_id: userId,
            latitude: location.lat,
            longitude: location.lng,
            assigned_hospital: hospitalName,
            eta: eta,
            status: 'dispatched'
        });

        const responsePayload = {
            success: true,
            message: "Emergency request logged and ambulance dispatched.",
            requestId: request.id,
            ambulance: {
                driver_name: "Rahul Sharma",
                vehicle_number: "KA-01-EA-1234",
                phone: "+91-9876543210",
                eta: eta,
                tracking_url: `https://maps.google.com/?q=${location.lat},${location.lng}`
            },
            hospital: {
                id: 101,
                name: hospitalName,
                location: "4.2 km away"
            }
        };

        // Simulate network delay
        setTimeout(() => {
            res.status(200).json(responsePayload);
        }, 800);

    } catch (error) {
        console.error("Emergency Trigger Error:", error);
        res.status(500).json({ success: false, message: "Failed to process emergency request." });
    }
};
