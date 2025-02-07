import { createClient } from '@sanity/client';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2021-08-31',
});

// Helper function to upload a single image to Sanity
async function uploadImageToSanity(imageUrl) {
  try {
    console.log(`Downloading and uploading image: ${imageUrl}`);
    const response = await axios.get(`http://localhost:3000${imageUrl}`, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data); // Convert image data to a buffer
    const asset = await client.assets.upload('image', buffer, {
      filename: path.basename(imageUrl), // Use the image filename
    });
    console.log(`Image uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error(`Error uploading image (${imageUrl}):`, error.message);
    return null;
  }
}

// Main function to import data
async function importData() {
  try {
    console.log('Fetching products from API...');
    const response = await axios.get('http://localhost:3000/api/products');
    const products = response.data;
    console.log(`Fetched ${products.length} products`);

    for (const product of products) {
      console.log(`Processing product: ${product.name}`);

      // Ensure imageUrl is processed as an array
      const imageUrls = Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl];
      const imageRefs = [];

      // Upload each image to Sanity and collect references
      for (const imageUrl of imageUrls) {
        if (imageUrl) {
          const imageRef = await uploadImageToSanity(imageUrl);
          if (imageRef) {
            imageRefs.push({
              asset: {
                _ref: imageRef,
              },
              _key: uuidv4(), // Add a unique key for each image
            });
          }
        }
      }

      // Construct the Sanity product object
      const sanityProduct = {
        _type: 'product',
        name: product.name,
        description: product.description || '',
        price: product.price || 0,
        discountPercentage: product.discount || 0,
        priceWithoutDiscount: product.originalPrice || product.price || 0,
        rating: product.rating || 0,
        stockLevel: product.stock || 0,
        tags: product.tag,
        sizes: product.sizes,
        colors: product.colors,
        images: imageRefs, // Pass the array of uploaded images with unique keys
        reviews: product.Reviews,
      };

      console.log('Uploading product to Sanity:', sanityProduct.name);
      const result = await client.create(sanityProduct);
      console.log(`Product uploaded successfully: ${result._id}`);
    }

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error.message);
  }
}

importData();
