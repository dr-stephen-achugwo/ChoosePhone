// controllers/HeadphoneController.js
import Headphone from '../model/Headphone_model.js';

// Controller function to handle the POST request
export const createHeadphone = async (req, res) => {
  const headphoneData = req.body;

  try {
      // Validate that at least one category is provided
      const categories = Object.keys(headphoneData);
      if (!categories.length) {
          return res.status(400).json({
              error: 'At least one Headphone category (e.g., oppo_Headphones) must be provided',
          });
      }

      // Aggregate all Headphone data into a single array (optional)
      const allHeadphones = categories.reduce((acc, category) => {
          return acc.concat(headphoneData[category] || []);
      }, []);

      if (!allHeadphones.length) {
          return res.status(400).json({
              error: 'No Headphone data provided in any category.',
          });
      }

      // Save or update the Headphone data
      let savedHeadphone;
      for (const category of categories) {
          const headphones = headphoneData[category];

          if (headphones?.length) {
              // Find or create the existing Headphone category in the database
              savedHeadphone = await Headphone.updateOne(
                  {}, // Assuming single-document DB (no filters needed)
                  { $push: { [category]: { $each: headphones } } },
                  { upsert: true } // Create if not exists
              );
          }
      }

      res.status(201).json({
          message: 'Headphone data saved successfully!',
          data: savedHeadphone,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'An error occurred while saving the Headphone data.',
          details: error.message,
      });
  }
};


export const updateHeadphone = async (req, res) => {
  const updatedHeadphone = req.body; // Updated Headphone data

  try {
    // Validate that updated data is provided
    if (!Object.keys(updatedHeadphone).length) {
      return res.status(400).json({ error: "No updated data provided." });
    }

    // Allowed fields for updating
    const allowedFields = [
      "name", "Price", "type", "noise_cancellation", "connectivity", "battery_life", "microphone",
      "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
      "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
      "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
      "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
      "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
      "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
      "vijaysales_Price",
    ];

    // Validate updatedHeadphone fields
    const invalidFields = Object.keys(updatedHeadphone).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length) {
      return res.status(400).json({
        error: "Invalid fields provided in the updated data.",
        invalidFields,
      });
    }

    // List of Headphone categories in the database
    const headphoneCategories = [
      "Boat_headphones", "Sennheiser_headphones", "JBL_headphones", "Realme_headphones",
      "sony_headphones", 
    ];

    // Fetch the existing document
    const existingDocument = await Headphone.findOne();

    if (!existingDocument) {
      return res.status(404).json({ error: "No Headphone document found in the database." });
    }

    let headphoneUpdated = false;

    // Loop through categories to find and update the Headphone
    for (const category of headphoneCategories) {
      const headphones = existingDocument[category];

      if (Array.isArray(headphones)) {
        const headphone = headphones.find(
          (p) => p.name && p.name.toLowerCase() === updatedHeadphone.name?.toLowerCase()
        );

        if (headphone) {
          // Merge existing data with updated data (ignoring null/undefined values)
          Object.assign(
            headphone,
            Object.fromEntries(
              Object.entries(updatedHeadphone).filter(
                ([_, value]) => value !== null && value !== undefined
              )
            )
          );

          headphoneUpdated = true;
          break;
        }
      }
    }

    if (!headphoneUpdated) {
      return res.status(404).json({
        error: `Headphone with name "${updatedHeadphone.name}" not found in any category.`,
      });
    }

    // Save the updated document
    await existingDocument.save();

    res.status(200).json({
      message: "Headphone updated successfully!",
      data: updatedHeadphone,
    });
  } catch (error) {
    console.error("Error while updating Headphone data:", error.message);
    res.status(500).json({
      error: "An error occurred while updating the Headphone data.",
      details: error.message,
    });
  }
};
    

 // Ensure the correct path to your schema

export const deleteHeadphone = async (req, res) => {
  const { headphoneObject } = req.body; // Receive the Headphone object

  try {
    if (!headphoneObject) {
      return res.status(400).json({ error: "Headphone object is required." });
    }

    // Track if a Headphone was deleted
    let headphoneDeleted = false;

    // Iterate over all categories in the schema
    const categories = Object.keys(Headphone.schema.paths).filter(
      (key) => key.endsWith("_headphones")
    );

    for (const category of categories) {
      // Remove the Headphone object from the category
      const result = await Headphone.updateOne(
        {}, // Assuming a single document
        { $pull: { [category]: headphoneObject } }
      );

      if (result.modifiedCount > 0) {
        headphoneDeleted = true;
        break; // Exit loop if the Headphone is deleted
      }
    }

    if (!headphoneDeleted) {
      return res.status(404).json({ error: "Headphone object not found in any category." });
    }

    res.status(200).json({ message: "Headphone deleted successfully from the database!" });
  } catch (error) {
    console.error("Error deleting Headphone:", error);
    res.status(500).json({ error: "An error occurred while deleting the Headphone." });
  }
};

 
  


  