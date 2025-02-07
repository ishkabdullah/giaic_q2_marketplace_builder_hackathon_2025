"use client";

import { useState } from "react";
import Reviews from "./reviews/ReviewCard"; // Import the Reviews component
import ProductDescription from "./description";
import FAQs from "./Faqs";


interface TabNavigationProps {
  productId: string;
}

export default function TabNavigation({ productId }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState("Product Details");

  const tabs = ["Product Details", "Rating & Reviews", "FAQs"];

  const renderContent = () => {
    switch (activeTab) {
      case "Product Details":
        return <ProductDescription productId={productId} />;
      case "Rating & Reviews":
        return <Reviews id={productId} />; 
      case "FAQs":
        return <FAQs />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex w-full justify-between items-center font-normal text-center text-black/60 text-[16px] md:text-[20px] text-nowrap leading-[22px] border-b border-gray-300">
        {tabs.map((tab) => (
          <p
            key={tab}
            className={`w-[28.75vw] cursor-pointer pb-[24px] ${
              activeTab === tab
                ? "font-medium text-black border-b-2 border-black"
                : "text-black/60"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </p>
        ))}
      </div>
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}
