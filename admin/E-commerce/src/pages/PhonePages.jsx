import React, { useState, useEffect } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import axios from 'axios';

export default function AdminPhonePanel() {
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const defaultPhone = {
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
    const getPhones = async () => {
      try {
        const res = await axios.get("http://localhost:4001/phones");
        setSelectedPhones(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching phones:", error.message);
      }
    };

    getPhones();
  }, []);

  
  const savePhone = async (phone, setSelectedPhones) => {
    if (!phone || typeof phone !== 'object') {
        alert("Phone data is required and must be an object.");
        return;
    }
    if (isNaN(Number(phone.Price))) {
        alert("Price must be a valid number.");
        return;
    }

    if (phone.features && typeof phone.features === 'string') {
        phone.features = phone.features
            .split(',')
            .map((feature) => feature.trim())
            .filter((feature) => feature);
    }

    if (phone.features && (!Array.isArray(phone.features) || phone.features.some((feature) => typeof feature !== 'string'))) {
        alert("Features must be an array of strings.");
        return;
    }

    // Automatically determine phone category based on the name
    let phoneCategory = '';
    const phoneNameLower = phone.name?.toLowerCase() || '';
         if (phoneNameLower.includes('oppo')) phoneCategory = 'oppo_phones';
    else if (phoneNameLower.includes('vivo')) phoneCategory = 'vivo_phones';
    else if (phoneNameLower.includes('samsung')) phoneCategory = 'samsung_phones';
    else if (phoneNameLower.includes('apple')) phoneCategory = 'apple_phones';
    else if (phoneNameLower.includes('google')) phoneCategory = 'Google_phones';
    else if (phoneNameLower.includes('asus')) phoneCategory = 'Asus_phones';
    else if (phoneNameLower.includes('infinix')) phoneCategory = 'Infinix_phones';
    else if (phoneNameLower.includes('motorola')) phoneCategory = 'Motorola_phones';
    else if (phoneNameLower.includes('nokia')) phoneCategory = 'Nokia_phones';
    else if (phoneNameLower.includes('oneplus')) phoneCategory = 'Oneplus_phones';
    else if (phoneNameLower.includes('realme')) phoneCategory = 'Realme_phones';
    else if (phoneNameLower.includes('tecno')) phoneCategory = 'Tecno_phones';
    else if (phoneNameLower.includes('xiaomi')) phoneCategory = 'Xiaomi_phones';
    else if (phoneNameLower.includes('iqoo')) phoneCategory = 'iQOO_phones';
    else {
        alert('Phone brand is required (e.g., Oppo, Vivo, Samsung, Apple).');
        return;
    }

    // Prepare the request body
    const phoneData = {
        [phoneCategory]: [phone], // Dynamically assign phone to the correct category
    };

    try {
        // Make the POST request to the backend
        const response = await axios.post("http://localhost:4001/api/phones", phoneData);

        if (response.status === 201) {
            alert("Phone saved successfully!");

            // Update the selected phones in the UI
            if (setSelectedPhones) {
                setSelectedPhones((prevPhones) => [...prevPhones, response.data.data]);
            }
        } else {
            console.error("Unexpected response:", response);
            alert(`Failed to save phone. Status: ${response.status}.`);
        }
    } catch (error) {
        console.error("Error saving phone:", error.response?.data || error.message);
        alert(`Failed to save phone. ${error.response?.data?.message || error.message}`);
    }
};


const updatePhone = async (updatedPhone, setSelectedPhones) => {
  if (!updatedPhone || typeof updatedPhone !== "object" || !updatedPhone.name) {
    alert("A valid phone object with a name is required for updating.");
    console.error("Invalid updatedPhone object:", updatedPhone);
    return;
  }

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

  const invalidFields = Object.keys(updatedPhone).filter(
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
    console.log("Sending update request for phone:", updatedPhone);

    const response = await axios.put(
      "http://localhost:4001/api/phones/update",
      updatedPhone
    );

    if (response.status === 200) {
      alert("Phone updated successfully!");
      if (setSelectedPhones) {
        setSelectedPhones((prevPhones) =>
          prevPhones.map((phone) =>
            phone.name.toLowerCase() === updatedPhone.name.toLowerCase()
              ? { ...phone, ...response.data.data }
              : phone
          )
        );
      }
    } else {
      alert(`Failed to update phone. Status: ${response.status}.`);
    }
  } catch (error) {
    console.error("Error updating phone:", error);
    alert(
      `Failed to update phone. ${
        error.response?.data?.error || error.message
      }`
    );
  }
};
  



  const updatePhoneProperty = (index, key, value) => {
    setSelectedPhones((prevPhones) =>
      prevPhones.map((phone, i) =>
        i === index ? { ...phone, [key]: value } : phone
      )
    );
  };

  const addPhone = () => {
    setSelectedPhones((prevPhones) => [...prevPhones, { ...defaultPhone }]);
  };


  const deletePhone = async (phoneObject, setSelectedPhones) => {
    // Validate the phone object
    if (!phoneObject || typeof phoneObject !== "object") {
      alert("A valid phone object is required for deletion.");
      console.error("Invalid phone object:", phoneObject);
      return;
    }
  
    try {
      console.log("Deleting phone:", phoneObject);
  
      // Make the request to delete the phone from the backend
      const response = await axios.post("http://localhost:4001/api/phones/delete", {
        phoneObject, // Send only the phone object
      });
  
      if (response.status === 200) {
        alert(response.data.message || "Phone deleted successfully!");
  
        if (setSelectedPhones) {
          setSelectedPhones((prevPhones) => {
            // Iterate through all categories in the state and remove the phone object
            const updatedPhones = Object.fromEntries(
              Object.entries(prevPhones).map(([category, phones]) => [
                category,
                phones.filter(
                  (phone) => JSON.stringify(phone) !== JSON.stringify(phoneObject)
                ),
              ])
            );
            return updatedPhones;
          });
        }
      } else {
        alert(`Failed to delete phone. Status: ${response.status}.`);
      }
    } catch (error) {
      console.error("Error deleting phone:", error);
  
      // Handle errors from the backend and display an appropriate message
      const errorMessage =
        error.response?.data?.error || error.message || "An unknown error occurred.";
      alert(`Failed to delete phone. ${errorMessage}`);
    }
  };
  
  
  return (
    <>
  <Navbar />
  <div className="container mx-auto px-4">
    <div className="flex justify-end mb-4">
      <button className="btn btn-primary" onClick={addPhone}>
        Add New Phone
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
            <th>Camera</th>
            <th>Battery</th>
            <th>Features</th>
            <th>Price</th>
            <th>Manage Prices</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedPhones.map((phone, index) => (
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
                          value={phone[key] || ""}
                          onChange={(e) => updatePhoneProperty(index, key, e.target.value)}
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
                          value={phone[key] || ""}
                          onChange={(e) => updatePhoneProperty(index, key, e.target.value)}
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
                          value={phone[key] || ""}
                          onChange={(e) => updatePhoneProperty(index, key, e.target.value)}
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
                  value={phone.name || ""}
                  onChange={(e) => updatePhoneProperty(index, "name", e.target.value)}
                  className="input input-bordered"
                  required
                  placeholder="Enter phone name"
                />
              </td>
              {/* Display */}
              <td>
                <input
                  type="text"
                  value={phone.display || ""}
                  onChange={(e) => updatePhoneProperty(index, "display", e.target.value)}
                  className="input input-bordered"
                  required
                />
              </td>
              {/* Processor, Camera, Battery, Features */}
              {["processor", "camera", "battery", "features"].map((key) => (
                <td key={key}>
                  <input
                    type="text"
                    value={phone[key] || ""}
                    onChange={(e) => updatePhoneProperty(index, key, e.target.value)}
                    className="input input-bordered"
                  />
                </td>
              ))}
              {/* Price */}
              <td>
                <input
                  type="text"
                  value={phone.Price || ""}
                  onChange={(e) => updatePhoneProperty(index, "Price", e.target.value)}
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
                          value={phone[key] || ""}
                          onChange={(e) => updatePhoneProperty(index, key, e.target.value)}
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
                <button className="btn btn-success mr-2" onClick={() => savePhone(phone)}>
                  Save
                </button>
                <button className="btn btn-primary mr-2" onClick={() => updatePhone(phone, setSelectedPhones)}
                >
                  Update
                </button>
                <button className="btn btn-error"  onClick={() => deletePhone(phone, setSelectedPhones)}>
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

  );
}
