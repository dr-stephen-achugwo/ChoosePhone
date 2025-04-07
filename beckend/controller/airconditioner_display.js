import mongoose from 'mongoose';

const getAirConditioner = async (req, res) => {
  try {
    // Access MongoDB database directly
    const db = mongoose.connection.db;

    // Fetch multiple brands by projecting specific fields for each brand's table array
    const airconditionData = await db.collection('airconditions').findOne({}, {
      projection: {
        'Bluestar_aircondition': 1,
        'Samsung_aircondition': 1,
        'Daikin_aircondition': 1,
        'Haier_aircondition': 1,
        'LG_aircondition': 1,
        'Lloyd_aircondition': 1,
        'O_General_aircondition': 1,
        'Voltas_aircondition': 1,
        _id: 0
      }
    });

    console.log("Fetched aircondition data:", airconditionData);

    if (!airconditionData) {
      console.warn("No aircondition data found in the database.");
      return res.status(404).json({ message: 'No aircondition data found' });
    }

    // Combine all table arrays into a single array, using empty arrays as fallback
    const allaircondition = [
      ...(airconditionData['LG_aircondition'] || []),
      ...(airconditionData['Samsung_aircondition'] || []),
      ...(airconditionData['Bluestar_aircondition'] || []),
      ...(airconditionData['Daikin_aircondition'] || []),
      ...(airconditionData['Haier_aircondition'] || []),
      ...(airconditionData['Lloyd_aircondition'] || []),
      ...(airconditionData['O_General_aircondition'] || []),
      ...(airconditionData['Voltas_aircondition'] || []),
    ];

    // Check if combined table array is empty
    if (allaircondition.length === 0) {
      console.warn("No aircondition data combined from the brands.");
      return res.status(404).json({ message: 'No aircondition data available for any brand' });
    }

    res.status(200).json(allaircondition); // Return combined table data
  } catch (error) {
    console.error("Error fetching aircondition data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getAirConditioner;
