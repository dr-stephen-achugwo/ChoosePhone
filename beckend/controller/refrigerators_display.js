
import mongoose from 'mongoose';

const getRefrigerators = async (req, res) => {
  try {
    // Access MongoDB database directly
    const db = mongoose.connection.db;

    // Fetch multiple brands by projecting specific fields for each brand's table array
    const refrigeratorData = await db.collection('refrigerators').findOne({}, {
      projection: {
        'Godrej_refrigerator': 1,
        'Samsung_refrigerator': 1,
        'whirlpool_refrigerator': 1,
        'LG_refrigerator': 1,
        _id: 0
      }
    });

    console.log("Fetched table data:", refrigeratorData);

    if (!refrigeratorData) {
      console.warn("No table data found in the database.");
      return res.status(404).json({ message: 'No table data found' });
    }

    // Combine all table arrays into a single array, using empty arrays as fallback
    const allrefrigerator = [
      ...(refrigeratorData['Godrej_refrigerator'] || []),
      ...(refrigeratorData['Samsung_refrigerator'] || []),
      ...(refrigeratorData['whirlpool_refrigerator'] || []),
      ...(refrigeratorData['LG_refrigerator'] || []),
    ];

    // Check if combined table array is empty
    if (allrefrigerator.length === 0) {
      console.warn("No refrigerator data combined from the brands.");
      return res.status(404).json({ message: 'No refrigerator data available for any brand' });
    }

    res.status(200).json(allrefrigerator); // Return combined table data
  } catch (error) {
    console.error("Error fetching refrigerator data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getRefrigerators;
