// controllers/AirConditionController.js
import AirCondition from '../model/Airconditioner_model.js';

// Controller function to handle the POST request
export const createAirCondition = async (req, res) => {
  const airConditionData = req.body;

  try {
      // Validate that at least one category is provided
      const categories = Object.keys(airConditionData);
      if (!categories.length) {
          return res.status(400).json({
              error: 'At least one AirCondition category (e.g., oppo_AirCondition) must be provided',
          });
      }

      // Aggregate all AirCondition data into a single array (optional)
      const allAircondition = categories.reduce((acc, category) => {
          return acc.concat(airConditionData[category] || []);
      }, []);

      if (!allAircondition.length) {
          return res.status(400).json({
              error: 'No AirCondition data provided in any category.',
          });
      }

      // Save or update the AirCondition data
      let savedAirCondition;
      for (const category of categories) {
          const airCondition = airConditionData[category];

          if (airCondition?.length) {
              // Find or create the existing AirCondition category in the database
              savedAirCondition = await AirCondition.updateOne(
                  {}, // Assuming single-document DB (no filters needed)
                  { $push: { [category]: { $each: airCondition } } },
                  { upsert: true } // Create if not exists
              );
          }
      }

      res.status(201).json({
          message: 'AirCondition data saved successfully!',
          data: savedAirCondition,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'An error occurred while saving the AirCondition data.',
          details: error.message,
      });
  }
};


export const updateAirCondition = async (req, res) => {
  const updatedAirCondition = req.body; // Updated AirCondition data

  try {
    // Validate that updated data is provided
    if (!Object.keys(updatedAirCondition).length) {
      return res.status(400).json({ error: "No updated data provided." });
    }

    // Allowed fields for updating
    const allowedFields = [
      "name", "Price", "type", "capacity", "energy_rating", "cooling_power", "special_features", "condenser_coil",
      "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
      "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
      "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
      "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
      "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
      "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
      "vijaysales_Price",
    ];

    // Validate updatedAirCondition fields
    const invalidFields = Object.keys(updatedAirCondition).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length) {
      return res.status(400).json({
        error: "Invalid fields provided in the updated data.",
        invalidFields,
      });
    }

    // List of AirCondition categories in the database
    const airConditionCategories = [
      "LG_aircondition", "Samsung_aircondition", "Daikin_aircondition", "O_General_aircondition",
      "Bluestar_aircondition", "Haier_aircondition", "Lloyd_aircondition", "Voltas_aircondition",
    ];

    // Fetch the existing document
    const existingDocument = await AirCondition.findOne();

    if (!existingDocument) {
      return res.status(404).json({ error: "No AirCondition document found in the database." });
    }

    let airConditionUpdated = false;

    // Loop through categories to find and update the AirCondition
    for (const category of airConditionCategories) {
      const airConditionArray = existingDocument[category];

      if (Array.isArray(airConditionArray)) {
        const airConditionToUpdate = airConditionArray.find(
          (p) => p.name && p.name.toLowerCase() === updatedAirCondition.name?.toLowerCase()
        );

        if (airConditionToUpdate) {
          // Merge existing data with updated data (ignoring null/undefined values)
          Object.assign(
            airConditionToUpdate,
            Object.fromEntries(
              Object.entries(updatedAirCondition).filter(
                ([_, value]) => value !== null && value !== undefined
              )
            )
          );

          airConditionUpdated = true;
          break;
        }
      }
    }

    if (!airConditionUpdated) {
      return res.status(404).json({
        error: `AirCondition with name "${updatedAirCondition.name}" not found in any category.`,
      });
    }

    // Save the updated document
    await existingDocument.save();

    res.status(200).json({
      message: "AirCondition updated successfully!",
      data: updatedAirCondition,
    });
  } catch (error) {
    console.error("Error while updating AirCondition data:", error);
    res.status(500).json({
      error: "An error occurred while updating the AirCondition data.",
      details: error.message,
    });
  }
};

    

 // Ensure the correct path to your schema

 export const deleteAirCondition = async (req, res) => {
  const { airConditionObject } = req.body; // Receive the AirCondition object

  try {
    if (!airConditionObject || typeof airConditionObject !== "object") {
      return res.status(400).json({ error: "A valid AirCondition object is required." });
    }

    // Track if an AirCondition was deleted
    let airConditionDeleted = false;

    // Iterate over all categories in the schema
    const categories = Object.keys(AirCondition.schema.paths).filter((key) =>
      key.endsWith("_aircondition")
    );

    for (const category of categories) {
      // Remove the AirCondition object from the category
      const result = await AirCondition.updateOne(
        {}, // Assuming a single document
        { $pull: { [category]: airConditionObject } }
      );

      if (result.modifiedCount > 0) {
        airConditionDeleted = true;
        break; // Exit loop if the AirCondition is deleted
      }
    }

    if (!airConditionDeleted) {
      return res.status(404).json({ error: "AirCondition object not found in any category." });
    }

    res.status(200).json({ message: "AirCondition deleted successfully from the database!" });
  } catch (error) {
    console.error("Error deleting AirCondition:", error);
    res.status(500).json({ error: "An error occurred while deleting the AirCondition." });
  }
};

 
  


  