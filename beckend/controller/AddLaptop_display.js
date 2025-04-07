// controllers/LaptopController.js
import Laptop from '../model/Laptop_model.js';

// Controller function to handle the POST request
export const createLaptop = async (req, res) => {
  const laptopData = req.body;

  try {
      // Validate that at least one category is provided
      const categories = Object.keys(laptopData);
      if (!categories.length) {
          return res.status(400).json({
              error: 'At least one Laptop category (e.g., HP_Laptops) must be provided',
          });
      }

      // Aggregate all Laptop data into a single array (optional)
      const allLaptops = categories.reduce((acc, category) => {
          return acc.concat(laptopData[category] || []);
      }, []);

      if (!allLaptops.length) {
          return res.status(400).json({
              error: 'No Laptop data provided in any category.',
          });
      }

      // Save or update the Laptop data
      let savedLaptop;
      for (const category of categories) {
          const laptops = laptopData[category];

          if (laptops?.length) {
              // Find or create the existing Laptop category in the database
              savedLaptop = await Laptop.updateOne(
                  {}, // Assuming single-document DB (no filters needed)
                  { $push: { [category]: { $each: laptops } } },
                  { upsert: true } // Create if not exists
              );
          }
      }

      res.status(201).json({
          message: 'Laptop data saved successfully!',
          data: savedLaptop,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'An error occurred while saving the Laptop data.',
          details: error.message,
      });
  }
};


export const updateLaptop = async (req, res) => {
  const updatedLaptop = req.body; // Updated Laptop data

  try {
    // Validate that updated data is provided
    if (!Object.keys(updatedLaptop).length) {
      return res.status(400).json({ error: "No updated data provided." });
    }

    // Allowed fields for updating
    const allowedFields = [
      "name", "Price", "display", "processor", "ram", "storage", "os","graphics","features",
      "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
      "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
      "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
      "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
      "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
      "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
      "vijaysales_Price",
    ];

    // Validate updatedLaptop fields
    const invalidFields = Object.keys(updatedLaptop).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length) {
      return res.status(400).json({
        error: "Invalid fields provided in the updated data.",
        invalidFields,
      });
    }

    // List of Laptop categories in the database
    const laptopCategories = [
      "Dell_laptops", "HP_laptops", "lenovo_laptops", "apple_laptops",
      "Asus_laptops", "Acer_laptops", "microsoft_laptops", 
    ];

    // Fetch the existing document
    const existingDocument = await Laptop.findOne();

    if (!existingDocument) {
      return res.status(404).json({ error: "No Laptop document found in the database." });
    }

    let laptopUpdated = false;

    // Loop through categories to find and update the Laptop
    for (const category of laptopCategories) {
      const laptops = existingDocument[category];

      if (Array.isArray(laptops)) {
        const laptop = laptops.find(
          (p) => p.name && p.name.toLowerCase() === updatedLaptop.name?.toLowerCase()
        );

        if (laptop) {
          // Merge existing data with updated data (ignoring null/undefined values)
          Object.assign(
            laptop,
            Object.fromEntries(
              Object.entries(updatedLaptop).filter(
                ([_, value]) => value !== null && value !== undefined
              )
            )
          );

          laptopUpdated = true;
          break;
        }
      }
    }

    if (!laptopUpdated) {
      return res.status(404).json({
        error: `Laptop with name "${updatedLaptop.name}" not found in any category.`,
      });
    }

    // Save the updated document
    await existingDocument.save();

    res.status(200).json({
      message: "Laptop updated successfully!",
      data: updatedLaptop,
    });
  } catch (error) {
    console.error("Error while updating Laptop data:", error.message);
    res.status(500).json({
      error: "An error occurred while updating the Laptop data.",
      details: error.message,
    });
  }
};
    

 // Ensure the correct path to your schema

export const deleteLaptop = async (req, res) => {
  const { laptopObject } = req.body; // Receive the Laptop object

  try {
    if (!laptopObject) {
      return res.status(400).json({ error: "Laptop object is required." });
    }

    // Track if a Laptop was deleted
    let laptopDeleted = false;

    // Iterate over all categories in the schema
    const categories = Object.keys(Laptop.schema.paths).filter(
      (key) => key.endsWith("_laptops")
    );

    for (const category of categories) {
      // Remove the Laptop object from the category
      const result = await Laptop.updateOne(
        {}, // Assuming a single document
        { $pull: { [category]: laptopObject } }
      );

      if (result.modifiedCount > 0) {
        laptopDeleted = true;
        break; // Exit loop if the Laptop is deleted
      }
    }

    if (!laptopDeleted) {
      return res.status(404).json({ error: "Laptop object not found in any category." });
    }

    res.status(200).json({ message: "Laptop deleted successfully from the database!" });
  } catch (error) {
    console.error("Error deleting Laptop:", error);
    res.status(500).json({ error: "An error occurred while deleting the Laptop." });
  }
};

 
  


  