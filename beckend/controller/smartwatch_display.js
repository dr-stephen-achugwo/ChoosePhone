import mongoose from 'mongoose';

const getSmartwatches = async (req, res) => {
  try {
    // Access MongoDB database directly
    const db = mongoose.connection.db;

    // Fetch multiple brands by projecting specific fields for each brand's table array
    const smartwatchData = await db.collection('smartwatches').findOne({}, {
      projection: {
        'Apple_smartwatches': 1,
        'Samsung_smartwatches': 1,
        'Oneplus_smartwatches': 1,
        'Realme_smartwatches': 1,
        'Amazfit_smartwatches': 1,
        _id: 0
      }
    });

    console.log("Fetched table data:", smartwatchData);

    if (!smartwatchData) {
      console.warn("No smartwatch data found in the database.");
      return res.status(404).json({ message: 'No smartwatch data found' });
    }

    // Combine all table arrays into a single array, using empty arrays as fallback
    const allsmartwatch = [
      ...(smartwatchData['Apple_smartwatches'] || []),
      ...(smartwatchData['Samsung_smartwatches'] || []),
      ...(smartwatchData['Oneplus_smartwatches'] || []),
      ...(smartwatchData['Amazfit_smartwatches'] || []),
      ...(smartwatchData['Realme_smartwatches'] || []),
    ];

    // Check if combined table array is empty
    if (allsmartwatch.length === 0) {
      console.warn("No smartwatch data combined from the brands.");
      return res.status(404).json({ message: 'No smartwatch data available for any brand' });
    }

    res.status(200).json(allsmartwatch); // Return combined table data
  } catch (error) {
    console.error("Error fetching smartwatch data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getSmartwatches;
