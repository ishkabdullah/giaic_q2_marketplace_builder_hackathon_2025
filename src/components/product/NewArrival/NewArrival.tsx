"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "../ProductCard";
import Skeleton from "react-loading-skeleton"; 
import "react-loading-skeleton/dist/skeleton.css";


// Define the Item type for better type safety
interface Item {
  id: string;
  slug: string;
  images: string[];
  name: string;
  price: number;
  rating: number;
  tags: string[];
}

// Card Component
export const Card: React.FC<{ items: Item[]; loading: boolean }> = ({ items, loading }) => {
  return (
    <div className="flex gap-[16px] md:gap-[20px] flex-wrap justify-center">
      {loading ? (
        // Display Skeletons while loading
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-[150px] md:w-[200px] h-[300px]">
            <Skeleton count={3} />
          </div>
        ))
      ) : (
        items.map((item) => <ProductCard key={item.slug} product={item} />)
      )}
    </div>
  );
};


// NewArrival Component
const NewArrival: React.FC = () => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [visibleItems, setVisibleItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Item[] = await response.json();

        // Filter items with the "New Arrival" tag
        const newArrivalItems = data.filter((item) =>
          item.tags.includes("New Arrival")
        );

        setAllItems(newArrivalItems);

        // Initially show limited items (e.g., 4)
        setVisibleItems(newArrivalItems.slice(0, 4));
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewAll = () => {
    setShowAll(!showAll);
    setVisibleItems(showAll ? allItems.slice(0, 4) : allItems);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Card items={[]} loading={true} /> 
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (allItems.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <div id="new_arrival"
      className="flex flex-col justify-center items-center pt-[50px] md:pt-[72px] px-[16px]">
      <h1 className="text-[32px] md:text-[48px] font-bold">NEW ARRIVALS</h1>
      <div className="min-w-[310px] w-full mt-[32px] md:mt-[55px] flex justify-start md:justify-center items-center overflow-hidden">
        <Card items={visibleItems} loading={false} />
      </div>
      <Button
        onClick={handleViewAll}
        className="mt-[24px] md:mt-[36px] w-full md:w-[218px] h-[52px] bg-transparent border-[1px] border-[rgba(0,0,0,0.1)] rounded-full text-[16px] text-black font-medium"
      >
        {showAll ? "View Less" : "View All"}
      </Button>
      <div className="shrink-0 mt-[40px] max-w-full h-px border border-solid border-black border-opacity-10 w-[1240px] max-md:mt-[64px]" />
    </div>
  );
};

export default NewArrival;
