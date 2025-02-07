"use client";

import ProductCard from "@/components/product/ProductCard";
import React, { useEffect, useState } from "react";

interface Product {
  id: string;
  slug: string;
  name: string;
  tags: string[];
  [key: string]: any;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  images: string[];
}

interface CardProps {
  relatedTags: string[];
}

const Card: React.FC<CardProps> = ({ relatedTags }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on related tags
  const filteredProducts = relatedTags.length
    ? products.filter((product) =>
        product.tags.some((tag) => relatedTags.includes(tag))
      )
    : [];

  // Randomly suggest products if no related tags are found
  const suggestedProducts =
    filteredProducts.length > 0
      ? filteredProducts.slice(0, 4) // Show up to 4 filtered products
      : products.sort(() => Math.random() - 0.5).slice(0, 4); // Randomly pick 4 products

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!products.length) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="flex flex-wrap gap-[16px] md:gap-[20px] justify-center items-center">
      {suggestedProducts.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
};

export default Card;
