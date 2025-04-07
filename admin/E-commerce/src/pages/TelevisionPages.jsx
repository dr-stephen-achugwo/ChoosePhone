import { replace, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'
import axios from 'axios';
import { Link } from 'react-router-dom'


export default function TelevisionPages() {

  const [selectedTelevisions, setSelectedTelevisions] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const defaultTelevision = {
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
    const getTelevisions = async () => {
      try {
        const res = await axios.get("http://localhost:4001/televisions");
        setSelectedTelevisions(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching Televisions:", error.message);
      }
    };

    getTelevisions();
  }, []);

  
  const saveTelevision = async (Television, setSelectedTelevisions) => {
    if (!Television || typeof Television !== 'object') {
        alert("Television data is required and must be an object.");
        return;
    }
    if (isNaN(Number(Television.Price))) {
        alert("Price must be a valid number.");
        return;
    }

    if (Television.features && typeof Television.features === 'string') {
        Television.features = Television.features
            .split(',')
            .map((feature) => feature.trim())
            .filter((feature) => feature);
    }

    if (Television.features && (!Array.isArray(Television.features) || Television.features.some((feature) => typeof feature !== 'string'))) {
        alert("Features must be an array of strings.");
        return;
    }

    // Automatically determine Television category based on the name
    let TelevisionCategory = '';
    const TelevisionNameLower = Television.name?.toLowerCase() || '';
         if (TelevisionNameLower.includes('lg')) TelevisionCategory = 'LG_televisions';
    else if (TelevisionNameLower.includes('mi')) TelevisionCategory = 'Mi_televisions';
    else if (TelevisionNameLower.includes('samsung')) TelevisionCategory = 'Samasung_televisions';
    else if (TelevisionNameLower.includes('sony')) TelevisionCategory = 'Sony_televisions';
    else if (TelevisionNameLower.includes('panasonic')) TelevisionCategory = 'Panasonic_televisions';
    else if (TelevisionNameLower.includes('oneplus')) TelevisionCategory = 'Oneplus_televisions';
    else {
        alert('Television brand is required (e.g., Oppo, Vivo, Samsung, Apple).');
        return;
    }

    // Prepare the request body
    const TelevisionData = {
        [TelevisionCategory]: [Television], // Dynamically assign Television to the correct category
    };

    try {
        // Make the POST request to the backend
        const response = await axios.post("http://localhost:4001/televisionapi/televisions", TelevisionData);

        if (response.status === 201) {
            alert("Television saved successfully!");

            // Update the selected Televisions in the UI
            if (setSelectedTelevisions) {
                setSelectedTelevisions((prevTelevisions) => [...prevTelevisions, response.data.data]);
            }
        } else {
            console.error("Unexpected response:", response);
            alert(`Failed to save Television. Status: ${response.status}.`);
        }
    } catch (error) {
        console.error("Error saving Television:", error.response?.data || error.message);
        alert(`Failed to save Television. ${error.response?.data?.message || error.message}`);
    }
};


const updateTelevision = async (updatedTelevision, setSelectedTelevisions) => {
  if (!updatedTelevision || typeof updatedTelevision !== "object" || !updatedTelevision.name) {
    alert("A valid Television object with a name is required for updating.");
    console.error("Invalid updatedTelevision object:", updatedTelevision);
    return;
  }

  const allowedFields = [
    "name", "Price", "screen_size", "resolution", "smart_tv", "connectivity", "speaker_output","display_technology",
    "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
    "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
    "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
    "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
    "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
    "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
    "vijaysales_Price",
  ];

  const invalidFields = Object.keys(updatedTelevision).filter(
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
    console.log("Sending update request for Television:", updatedTelevision);

    const response = await axios.put(
      "http://localhost:4001/televisionapi/televisions/update",
      updatedTelevision
    );

    if (response.status === 200) {
      alert("Television updated successfully!");
      if (setSelectedTelevisions) {
        setSelectedTelevisions((prevTelevisions) =>
          prevTelevisions.map((Television) =>
            Television.name.toLowerCase() === updatedTelevision.name.toLowerCase()
              ? { ...Television, ...response.data.data }
              : Television
          )
        );
      }
    } else {
      alert(`Failed to update Television. Status: ${response.status}.`);
    }
  } catch (error) {
    console.error("Error updating Television:", error);
    alert(
      `Failed to update Television. ${
        error.response?.data?.error || error.message
      }`
    );
  }
};
  



  const updateTelevisionProperty = (index, key, value) => {
    setSelectedTelevisions((prevTelevisions) =>
      prevTelevisions.map((Television, i) =>
        i === index ? { ...Television, [key]: value } : Television
      )
    );
  };

  const addTelevision = () => {
    setSelectedTelevisions((prevTelevisions) => [...prevTelevisions, { ...defaultTelevision }]);
  };


  const deleteTelevision = async (TelevisionObject, setSelectedTelevisions) => {
    // Validate the Television object
    if (!TelevisionObject || typeof TelevisionObject !== "object") {
      alert("A valid Television object is required for deletion.");
      console.error("Invalid Television object:", TelevisionObject);
      return;
    }
  
    try {
      console.log("Deleting Television:", TelevisionObject);
  
      // Make the request to delete the Television from the backend
      const response = await axios.post("http://localhost:4001/televisionapi/televisions/delete", {
        televisionObject: TelevisionObject, // Send the Television object with the correct key
      });
  
      if (response.status === 200) {
        alert(response.data.message || "Television deleted successfully!");
  
        if (setSelectedTelevisions) {
          setSelectedTelevisions((prevTelevisions) => {
            // Iterate through all categories in the state and remove the Television object
            const updatedTelevisions = Object.fromEntries(
              Object.entries(prevTelevisions).map(([category, Televisions]) => [
                category,
                Televisions.filter(
                  (Television) => JSON.stringify(Television) !== JSON.stringify(TelevisionObject)
                ),
              ])
            );
            return updatedTelevisions;
          });
        }
      } else {
        alert(`Failed to delete Television. Status: ${response.status}.`);
      }
    } catch (error) {
      console.error("Error deleting Television:", error);
  
      // Handle errors from the backend and display an appropriate message
      const errorMessage =
        error.response?.data?.error || error.message || "An unknown error occurred.";
      alert(`Failed to delete Television. ${errorMessage}`);
    }
  };
  
  
  
 

  return (
     <>
          <Navbar />
          <div className="container mx-auto px-4">
            <div className="flex justify-end mb-4">
              <button className="btn btn-primary" onClick={addTelevision}>
                Add New Television
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
                    <th>Screen Size</th>
                    <th>Resolution</th>
                    <th>Smart TV</th>
                    <th>Connectivity</th>
                    <th>Speaker Output</th>
                    <th>Display Technology</th>
                    <th>Price</th>
                    <th>Manage Prices</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTelevisions.map((Television, index) => (
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
                                  value={Television[key] || ""}
                                  onChange={(e) => updateTelevisionProperty(index, key, e.target.value)}
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
                                  value={Television[key] || ""}
                                  onChange={(e) => updateTelevisionProperty(index, key, e.target.value)}
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
                                  value={Television[key] || ""}
                                  onChange={(e) => updateTelevisionProperty(index, key, e.target.value)}
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
                          value={Television.name || ""}
                          onChange={(e) => updateTelevisionProperty(index, "name", e.target.value)}
                          className="input input-bordered"
                          required
                          placeholder="Enter Television name"
                        />
                      </td>
                      {/* Display */}
                      <td>
                        <input
                          type="text"
                          value={Television.screen_size || ""}
                          onChange={(e) => updateTelevisionProperty(index, "screen_size", e.target.value)}
                          className="input input-bordered"
                          required
                        />
                      </td>
                      {/* Processor, Camera, Battery, Features */}
                      {["resolution", "smart_tv", "connectivity", "speaker_output","display_technology"].map((key) => (
                        <td key={key}>
                          <input
                            type="text"
                            value={Television[key] || ""}
                            onChange={(e) => updateTelevisionProperty(index, key, e.target.value)}
                            className="input input-bordered"
                          />
                        </td>
                      ))}
                      {/* Price */}
                      <td>
                        <input
                          type="text"
                          value={Television.Price || ""}
                          onChange={(e) => updateTelevisionProperty(index, "Price", e.target.value)}
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
                                  value={Television[key] || ""}
                                  onChange={(e) => updateTelevisionProperty(index, key, e.target.value)}
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
                        <button className="btn btn-success mr-2" onClick={() => saveTelevision(Television)}>
                          Save
                        </button>
                        <button className="btn btn-primary mr-2" onClick={() => updateTelevision(Television, setSelectedTelevisions)}
                        >
                          Update
                        </button>
                        <button className="btn btn-error"  onClick={() => deleteTelevision(Television, setSelectedTelevisions)}>
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
