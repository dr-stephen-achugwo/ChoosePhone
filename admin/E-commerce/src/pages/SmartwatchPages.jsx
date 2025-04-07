import { replace, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'
import axios from 'axios';
export default function SmartwatchPages() {

  const [selectedSmartwatches, setSelectedSmartwatches] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const defaultSmartwatches = {
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
    battery_life: "",
    water_resistance: "",
    display: "",
    connectivity: "",
    sensors: [],
    features: [],
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
    const getSmartwatches = async () => {
      try {
        const res = await axios.get("http://localhost:4001/smartwatches");
        setSelectedSmartwatches(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching Smartwatches:", error.message);
      }
    };

    getSmartwatches();
  }, []);

  
  const saveSmartwatch = async (smartwatches, setSelectedSmartwatches) => {
    if (!smartwatches || typeof smartwatches !== 'object') {
        alert("Smartwatch data is required and must be an object.");
        return;
    }
    if (isNaN(Number(smartwatches.Price))) {
        alert("Price must be a valid number.");
        return;
    }

    if (smartwatches.features && typeof smartwatches.features === 'string') {
        smartwatches.features = smartwatches.features
            .split(',')
            .map((feature) => feature.trim())
            .filter((feature) => feature);
    }

    if (smartwatches.features && (!Array.isArray(smartwatches.features) || smartwatches.features.some((feature) => typeof feature !== 'string'))) {
        alert("Features must be an array of strings.");
        return;
    }

    // Automatically determine Smartwatch category based on the name
    let smartwatchesCategory = '';
    const smartwatchesNameLower = smartwatches.name?.toLowerCase() || '';
         if (smartwatchesNameLower.includes('realme')) smartwatchesCategory = 'Realme_smartwatches';
    else if (smartwatchesNameLower.includes('oneplus')) smartwatchesCategory = 'Oneplus_smartwatches';
    else if (smartwatchesNameLower.includes('samsung')) smartwatchesCategory = 'Samsung_smartwatches';
    else if (smartwatchesNameLower.includes('apple')) smartwatchesCategory = 'Apple_smartwatches';
    else if (smartwatchesNameLower.includes('amazfit')) smartwatchesCategory = 'Amazfit_smartwatches';
    else {
        alert('Smartwatch brand is required (e.g., Oppo, Vivo, Samsung, Apple).');
        return;
    }

    // Prepare the request body
    const smartwatchesData = {
        [smartwatchesCategory]: [smartwatches], // Dynamically assign Smartwatch to the correct category
    };

    try {
        // Make the POST request to the backend
        const response = await axios.post("http://localhost:4001/smartwatchapi/smartwatches", smartwatchesData);

        if (response.status === 201) {
            alert("Smartwatch saved successfully!");

            // Update the selected Smartwatches in the UI
            if (setSelectedSmartwatches) {
                setSelectedSmartwatches((prevSmartwatches) => [...prevSmartwatches, response.data.data]);
            }
        } else {
            console.error("Unexpected response:", response);
            alert(`Failed to save Smartwatch. Status: ${response.status}.`);
        }
    } catch (error) {
        console.error("Error saving Smartwatch:", error.response?.data || error.message);
        alert(`Failed to save Smartwatch. ${error.response?.data?.message || error.message}`);
    }
};


const updateSmartwatch = async (updatedSmartwatches, setSelectedSmartwatches) => {
  if (!updatedSmartwatches || typeof updatedSmartwatches !== "object" || !updatedSmartwatches.name) {
    alert("A valid Smartwatch object with a name is required for updating.");
    console.error("Invalid updatedSmartwatch object:", updatedSmartwatches);
    return;
  }

  const allowedFields = [
    "name", "Price", "display", "battery_life", "water_resistance", "sensors", "connectivity","features",
    "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
    "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
    "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
    "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
    "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
    "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
    "vijaysales_Price",
  ];

  const invalidFields = Object.keys(updatedSmartwatches).filter(
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
    console.log("Sending update request for Smartwatch:", updatedSmartwatches);

    const response = await axios.put(
      "http://localhost:4001/smartwatchapi/smartwatches/update",
      updatedSmartwatches
    );

    if (response.status === 200) {
      alert("Smartwatch updated successfully!");
      if (setSelectedSmartwatches) {
        setSelectedSmartwatches((prevSmartwatches) =>
          prevSmartwatches.map((smartwatches) =>
            smartwatches.name.toLowerCase() === updatedSmartwatches.name.toLowerCase()
              ? { ...smartwatches, ...response.data.data }
              : smartwatches
          )
        );
      }
    } else {
      alert(`Failed to update Smartwatch. Status: ${response.status}.`);
    }
  } catch (error) {
    console.error("Error updating Smartwatch:", error);
    alert(
      `Failed to update Smartwatch. ${
        error.response?.data?.error || error.message
      }`
    );
  }
};
  



  const updateSmartwatchProperty = (index, key, value) => {
    setSelectedSmartwatches((prevSmartwatches) =>
      prevSmartwatches.map((smartwatches, i) =>
        i === index ? { ...smartwatches, [key]: value } : smartwatches
      )
    );
  };

  const addSmartwatch = () => {
    setSelectedSmartwatches((prevSmartwatches) => [...prevSmartwatches, { ...defaultSmartwatches }]);
  };


  const deleteSmartwatch = async (smartwatchesObject, setSelectedSmartwatches) => {
    // Validate the Smartwatche object
    if (!smartwatchesObject || typeof smartwatchesObject !== "object") {
      alert("A valid Smartwatch object is required for deletion.");
      console.error("Invalid Smartwatch object:", smartwatchesObject);
      return;
    }
  
    try {
      console.log("Deleting Smartwatch:", smartwatchesObject);
  
      // Make the request to delete the Smartwatche from the backend
      const response = await axios.post("http://localhost:4001/smartwatchapi/smartwatches/delete", {
        smartwatchesObject, // Send only the Smartwatche object
      });
  
      if (response.status === 200) {
        alert(response.data.message || "Smartwatch deleted successfully!");
  
        if (setSelectedSmartwatches) {
          setSelectedSmartwatches((prevSmartwatches) => {
            // Iterate through all categories in the state and remove the Smartwatche object
            const updatedSmartwatches = Object.fromEntries(
              Object.entries(prevSmartwatches).map(([category, smartwatches]) => [
                category,
                smartwatches.filter(
                  (smartwatches) => JSON.stringify(smartwatches) !== JSON.stringify(smartwatchesObject)
                ),
              ])
            );
            return updatedSmartwatches;
          });
        }
      } else {
        alert(`Failed to delete Smartwatch. Status: ${response.status}.`);
      }
    } catch (error) {
      console.error("Error deleting Smartwatch:", error);
  
      // Handle errors from the backend and display an appropriate message
      const errorMessage =
        error.response?.data?.error || error.message || "An unknown error occurred.";
      alert(`Failed to delete Smartwatch. ${errorMessage}`);
    }
  };
  
  
  
 

  return (
    <>
         <Navbar />
         <div className="container mx-auto px-4">
           <div className="flex justify-end mb-4">
             <button className="btn btn-primary" onClick={addSmartwatch}>
               Add New Smartwatch
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
                   <th>Display</th>
                   <th>Battery Life</th>
                   <th>Water Resistance</th>
                   <th>Sensors</th>
                   <th>features</th>
                   <th>Connectivity</th>
                   <th>Price</th>
                   <th>Manage Prices</th>
                   <th>Action</th>
                 </tr>
               </thead>
               <tbody>
                 {selectedSmartwatches.map((smartwatches, index) => (
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
                                 value={smartwatches[key] || ""}
                                 onChange={(e) => updateSmartwatchProperty(index, key, e.target.value)}
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
                                 value={smartwatches[key] || ""}
                                 onChange={(e) => updateSmartwatchProperty(index, key, e.target.value)}
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
                                 value={smartwatches[key] || ""}
                                 onChange={(e) => updateSmartwatchProperty(index, key, e.target.value)}
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
                         value={smartwatches.name || ""}
                         onChange={(e) => updateSmartwatchProperty(index, "name", e.target.value)}
                         className="input input-bordered"
                         required
                         placeholder="Enter Smartwatch name"
                       />
                     </td>
                     {/* Display */}
                     <td>
                       <input
                         type="text"
                         value={smartwatches.display || ""}
                         onChange={(e) => updateSmartwatchProperty(index, "display", e.target.value)}
                         className="input input-bordered"
                         required
                       />
                     </td>
                     {/* Processor, Camera, Battery, Features */}
                     {["battery_life", "water_resistance", "sensors","features", "connectivity"].map((key) => (
                       <td key={key}>
                         <input
                           type="text"
                           value={smartwatches[key] || ""}
                           onChange={(e) => updateSmartwatchProperty(index, key, e.target.value)}
                           className="input input-bordered"
                         />
                       </td>
                     ))}
                     {/* Price */}
                     <td>
                       <input
                         type="text"
                         value={smartwatches.Price || ""}
                         onChange={(e) => updateSmartwatchProperty(index, "Price", e.target.value)}
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
                           {["amazon_Price", "flipkart_Price", "reliancedigital_Price", "croma_Price", "vijaysales_Price", "tatacliq_Price", "poorvika_Price"].map((key) => (
                             <li key={key} className="flex flex-col">
                               <label className="font-semibold">
                                 {key.replace(/_/g, " ").toUpperCase()}
                               </label>
                               <input
                                 type="number"
                                 value={smartwatches[key] || ""}
                                 onChange={(e) => updateSmartwatchProperty(index, key, e.target.value)}
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
                       <button className="btn btn-success mr-2" onClick={() => saveSmartwatch(smartwatches)}>
                         Save
                       </button>
                       <button className="btn btn-primary mr-2" onClick={() => updateSmartwatch(smartwatches, setSelectedSmartwatches)}
                       >
                         Update
                       </button>
                       <button className="btn btn-error"  onClick={() => deleteSmartwatch(smartwatches, setSelectedSmartwatches)}>
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
