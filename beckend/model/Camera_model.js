import mongoose from 'mongoose';

// models/phoneDataSchema.js

// Define a sub-schema for individual phone objects (common properties for Oppo and Vivo)
const CameraSubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    Price: { type: String, required: true },
    resolution: { type: String, required: true },
    video_resolution: { type: String, required: true },
    type: { type: String, required: true },
    sensor_type: { type: String, required: true },
    iso_range: { type: String, required: true },
    image_stabilization: { type: String, required: true },
    connectivity: { type: [String], required: true },
    main_image: { type: String },
    image_one: { type: String },
    image_two: { type: String },
    image_three: { type: String },
    image_four: { type: String },
    image_five: { type: String },
    amazon_image: { type: String },
    amazon_link: { type: String },
    flipkart_image: { type: String },
    flipkart_link: { type: String },
    reliancedigital_image: { type: String },
    reliancedigital_link: { type: String },
    croma_link: { type: String },
    vijaysales_image: { type: String },
    vijaysales_link: { type: String },
    tatacliq_image: { type: String },
    tatacliq_link: { type: String },
    poorvika_image: { type: String },
    poorvika_link: { type: String },
    amazon_Price: { type: String },
    croma_Price: { type: String },
    flipkart_Price: { type: String },
    poorvika_Price: { type: String },
    reliancedigital_Price: { type: String },
    tatacliq_Price: { type: String },
    vijaysales_Price: { type: String },
    croma_image: { type: String },
  },
  { _id: false } // This prevents Mongoose from creating an _id field for each phone object inside the array
);

// Define the main schema for the phone data (including Oppo and Vivo phone lists)
const CameraSchema = new mongoose.Schema(
  {
    Canon_camera: [CameraSubSchema], 
    Nikon_camera: [CameraSubSchema],
    Sony_camera: [CameraSubSchema],
    Panasonic_camera: [CameraSubSchema],
    GoPro_camera: [CameraSubSchema],
  },
  { _id: true },
  {
    timestamps: true, 
  }
);

// Create a Mongoose model using the schema
const Camera = mongoose.model('Camera', CameraSchema);

export default Camera;
