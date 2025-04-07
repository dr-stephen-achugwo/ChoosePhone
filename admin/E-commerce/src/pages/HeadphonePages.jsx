import { replace, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'
import axios from 'axios';
export default function HeadHeadphonePages() {

  const [selectedHeadphones, setSelectedHeadphones] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const defaultHeadphone = {
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
    battery: "",
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
    const getHeadphones = async () => {
      try {
        const res = await axios.get("http://localhost:4001/headphones");
        setSelectedHeadphones(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching Headphones:", error.message);
      }
    };

    getHeadphones();
  }, []);

  
  const saveHeadphone = async (headphone, setSelectedHeadphones) => {
    if (!headphone || typeof headphone !== 'object') {
        alert("Headphone data is required and must be an object.");
        return;
    }
    if (isNaN(Number(headphone.Price))) {
        alert("Price must be a valid number.");
        return;
    }

    if (headphone.features && typeof headphone.features === 'string') {
        headphone.features = headphone.features
            .split(',')
            .map((feature) => feature.trim())
            .filter((feature) => feature);
    }

    if (headphone.features && (!Array.isArray(headphone.features) || headphone.features.some((feature) => typeof feature !== 'string'))) {
        alert("Features must be an array of strings.");
        return;
    }

    // Automatically determine Headphone category based on the name
    let headphoneCategory = '';
    const headphoneNameLower = headphone.name?.toLowerCase() || '';
         if (headphoneNameLower.includes('boat')) headphoneCategory = 'Boat_headphones';
    else if (headphoneNameLower.includes('jbl')) headphoneCategory = 'JBL_headphones';
    else if (headphoneNameLower.includes('realme')) headphoneCategory = 'Realme_headphones';
    else if (headphoneNameLower.includes('sony')) headphoneCategory = 'sony_headphones';
    else {
        alert('Headphone brand is required (e.g., Oppo, Vivo, Samsung, Apple).');
        return;
    }

    // Prepare the request body
    const headphoneData = {
        [headphoneCategory]: [headphone], // Dynamically assign Headphone to the correct category
    };

    try {
        // Make the POST request to the backend
        const response = await axios.post("http://localhost:4001/headphoneapi/headphones", headphoneData);

        if (response.status === 201) {
            alert("Headphone saved successfully!");

            // Update the selected Headphones in the UI
            if (setSelectedHeadphones) {
                setSelectedHeadphones((prevHeadphones) => [...prevHeadphones, response.data.data]);
            }
        } else {
            console.error("Unexpected response:", response);
            alert(`Failed to save Headphone. Status: ${response.status}.`);
        }
    } catch (error) {
        console.error("Error saving Headphone:", error.response?.data || error.message);
        alert(`Failed to save Headphone. ${error.response?.data?.message || error.message}`);
    }
};


const updateHeadphone = async (updatedHeadphone, setSelectedHeadphones) => {
  if (!updatedHeadphone || typeof updatedHeadphone !== "object" || !updatedHeadphone.name) {
    alert("A valid Headphone object with a name is required for updating.");
    console.error("Invalid updatedHeadphone object:", updatedHeadphone);
    return;
  }

  const allowedFields = [
    "name", "Price", "type", "connectivity", "noise_cancellation", "battery_life","microphone", "features",
    "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
    "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
    "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
    "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
    "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
    "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
    "vijaysales_Price",
  ];

  const invalidFields = Object.keys(updatedHeadphone).filter(
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
    console.log("Sending update request for Headphone:", updatedHeadphone);

    const response = await axios.put(
      "http://localhost:4001/headphoneapi/headphones/update",
      updatedHeadphone
    );

    if (response.status === 200) {
      alert("Headphone updated successfully!");
      if (setSelectedHeadphones) {
        setSelectedHeadphones((prevHeadphones) =>
          prevHeadphones.map((headphone) =>
            headphone.name.toLowerCase() === updatedHeadphone.name.toLowerCase()
              ? { ...headphone, ...response.data.data }
              : headphone
          )
        );
      }
    } else {
      alert(`Failed to update Headphone. Status: ${response.status}.`);
    }
  } catch (error) {
    console.error("Error updating Headphone:", error);
    alert(
      `Failed to update Headphone. ${
        error.response?.data?.error || error.message
      }`
    );
  }
};
  



  const updateHeadphoneProperty = (index, key, value) => {
    setSelectedHeadphones((prevHeadphones) =>
      prevHeadphones.map((headphone, i) =>
        i === index ? { ...headphone, [key]: value } : headphone
      )
    );
  };

  const addHeadphone = () => {
    setSelectedHeadphones((prevHeadphones) => [...prevHeadphones, { ...defaultHeadphone }]);
  };


  const deleteHeadphone = async (headphoneObject, setSelectedHeadphones) => {
    // Validate the Headphone object
    if (!headphoneObject || typeof headphoneObject !== "object") {
      alert("A valid Headphone object is required for deletion.");
      console.error("Invalid Headphone object:", headphoneObject);
      return;
    }
  
    try {
      console.log("Deleting Headphone:", headphoneObject);
  
      // Make the request to delete the Headphone from the backend
      const response = await axios.post("http://localhost:4001/headphoneapi/headphones/delete", {
        headphoneObject, // Send only the Headphone object
      });
  
      if (response.status === 200) {
        alert(response.data.message || "Headphone deleted successfully!");
  
        if (setSelectedHeadphones) {
          setSelectedHeadphones((prevHeadphones) => {
            // Iterate through all categories in the state and remove the Headphone object
            const updatedHeadphones = Object.fromEntries(
              Object.entries(prevHeadphones).map(([category, headphones]) => [
                category,
                headphones.filter(
                  (headphone) => JSON.stringify(headphone) !== JSON.stringify(headphoneObject)
                ),
              ])
            );
            return updatedHeadphones;
          });
        }
      } else {
        alert(`Failed to delete Headphone. Status: ${response.status}.`);
      }
    } catch (error) {
      console.error("Error deleting Headphone:", error);
  
      // Handle errors from the backend and display an appropriate message
      const errorMessage =
        error.response?.data?.error || error.message || "An unknown error occurred.";
      alert(`Failed to delete Headphone. ${errorMessage}`);
    }
  };
  
  
  
 

  return (
     <>
          <Navbar />
          <div className="container mx-auto px-4">
            <div className="flex justify-end mb-4">
              <button className="btn btn-primary" onClick={addHeadphone}>
                Add New Headphone
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
                    <th>Connectivity</th>
                    <th>Noise Cancellation</th>
                    <th>Battery Life</th>
                    <th>Features</th>
                    <th>Microphone</th>
                    <th>Price</th>
                    <th>Manage Prices</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedHeadphones.map((headphone, index) => (
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
                                  value={headphone[key] || ""}
                                  onChange={(e) => updateHeadphoneProperty(index, key, e.target.value)}
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
                                  value={headphone[key] || ""}
                                  onChange={(e) => updateHeadphoneProperty(index, key, e.target.value)}
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
                                  value={headphone[key] || ""}
                                  onChange={(e) => updateHeadphoneProperty(index, key, e.target.value)}
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
                          value={headphone.name || ""}
                          onChange={(e) => updateHeadphoneProperty(index, "name", e.target.value)}
                          className="input input-bordered"
                          required
                          placeholder="Enter Headphone name"
                        />
                      </td>
                      {/* Display */}
                      <td>
                        <input
                          type="text"
                          value={headphone.type || ""}
                          onChange={(e) => updateHeadphoneProperty(index, "type", e.target.value)}
                          className="input input-bordered"
                          required
                        />
                      </td>
                      {/* Processor, Camera, Battery, Features */}
                      {["connectivity", "noise_cancellation", "battery_life", "features","microphone"].map((key) => (
                        <td key={key}>
                          <input
                            type="text"
                            value={headphone[key] || ""}
                            onChange={(e) => updateHeadphoneProperty(index, key, e.target.value)}
                            className="input input-bordered"
                          />
                        </td>
                      ))}
                      {/* Price */}
                      <td>
                        <input
                          type="text"
                          value={headphone.Price || ""}
                          onChange={(e) => updateHeadphoneProperty(index, "Price", e.target.value)}
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
                                  value={headphone[key] || ""}
                                  onChange={(e) => updateHeadphoneProperty(index, key, e.target.value)}
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
                        <button className="btn btn-success mr-2" onClick={() => saveHeadphone(headphone)}>
                          Save
                        </button>
                        <button className="btn btn-primary mr-2" onClick={() => updateHeadphone(headphone, setSelectedHeadphones)}
                        >
                          Update
                        </button>
                        <button className="btn btn-error"  onClick={() => deleteHeadphone(headphone, setSelectedHeadphones)}>
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
        </>  )
}
