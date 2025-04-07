import mongoose from 'mongoose';

const getTablets = async (req, res) => {
  try {
    // Access MongoDB database directly
    const db = mongoose.connection.db;

    // Fetch multiple brands by projecting specific fields for each brand's table array
    const tabletData = await db.collection('tablets').findOne({}, {
      projection: {
        'Apple_tablets': 1,
        'Samsung_tablets': 1,
        'lenovo_tablets': 1,
        'Huawei_tablets': 1,
        'Realme_tablets': 1,
        'Xiaomi_tablets': 1,
        _id: 0
      }
    });

    console.log("Fetched table data:", tabletData);

    if (!tabletData) {
      console.warn("No table data found in the database.");
      return res.status(404).json({ message: 'No table data found' });
    }

    // Combine all table arrays into a single array, using empty arrays as fallback
    const alltables = [
      ...(tabletData['Apple_tablets'] || []),
      ...(tabletData['Samsung_tablets'] || []),
      ...(tabletData['Huawei_tablets'] || []),
      ...(tabletData['lenovo_tablets'] || []),
      ...(tabletData['Realme_tablets'] || []),
      ...(tabletData['Xiaomi_tablets'] || []),
    ];

    // Check if combined table array is empty
    if (alltables.length === 0) {
      console.warn("No tables data combined from the brands.");
      return res.status(404).json({ message: 'No table data available for any brand' });
    }

    res.status(200).json(alltables); // Return combined table data
  } catch (error) {
    console.error("Error fetching table data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getTablets;
