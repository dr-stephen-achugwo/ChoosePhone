// controllers/CameraController.js
import Camera from '../model/Camera_model.js';

// Controller function to handle the POST request
export const createCamera = async (req, res) => {
  const cameraData = req.body;

  try {
      // Validate that at least one category is provided
      const categories = Object.keys(cameraData);
      if (!categories.length) {
          return res.status(400).json({
              error: 'At least one Camera category (e.g., oppo_Camera) must be provided',
          });
      }

      // Aggregate all Camera data into a single array (optional)
      const allCamera = categories.reduce((acc, category) => {
          return acc.concat(cameraData[category] || []);
      }, []);

      if (!allCamera.length) {
          return res.status(400).json({
              error: 'No Camera data provided in any category.',
          });
      }

      // Save or update the Camera data
      let savedCamera;
      for (const category of categories) {
          const camera = cameraData[category];

          if (camera?.length) {
              // Find or create the existing Camera category in the database
              savedCamera = await Camera.updateOne(
                  {}, // Assuming single-document DB (no filters needed)
                  { $push: { [category]: { $each: camera } } },
                  { upsert: true } // Create if not exists
              );
          }
      }

      res.status(201).json({
          message: 'Camera data saved successfully!',
          data: savedCamera,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          error: 'An error occurred while saving the Camera data.',
          details: error.message,
      });
  }
};


export const updateCamera = async (req, res) => {
  const updatedCamera = req.body; // Updated Camera data

  try {
    // Validate that updated data is provided
    if (!Object.keys(updatedCamera).length) {
      return res.status(400).json({ error: "No updated data provided." });
    }

    // Allowed fields for updating
    const allowedFields = [
      "name", "Price", "type", "connectivity", "resolution", "sensor_type", "iso_range", "video_resolution", "image_stabilization",
      "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
      "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
      "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
      "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
      "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
      "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
      "vijaysales_Price",
    ];

    // Validate updatedCamera fields
    const invalidFields = Object.keys(updatedCamera).filter(
      (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length) {
      return res.status(400).json({
        error: "Invalid fields provided in the updated data.",
        invalidFields,
      });
    }

    // List of Camera categories in the database
    const cameraCategories = [
      "Canon_camera", "Nikon_camera", "Sony_camera", "Panasonic_camera","GoPro_camera", 
    ];

    // Fetch the existing document
    const existingDocument = await Camera.findOne();

    if (!existingDocument) {
      return res.status(404).json({ error: "No Camera document found in the database." });
    }

    let cameraUpdated = false;

    // Loop through categories to find and update the Camera
    for (const category of cameraCategories) {
      const camera = existingDocument[category];

      if (Array.isArray(camera)) {
        const FoundCamera = camera.find(
          (p) => p.name && p.name.toLowerCase() === updatedCamera.name?.toLowerCase()
        );

        if (FoundCamera) {
          // Merge existing data with updated data (ignoring null/undefined values)
          Object.assign(
            FoundCamera,
            Object.fromEntries(
              Object.entries(updatedCamera).filter(
                ([_, value]) => value !== null && value !== undefined
              )
            )
          );

          cameraUpdated = true;
          break;
        }
      }
    }

    if (!cameraUpdated) {
      return res.status(404).json({
        error: `Camera with name "${updatedCamera.name}" not found in any category.`,
      });
    }

    // Save the updated document
    await existingDocument.save();

    res.status(200).json({
      message: "Camera updated successfully!",
      data: updatedCamera,
    });
  } catch (error) {
    console.error("Error while updating Camera data:", error.message);
    res.status(500).json({
      error: "An error occurred while updating the Camera data.",
      details: error.message,
    });
  }
};
    

 // Ensure the correct path to your schema

 export const deleteCamera = async (req, res) => {
  const { cameraObject } = req.body; // Receive the camera object

  try {
    if (!cameraObject) {
      return res.status(400).json({ error: "Camera object is required." });
    }

    // Flag to check if the camera was deleted
    let cameraDeleted = false;

    // Get all schema paths ending with "_camera"
    const categories = Object.keys(Camera.schema.paths).filter(
      (key) => key.endsWith("_camera")
    );

    for (const category of categories) {
      // Attempt to remove the camera object from the category
      const result = await Camera.updateOne(
        {}, // Assuming a single document exists
        { $pull: { [category]: cameraObject } }
      );

      if (result.modifiedCount > 0) {
        cameraDeleted = true;
        break; // Exit loop if the camera is deleted
      }
    }

    if (!cameraDeleted) {
      return res
        .status(404)
        .json({ error: "Camera object not found in any category." });
    }

    res.status(200).json({ message: "Camera deleted successfully from the database!" });
  } catch (error) {
    console.error("Error deleting Camera:", error);
    res.status(500).json({ error: "An error occurred while deleting the Camera." });
  }
};

 
  


  