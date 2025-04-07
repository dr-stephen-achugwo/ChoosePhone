import mongoose from 'mongoose';

const getPhones = async (req, res) => {
  try {
    // Access MongoDB database directly
    const db = mongoose.connection.db;

    // Fetch multiple brands by projecting specific fields for each brand's phone array
    const phoneData = await db.collection('phones').findOne({}, {
      projection: {
        'oppo_phones': 1,
        'vivo_phones': 1,
        'apple_phones': 1,
        'samsung_phones': 1,
        'Asus_phones': 1,
        'Google_phones': 1,
        'Infinix_phones': 1,
        'Motorola_phones': 1,
        'Nokia_phones': 1,
        'OnePlus_phones': 1,
        'Realme_phones': 1,
        'Tecno_phones': 1,
        'Xiaomi_phones': 1,
        'iQOO_phones': 1,
        _id: 0
      }
    });

    console.log("Fetched phone data:", phoneData);

    if (!phoneData) {
      console.warn("No phone data found in the database.");
      return res.status(404).json({ message: 'No phone data found' });
    }

    // Combine all phone arrays into a single array, using empty arrays as fallback
    const allPhones = [
      ...(phoneData['oppo_phones'] || []),
      ...(phoneData['vivo_phones'] || []),
      ...(phoneData['apple_phones'] || []),
      ...(phoneData['samsung_phones'] || []),
      ...(phoneData['Asus_phones'] || []),
      ...(phoneData['Google_phones'] || []),
      ...(phoneData['Infinix_phones'] || []),
      ...(phoneData['Motorola_phones'] || []),
      ...(phoneData['Nokia_phones'] || []),
      ...(phoneData['OnePlus_phones'] || []),
      ...(phoneData['Realme_phones'] || []),
      ...(phoneData['Tecno_phones'] || []),
      ...(phoneData['Xiaomi_phones'] || []),
      ...(phoneData['iQOO_phones'] || []),
    ];

    // Check if combined phone array is empty
    if (allPhones.length === 0) {
      console.warn("No phones data combined from the brands.");
      return res.status(404).json({ message: 'No phone data available for any brand' });
    }

    res.status(200).json(allPhones); // Return combined phone data
  } catch (error) {
    console.error("Error fetching phone data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getPhones;
