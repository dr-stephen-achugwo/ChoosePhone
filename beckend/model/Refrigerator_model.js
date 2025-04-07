import mongoose from 'mongoose';

// models/phoneDataSchema.js

// Define a sub-schema for individual phone objects (common properties for Oppo and Vivo)
const RefrigeratorSubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    Price: { type: String, required: true },
    capacity: { type: String, required: true },
    energy_rating: { type: String, required: true },
    features: { type: [String], required: true },
    main_image: { type: String, },
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
const RefrigeratorSchema = new mongoose.Schema(
  {
    LG_refrigerator: [RefrigeratorSubSchema], 
    Samsung_refrigerator: [RefrigeratorSubSchema],
    whirlpool_refrigerator: [RefrigeratorSubSchema],
    Godrej_refrigerator: [RefrigeratorSubSchema],
  },
  { _id: true },
  {
    timestamps: true, 
  }
);

// Create a Mongoose model using the schema
const Refrigerator = mongoose.model('Refrigerator', RefrigeratorSchema);

export default Refrigerator;
