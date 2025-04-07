import Tablet from '../model/Tablet_model.js';

// Controller function to handle the POST request
export const createTablet = async (req, res) => {
  const tabletData = req.body;

  try {
      // Validate that at least one category is provided
      const categories = Object.keys(tabletData);
      if (!categories.length) {
          return res.status(400).json({
              error: 'At least one Tablet category (e.g., oppo_Tablets) must be provided',
          });
      }

      // Aggregate all Tablet data into a single array (optional)
      const allTablets = categories.reduce((acc, category) => {
          return acc.concat(tabletData[category] || []);
      }, []);

      if (!allTablets.length) {
          return res.status(400).json({
              error: 'No Tablet data provided in any category.',
          });
      }

      // Save or update the Tablet data
      let savedTablet;
      for (const category of categories) {
          const tablets = tabletData[category];

          if (tablets?.length) {
              // Find or create the existing Tablet category in the database
              savedTablet = await Tablet.updateOne(
                  {}, // Assuming single-document DB (no filters needed)
                  { $push: { [category]: { $each: tablets } } },
                  { upsert: true } // Create if not exists
              );
          }
      }

      res.status(201).json({
          message: 'Tablet data saved successfully!',
          data: savedTablet,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'An error occurred while saving the Tablet data.',
          details: error.message,
      });
  }
};


export const updateTablet = async (req, res) => {
  const updatedTablet = req.body; // Updated Tablet data

  try {
    // Validate that updated data is provided
    if (!Object.keys(updatedTablet).length) {
      return res.status(400).json({ error: "No updated data provided." });
    }

    // Allowed fields for updating
    const allowedFields = [
      "name", "Price", "display", "processor", "ram", "storage", "features","camera","os",
      "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
      "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
      "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
      "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
      "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
      "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
      "vijaysales_Price",
    ];

    // Validate updatedTablet fields
    const invalidFields = Object.keys(updatedTablet).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length) {
      return res.status(400).json({
        error: "Invalid fields provided in the updated data.",
        invalidFields,
      });
    }

    // List of Tablet categories in the database
    const tabletCategories = [
       "Xiaomi_tablets", "lenovo_tablets", "Apple_tablets",
      "Huawei_tablets", "Realme_tablets", "Samsung_tablets", 
    ];

    // Fetch the existing document
    const existingDocument = await Tablet.findOne();

    if (!existingDocument) {
      return res.status(404).json({ error: "No Tablet document found in the database." });
    }

    let tabletUpdated = false;

    // Loop through categories to find and update the Tablet
    for (const category of tabletCategories) {
      const tablets = existingDocument[category];

      if (Array.isArray(tablets)) {
        const tablet = tablets.find(
          (p) => p.name && p.name.toLowerCase() === updatedTablet.name?.toLowerCase()
        );

        if (tablet) {
          // Merge existing data with updated data (ignoring null/undefined values)
          Object.assign(
            tablet,
            Object.fromEntries(
              Object.entries(updatedTablet).filter(
                ([_, value]) => value !== null && value !== undefined
              )
            )
          );

          tabletUpdated = true;
          break;
        }
      }
    }

    if (!tabletUpdated) {
      return res.status(404).json({
        error: `Tablet with name "${updatedTablet.name}" not found in any category.`,
      });
    }

    // Save the updated document
    await existingDocument.save();

    res.status(200).json({
      message: "Tablet updated successfully!",
      data: updatedTablet,
    });
  } catch (error) {
    console.error("Error while updating Tablet data:", error.message);
    res.status(500).json({
      error: "An error occurred while updating the Tablet data.",
      details: error.message,
    });
  }
};
    

 // Ensure the correct path to your schema

export const deleteTablet = async (req, res) => {
  const { tabletObject } = req.body; // Receive the Tablet object

  try {
    if (!tabletObject) {
      return res.status(400).json({ error: "Tablet object is required." });
    }

    // Track if a Tablet was deleted
    let tabletDeleted = false;

    // Iterate over all categories in the schema
    const categories = Object.keys(Tablet.schema.paths).filter(
      (key) => key.endsWith("_tablets")
    );

    for (const category of categories) {
      // Remove the Tablet object from the category
      const result = await Tablet.updateOne(
        {}, // Assuming a single document
        { $pull: { [category]: tabletObject } }
      );

      if (result.modifiedCount > 0) {
        tabletDeleted = true;
        break; // Exit loop if the Tablet is deleted
      }
    }

    if (!tabletDeleted) {
      return res.status(404).json({ error: "Tablet object not found in any category." });
    }

    res.status(200).json({ message: "Tablet deleted successfully from the database!" });
  } catch (error) {
    console.error("Error deleting Tablet:", error);
    res.status(500).json({ error: "An error occurred while deleting the Tablet." });
  }
};

 
  


  