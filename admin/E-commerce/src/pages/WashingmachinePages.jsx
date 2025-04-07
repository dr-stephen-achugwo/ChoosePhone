import { replace, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'
import axios from 'axios';
import { Link } from 'react-router-dom'


export default function WashingmachinePages() {

  const [selectedWashingmachines, setSelectedWashingmachines] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const defaultWashingmachine = {
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
    const getWashingmachines = async () => {
      try {
        const res = await axios.get("http://localhost:4001/washingmachines");
        setSelectedWashingmachines(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching Washingmachines:", error.message);
      }
    };

    getWashingmachines();
  }, []);

  
  const saveWashingmachine = async (Washingmachine, setSelectedWashingmachines) => {
    if (!Washingmachine || typeof Washingmachine !== 'object') {
        alert("Washingmachine data is required and must be an object.");
        return;
    }
    if (isNaN(Number(Washingmachine.Price))) {
        alert("Price must be a valid number.");
        return;
    }

    if (Washingmachine.features && typeof Washingmachine.features === 'string') {
        Washingmachine.features = Washingmachine.features
            .split(',')
            .map((feature) => feature.trim())
            .filter((feature) => feature);
    }

    if (Washingmachine.features && (!Array.isArray(Washingmachine.features) || Washingmachine.features.some((feature) => typeof feature !== 'string'))) {
        alert("Features must be an array of strings.");
        return;
    }

    // Automatically determine Washingmachine category based on the name
    let WashingmachineCategory = '';
    const WashingmachineNameLower = Washingmachine.name?.toLowerCase() || '';
         if (WashingmachineNameLower.includes('lg')) WashingmachineCategory = 'LG_washingmachine';
    else if (WashingmachineNameLower.includes('whirlpool')) WashingmachineCategory = 'Whirlpool_washingmachine';
    else if (WashingmachineNameLower.includes('samsung')) WashingmachineCategory = 'samsung_washingmachine';
    else if (WashingmachineNameLower.includes('godrej')) WashingmachineCategory = 'Godrej_washingmachine';
    else if (WashingmachineNameLower.includes('ifb')) WashingmachineCategory = 'IFB_washingmachine';
    else {
        alert('Washingmachine brand is required (e.g., Oppo, Vivo, Samsung, Apple).');
        return;
    }

    // Prepare the request body
    const WashingmachineData = {
        [WashingmachineCategory]: [Washingmachine], // Dynamically assign Washingmachine to the correct category
    };

    try {
        // Make the POST request to the backend
        const response = await axios.post("http://localhost:4001/washingmachineapi/WashingMachine", WashingmachineData);

        if (response.status === 201) {
            alert("Washingmachine saved successfully!");

            // Update the selected Washingmachines in the UI
            if (setSelectedWashingmachines) {
                setSelectedWashingmachines((prevWashingmachines) => [...prevWashingmachines, response.data.data]);
            }
        } else {
            console.error("Unexpected response:", response);
            alert(`Failed to save Washingmachine. Status: ${response.status}.`);
        }
    } catch (error) {
        console.error("Error saving Washingmachine:", error.response?.data || error.message);
        alert(`Failed to save Washingmachine. ${error.response?.data?.message || error.message}`);
    }
};


const updateWashingmachine = async (updatedWashingmachine, setSelectedWashingmachines) => {
  if (!updatedWashingmachine || typeof updatedWashingmachine !== "object" || !updatedWashingmachine.name) {
    alert("A valid Washingmachine object with a name is required for updating.");
    console.error("Invalid updatedWashingmachine object:", updatedWashingmachine);
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

  const invalidFields = Object.keys(updatedWashingmachine).filter(
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
    console.log("Sending update request for Washingmachine:", updatedWashingmachine);

    const response = await axios.put(
      "http://localhost:4001/washingmachineapi/WashingMachine/update",
      updatedWashingmachine
    );

    if (response.status === 200) {
      alert("Washingmachine updated successfully!");
      if (setSelectedWashingmachines) {
        setSelectedWashingmachines((prevWashingmachines) =>
          prevWashingmachines.map((Washingmachine) =>
            Washingmachine.name.toLowerCase() === updatedWashingmachine.name.toLowerCase()
              ? { ...Washingmachine, ...response.data.data }
              : Washingmachine
          )
        );
      }
    } else {
      alert(`Failed to update Washingmachine. Status: ${response.status}.`);
    }
  } catch (error) {
    console.error("Error updating Washingmachine:", error);
    alert(
      `Failed to update Washingmachine. ${
        error.response?.data?.error || error.message
      }`
    );
  }
};
  



  const updateWashingmachineProperty = (index, key, value) => {
    setSelectedWashingmachines((prevWashingmachines) =>
      prevWashingmachines.map((Washingmachine, i) =>
        i === index ? { ...Washingmachine, [key]: value } : Washingmachine
      )
    );
  };

  const addWashingmachine = () => {
    setSelectedWashingmachines((prevWashingmachines) => [...prevWashingmachines, { ...defaultWashingmachine }]);
  };


  const deleteWashingmachine = async (washingMachineObject, setSelectedWashingmachines) => {
    // Validate the washing machine object
    if (!washingMachineObject || typeof washingMachineObject !== "object") {
      alert("A valid washing machine object is required for deletion.");
      console.error("Invalid washing machine object:", washingMachineObject);
      return;
    }
  
    try {
      console.log("Deleting washing machine:", washingMachineObject);
  
      // Send the delete request to the backend
      const response = await axios.post(
        "http://localhost:4001/washingmachineapi/WashingMachine/delete",
        {
          washingMachineObject, // Include only the washing machine object in the request
        }
      );
  
      if (response.status === 200) {
        alert(response.data.message || "Washing machine deleted successfully!");
  
        if (setSelectedWashingmachines) {
          setSelectedWashingmachines((prevWashingmachines) => {
            // Remove the deleted washing machine from the state
            const updatedWashingmachines = Object.fromEntries(
              Object.entries(prevWashingmachines).map(([category, washingMachines]) => [
                category,
                washingMachines.filter(
                  (machine) =>
                    JSON.stringify(machine) !== JSON.stringify(washingMachineObject)
                ),
              ])
            );
            return updatedWashingmachines;
          });
        }
      } else {
        alert(`Failed to delete washing machine. Status: ${response.status}.`);
      }
    } catch (error) {
      console.error("Error deleting washing machine:", error);
  
      // Display an error message
      const errorMessage =
        error.response?.data?.error || error.message || "An unknown error occurred.";
      alert(`Failed to delete washing machine. ${errorMessage}`);
    }
  };

  return (
     <>
          <Navbar />
          <div className="container mx-auto px-4">
            <div className="flex justify-end mb-4">
              <button className="btn btn-primary" onClick={addWashingmachine}>
                Add New Washingmachine
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
                  {selectedWashingmachines.map((Washingmachine, index) => (
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
                                  value={Washingmachine[key] || ""}
                                  onChange={(e) => updateWashingmachineProperty(index, key, e.target.value)}
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
                                  value={Washingmachine[key] || ""}
                                  onChange={(e) => updateWashingmachineProperty(index, key, e.target.value)}
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
                                  value={Washingmachine[key] || ""}
                                  onChange={(e) => updateWashingmachineProperty(index, key, e.target.value)}
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
                          value={Washingmachine.name || ""}
                          onChange={(e) => updateWashingmachineProperty(index, "name", e.target.value)}
                          className="input input-bordered"
                          required
                          placeholder="Enter Washingmachine name"
                        />
                      </td>
                      {/* Display */}
                      <td>
                        <input
                          type="text"
                          value={Washingmachine.capacity || ""}
                          onChange={(e) => updateWashingmachineProperty(index, "capacity", e.target.value)}
                          className="input input-bordered"
                          required
                        />
                      </td>
                      {/* Processor, Camera, Battery, Features */}
                      {["energy_rating", "features"].map((key) => (
                        <td key={key}>
                          <input
                            type="text"
                            value={Washingmachine[key] || ""}
                            onChange={(e) => updateWashingmachineProperty(index, key, e.target.value)}
                            className="input input-bordered"
                          />
                        </td>
                      ))}
                      {/* Price */}
                      <td>
                        <input
                          type="text"
                          value={Washingmachine.Price || ""}
                          onChange={(e) => updateWashingmachineProperty(index, "Price", e.target.value)}
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
                                  value={Washingmachine[key] || ""}
                                  onChange={(e) => updateWashingmachineProperty(index, key, e.target.value)}
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
                        <button className="btn btn-success mr-2" onClick={() => saveWashingmachine(Washingmachine)}>
                          Save
                        </button>
                        <button className="btn btn-primary mr-2" onClick={() => updateWashingmachine(Washingmachine, setSelectedWashingmachines)}
                        >
                          Update
                        </button>
                        <button className="btn btn-error"  onClick={() => deleteWashingmachine(Washingmachine, setSelectedWashingmachines)}>
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
