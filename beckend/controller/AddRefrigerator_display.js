// controllers/RefrigeratorController.js
import Refrigerator from '../model/Refrigerator_model.js';

// Controller function to handle the POST request
export const createRefrigerator = async (req, res) => {
  const refrigeratorData = req.body;

  try {
      // Validate that at least one category is provided
      const categories = Object.keys(refrigeratorData);
      if (!categories.length) {
          return res.status(400).json({
              error: 'At least one Refrigerator category (e.g., oppo_Refrigerator) must be provided',
          });
      }

      // Aggregate all Refrigerator data into a single array (optional)
      const allRefrigerator = categories.reduce((acc, category) => {
          return acc.concat(refrigeratorData[category] || []);
      }, []);

      if (!allRefrigerator.length) {
          return res.status(400).json({
              error: 'No Refrigerator data provided in any category.',
          });
      }

      // Save or update the Refrigerator data
      let savedRefrigerator;
      for (const category of categories) {
          const refrigerator = refrigeratorData[category];

          if (refrigerator?.length) {
              // Find or create the existing Refrigerator category in the database
              savedRefrigerator = await Refrigerator.updateOne(
                  {}, // Assuming single-document DB (no filters needed)
                  { $push: { [category]: { $each: refrigerator } } },
                  { upsert: true } // Create if not exists
              );
          }
      }

      res.status(201).json({
          message: 'Refrigerator data saved successfully!',
          data: savedRefrigerator,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'An error occurred while saving the Refrigerator data.',
          details: error.message,
      });
  }
};


export const updateRefrigerator = async (req, res) => {
  const updatedRefrigerator = req.body; // Updated Refrigerator data

  try {
    // Validate that updated data is provided
    if (!Object.keys(updatedRefrigerator).length) {
      return res.status(400).json({ error: "No updated data provided." });
    }

    // Allowed fields for updating
    const allowedFields = [
      "name", "Price", "capacity", "features", "energy_rating",
      "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
      "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
      "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
      "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
      "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
      "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
      "vijaysales_Price",
    ];

    // Validate updatedRefrigerator fields
    const invalidFields = Object.keys(updatedRefrigerator).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length) {
      return res.status(400).json({
        error: "Invalid fields provided in the updated data.",
        invalidFields,
      });
    }

    // List of Refrigerator categories in the database
    const refrigeratorCategories = [
      "LG_refrigerator", "Samsung_refrigerator", "whirlpool_refrigerator", "Godrej_refrigerator", 
    ];

    // Fetch the existing document
    const existingDocument = await Refrigerator.findOne();

    if (!existingDocument) {
      return res.status(404).json({ error: "No Refrigerator document found in the database." });
    }

    let refrigeratorUpdated = false;

    // Loop through categories to find and update the Refrigerator
    for (const category of refrigeratorCategories) {
      const refrigeratorArray = existingDocument[category];

      if (Array.isArray(refrigeratorArray)) {
        const refrigeratorToUpdate = refrigeratorArray.find(
          (p) => p.name && p.name.toLowerCase() === updatedRefrigerator.name?.toLowerCase()
        );

        if (refrigeratorToUpdate) {
          // Merge existing data with updated data (ignoring null/undefined values)
          Object.assign(
            refrigeratorToUpdate,
            Object.fromEntries(
              Object.entries(updatedRefrigerator).filter(
                ([_, value]) => value !== null && value !== undefined
              )
            )
          );

          refrigeratorUpdated = true;
          break;
        }
      }
    }

    if (!refrigeratorUpdated) {
      return res.status(404).json({
        error: `Refrigerator with name "${updatedRefrigerator.name}" not found in any category.`,
      });
    }

    // Save the updated document
    await existingDocument.save();

    res.status(200).json({
      message: "Refrigerator updated successfully!",
      data: updatedRefrigerator,
    });
  } catch (error) {
    console.error("Error while updating Refrigerator data:", error.message);
    res.status(500).json({
      error: "An error occurred while updating the Refrigerator data.",
      details: error.message,
    });
  }
};
    

 // Ensure the correct path to your schema

export const deleteRefrigerator = async (req, res) => {
  const { refrigeratorObject } = req.body; // Receive the Refrigerator object

  try {
    if (!refrigeratorObject) {
      return res.status(400).json({ error: "Refrigerator object is required." });
    }

    // Track if a Refrigerator was deleted
    let refrigeratorDeleted = false;

    // Iterate over all categories in the schema
    const categories = Object.keys(Refrigerator.schema.paths).filter(
      (key) => key.endsWith("_refrigerator")
    );

    for (const category of categories) {
      // Remove the Refrigerator object from the category
      const result = await Refrigerator.updateOne(
        {}, // Assuming a single document
        { $pull: { [category]: refrigeratorObject } }
      );

      if (result.modifiedCount > 0) {
        refrigeratorDeleted = true;
        break; // Exit loop if the Refrigerator is deleted
      }
    }

    if (!refrigeratorDeleted) {
      return res.status(404).json({ error: "Refrigerator object not found in any category." });
    }

    res.status(200).json({ message: "Refrigerator deleted successfully from the database!" });
  } catch (error) {
    console.error("Error deleting Refrigerator:", error);
    res.status(500).json({ error: "An error occurred while deleting the Refrigerator." });
  }
};

 
  


  