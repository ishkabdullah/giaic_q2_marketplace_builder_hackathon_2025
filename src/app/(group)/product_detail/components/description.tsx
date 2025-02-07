"use client";

import React, { useEffect, useState } from "react";

export const revalidate = 2;

async function fetchProductDescription(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products?id=${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch product description");
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface Product {
  id: string;
  name: string;
  description: string;
}

interface ProductDescriptionProps {
  productId: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const productData = await fetchProductDescription(productId);
        setProduct(productData);
      } catch (err: any) {
        setError(err.message || "Failed to load product description");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[200px]">
        <p>Loading product description...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-full h-[200px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-[16px] mt-6">
      <h2 className="text-[20px] md:text-[24px] font-bold mb-4">Product Description</h2>
      <p className="text-gray-600 text-[14px] md:text-[16px]">
        {product?.description ? product.description : "No details provided for this product."}
      </p>
    </div>
  );
};

export default ProductDescription;
