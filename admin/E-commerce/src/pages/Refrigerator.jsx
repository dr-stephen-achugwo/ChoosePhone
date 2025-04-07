import { replace, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'
import axios from 'axios';
import { Link } from 'react-router-dom'


export default function Refrigerator() {

  const [selectedRefrigerators, setSelectedRefrigerators] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const defaultRefrigerator = {
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
    capacity: "",
    energy_rating: "",
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
    const getRefrigerators = async () => {
      try {
        const res = await axios.get("http://localhost:4001/refrigerators");
        setSelectedRefrigerators(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching Refrigerators:", error.message);
      }
    };

    getRefrigerators();
  }, []);

  
 const saveRefrigerator = async (refrigerators, setSelectedRefrigerators) => {
    if (!refrigerators || typeof refrigerators !== 'object') {
        alert("Refrigerator data is required and must be an object.");
        return;
    }
    if (isNaN(Number(refrigerators.Price))) {
        alert("Price must be a valid number.");
        return;
    }

    if (refrigerators.features && typeof refrigerators.features === 'string') {
        refrigerators.features = refrigerators.features
            .split(',')
            .map((feature) => feature.trim())
            .filter((feature) => feature);
    }

    if (refrigerators.features && (!Array.isArray(refrigerators.features) || refrigerators.features.some((feature) => typeof feature !== 'string'))) {
        alert("Features must be an array of strings.");
        return;
    }

    // Automatically determine Refrigerator category based on the name
    let refrigeratorCategory = '';
    const refrigeratorNameLower = refrigerators.name?.toLowerCase() || '';
    if (refrigeratorNameLower.includes('godrej')) refrigeratorCategory = 'Godrej_refrigerator';
    else if (refrigeratorNameLower.includes('lg')) refrigeratorCategory = 'LG_refrigerator';
    else if (refrigeratorNameLower.includes('samsung')) refrigeratorCategory = 'Samsung_refrigerator';
    else if (refrigeratorNameLower.includes('whirlpool')) refrigeratorCategory = 'Whirlpool_refrigerator';
    else {
        alert('Refrigerator brand is required (e.g., Godrej, LG, Samsung, Whirlpool).');
        return;
    }

    // Prepare the request body
    const refrigeratorData = {
        [refrigeratorCategory]: [refrigerators],
    };

    try {
        // Make the POST request to the backend
        const response = await axios.post("http://localhost:4001/refrigeratorapi/Refrigerator", refrigeratorData);

        if (response.status === 201) {
            alert("Refrigerator saved successfully!");

            // Update the selected Refrigerators in the UI
            if (setSelectedRefrigerators) {
                setSelectedRefrigerators((prevRefrigerators) => [...prevRefrigerators, response.data.data]);
            }
        } else {
            console.error("Unexpected response:", response);
            alert(`Failed to save Refrigerator. Status: ${response.status}.`);
        }
    } catch (error) {
        console.error("Error saving Refrigerator:", error.response?.data || error.message);
        alert(`Failed to save Refrigerator. ${error.response?.data?.message || error.message}`);
    }
};



const updateRefrigerator = async (updatedRefrigerator, setSelectedRefrigerators) => {
  if (!updatedRefrigerator || typeof updatedRefrigerator !== "object" || !updatedRefrigerator.name) {
    alert("A valid Refrigerator object with a name is required for updating.");
    console.error("Invalid updatedRefrigerator object:", updatedRefrigerator);
    return;
  }

  const allowedFields = [
    "name", "Price", "capacity", "energy_rating",  "features",
    "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
    "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
    "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
    "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
    "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
    "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
    "vijaysales_Price",
  ];

  const invalidFields = Object.keys(updatedRefrigerator).filter(
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
    console.log("Sending update request for Refrigerator:", updatedRefrigerator);

    const response = await axios.put("http://localhost:4001/refrigeratorapi/Refrigerator/update",updatedRefrigerator);

    if (response.status === 200) {
      alert("Refrigerator updated successfully!");
      if (setSelectedRefrigerators) {
        setSelectedRefrigerators((prevRefrigerators) =>
          prevRefrigerators.map((Refrigerator) =>
            Refrigerator.name.toLowerCase() === updatedRefrigerator.name.toLowerCase()
              ? { ...Refrigerator, ...response.data.data }
              : Refrigerator
          )
        );
      }
    } else {
      alert(`Failed to update Refrigerator. Status: ${response.status}.`);
    }
  } catch (error) {
    console.error("Error updating Refrigerator:", error);
    alert(
      `Failed to update Refrigerator. ${
        error.response?.data?.error || error.message
      }`
    );
  }
};
  



  const updateRefrigeratorProperty = (index, key, value) => {
    setSelectedRefrigerators((prevRefrigerators) =>
      prevRefrigerators.map((Refrigerator, i) =>
        i === index ? { ...Refrigerator, [key]: value } : Refrigerator
      )
    );
  };

  const addRefrigerator = () => {
    setSelectedRefrigerators((prevRefrigerators) => [...prevRefrigerators, { ...defaultRefrigerator }]);
  };


  const deleteRefrigerator = async (refrigeratorObject, setSelectedRefrigerators) => {
    // Validate the Refrigerator object
    if (!refrigeratorObject || typeof refrigeratorObject !== "object") {
      alert("A valid Refrigerator object is required for deletion.");
      console.error("Invalid Refrigerator object:", refrigeratorObject);
      return;
    }
  
    try {
      console.log("Deleting Refrigerator:", refrigeratorObject);
  
      // Make the request to delete the Refrigerator from the backend
      const response = await axios.post("http://localhost:4001/refrigeratorapi/Refrigerator/delete", {
        refrigeratorObject, // Send only the Refrigerator object
      });
  
      if (response.status === 200) {
        alert(response.data.message || "Refrigerator deleted successfully!");
  
        if (setSelectedRefrigerators) {
          setSelectedRefrigerators((prevRefrigerators) => {
            // Iterate through all categories in the state and remove the Refrigerator object
            const updatedRefrigerators = Object.fromEntries(
              Object.entries(prevRefrigerators).map(([category, refrigerators]) => [
                category,
                refrigerators.filter(
                  (refrigerator) => JSON.stringify(refrigerator) !== JSON.stringify(refrigeratorObject)
                ),
              ])
            );
            return updatedRefrigerators;
          });
        }
      } else {
        alert(`Failed to delete Refrigerator. Status: ${response.status}.`);
      }
    } catch (error) {
      console.error("Error deleting Refrigerator:", error);
  
      // Handle errors from the backend and display an appropriate message
      const errorMessage =
        error.response?.data?.error || error.message || "An unknown error occurred.";
      alert(`Failed to delete Refrigerator. ${errorMessage}`);
    }
  };
  
  
  
 

  return (
    <>
         <Navbar />
         <div className="container mx-auto px-4">
           <div className="flex justify-end mb-4">
             <button className="btn btn-primary" onClick={addRefrigerator}>
               Add New Refrigerator
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
                   <th>Capacity</th>
                   <th>Energy Rating</th>
                   <th>Features</th>
                   <th>Price</th>
                   <th>Manage Prices</th>
                   <th>Action</th>
                 </tr>
               </thead>
               <tbody>
                 {selectedRefrigerators.map((Refrigerator, index) => (
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
                                 value={Refrigerator[key] || ""}
                                 onChange={(e) => updateRefrigeratorProperty(index, key, e.target.value)}
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
                                 value={Refrigerator[key] || ""}
                                 onChange={(e) => updateRefrigeratorProperty(index, key, e.target.value)}
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
                                 value={Refrigerator[key] || ""}
                                 onChange={(e) => updateRefrigeratorProperty(index, key, e.target.value)}
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
                         value={Refrigerator.name || ""}
                         onChange={(e) => updateRefrigeratorProperty(index, "name", e.target.value)}
                         className="input input-bordered"
                         required
                         placeholder="Enter Refrigerator name"
                       />
                     </td>
                     {/* Display */}
                     <td>
                       <input
                         type="text"
                         value={Refrigerator.capacity || ""}
                         onChange={(e) => updateRefrigeratorProperty(index, "capacity", e.target.value)}
                         className="input input-bordered"
                         required
                       />
                     </td>
                     {/* Processor, Camera, Battery, Features */}
                     {["energy_rating", "features"].map((key) => (
                       <td key={key}>
                         <input
                           type="text"
                           value={Refrigerator[key] || ""}
                           onChange={(e) => updateRefrigeratorProperty(index, key, e.target.value)}
                           className="input input-bordered"
                         />
                       </td>
                     ))}
                     {/* Price */}
                     <td>
                       <input
                         type="text"
                         value={Refrigerator.Price || ""}
                         onChange={(e) => updateRefrigeratorProperty(index, "Price", e.target.value)}
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
                                 value={Refrigerator[key] || ""}
                                 onChange={(e) => updateRefrigeratorProperty(index, key, e.target.value)}
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
                       <button className="btn btn-success mr-2" onClick={() => saveRefrigerator(Refrigerator)}>
                         Save
                       </button>
                       <button className="btn btn-primary mr-2" onClick={() => updateRefrigerator(Refrigerator, setSelectedRefrigerators)}
                       >
                         Update
                       </button>
                       <button className="btn btn-error"  onClick={() => deleteRefrigerator(Refrigerator, setSelectedRefrigerators)}>
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
