import mongoose from 'mongoose';

const getTelevisions = async (req, res) => {
  try {
    // Access MongoDB database directly
    const db = mongoose.connection.db;

    // Fetch multiple brands by projecting specific fields for each brand's table array
    const televisionsData = await db.collection('televisions').findOne({}, {
      projection: {
        'LG_televisions': 1,
        'Samasung_televisions': 1,
        'Oneplus_televisions': 1,
        'Mi_televisions': 1,
        'Panasonic_televisions': 1,
        'Sony_televisions': 1,
        _id: 0
      }
    });

    console.log("Fetched televisions data:", televisionsData);

    if (!televisionsData) {
      console.warn("No televisions data found in the database.");
      return res.status(404).json({ message: 'No televisions data found' });
    }

    // Combine all table arrays into a single array, using empty arrays as fallback
    const alltelevisions = [
      ...(televisionsData['LG_televisions'] || []),
      ...(televisionsData['Samasung_televisions'] || []),
      ...(televisionsData['Oneplus_televisions'] || []),
      ...(televisionsData['Mi_televisions'] || []),
      ...(televisionsData['Panasonic_televisions'] || []),
      ...(televisionsData['Sony_televisions'] || []),
    ];

    // Check if combined table array is empty
    if (alltelevisions.length === 0) {
      console.warn("No televisions data combined from the brands.");
      return res.status(404).json({ message: 'No televisions data available for any brand' });
    }

    res.status(200).json(alltelevisions); // Return combined table data
  } catch (error) {
    console.error("Error fetching televisions data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getTelevisions;
