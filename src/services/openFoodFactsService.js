// services/openFoodFactsService.js
const axios = require('axios');

const API_URL = 'https://world.openfoodfacts.org/api/v0/product';

async function getProductByBarcode(barcode) {
  try {
    const response = await axios.get(`${API_URL}/${barcode}.json`);
    
    if (response.data.status === 0) {
      return { error: 'Product not found' };
    }

    const product = response.data.product;
    
    return {
      name: product.product_name || 'Unknown',
      calories: product.nutriments?.energy_kcal_100g || 0,
      protein: product.nutriments?.proteins_100g || 0,
      carbs: product.nutriments?.carbohydrates_100g || 0,
      fat: product.nutriments?.fat_100g || 0,
      image: product.image_url || null,
      barcode
    };
  } catch (error) {
    console.error('Open Food Facts API error:', error);
    return { error: 'API request failed' };
  }
}

module.exports = { getProductByBarcode };