// controllers/SmartwatchesController.js
import Smartwatches from '../model/Smartwatch_model.js';
// Controller function to handle the POST request
export const createSmartwatches = async (req, res) => {
  const smartwatchesData = req.body;
try {
      // Validate that at least one category is provided
      const categories = Object.keys(smartwatchesData);
      if (!categories.length) {
          return res.status(400).json({
              error: 'At least one Smartwatches category (e.g., oppo_Smartwatcheses) must be provided',
          });
      }
// Aggregate all Smartwatches data into a single array (optional)
      const allSmartwatches = categories.reduce((acc, category) => {
          return acc.concat(smartwatchesData[category] || []);
      }, []);

      if (!allSmartwatches.length) {
          return res.status(400).json({
              error: 'No Smartwatches data provided in any category.',
          });
      }
// Save or update the Smartwatches data
      let savedSmartwatches;
      for (const category of categories) {
          const smartwatches = smartwatchesData[category];

          if (smartwatches?.length) {
              // Find or create the existing Smartwatches category in the database
              savedSmartwatches = await Smartwatches.updateOne(
                  {}, // Assuming single-document DB (no filters needed)
                  { $push: { [category]: { $each: smartwatches } } },
                  { upsert: true } // Create if not exists
              );
          }
      }

      res.status(201).json({
          message: 'Smartwatches data saved successfully!',
          data: savedSmartwatches,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'An error occurred while saving the Smartwatches data.',
          details: error.message,
      });
  }
};


export const updateSmartwatches = async (req, res) => {
  const updatedSmartwatches = req.body; // Updated Smartwatches data

  try {
    // Validate that updated data is provided
    if (!Object.keys(updatedSmartwatches).length) {
      return res.status(400).json({ error: "No updated data provided." });
    }

    // Allowed fields for updating
    const allowedFields = [
      "name", "Price", "display", "battery_life", "water_resistance","sensors","connectivity","features",
      "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
      "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
      "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
      "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
      "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
      "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
      "vijaysales_Price",
    ];

    // Validate updatedSmartwatches fields
    const invalidFields = Object.keys(updatedSmartwatches).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length) {
      return res.status(400).json({
        error: "Invalid fields provided in the updated data.",
        invalidFields,
      });
    }

    // List of Smartwatches categories in the database
    const smartwatchesCategories = [
       "Amazfit_smartwatches", "Oneplus_smartwatches", "Apple_smartwatches",
       "Realme_smartwatches", "Samsung_smartwatches", 
    ];

    // Fetch the existing document
    const existingDocument = await Smartwatches.findOne();

    if (!existingDocument) {
      return res.status(404).json({ error: "No Smartwatches document found in the database." });
    }

    let smartwatchesUpdated = false;

    // Loop through categories to find and update the Smartwatches
    for (const category of smartwatchesCategories) {
      const smartwatches = existingDocument[category];

      if (Array.isArray(smartwatches)) {
        const smartwatch = smartwatches.find(
          (p) => p.name && p.name.toLowerCase() === updatedSmartwatches.name?.toLowerCase()
        );

        if (smartwatch) {
          // Merge existing data with updated data (ignoring null/undefined values)
          Object.assign(
            smartwatch,
            Object.fromEntries(
              Object.entries(updatedSmartwatches).filter(
                ([_, value]) => value !== null && value !== undefined
              )
            )
          );

          smartwatchesUpdated = true;
          break;
        }
      }
    }

    if (!smartwatchesUpdated) {
      return res.status(404).json({
        error: `Smartwatches with name "${updatedSmartwatches.name}" not found in any category.`,
      });
    }

    // Save the updated document
    await existingDocument.save();

    res.status(200).json({
      message: "Smartwatches updated successfully!",
      data: updatedSmartwatches,
    });
  } catch (error) {
    console.error("Error while updating Smartwatches data:", error.message);
    res.status(500).json({
      error: "An error occurred while updating the Smartwatches data.",
      details: error.message,
    });
  }
};
    

 // Ensure the correct path to your schema

export const deleteSmartwatches = async (req, res) => {
  const { smartwatchesObject } = req.body; // Receive the Smartwatches object

  try {
    if (!smartwatchesObject) {
      return res.status(400).json({ error: "Smartwatches object is required." });
    }

    // Track if a Smartwatches was deleted
    let smartwatchesDeleted = false;

    // Iterate over all categories in the schema
    const categories = Object.keys(Smartwatches.schema.paths).filter(
      (key) => key.endsWith("_smartwatches")
    );

    for (const category of categories) {
      // Remove the Smartwatches object from the category
      const result = await Smartwatches.updateOne(
        {}, // Assuming a single document
        { $pull: { [category]: smartwatchesObject } }
      );

      if (result.modifiedCount > 0) {
        smartwatchesDeleted = true;
        break; // Exit loop if the Smartwatches is deleted
      }
    }

    if (!smartwatchesDeleted) {
      return res.status(404).json({ error: "Smartwatches object not found in any category." });
    }

    res.status(200).json({ message: "Smartwatches deleted successfully from the database!" });
  } catch (error) {
    console.error("Error deleting Smartwatches:", error);
    res.status(500).json({ error: "An error occurred while deleting the Smartwatches." });
  }
};

 
  


  