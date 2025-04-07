import mongoose from 'mongoose';

const getLaptops = async (req, res) => {
  try {
    // Access MongoDB database directly
    const db = mongoose.connection.db;

    // Fetch multiple brands by projecting specific fields for each brand's table array
    const laptopData = await db.collection('laptops').findOne({}, {
      projection: {
        'apple_laptops': 1,
        'Acer_laptops': 1,
        'lenovo_laptops': 1,
        'HP_laptops': 1,
        'microsoft_laptops': 1,
        'Dell_laptops': 1,
        'Asus_laptops': 1,
        _id: 0
      }
    });

    console.log("Fetched laptop data:", laptopData);

    if (!laptopData) {
      console.warn("No laptop data found in the database.");
      return res.status(404).json({ message: 'No laptop data found' });
    }

    // Combine all table arrays into a single array, using empty arrays as fallback
    const alllaptop = [
      ...(laptopData['apple_laptops'] || []),
      ...(laptopData['Acer_laptops'] || []),
      ...(laptopData['HP_laptops'] || []),
      ...(laptopData['lenovo_laptops'] || []),
      ...(laptopData['microsoft_laptops'] || []),
      ...(laptopData['Dell_laptops'] || []),
      ...(laptopData['Asus_laptops'] || []),
    ];

    // Check if combined table array is empty
    if (alllaptop.length === 0) {
      console.warn("No laptop data combined from the brands.");
      return res.status(404).json({ message: 'No laptop data available for any brand' });
    }

    res.status(200).json(alllaptop); // Return combined table data
  } catch (error) {
    console.error("Error fetching laptop data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getLaptops;
