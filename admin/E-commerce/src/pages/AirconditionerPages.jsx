import { replace, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'
import axios from 'axios';
import { Link } from 'react-router-dom'


export default function AirconditionerPages() {

  const [selectedAirCondition, setSelectedAirCondition] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const defaultAirCondition = {
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
    capacity: "",
    energy_rating: "",
    cooling_power: "",
    condenser_coil: "",
    special_features: [],
    Price: "",
    amazon_Price: "",
    flipkart_Price: "",
    tatacliq_Price: "",
    reliancedigital_Price: "",
    vijaysales_Price: "",
    poorvika_Price: "",
    croma_Price: "",
  };

  useEffect(() => {
    const getAirConditions = async () => {
      try {
        const res = await axios.get("http://localhost:4001/airconditioners");
        setSelectedAirCondition(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching AirCondition:", error.message);
      }
    };

    getAirConditions();
  }, []);

  
  const saveAirCondition = async (AirCondition, setSelectedAirCondition) => {
    if (!AirCondition || typeof AirCondition !== 'object') {
        alert("AirCondition data is required and must be an object.");
        return;
    }
    if (isNaN(Number(AirCondition.Price))) {
        alert("Price must be a valid number.");
        return;
    }

    if (AirCondition.features && typeof AirCondition.features === 'string') {
        AirCondition.features = AirCondition.features
            .split(',')
            .map((feature) => feature.trim())
            .filter((feature) => feature);
    }

    if (AirCondition.features && (!Array.isArray(AirCondition.features) || AirCondition.features.some((feature) => typeof feature !== 'string'))) {
        alert("Features must be an array of strings.");
        return;
    }

    // Automatically determine AirCondition category based on the name
    let AirConditionCategory = '';
    const AirConditionNameLower = AirCondition.name?.toLowerCase() || '';
         if (AirConditionNameLower.includes('bluestar')) AirConditionCategory = 'Bluestar_aircondition';
    else if (AirConditionNameLower.includes('daikin')) AirConditionCategory = 'Daikin_aircondition';
    else if (AirConditionNameLower.includes('samsung')) AirConditionCategory = 'Samsung_aircondition';
    else if (AirConditionNameLower.includes('lg')) AirConditionCategory = 'LG_aircondition';
    else if (AirConditionNameLower.includes('haier')) AirConditionCategory = 'Haier_aircondition';
    else if (AirConditionNameLower.includes('lloyd')) AirConditionCategory = 'Lloyd_aircondition';
    else if (AirConditionNameLower.includes('lg')) AirConditionCategory = 'O_General_aircondition';
    else if (AirConditionNameLower.includes('voltas')) AirConditionCategory = 'Voltas_aircondition';
    else {
        alert('AirCondition brand is required (e.g., Oppo, Vivo, Samsung, Apple).');
        return;
    }

    // Prepare the request body
    const AirConditionData = {
        [AirConditionCategory]: [AirCondition], // Dynamically assign AirCondition to the correct category
    };

    try {
        // Make the POST request to the backend
        const response = await axios.post("http://localhost:4001/airconditionerapi/AirCondition", AirConditionData);

        if (response.status === 201) {
            alert("AirCondition saved successfully!");

            // Update the selected AirCondition in the UI
            if (setSelectedAirCondition) {
                setSelectedAirCondition((prevAirCondition) => [...prevAirCondition, response.data.data]);
            }
        } else {
            console.error("Unexpected response:", response);
            alert(`Failed to save AirCondition. Status: ${response.status}.`);
        }
    } catch (error) {
        console.error("Error saving AirCondition:", error.response?.data || error.message);
        alert(`Failed to save AirCondition. ${error.response?.data?.message || error.message}`);
    }
};


const updateAirCondition = async (updatedAirCondition, setSelectedAirCondition) => {
  if (!updatedAirCondition || typeof updatedAirCondition !== "object" || !updatedAirCondition.name) {
    alert("A valid AirCondition object with a name is required for updating.");
    console.error("Invalid updatedAirCondition object:", updatedAirCondition);
    return;
  }

  const allowedFields = [
    "name", "Price", "type", "capacity", "energy_rating", "cooling_power", "special_features","condenser_coil",
    "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
    "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
    "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
    "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
    "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
    "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
    "vijaysales_Price",
  ];

  const invalidFields = Object.keys(updatedAirCondition).filter(
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
    console.log("Sending update request for AirCondition:", updatedAirCondition);

    const response = await axios.put("http://localhost:4001/airconditionerapi/AirCondition/update",updatedAirCondition);

    if (response.status === 200) {
      alert("AirCondition updated successfully!");
      if (setSelectedAirCondition) {
        setSelectedAirCondition((prevAirCondition) =>
          prevAirCondition.map((AirCondition) =>
            AirCondition.name.toLowerCase() === updatedAirCondition.name.toLowerCase()
              ? { ...AirCondition, ...response.data.data }
              : AirCondition
          )
        );
      }
    } else {
      alert(`Failed to update AirCondition. Status: ${response.status}.`);
    }
  } catch (error) {
    console.error("Error updating AirCondition:", error);
    alert(
      `Failed to update AirCondition. ${
        error.response?.data?.error || error.message
      }`
    );
  }
};
  



  const updateAirConditionProperty = (index, key, value) => {
    setSelectedAirCondition((prevAirCondition) =>
      prevAirCondition.map((AirCondition, i) =>
        i === index ? { ...AirCondition, [key]: value } : AirCondition
      )
    );
  };

  const addAirCondition = () => {
    setSelectedAirCondition((prevAirCondition) => [...prevAirCondition, { ...defaultAirCondition }]);
  };


  const deleteAirCondition = async (airConditionObject, setSelectedAirCondition) => {
    // Validate the AirCondition object
    if (!airConditionObject || typeof airConditionObject !== "object") {
      alert("A valid AirCondition object is required for deletion.");
      console.error("Invalid AirCondition object:", airConditionObject);
      return;
    }
  
    try {
      console.log("Deleting AirCondition:", airConditionObject);
  
      // Make the request to delete the AirCondition from the backend
      const response = await axios.post("http://localhost:4001/airconditionerapi/AirCondition/delete", {
        airConditionObject, // Send only the AirCondition object
      });
  
      if (response.status === 200) {
        alert(response.data.message || "AirCondition deleted successfully!");
  
        if (setSelectedAirCondition) {
          setSelectedAirCondition((prevAirCondition) => {
            // Iterate through all categories in the state and remove the AirCondition object
            const updatedAirCondition = Object.fromEntries(
              Object.entries(prevAirCondition).map(([category, airConditions]) => [
                category,
                airConditions.filter(
                  (airCondition) =>
                    JSON.stringify(airCondition) !== JSON.stringify(airConditionObject)
                ),
              ])
            );
            return updatedAirCondition;
          });
        }
      } else {
        alert(`Failed to delete AirCondition. Status: ${response.status}.`);
      }
    } catch (error) {
      console.error("Error deleting AirCondition:", error);
  
      // Handle errors from the backend and display an appropriate message
      const errorMessage =
        error.response?.data?.error || error.message || "An unknown error occurred.";
      alert(`Failed to delete AirCondition. ${errorMessage}`);
    }
  };
  
  
  
 

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="flex justify-end mb-4">
          <button className="btn btn-primary" onClick={addAirCondition}>
            Add New AirCondition
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
                <th>Capacity</th>
                <th>Energy Rating</th>
                <th>Cooling Power</th>
                <th>Special Features</th>
                <th>Condenser Coil</th>
                <th>Price</th>
                <th>Manage Prices</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedAirCondition.map((AirCondition, index) => (
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
                              value={AirCondition[key] || ""}
                              onChange={(e) => updateAirConditionProperty(index, key, e.target.value)}
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
                              value={AirCondition[key] || ""}
                              onChange={(e) => updateAirConditionProperty(index, key, e.target.value)}
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
                              value={AirCondition[key] || ""}
                              onChange={(e) => updateAirConditionProperty(index, key, e.target.value)}
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
                      value={AirCondition.name || ""}
                      onChange={(e) => updateAirConditionProperty(index, "name", e.target.value)}
                      className="input input-bordered"
                      required
                      placeholder="Enter AirCondition name"
                    />
                  </td>
                  {/* Display */}
                  <td>
                    <input
                      type="text"
                      value={AirCondition.type || ""}
                      onChange={(e) => updateAirConditionProperty(index, "type", e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </td>
                  {/* Processor, Camera, Battery, Features */}
                  {["capacity", "energy_rating", "cooling_power", "special_features","condenser_coil"].map((key) => (
                    <td key={key}>
                      <input
                        type="text"
                        value={AirCondition[key] || ""}
                        onChange={(e) => updateAirConditionProperty(index, key, e.target.value)}
                        className="input input-bordered"
                      />
                    </td>
                  ))}
                  {/* Price */}
                  <td>
                    <input
                      type="text"
                      value={AirCondition.Price || ""}
                      onChange={(e) => updateAirConditionProperty(index, "Price", e.target.value)}
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
                              value={AirCondition[key] || ""}
                              onChange={(e) => updateAirConditionProperty(index, key, e.target.value)}
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
                    <button className="btn btn-success mr-2" onClick={() => saveAirCondition(AirCondition)}>
                      Save
                    </button>
                    <button className="btn btn-primary mr-2" onClick={() => updateAirCondition(AirCondition, setSelectedAirCondition)}
                    >
                      Update
                    </button>
                    <button className="btn btn-error"  onClick={() => deleteAirCondition(AirCondition, setSelectedAirCondition)}>
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
