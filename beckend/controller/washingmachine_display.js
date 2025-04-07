import mongoose from 'mongoose';

const getWashingmachine = async (req, res) => {
  try {
    // Access MongoDB database directly
    const db = mongoose.connection.db;

    // Fetch multiple brands by projecting specific fields for each brand's table array
    const washingmachineData = await db.collection('washingmachines').findOne({}, {
      projection: {
        'LG_washingmachine': 1,
        'Samsung_washingmachine': 1,
        'Godrej_washingmachine': 1,
        'IFB_washingmachine': 1,
        'Whirlpool_washingmachine': 1,
        _id: 0
      }
    });

    console.log("Fetched washingmachine data:", washingmachineData);

    if (!washingmachineData) {
      console.warn("No washingmachine data found in the database.");
      return res.status(404).json({ message: 'No washingmachine data found' });
    }

    // Combine all table arrays into a single array, using empty arrays as fallback
    const allwashingmachine = [
      ...(washingmachineData['LG_washingmachine'] || []),
      ...(washingmachineData['Samsung_washingmachine'] || []),
      ...(washingmachineData['Godrej_washingmachine'] || []),
      ...(washingmachineData['IFB_washingmachine'] || []),
      ...(washingmachineData['Whirlpool_washingmachine'] || []),
    ];

    // Check if combined table array is empty
    if (allwashingmachine.length === 0) {
      console.warn("No washingmachine data combined from the brands.");
      return res.status(404).json({ message: 'No washingmachine data available for any brand' });
    }

    res.status(200).json(allwashingmachine); // Return combined table data
  } catch (error) {
    console.error("Error fetching washingmachine data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getWashingmachine;
