import { replace, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'
import axios from 'axios';
import { Link } from 'react-router-dom'


export default function CameraPages() {

  const [selectedCameras, setSelectedCameras] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const defaultCamera = {
    main_image: "",
    image_one: "",
    image_two: "",
    image_three: "",
    image_four: "",
    image_five: "",
    amazon_link: "",
    tatacliq_link: "",
    reliancedigital_link: "",
    flipkart_link: "",
    poorvika_link: "",
    vijaysales_link: "",
    croma_link: "",
    name: "",
    type: "",
    resolution: "",
    sensor_type: "",
    iso_range: "",
    video_resolution: "",
    image_stabilization:"",
    connectivity: [],
    Price: "",
    amazon_price: "",
    flipkart_price: "",
    tatacliq_price: "",
    reliancedigital_price: "",
    vijaysales_price: "",
    poorvika_price: "",
    croma_price: "",
  };

  useEffect(() => {
    const getCameras = async () => {
      try {
        const res = await axios.get("http://localhost:4001/cameras");
        setSelectedCameras(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching Cameras:", error.message);
      }
    };

    getCameras();
  }, []);

  
  const saveCamera = async (Camera, setSelectedCameras) => {
    if (!Camera || typeof Camera !== 'object') {
        alert("Camera data is required and must be an object.");
        return;
    }
    if (isNaN(Number(Camera.Price))) {
        alert("Price must be a valid number.");
        return;
    }

    if (Camera.features && typeof Camera.features === 'string') {
        Camera.features = Camera.features
            .split(',')
            .map((feature) => feature.trim())
            .filter((feature) => feature);
    }

    if (Camera.features && (!Array.isArray(Camera.features) || Camera.features.some((feature) => typeof feature !== 'string'))) {
        alert("Features must be an array of strings.");
        return;
    }

    // Automatically determine Camera category based on the name
    let CameraCategory = '';
    const CameraNameLower = Camera.name?.toLowerCase() || '';
         if (CameraNameLower.includes('canon')) CameraCategory = 'Canon_camera';
    else if (CameraNameLower.includes('nikon')) CameraCategory = 'Nikon_camera';
    else if (CameraNameLower.includes('panasonic')) CameraCategory = 'Panasonic_camera';
    else if (CameraNameLower.includes('sony')) CameraCategory = 'Sony_camera';
    else if (CameraNameLower.includes('gopro')) CameraCategory = 'GoPro_camera';
    else {
        alert('Camera brand is required (e.g., Oppo, Vivo, Samsung, Apple).');
        return;
    }

    // Prepare the request body
    const CameraData = {
        [CameraCategory]: [Camera], // Dynamically assign Camera to the correct category
    };

    try {
        // Make the POST request to the backend
        const response = await axios.post("http://localhost:4001/cameraapi/Camera", CameraData);

        if (response.status === 201) {
            alert("Camera saved successfully!");

            // Update the selected Cameras in the UI
            if (setSelectedCameras) {
                setSelectedCameras((prevCameras) => [...prevCameras, response.data.data]);
            }
        } else {
            console.error("Unexpected response:", response);
            alert(`Failed to save Camera. Status: ${response.status}.`);
        }
    } catch (error) {
        console.error("Error saving Camera:", error.response?.data || error.message);
        alert(`Failed to save Camera. ${error.response?.data?.message || error.message}`);
    }
};


const updateCamera = async (updatedCamera, setSelectedCameras) => {
  if (!updatedCamera || typeof updatedCamera !== "object" || !updatedCamera.name) {
    alert("A valid Camera object with a name is required for updating.");
    console.error("Invalid updatedCamera object:", updatedCamera);
    return;
  }

  const allowedFields = [
    "name", "Price", "type", "resolution", "sensor_type", "iso_range", "video_resolution","image_stabilization","connectivity",
    "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
    "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
    "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
    "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
    "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
    "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
    "vijaysales_Price",
  ];

  const invalidFields = Object.keys(updatedCamera).filter(
    (key) => !allowedFields.includes(key)
  );

  if (invalidFields.length) {
    alert(
      `Invalid fields detected in the updated data: ${invalidFields.join(", ")}.`
    );
    console.error("Invalid fields:", invalidFields);
    return;
  }

  try {
    console.log("Sending update request for Camera:", updatedCamera);

    const response = await axios.put(
      "http://localhost:4001/cameraapi/Camera/update",
      updatedCamera
    );

    if (response.status === 200) {
      alert("Camera updated successfully!");
      if (setSelectedCameras) {
        setSelectedCameras((prevCameras) =>
          prevCameras.map((Camera) =>
            Camera.name.toLowerCase() === updatedCamera.name.toLowerCase()
              ? { ...Camera, ...response.data.data }
              : Camera
          )
        );
      }
    } else {
      alert(`Failed to update Camera. Status: ${response.status}.`);
    }
  } catch (error) {
    console.error("Error updating Camera:", error);
    alert(
      `Failed to update Camera. ${
        error.response?.data?.error || error.message
      }`
    );
  }
};
  



  const updateCameraProperty = (index, key, value) => {
    setSelectedCameras((prevCameras) =>
      prevCameras.map((Camera, i) =>
        i === index ? { ...Camera, [key]: value } : Camera
      )
    );
  };

  const addCamera = () => {
    setSelectedCameras((prevCameras) => [...prevCameras, { ...defaultCamera }]);
  };


  const deleteCamera = async (CameraObject, setSelectedCameras) => {
    // Validate the camera object
    if (!CameraObject || typeof CameraObject !== "object") {
      alert("A valid Camera object is required for deletion.");
      console.error("Invalid Camera object:", CameraObject);
      return;
    }
  
    try {
      console.log("Deleting Camera:", CameraObject);
  
      // Make the delete request to the backend
      const response = await axios.post(
        "http://localhost:4001/cameraapi/Camera/delete",
        {
          cameraObject: CameraObject, // Match backend field naming
        }
      );
  
      if (response.status === 200) {
        alert(response.data.message || "Camera deleted successfully!");
  
        if (setSelectedCameras) {
          setSelectedCameras((prevCameras) => {
            // Remove the deleted camera from the state
            const updatedCameras = Object.fromEntries(
              Object.entries(prevCameras).map(([category, Cameras]) => [
                category,
                Cameras.filter(
                  (Camera) =>
                    JSON.stringify(Camera) !== JSON.stringify(CameraObject)
                ),
              ])
            );
            return updatedCameras;
          });
        }
      } else {
        alert(`Failed to delete Camera. Status: ${response.status}.`);
      }
    } catch (error) {
      console.error("Error deleting Camera:", error);
  
      // Display an appropriate error message
      const errorMessage =
        error.response?.data?.error || error.message || "An unknown error occurred.";
      alert(`Failed to delete Camera. ${errorMessage}`);
    }
  };
  
  

  return (
    <>
         <Navbar />
         <div className="container mx-auto px-4">
           <div className="flex justify-end mb-4">
             <button className="btn btn-primary" onClick={addCamera}>
               Add New Camera
             </button>
           </div>
           <div className="overflow-x-auto">
             <table className="table">
               <thead>
                 <tr>
                   <th>Manage Images</th>
                   <th>Vendor Images</th>
                   <th>Manage Links</th>
                   <th>Model Name</th>
                   <th>Type</th>
                   <th>Resolution</th>
                   <th>Sensor Type</th>
                   <th>ISO Range</th>
                   <th>Video Resolution</th>
                   <th>Image Stabilization</th>
                   <th>Connectivity</th>
                   <th>Price</th>
                   <th>Manage Prices</th>
                   <th>Action</th>
                 </tr>
               </thead>
               <tbody>
                 {selectedCameras.map((Camera, index) => (
                   <tr key={index}>
                     {/* Manage Images */}
                     <td>
                       <div className="dropdown relative">
                         <label tabIndex={0} className="btn btn-secondary dropdown-toggle">
                           Manage Image
                         </label>
                         <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                           {["main_image", "image_one", "image_two", "image_three", "image_four", "image_five"].map((key) => (
                             <li key={key} className="flex flex-col">
                               <label className="font-semibold">
                                 {key.replace(/_/g, " ").toUpperCase()}
                               </label>
                               <input
                                 type="text"
                                 value={Camera[key] || ""}
                                 onChange={(e) => updateCameraProperty(index, key, e.target.value)}
                                 placeholder={`Enter ${key.replace(/_/g, " ")}`}
                                 className="input input-bordered w-full mb-2"
                               />
                             </li>
                           ))}
                         </ul>
                       </div>
                     </td>
                     {/* Manage Vendor Image Links */}
                     <td>
                       <div className="dropdown relative">
                         <label tabIndex={0} className="btn btn-secondary dropdown-toggle">
                           Vendor Image
                         </label>
                         <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                           {["amazon_image", "flipkart_image", "reliancedigital_image", "croma_image", "vijaysales_image", "tatacliq_image", "poorvika_image"].map((key) => (
                             <li key={key} className="flex flex-col">
                               <label className="font-semibold">
                                 {key.replace(/_/g, " ").toUpperCase()}
                               </label>
                               <input
                                 type="text"
                                 value={Camera[key] || ""}
                                 onChange={(e) => updateCameraProperty(index, key, e.target.value)}
                                 placeholder={`Enter ${key.replace(/_/g, " ")}`}
                                 className="input input-bordered w-full mb-2"
                               />
                             </li>
                           ))}
                         </ul>
                       </div>
                     </td>
                     {/* Manage Links */}
                     <td>
                       <div className="dropdown relative">
                         <label tabIndex={0} className="btn btn-secondary dropdown-toggle">
                           Manage Links
                         </label>
                         <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                           {["amazon_link", "flipkart_link", "reliancedigital_link", "croma_link", "vijaysales_link", "tatacliq_link", "poorvika_link"].map((key) => (
                             <li key={key} className="flex flex-col">
                               <label className="font-semibold">
                                 {key.replace(/_/g, " ").toUpperCase()}
                               </label>
                               <input
                                 type="text"
                                 value={Camera[key] || ""}
                                 onChange={(e) => updateCameraProperty(index, key, e.target.value)}
                                 placeholder={`Enter ${key.replace(/_/g, " ")}`}
                                 className="input input-bordered w-full mb-2"
                               />
                             </li>
                           ))}
                         </ul>
                       </div>
                     </td>
                     {/* Model Name */}
                     <td>
                       <input
                         type="text"
                         value={Camera.name || ""}
                         onChange={(e) => updateCameraProperty(index, "name", e.target.value)}
                         className="input input-bordered"
                         required
                         placeholder="Enter Camera name"
                       />
                     </td>
                     {/* Display */}
                     <td>
                       <input
                         type="text"
                         value={Camera.type || ""}
                         onChange={(e) => updateCameraProperty(index, "type", e.target.value)}
                         className="input input-bordered"
                         required
                       />
                     </td>
                     {/* Processor, Camera, Battery, Features */}
                     {["resolution", "sensor_type", "iso_range", "video_resolution","image_stabilization","connectivity"].map((key) => (
                       <td key={key}>
                         <input
                           type="text"
                           value={Camera[key] || ""}
                           onChange={(e) => updateCameraProperty(index, key, e.target.value)}
                           className="input input-bordered"
                         />
                       </td>
                     ))}
                     {/* Price */}
                     <td>
                       <input
                         type="text"
                         value={Camera.Price || ""}
                         onChange={(e) => updateCameraProperty(index, "Price", e.target.value)}
                         className="input input-bordered"
                         required
                       />
                     </td>
                     {/* Manage Prices */}
                     <td>
                       <div className="dropdown relative">
                         <label tabIndex={0} className="btn btn-secondary dropdown-toggle">
                           Manage Prices
                         </label>
                         <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                           {["amazon_price", "flipkart_price", "reliancedigital_price", "croma_price", "vijaysales_price", "tatacliq_price", "poorvika_price"].map((key) => (
                             <li key={key} className="flex flex-col">
                               <label className="font-semibold">
                                 {key.replace(/_/g, " ").toUpperCase()}
                               </label>
                               <input
                                 type="number"
                                 value={Camera[key] || ""}
                                 onChange={(e) => updateCameraProperty(index, key, e.target.value)}
                                 placeholder={`Enter ${key.replace(/_/g, " ")}`}
                                 className="input input-bordered w-full mb-2"
                               />
                             </li>
                           ))}
                         </ul>
                       </div>
                     </td>
                     {/* Actions */}
                     <td>
                       <button className="btn btn-success mr-2" onClick={() => saveCamera(Camera)}>
                         Save
                       </button>
                       <button className="btn btn-primary mr-2" onClick={() => updateCamera(Camera, setSelectedCameras)}
                       >
                         Update
                       </button>
                       <button className="btn btn-error"  onClick={() => deleteCamera(Camera, setSelectedCameras)}>
                         Delete
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
         <Footer />
       </>
  )
}
