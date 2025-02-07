"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation"; // For extracting the search query
import { Card as UiCard, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

interface Item {
  id: number;
  images: string[];
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  tags: string[];
  colors: string[];
  sizes: string[];
  slug: string;
  description: string;
  dressStyle: string[];
}

interface ProductListProps {
  filters: Record<string, any>;
  currentPage: number;
  productsPerPage: number;
  sortOption: string; 
}


const ProductList = ({ filters, currentPage, productsPerPage, sortOption }: ProductListProps) => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const filteredItems = useMemo(() => {
    let filtered = allItems;
  
    // 1. Apply the search query if it exists
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }
  
    // 2. Apply filters on top of the search results
    if (filters.category) {
      filtered = filtered.filter((item) => item.tags.includes(filters.category));
    }
  
    if (filters.priceRange) {
      filtered = filtered.filter(
        (item) => item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
      );
    }
  
    if (filters.colors.length > 0) {
      filtered = filtered.filter((item) =>
        item.colors.some((color: string) => filters.colors.includes(color))
      );
    }
  
    if (filters.size.length > 0) {
      filtered = filtered.filter((item) =>
        item.sizes.some((size: string) => filters.size.includes(size))
      );
    }
  
    if (filters.dressStyle) {
      filtered = filtered.filter((item) => item.tags.includes(filters.dressStyle));
    }
  
    if (sortOption === "low-price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-price") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "most-popular") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
    
  }, [filters, searchQuery, allItems, sortOption]);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Item[] = await response.json();
        setAllItems(data);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center items-center gap-[16px] md:gap-[20px]">
        {[...Array(8)].map((_, index) => (
          <UiCard
            key={index}
            className="group relative min-w-[198px] md:max-w-[280px] rounded-none border-none shadow-none"
          >
            <CardContent className="p-0">
              <div className="w-[198px] md:w-[295px] h-[200px] md:h-[298px] bg-gray-200 animate-pulse"></div>
              <div className="p-0 pt-4">
                <div className="h-[20px] bg-gray-200 animate-pulse mb-[8px]"></div>
                <div className="h-[14px] bg-gray-200 animate-pulse w-[50%] mb-[4px]"></div>
              </div>
            </CardContent>
          </UiCard>
        ))}
      </div>
    );
  }


  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (filteredItems.length === 0) {
    return (
    <p>No products found for 
      {searchQuery ? `search query "${searchQuery}"` : "your search query"}.
      {filters.category ? `category "${filters.category}"` : "your filter"}.
    </p>
  );
  }

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredItems.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="flex flex-wrap justify-center items-center gap-[16px] md:gap-[20px]">
      {currentProducts.map((product) => (
        <UiCard
          key={product.id}
          className="group relative min-w-[198px] md:max-w-[280px] rounded-none border-none shadow-none"
        >
          <Link href={`/product_detail/${product.slug}`}>
            <CardContent className="p-0">
              <div className="relative aspect-square flex justify-center items-center">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={295}
                  height={180}
                  className="w-[198px] md:w-[295px] h-[200.01px] md:h-[298px] object-scale-down"
                />
              </div>

              <div className="p-0 pt-4">
                <h3 className="font-bold text-[14px] md:text-[18px] mb-[4px] md:mb-[8px]">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-muted-foreground">
                    {product.rating}/5
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-[20px] md:text-[24px] font-bold">
                    ${product.price}
                  </span>
                  {product.originalPrice != product.price && (
                    <span className="text-[20px] md:text-[24px] font-bold text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.discount != 0 && (
                    <Badge
                      variant="destructive"
                      className="bg-[rgba(255,_51,_51,_0.1)] font-medium text-[12px] leading-[16px] text-[#FF3333]"
                    >
                      -{product.discount}%
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Link>
        </UiCard>
      ))}
    </div>
  );
};

export default ProductList;
