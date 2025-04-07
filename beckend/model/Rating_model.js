import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  asin: { type: String, required: true, unique: true },
  averageRating: { type: Number, required: true },
  totalRatings: { type: Number, required: true },
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
