import { replace, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'
import axios from 'axios';
import {Link} from 'react-router-dom'

export default function LaptopPages() {

  const [selectedLaptops, setSelectedLaptops] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const defaultlaptop = {
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
    graphics: "",
    storage: "",
    features: [],
    processor: "",
    os: "",
    display: "",
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
    const getLaptops = async () => {
      try {
        const res = await axios.get("http://localhost:4001/laptops");
        setSelectedLaptops(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching Laptops:", error.message);
      }
    };

    getLaptops();
  }, []);

  
  const savelaptop = async (laptop, setSelectedLaptops) => {
    if (!laptop || typeof laptop !== 'object') {
        alert("Laptop data is required and must be an object.");
        return;
    }

    if (isNaN(Number(laptop.Price))) {
        alert("Price must be a valid number.");
        return;
    }

    let laptopCategory = '';
    const laptopNameLower = laptop.name?.toLowerCase() || '';
    if (laptopNameLower.includes('acer')) laptopCategory = 'Acer_laptops';
    else if (laptopNameLower.includes('asus')) laptopCategory = 'Asus_laptops';
    else if (laptopNameLower.includes('dell')) laptopCategory = 'Dell_laptops';
    else if (laptopNameLower.includes('hp')) laptopCategory = 'HP_laptops';
    else if (laptopNameLower.includes('apple')) laptopCategory = 'apple_laptops';
    else if (laptopNameLower.includes('lenovo')) laptopCategory = 'lenovo_laptops';
    else if (laptopNameLower.includes('microsoft')) laptopCategory = 'microsoft_laptops';
    else {
        alert('Laptop brand is required (e.g., Acer, Asus, Dell, HP).');
        return;
    }

    const laptopData = {
        [laptopCategory]: [laptop],
    };

    try {
        const response = await axios.post('http://localhost:4001/laptopapi/laptops', laptopData);

        if (response.status === 201) {
            alert("Laptop saved successfully!");

            if (setSelectedLaptops) {
                setSelectedLaptops((prevLaptops) => [...prevLaptops, ...laptopData[laptopCategory]]);
            }
        } else {
            alert(`Failed to save laptop. Status: ${response.status}.`);
        }
    } catch (error) {
        alert(`Failed to save laptop. ${error.response?.data?.error || error.message}`);
    }
};


const updatelaptop = async (updatedLaptop, setSelectedLaptops) => {
    if (!updatedLaptop || typeof updatedLaptop !== "object" || !updatedLaptop.name) {
        alert("A valid laptop object with a name is required for updating.");
        console.error("Invalid updatedLaptop object:", updatedLaptop);
        return;
    }

    const allowedFields = ["name", "Price", "storage", "processor", "graphics", "ram", "display", "os","features",
        "main_image", "image_one", "image_two", "image_three", "image_four", "image_five",
        "amazon_image", "amazon_link", "flipkart_image", "flipkart_link",
        "reliancedigital_image", "reliancedigital_link", "croma_image", "croma_link",
        "vijaysales_image", "vijaysales_link", "tatacliq_image", "tatacliq_link",
        "poorvika_image", "poorvika_link", "amazon_Price", "croma_Price",
        "flipkart_Price", "poorvika_Price", "reliancedigital_Price", "tatacliq_Price",
        "vijaysales_Price",];

    const invalidFields = Object.keys(updatedLaptop).filter(
        (key) => !allowedFields.includes(key)
    );

    if (invalidFields.length) {
        alert(`Invalid fields in updated data: ${invalidFields.join(",")}.`);
        console.error("Invalid fields:", invalidFields);
        return;
    }

    try {
        console.log("Updating laptop:", updatedLaptop);
        const response = await axios.put("http://localhost:4001/laptopapi/laptops/update",updatedLaptop);
        if (response.status === 200) {
            alert("Laptop updated successfully!");
            // Update the UI state
            if (setSelectedLaptops) {
                setSelectedLaptops((prevLaptops) =>prevLaptops.map((laptop) =>
                laptop.name.toLowerCase() === updatedLaptop.name.toLowerCase()
                            ? { ...laptop, ...response.data.data }
                            : laptop
                    )
                );
            }
        } else {
            alert(`Failed to update laptop. Status: ${response.status}.`);
        }
    } catch (error) {
        console.error("Error updating laptop:", error);
        alert(`Failed to update laptop. ${error.response?.data?.error || error.message}`);
    }
};
  



  const updatelaptopProperty = (index, key, value) => {
    setSelectedLaptops((prevLaptops) =>
      prevLaptops.map((laptop, i) =>
        i === index ? { ...laptop, [key]: value } : laptop
      )
    );
  };

  const addlaptop = () => {
    setSelectedLaptops((prevLaptops) => [...prevLaptops, { ...defaultlaptop }]);
  };


  const deletelaptop = async (laptopObject, setSelectedLaptops) => {
    if (!laptopObject || typeof laptopObject !== "object") {
        alert("A valid laptop object is required for deletion.");
        console.error("Invalid laptop object:", laptopObject);
        return;
    }

    try {
        console.log("Deleting laptop:", laptopObject);

        // POST request to delete the laptop from the backend
        const response = await axios.post("http://localhost:4001/laptopapi/laptops/delete", {
            laptopObject,
        });

        if (response.status === 200) {
            alert(response.data.message || "Laptop deleted successfully!");

            // Update the frontend UI
            if (setSelectedLaptops) {
                setSelectedLaptops((prevLaptops) => {
                    const updatedLaptops = Object.fromEntries(
                        Object.entries(prevLaptops).map(([category, laptops]) => [
                            category,
                            laptops.filter(
                                (laptop) => JSON.stringify(laptop) !== JSON.stringify(laptopObject)
                            ),
                        ])
                    );
                    return updatedLaptops;
                });
            }
        } else {
            alert(`Failed to delete laptop. Status: ${response.status}.`);
        }
    } catch (error) {
        console.error("Error deleting laptop:", error);

        const errorMessage =
            error.response?.data?.error || error.message || "An unknown error occurred.";
        alert(`Failed to delete laptop. ${errorMessage}`);
    }
};

  
  
  
 



  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="flex justify-end mb-4">
          <button className="btn btn-primary" onClick={addlaptop}>
            Add New Laptop
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
                <th>Storage</th>
                <th>Processor</th>
                <th>graphics</th>
                <th>RAM</th>
                <th>Features</th>
                <th>Display</th>
                <th>Operating System</th>
                <th>Price</th>
                <th>Manage Prices</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedLaptops.map((laptop, index) => (
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
                              value={laptop[key] || ""}
                              onChange={(e) => updatelaptopProperty(index, key, e.target.value)}
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
                              value={laptop[key] || ""}
                              onChange={(e) => updatelaptopProperty(index, key, e.target.value)}
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
                              value={laptop[key] || ""}
                              onChange={(e) => updatelaptopProperty(index, key, e.target.value)}
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
                      value={laptop.name || ""}
                      onChange={(e) => updatelaptopProperty(index, "name", e.target.value)}
                      className="input input-bordered"
                      required
                      placeholder="Enter laptop name"
                    />
                  </td>
                  {/* Display */}
                  <td>
                    <input
                      type="text"
                      value={laptop.storage || ""}
                      onChange={(e) => updatelaptopProperty(index, "storage", e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </td>
                  {/* Processor, Camera, Battery, Operating System */}
                  {["processor", "graphics","ram","features", "display", "os"].map((key) => (
                    <td key={key}>
                      <input
                        type="text"
                        value={laptop[key] || ""}
                        onChange={(e) => updatelaptopProperty(index, key, e.target.value)}
                        className="input input-bordered"
                      />
                    </td>
                  ))}
                  {/* Price */}
                  <td>
                    <input
                      type="text"
                      value={laptop.Price || ""}
                      onChange={(e) => updatelaptopProperty(index, "Price", e.target.value)}
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
                              value={laptop[key] || ""}
                              onChange={(e) => updatelaptopProperty(index, key, e.target.value)}
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
                    <button className="btn btn-success mr-2" onClick={() => savelaptop(laptop)}>Save</button>
                    <button className="btn btn-primary mr-2" onClick={() => updatelaptop(laptop, setSelectedLaptops)}>Update</button>
                    <button className="btn btn-error"  onClick={() => deletelaptop(laptop, setSelectedLaptops)}>Delete</button>
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
