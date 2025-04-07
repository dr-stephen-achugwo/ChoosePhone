// controllers/phoneController.js
import Phone from '../model/Phone_model.js';

// Controller function to handle the POST request
export const createPhone = async (req, res) => {
  const phoneData = req.body;

  try {
      // Validate that at least one category is provided
      const categories = Object.keys(phoneData);
      if (!categories.length) {
          return res.status(400).json({
              error: 'At least one phone category (e.g., oppo_phones) must be provided',
          });
      }

      // Aggregate all phone data into a single array (optional)
      const allPhones = categories.reduce((acc, category) => {
          return acc.concat(phoneData[category] || []);
      }, []);

      if (!allPhones.length) {
          return res.status(400).json({
              error: 'No phone data provided in any category.',
          });
      }

      // Save or update the phone data
      let savedPhone;
      for (const category of categories) {
          const phones = phoneData[category];

          if (phones?.length) {
              // Find or create the existing phone category in the database
              savedPhone = await Phone.updateOne(
                  {}, // Assuming single-document DB (no filters needed)
                  { $push: { [category]: { $each: phones } } },
                  { upsert: true } // Create if not exists
              );
          }
      }

      res.status(201).json({
          message: 'Phone data saved successfully!',
          data: savedPhone,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'An error occurred while saving the phone data.',
          details: error.message,
      });
  }
};


export const updatePhone = async (req, res) => {
  const updatedPhone = req.body; // Updated phone data

  try {
    // Validate that updated data is provided
    if (!Object.keys(updatedPhone).length) {
      return res.status(400).json({ error: "No updated data provided." });
    }

    // Allowed fields for updating
    const allowedFields = [
      "name", "Price", "display", "processor", "camera", "battery", "features",
      "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
      "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
      "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
      "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
      "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
      "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
      "vijaysales_Price",
    ];

    // Validate updatedPhone fields
    const invalidFields = Object.keys(updatedPhone).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length) {
      return res.status(400).json({
        error: "Invalid fields provided in the updated data.",
        invalidFields,
      });
    }

    // List of phone categories in the database
    const phoneCategories = [
      "oppo_phones", "vivo_phones", "samsung_phones", "apple_phones",
      "asus_phones", "google_phones", "infinix_phones", "motorola_phones",
      "nokia_phones", "oneplus_phones", "realme_phones", "tecno_phones",
      "xiaomi_phones","iQOO_phones",
    ];

    // Fetch the existing document
    const existingDocument = await Phone.findOne();

    if (!existingDocument) {
      return res.status(404).json({ error: "No phone document found in the database." });
    }

    let phoneUpdated = false;

    // Loop through categories to find and update the phone
    for (const category of phoneCategories) {
      const phones = existingDocument[category];

      if (Array.isArray(phones)) {
        const phone = phones.find(
          (p) => p.name && p.name.toLowerCase() === updatedPhone.name?.toLowerCase()
        );

        if (phone) {
          // Merge existing data with updated data (ignoring null/undefined values)
          Object.assign(
            phone,
            Object.fromEntries(
              Object.entries(updatedPhone).filter(
                ([_, value]) => value !== null && value !== undefined
              )
            )
          );

          phoneUpdated = true;
          break;
        }
      }
    }

    if (!phoneUpdated) {
      return res.status(404).json({
        error: `Phone with name "${updatedPhone.name}" not found in any category.`,
      });
    }

    // Save the updated document
    await existingDocument.save();

    res.status(200).json({
      message: "Phone updated successfully!",
      data: updatedPhone,
    });
  } catch (error) {
    console.error("Error while updating phone data:", error.message);
    res.status(500).json({
      error: "An error occurred while updating the phone data.",
      details: error.message,
    });
  }
};
    

 // Ensure the correct path to your schema

export const deletePhone = async (req, res) => {
  const { phoneObject } = req.body; // Receive the phone object

  try {
    if (!phoneObject) {
      return res.status(400).json({ error: "Phone object is required." });
    }

    // Track if a phone was deleted
    let phoneDeleted = false;

    // Iterate over all categories in the schema
    const categories = Object.keys(Phone.schema.paths).filter(
      (key) => key.endsWith("_phones")
    );

    for (const category of categories) {
      // Remove the phone object from the category
      const result = await Phone.updateOne(
        {}, // Assuming a single document
        { $pull: { [category]: phoneObject } }
      );

      if (result.modifiedCount > 0) {
        phoneDeleted = true;
        break; // Exit loop if the phone is deleted
      }
    }

    if (!phoneDeleted) {
      return res.status(404).json({ error: "Phone object not found in any category." });
    }

    res.status(200).json({ message: "Phone deleted successfully from the database!" });
  } catch (error) {
    console.error("Error deleting phone:", error);
    res.status(500).json({ error: "An error occurred while deleting the phone." });
  }
};

 
  


  