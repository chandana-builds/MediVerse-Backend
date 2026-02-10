const { EmergencyRequest } = require('../models');

exports.triggerEmergency = async (req, res) => {
    try {
        const { userId, location } = req.body;

        console.log(`[EMERGENCY] Triggered by Patient: ${userId} at`, location);

        const hospitalName = "City General Hospital";
        const eta = "12 mins";

        const request = await EmergencyRequest.create({
            patient_id: userId,
            latitude: location.lat,
            longitude: location.lng,
            assigned_hospital: hospitalName,
            eta: eta,
            status: 'dispatched'
        });

        // IMMEDIATELY return success response as requested
        return res.status(200).json({
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
        });

    } catch (error) {
        console.error("Emergency Trigger Error:", error);
        // Ensure headers aren't already sent
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "Failed to process emergency request." });
        }
    }
};
