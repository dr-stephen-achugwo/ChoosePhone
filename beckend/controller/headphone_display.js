import mongoose from 'mongoose';

const getHeadphones = async (req, res) => {
  try {
    // Access MongoDB database directly
    const db = mongoose.connection.db;

    // Fetch multiple brands by projecting specific fields for each brand's table array
    const headphoneData = await db.collection('headphones').findOne({}, {
      projection: {
        'Boat_headphones': 1,
        'JBL_headphones': 1,
        'Realme_headphones': 1,
        'Sennheiser_headphones': 1,
        'sony_headphones': 1,
        _id: 0
      }
    });

    console.log("Fetched headphone data:", headphoneData);

    if (!headphoneData) {
      console.warn("No headphone data found in the database.");
      return res.status(404).json({ message: 'No headphone data found' });
    }

    // Combine all table arrays into a single array, using empty arrays as fallback
    const allheadphone = [
      ...(headphoneData['Boat_headphones'] || []),
      ...(headphoneData['JBL_headphones'] || []),
      ...(headphoneData['Realme_headphones'] || []),
      ...(headphoneData['Sennheiser_headphones'] || []),
      ...(headphoneData['sony_headphones'] || []),
    ];

    // Check if combined table array is empty
    if (allheadphone.length === 0) {
      console.warn("No headphone data combined from the brands.");
      return res.status(404).json({ message: 'No headphone data available for any brand' });
    }

    res.status(200).json(allheadphone); // Return combined table data
  } catch (error) {
    console.error("Error fetching headphone data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getHeadphones;
