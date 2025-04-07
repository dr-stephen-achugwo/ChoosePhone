// controllers/TelevisionController.js
import Television from '../model/Television_model.js';

// Controller function to handle the POST request
export const createTelevision = async (req, res) => {
  const televisionData = req.body;

  try {
      // Validate that at least one category is provided
      const categories = Object.keys(televisionData);
      if (!categories.length) {
          return res.status(400).json({
              error: 'At least one Television category (e.g., oppo_Televisions) must be provided',
          });
      }

      // Aggregate all Television data into a single array (optional)
      const allTelevisions = categories.reduce((acc, category) => {
          return acc.concat(televisionData[category] || []);
      }, []);

      if (!allTelevisions.length) {
          return res.status(400).json({
              error: 'No Television data provided in any category.',
          });
      }

      // Save or update the Television data
      let savedTelevision;
      for (const category of categories) {
          const televisions = televisionData[category];

          if (televisions?.length) {
              // Find or create the existing Television category in the database
              savedTelevision = await Television.updateOne(
                  {}, // Assuming single-document DB (no filters needed)
                  { $push: { [category]: { $each: televisions } } },
                  { upsert: true } // Create if not exists
              );
          }
      }

      res.status(201).json({
          message: 'Television data saved successfully!',
          data: savedTelevision,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'An error occurred while saving the Television data.',
          details: error.message,
      });
  }
};


export const updateTelevision = async (req, res) => {
  const updatedTelevision = req.body; // Updated Television data

  try {
    // Validate that updated data is provided
    if (!Object.keys(updatedTelevision).length) {
      return res.status(400).json({ error: "No updated data provided." });
    }

    // Allowed fields for updating
    const allowedFields = [
      "name", "Price", "screen_size", "resolution", "smart_tv", "connectivity", "speaker_output","display_technology",
      "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
      "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
      "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
      "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
      "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
      "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
      "vijaysales_Price",
    ];

    // Validate updatedTelevision fields
    const invalidFields = Object.keys(updatedTelevision).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length) {
      return res.status(400).json({
        error: "Invalid fields provided in the updated data.",
        invalidFields,
      });
    }

    // List of Television categories in the database
    const televisionCategories = [
      "Samasung_televisions", "LG_televisions", "Sony_televisions", "Oneplus_televisions",
      "Mi_televisions","Panasonic_televisions", 
    ];

    // Fetch the existing document
    const existingDocument = await Television.findOne();

    if (!existingDocument) {
      return res.status(404).json({ error: "No Television document found in the database." });
    }

    let televisionUpdated = false;

    // Loop through categories to find and update the Television
    for (const category of televisionCategories) {
      const televisions = existingDocument[category];

      if (Array.isArray(televisions)) {
        const television = televisions.find(
          (p) => p.name && p.name.toLowerCase() === updatedTelevision.name?.toLowerCase()
        );

        if (television) {
          // Merge existing data with updated data (ignoring null/undefined values)
          Object.assign(
            television,
            Object.fromEntries(
              Object.entries(updatedTelevision).filter(
                ([_, value]) => value !== null && value !== undefined
              )
            )
          );

          televisionUpdated = true;
          break;
        }
      }
    }

    if (!televisionUpdated) {
      return res.status(404).json({
        error: `Television with name "${updatedTelevision.name}" not found in any category.`,
      });
    }

    // Save the updated document
    await existingDocument.save();

    res.status(200).json({
      message: "Television updated successfully!",
      data: updatedTelevision,
    });
  } catch (error) {
    console.error("Error while updating Television data:", error.message);
    res.status(500).json({
      error: "An error occurred while updating the Television data.",
      details: error.message,
    });
  }
};
    

 // Ensure the correct path to your schema

 export const deleteTelevision = async (req, res) => {
  const { televisionObject } = req.body; // Expecting televisionObject in the request body

  try {
    if (!televisionObject) {
      return res.status(400).json({ error: "Television object is required." });
    }

    // Track if a Television was deleted
    let televisionDeleted = false;

    // Iterate over all categories in the schema
    const categories = Object.keys(Television.schema.paths).filter(
      (key) => key.endsWith("_televisions")
    );

    for (const category of categories) {
      // Remove the Television object from the category
      const result = await Television.updateOne(
        {}, // Assuming a single document
        { $pull: { [category]: televisionObject } }
      );

      if (result.modifiedCount > 0) {
        televisionDeleted = true;
        break; // Exit loop if the Television is deleted
      }
    }

    if (!televisionDeleted) {
      return res.status(404).json({ error: "Television object not found in any category." });
    }

    res.status(200).json({ message: "Television deleted successfully from the database!" });
  } catch (error) {
    console.error("Error deleting Television:", error);
    res.status(500).json({ error: "An error occurred while deleting the Television." });
  }
};

 
  


  