import { replace, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'
import axios from 'axios';
import { Link } from 'react-router-dom'

export default function TabletPages() {

  const [selectedTablets, setSelectedTablets] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const defaultTablet = {
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
    camera: "",
    os: "",
    ram: "",
    display: "",
    processor: "",
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
    const getTablets = async () => {
      try {
        const res = await axios.get("http://localhost:4001/tablets");
        setSelectedTablets(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching Tablets:", error.message);
      }
    };

    getTablets();
  }, []);

  
  const saveTablet = async (tablet, setSelectedTablets) => {
    if (!tablet || typeof tablet !== 'object') {
        alert("Tablet data is required and must be an object.");
        return;
    }
    if (isNaN(Number(tablet.Price))) {
        alert("Price must be a valid number.");
        return;
    }

    if (tablet.features && typeof tablet.features === 'string') {
        tablet.features = tablet.features
            .split(',')
            .map((feature) => feature.trim())
            .filter((feature) => feature);
    }

    if (tablet.features && (!Array.isArray(tablet.features) || tablet.features.some((feature) => typeof feature !== 'string'))) {
        alert("Features must be an array of strings.");
        return;
    }

    // Automatically determine Tablet category based on the name
    let tabletCategory = '';
    const tabletNameLower = tablet.name?.toLowerCase() || '';
         if (tabletNameLower.includes('lenevo')) tabletCategory = 'lenevo_tablets';
    else if (tabletNameLower.includes('realme')) tabletCategory = 'Realme_tablets';
    else if (tabletNameLower.includes('samsung')) tabletCategory = 'Samsung_tablets';
    else if (tabletNameLower.includes('apple')) tabletCategory = 'Apple_tablets';
    else if (tabletNameLower.includes('huawei')) tabletCategory = 'Huawei_tablets';
    else if (tabletNameLower.includes('xiaomi')) tabletCategory = 'Xiaomi_tablets';
    else {
        alert('Tablet brand is required (e.g., Oppo, Vivo, Samsung, Apple).');
        return;
    }

    // Prepare the request body
    const tabletData = {
        [tabletCategory]: [tablet], // Dynamically assign Tablet to the correct category
    };

    try {
        // Make the POST request to the backend
        const response = await axios.post("http://localhost:4001/tabletapi/tablets", tabletData);

        if (response.status === 201) {
            alert("Tablet saved successfully!");

            // Update the selected Tablets in the UI
            if (setSelectedTablets) {
                setSelectedTablets((prevTablets) => [...prevTablets, response.data.data]);
            }
        } else {
            console.error("Unexpected response:", response);
            alert(`Failed to save Tablet. Status: ${response.status}.`);
        }
    } catch (error) {
        console.error("Error saving Tablet:", error.response?.data || error.message);
        alert(`Failed to save Tablet. ${error.response?.data?.message || error.message}`);
    }
};


const updateTablet = async (updatedTablet, setSelectedTablets) => {
  if (!updatedTablet || typeof updatedTablet !== "object" || !updatedTablet.name) {
    alert("A valid Tablet object with a name is required for updating.");
    console.error("Invalid updatedTablet object:", updatedTablet);
    return;
  }

  const allowedFields = [
    "name", "Price", "display", "processor", "camera", "ram", "features","os","storage",
    "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
    "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
    "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
    "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
    "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
    "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
    "vijaysales_Price",
  ];

  const invalidFields = Object.keys(updatedTablet).filter(
    (key) => !allowedFields.includes(key)
  );

  if (invalidFields.length) {
    alert(`Invalid fields detected in the updated data: ${invalidFields.join(", ")}.`);
    console.error("Invalid fields:", invalidFields);
    return;
  }

  try {
    console.log("Sending update request for Tablet:", updatedTablet);

    const response = await axios.put("http://localhost:4001/tabletapi/tablets/update",updatedTablet);

    if (response.status === 200) {
      alert("Tablet updated successfully!");
      if (setSelectedTablets) {
        setSelectedTablets((prevTablets) =>
          prevTablets.map((tablet) =>
            tablet.name.toLowerCase() === updatedTablet.name.toLowerCase()
              ? { ...tablet, ...response.data.data }
              : tablet
          )
        );
      }
    } else {
      alert(`Failed to update Tablet. Status: ${response.status}.`);
    }
  } catch (error) {
    console.error("Error updating Tablet:", error);
    alert(`Failed to update Tablet. ${error.response?.data?.error || error.message}`);
  }
};
  



  const updateTabletProperty = (index, key, value) => {
    setSelectedTablets((prevTablets) =>
      prevTablets.map((tablet, i) =>
        i === index ? { ...tablet, [key]: value } : tablet
      )
    );
  };

  const addTablet = () => {
    setSelectedTablets((prevTablets) => [...prevTablets, { ...defaultTablet }]);
  };


  const deleteTablet = async (tabletObject, setSelectedTablets) => {
    // Validate the Tablet object
    if (!tabletObject || typeof tabletObject !== "object") {
      alert("A valid Tablet object is required for deletion.");
      console.error("Invalid Tablet object:", tabletObject);
      return;
    }
  
    try {
      console.log("Deleting Tablet:", tabletObject);
  
      // Make the request to delete the Tablet from the backend
      const response = await axios.post("http://localhost:4001/tabletapi/tablets/delete", {
        tabletObject, // Send only the Tablet object
      });
  
      if (response.status === 200) {
        alert(response.data.message || "Tablet deleted successfully!");
  
        if (setSelectedTablets) {
          setSelectedTablets((prevTablets) => {
            // Iterate through all categories in the state and remove the Tablet object
            const updatedTablets = Object.fromEntries(
              Object.entries(prevTablets).map(([category, tablets]) => [
                category,
                tablets.filter(
                  (tablet) => JSON.stringify(tablet) !== JSON.stringify(tabletObject)
                ),
              ])
            );
            return updatedTablets;
          });
        }
      } else {
        alert(`Failed to delete Tablet. Status: ${response.status}.`);
      }
    } catch (error) {
      console.error("Error deleting Tablet:", error);
  
      // Handle errors from the backend and display an appropriate message
      const errorMessage =
        error.response?.data?.error || error.message || "An unknown error occurred.";
      alert(`Failed to delete Tablet. ${errorMessage}`);
    }
  };
  
  
  
 

  return (
    <>
         <Navbar />
         <div className="container mx-auto px-4">
           <div className="flex justify-end mb-4">
             <button className="btn btn-primary" onClick={addTablet}>
               Add New Tablet
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
                   <th>Processor</th>
                   <th>Storage</th>
                   <th>Camera</th>
                   <th>RAM</th>
                   <th>Features</th>
                   <th>Operating System</th>
                   <th>Price</th>
                   <th>Manage Prices</th>
                   <th>Action</th>
                 </tr>
               </thead>
               <tbody>
                 {selectedTablets.map((tablet, index) => (
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
                                 value={tablet[key] || ""}
                                 onChange={(e) => updateTabletProperty(index, key, e.target.value)}
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
                                 value={tablet[key] || ""}
                                 onChange={(e) => updateTabletProperty(index, key, e.target.value)}
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
                                 value={tablet[key] || ""}
                                 onChange={(e) => updateTabletProperty(index, key, e.target.value)}
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
                         value={tablet.name || ""}
                         onChange={(e) => updateTabletProperty(index, "name", e.target.value)}
                         className="input input-bordered"
                         required
                         placeholder="Enter Tablet name"
                       />
                     </td>
                     {/* Display */}
                     <td>
                       <input
                         type="text"
                         value={tablet.display || ""}
                         onChange={(e) => updateTabletProperty(index, "display", e.target.value)}
                         className="input input-bordered"
                         required
                       />
                     </td>
                     {/* Processor, Camera, Battery, Features */}
                     {["processor","storage", "camera", "ram", "features","os"].map((key) => (
                       <td key={key}>
                         <input
                           type="text"
                           value={tablet[key] || ""}
                           onChange={(e) => updateTabletProperty(index, key, e.target.value)}
                           className="input input-bordered"
                         />
                       </td>
                     ))}
                     {/* Price */}
                     <td>
                       <input
                         type="text"
                         value={tablet.Price || ""}
                         onChange={(e) => updateTabletProperty(index, "Price", e.target.value)}
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
                                 value={tablet[key] || ""}
                                 onChange={(e) => updateTabletProperty(index, key, e.target.value)}
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
                       <button className="btn btn-success mr-2" onClick={() => saveTablet(tablet)}>Save</button>
                       <button className="btn btn-primary mr-2" onClick={() => updateTablet(tablet, setSelectedTablets)}>Update</button>
                       <button className="btn btn-error"  onClick={() => deleteTablet(tablet, setSelectedTablets)}>Delete</button>
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
