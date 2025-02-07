"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CardContext";

interface CartItem {
  id: string;
  name: string;
  discount: number;
  price: number;
  image: string;
  color: string[]; 
  size: string[]; 
  quantity: number;
}

interface ProductCardProps {
  item: CartItem;
}

export default function Cart({ item }: ProductCardProps) {
  const { addToCart, removeFromCart } = useCart();

  const updateQuantity = (change: number) => {
    if (item.quantity + change > 0) {
      addToCart({ ...item, quantity: change });
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id); // Remove entire item
  };

  if (!item || !item.id) {
    return null; // Prevent rendering empty items
  }

  return (
    <div className="flex items-end justify-between gap-4 p-4 mb-4 relative w-full">
      {/* Product Image */}
      <Image
        src={item.image}
        alt={item.name || "Product Image"}
        width={124}
        height={124}
        className="w-[99px] md:w-[124px] h-[99px] md:h-[124px] rounded-md object-cover"
      />

      {/* Product Details */}
      <div className="flex-1 w-[70vw] md:w-[36.597vw]">
        <h3 className="font-bold text-[16px] md:text-[20px]">{item.name}</h3>
        <p className="text-sm">
          Sizes:{" "}
          <span className="text-gray-500">
            {item.size.join(", ")} {/* Display sizes as a comma-separated list */}
          </span>
        </p>
        <p className="text-sm">
          Colors:{" "}
          <span className="text-gray-500">
            {item.color.join(", ")} {/* Display colors as a comma-separated list */}
          </span>
        </p>
        <p className="font-bold text-[20px] md:text-[24px] mt-[15px]">
          ${item.price}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="absolute right-0 flex items-center justify-between bg-gray-200 rounded-full w-[105px] md:w-[126px] h-[31px] md:h-[44px] px-[2px]">
        <button
          onClick={() => updateQuantity(-1)}
          disabled={item.quantity <= 1}
          className="w-9 md:w-8 h-full bg-gray-200 rounded-full flex items-center justify-center text-4xl hover:bg-gray-300"
        >
          -
        </button>
        <span className="mx-2">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(1)}
          className="w-9 md:w-8 h-full bg-gray-200 rounded-full flex items-center justify-center text-2xl hover:bg-gray-300"
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <Button
        onClick={handleRemove}
        variant="ghost"
        className="absolute top-0 right-0"
        aria-label={`Remove ${item.name} from cart`}
        title="Remove from cart"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.25 4.50006H16.5V3.75006C16.5 3.15332 16.2629 2.58103 15.841 2.15907C15.419 1.73711 14.8467 1.50006 14.25 1.50006H9.75C9.15326 1.50006 8.58097 1.73711 8.15901 2.15907C7.73705 2.58103 7.5 3.15332 7.5 3.75006V4.50006H3.75C3.55109 4.50006 3.36032 4.57908 3.21967 4.71973C3.07902 4.86038 3 5.05115 3 5.25006C3 5.44897 3.07902 5.63974 3.21967 5.78039C3.36032 5.92104 3.55109 6.00006 3.75 6.00006H4.5V19.5001C4.5 19.8979 4.65804 20.2794 4.93934 20.5607C5.22064 20.842 5.60218 21.0001 6 21.0001H18C18.3978 21.0001 18.7794 20.842 19.0607 20.5607C19.342 20.2794 19.5 19.8979 19.5 19.5001V6.00006H20.25C20.4489 6.00006 20.6397 5.92104 20.7803 5.78039C20.921 5.63974 21 5.44897 21 5.25006C21 5.05115 20.921 4.86038 20.7803 4.71973C20.6397 4.57908 20.4489 4.50006 20.25 4.50006ZM10.5 15.7501C10.5 15.949 10.421 16.1397 10.2803 16.2804C10.1397 16.421 9.94891 16.5001 9.75 16.5001C9.55109 16.5001 9.36032 16.421 9.21967 16.2804C9.07902 16.1397 9 15.949 9 15.7501V9.75006C9 9.55115 9.07902 9.36038 9.21967 9.21973C9.36032 9.07908 9.55109 9.00006 9.75 9.00006C9.94891 9.00006 10.1397 9.07908 10.2803 9.21973C10.421 9.36038 10.5 9.55115 10.5 9.75006V15.7501ZM15 15.7501C15 15.949 14.921 16.1397 14.7803 16.2804C14.6397 16.421 14.4489 16.5001 14.25 16.5001C14.0511 16.5001 13.8603 16.421 13.7197 16.2804C13.579 16.1397 13.5 15.949 13.5 15.7501V9.75006C13.5 9.55115 13.579 9.36038 13.7197 9.21973C13.8603 9.07908 14.0511 9.00006 14.25 9.00006C14.4489 9.00006 14.6397 9.07908 14.7803 9.21973C14.921 9.36038 15 9.55115 15 9.75006V15.7501ZM15 4.50006H9V3.75006C9 3.55115 9.07902 3.36038 9.21967 3.21973C9.36032 3.07908 9.55109 3.00006 9.75 3.00006H14.25C14.4489 3.00006 14.6397 3.07908 14.7803 3.21973C14.921 3.36038 15 3.55115 15 3.75006V4.50006Z" fill="#FF3333" />
        </svg>

      </Button>
    </div>
  );
}
