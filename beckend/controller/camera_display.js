import mongoose from 'mongoose';

const getCamera = async (req, res) => {
  try {
    // Access MongoDB database directly
    const db = mongoose.connection.db;

    // Fetch multiple brands by projecting specific fields for each brand's table array
    const cameraData = await db.collection('cameras').findOne({}, {
      projection: {
        'Canon_camera': 1,
        'Nikon_camera': 1,
        'Panasonic_camera': 1,
        'Sony_camera': 1,
        'GoPro_camera': 1,
        _id: 0
      }
    });

    console.log("Fetched camera data:", cameraData);

    if (!cameraData) {
      console.warn("No camera data found in the database.");
      return res.status(404).json({ message: 'No camera data found' });
    }

    // Combine all table arrays into a single array, using empty arrays as fallback
    const allcamera = [
      ...(cameraData['Canon_camera'] || []),
      ...(cameraData['Nikon_camera'] || []),
      ...(cameraData['Panasonic_camera'] || []),
      ...(cameraData['Sony_camera'] || []),
      ...(cameraData['GoPro_camera'] || []),
    ];

    // Check if combined table array is empty
    if (allcamera.length === 0) {
      console.warn("No camera data combined from the brands.");
      return res.status(404).json({ message: 'No camera data available for any brand' });
    }

    res.status(200).json(allcamera); // Return combined table data
  } catch (error) {
    console.error("Error fetching camera data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getCamera;
