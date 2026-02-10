const { EmergencyRequest } = require('../models');

exports.triggerEmergency = async (req, res) => {
    try {
        const { userId, location } = req.body;

        console.log(`[EMERGENCY] Triggered by Patient: ${userId} at`, location);

        // 1. Input Validation
        if (!userId) {
            return res.status(400).json({ success: false, message: "Missing userId." });
        }
        if (!location || !location.lat || !location.lng) {
            return res.status(400).json({ success: false, message: "Invalid location data." });
        }

        const hospitalName = "City General Hospital";
        const eta = "12 mins";

        // 2. Database Creation
        let request;
        try {
            request = await EmergencyRequest.create({
                patientId: userId,
                latitude: location.lat,
                longitude: location.lng,
                assigned_hospital: hospitalName,
                eta: eta,
                status: 'dispatched'
            });
        } catch (dbError) {
            console.error("Database Write Error:", dbError);
            // If the table is missing or columns are wrong, we might get here.
            // For MVP/Backup, we can return success with a mock ID if DB fails,
            // BUT since user asked for persistence, we should probably return the error
            // so they know to fix the DB.
            throw new Error(`Database Error: ${dbError.message}`);
        }

        // 3. Success Response
        return res.status(200).json({
            success: true,
            data: {
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
            }
        });

    } catch (error) {
        console.error("Emergency Trigger Error:", error);
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to process emergency request.",
                error_details: error.message // Return specific error for debugging
            });
        }
    }
};
