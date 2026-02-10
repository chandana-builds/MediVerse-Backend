exports.triggerEmergency = async (req, res) => {
    try {
        const { userId, location } = req.body;

        console.log(`[EMERGENCY] Triggered by User: ${userId} at Location:`, location);

        // Mock Logic: Find nearest hospital
        // In a real app, this would query a Geospatial Database (PostGIS / MongoDB GeoJSON)
        const mockResponse = {
            success: true,
            message: "Emergency request received. Ambulance dispatched.",
            ambulance: {
                driver_name: "Rahul Sharma",
                vehicle_number: "KA-01-EA-1234",
                phone: "+91-9876543210",
                eta: "12 mins",
                tracking_url: "https://maps.google.com/?q=12.9716,77.5946" // Example: Bangalore coordinates
            },
            hospital: {
                id: 101,
                name: "City General Hospital",
                location: "4.2 km away"
            }
        };

        // Simulate network delay
        setTimeout(() => {
            res.status(200).json(mockResponse);
        }, 1000);

    } catch (error) {
        console.error("Emergency Trigger Error:", error);
        res.status(500).json({ success: false, message: "Failed to process emergency request." });
    }
};
