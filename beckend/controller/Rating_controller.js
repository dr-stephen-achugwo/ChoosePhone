import amazonPaapi from 'amazon-paapi';
import Rating from '../model/Rating_model.js';

const AMAZON_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
const AMAZON_SECRET_KEY = process.env.AMAZON_SECRET_KEY;
const AMAZON_ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG;
const AMAZON_REGION = process.env.AMAZON_REGION || 'us-east-1';

// Function to fetch ratings from Amazon PA-API
async function fetchAmazonRating(asin) {
  const requestParameters = {
    AccessKey: AMAZON_ACCESS_KEY,
    SecretKey: AMAZON_SECRET_KEY,
    PartnerTag: AMAZON_ASSOCIATE_TAG,
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.com',  // Change based on region (e.g., amazon.in, amazon.co.uk)
    Resources: [
      'ItemInfo.Title', 
      'CustomerReviews.Count', 
      'CustomerReviews.StarRating'
    ],
    ItemIds: [asin],
  };

  try {
    const response = await amazonPaapi.GetItems(requestParameters);
    const product = response.ItemsResult.Items[0];

    return {
      asin,
      averageRating: product.CustomerReviews.StarRating,
      totalRatings: product.CustomerReviews.Count,
    };
  } catch (error) {
    console.error('Error fetching data from Amazon:', error.message);
    return null;
  }
}

// Controller method to get ratings data (from Amazon and local DB)
export async function getRatings(req, res) {
  const { asin } = req.query;

  try {
    let ratingData = await Rating.findOne({ asin });

    if (!ratingData) {
      const amazonRatingData = await fetchAmazonRating(asin);

      if (!amazonRatingData) {
        return res.status(500).json({ message: 'Error fetching ratings from Amazon.' });
      }

      ratingData = new Rating(amazonRatingData);
      await ratingData.save();
    }

    res.json(ratingData);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
