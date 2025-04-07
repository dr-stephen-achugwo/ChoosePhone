// controllers/WashingmachineController.js
import Washingmachine from '../model/Washingmachine_model.js';

// Controller function to handle the POST request
export const createWashingmachine = async (req, res) => {
  const washingMachineData = req.body;
try {
      // Validate that at least one category is provided
      const categories = Object.keys(washingMachineData);
      if (!categories.length) {
          return res.status(400).json({
              error: 'At least one Washingmachine category (e.g., oppo_Washingmachine) must be provided',
          });
      }
      // Aggregate all Washingmachine data into a single array (optional)
      const allWashingmachine = categories.reduce((acc, category) => {
          return acc.concat(washingMachineData[category] || []);
      }, []);

      if (!allWashingmachine.length) {
          return res.status(400).json({
              error: 'No Washingmachine data provided in any category.',
          });
      }

      // Save or update the Washingmachine data
      let savedWashingmachine;
      for (const category of categories) {
          const washingmachine = washingMachineData[category];

          if (washingmachine?.length) {
              // Find or create the existing Washingmachine category in the database
              savedWashingmachine = await Washingmachine.updateOne(
                  {}, // Assuming single-document DB (no filters needed)
                  { $push: { [category]: { $each: washingmachine } } },
                  { upsert: true } // Create if not exists
              );
          }
      }

      res.status(201).json({
          message: 'Washingmachine data saved successfully!',
          data: savedWashingmachine,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'An error occurred while saving the Washingmachine data.',
          details: error.message,
      });
  }
};


export const updateWashingmachine = async (req, res) => {
  const updatedWashingmachine = req.body; // Updated Washingmachine data

  try {
    // Validate that updated data is provided
    if (!Object.keys(updatedWashingmachine).length) {
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

    // Validate updatedWashingmachine fields
    const invalidFields = Object.keys(updatedWashingmachine).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length) {
      return res.status(400).json({
        error: "Invalid fields provided in the updated data.",
        invalidFields,
      });
    }

    // List of Washingmachine categories in the database
    const washingmachineCategories = [
      "LG_washingmachine", "Samsung_washingmachine", "whirlpool_washingmachine", "Godrej_washingmachine","IFB_washingmachine", 
    ];

    // Fetch the existing document
    const existingDocument = await Washingmachine.findOne();

    if (!existingDocument) {
      return res.status(404).json({ error: "No Washingmachine document found in the database." });
    }

    let washingmachineUpdated = false;

    // Loop through categories to find and update the Washingmachine
    for (const category of washingmachineCategories) {
      const washingmachines = existingDocument[category]; // Corrected variable name
    
      if (Array.isArray(washingmachines)) {
        const foundWashingmachine = washingmachines.find(
          (p) => p.name && p.name.toLowerCase() === updatedWashingmachine.name?.toLowerCase()
        );
    
        if (foundWashingmachine) {
          // Merge existing data with updated data (ignoring null/undefined values)
          Object.assign(
            foundWashingmachine,
            Object.fromEntries(
              Object.entries(updatedWashingmachine).filter(
                ([_, value]) => value !== null && value !== undefined
              )
            )
          );
    
          washingmachineUpdated = true;
          break;
        }
      }
    }
    

    if (!washingmachineUpdated) {
      return res.status(404).json({
        error: `Washingmachine with name "${updatedWashingmachine.name}" not found in any category.`,
      });
    }

    // Save the updated document
    await existingDocument.save();

    res.status(200).json({
      message: "Washingmachine updated successfully!",
      data: updatedWashingmachine,
    });
  } catch (error) {
    console.error("Error while updating Washingmachine data:", error.message);
    res.status(500).json({
      error: "An error occurred while updating the Washingmachine data.",
      details: error.message,
    });
  }
};
    

 // Ensure the correct path to your schema

 export const deleteWashingmachine = async (req, res) => {
  const { washingMachineObject } = req.body; // Receive the washing machine object

  try {
    if (!washingMachineObject) {
      return res.status(400).json({ error: "Washing machine object is required." });
    }

    // Flag to track if a washing machine was deleted
    let washingmachineDeleted = false;

    // Get all categories in the schema that end with "_washingmachine"
    const categories = Object.keys(Washingmachine.schema.paths).filter(
      (key) => key.endsWith("_washingmachine")
    );

    for (const category of categories) {
      // Attempt to remove the washing machine from the category
      const result = await Washingmachine.updateOne(
        {}, // Assuming a single document exists
        { $pull: { [category]: washingMachineObject } }
      );

      if (result.modifiedCount > 0) {
        washingmachineDeleted = true;
        break; // Exit loop once the washing machine is deleted
      }
    }

    if (!washingmachineDeleted) {
      return res
        .status(404)
        .json({ error: "Washing machine object not found in any category." });
    }

    res.status(200).json({ message: "Washing machine deleted successfully from the database!" });
  } catch (error) {
    console.error("Error deleting washing machine:", error);
    res.status(500).json({ error: "An error occurred while deleting the washing machine." });
  }
};
 
  


  