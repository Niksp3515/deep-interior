import fetch from 'node-fetch';

let reviewCache = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const formatDate = (timestamp) => {
  const d = new Date(timestamp * 1000);
  return d.toISOString().split('T')[0];
};

export const getGoogleReviews = async (req, res, next) => {
  try {
    const now = Date.now();

    // 1. Check Cache
    if (reviewCache.data && (now - reviewCache.timestamp < CACHE_DURATION)) {
      return res.json(reviewCache.data);
    }

    const API_KEY = process.env.GOOGLE_API_KEY;
    const PLACE_ID = process.env.GOOGLE_PLACE_ID;

    if (!API_KEY || !PLACE_ID) {
      console.warn("Missing GOOGLE_API_KEY or GOOGLE_PLACE_ID. Returning empty reviews.");
      return res.json([]);
    }

    // 2. Fetch from Google
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews&key=${API_KEY}`
    );
    const data = await response.json();

    if (!data.result || !data.result.reviews) {
      console.warn("No reviews found in Google Places payload.");
      return res.json([]);
    }

    // 3. Filter and Map
    const validReviews = data.result.reviews
      .filter(r => r.text && r.text.length >= 20 && r.rating >= 4)
      .map(r => ({
        id: r.author_name + r.time,
        name: r.author_name, // Mapping exactly what frontend expects
        rating: r.rating,
        message: r.text, // Frontend maps to .message
        date: formatDate(r.time),
        originalTime: r.time,
        profile_photo_url: r.profile_photo_url || null
      }))
      .sort((a, b) => b.originalTime - a.originalTime)
      .slice(0, 3); // Take top 3

    validReviews.forEach(r => delete r.originalTime);

    // 4. Update Cache
    reviewCache = {
      data: validReviews,
      timestamp: now,
    };

    res.json(validReviews);
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    res.json([]); // Prevents backend crash on failure, returns empty
  }
};
