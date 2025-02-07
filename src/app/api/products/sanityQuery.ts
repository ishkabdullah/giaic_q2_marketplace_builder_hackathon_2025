import { client } from '@/sanity/lib/client';


export const fetchProducts = async () => {
  const query = `
    *[_type == "product"]{
      "id": _id,
      "slug": slug.current,
      name,
      description,
      price,
      "originalPrice": priceWithoutDiscount,
      "discount": discountPercentage,
      rating,
      stockLevel,
      tags,
      sizes,
      colors,
      "images": images[].asset->url,
      reviews[]{
        _key,
        id,
        name,
        review,
        rating,
        date,
      }
    }
  `;
  return await client.fetch(query);
};


export async function addReviewToProduct(productId: string, review: { rating: number; name: string; review: string; date: string }) {
  const product = await client.getDocument(productId);

  if (!product) {
    return null;
  }

  const updatedReviews = [...(product.reviews || []), review];

  await client.patch(productId).set({ reviews: updatedReviews }).commit();

  return await client.getDocument(productId);
}