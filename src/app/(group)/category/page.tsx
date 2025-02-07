"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import Filter from "./components/Filter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductList from "./components/Cards/Cards";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card as UiCard, CardContent } from "@/components/ui/card";


interface Filters {
    category: string;
    priceRange: number[];
    colors: string[];
    size: string[];
    dressStyle: string;
}

interface Product {
    id: number;
    name: string;
    tags: string[];
    price: number;
    colors: string[];
    sizes: string[];
    rating: number;
  }
 
  

function Page() {
    // State management
    const [allProducts, setAllProducts] = useState<Product[]>([]); // Stores all products
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Stores filtered and sorted products
    const [filters, setFilters] = useState<Filters>({
        category: "",
        priceRange: [0, 500],
        colors: [],
        size: [],
        dressStyle: "",
    });
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const [sortOption, setSortOption] = useState("most-popular"); // Sorting option
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const productsPerPage = 10; // Products per page

    // Fetch all products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
              const response = await fetch("/api/products");
              if (!response.ok) {
                throw new Error("Failed to fetch products");
              }
              const data = await response.json();
          
              // Map API data to ensure all products have required fields
              const normalizedData = data.map((product: any) => ({
                id: product.id || 0,
                name: product.name || "Unnamed Product",
                tags: product.tags || [],
                price: product.price || 0,
                colors: product.colors || [],
                sizes: product.sizes || [],
                rating: product.rating || 0,
              }));
          
              setAllProducts(normalizedData);
              setFilteredProducts(normalizedData);
            } catch (err: any) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          };
          
        fetchProducts();
    }, []);

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<Filters>) => {
        setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
        setCurrentPage(1); // Reset to the first page when filters change
    };

    // Handle sorting changes
    const handleSortChange = (sort: string) => {
        setSortOption(sort);
        setCurrentPage(1); // Reset to the first page when sorting changes
    };

    // Apply filters, sorting, and pagination
    useEffect(() => {
        if (!allProducts.length) return;

        let updatedProducts = [...allProducts];

        // Apply filters
        if (filters.category) {
            updatedProducts = updatedProducts.filter((product) => product.tags.includes(filters.category));
        }

        if (filters.priceRange) {
            updatedProducts = updatedProducts.filter(
                (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
            );
        }

        if (filters.colors.length) {
            updatedProducts = updatedProducts.filter((product) =>
                product.colors.some((color: string) => filters.colors.includes(color))
            );
        }

        if (filters.size.length) {
            updatedProducts = updatedProducts.filter((product) =>
                product.sizes.some((size: string) => filters.size.includes(size))
            );
        }

        if (filters.dressStyle) {
            updatedProducts = updatedProducts.filter((product) => product.tags.includes(filters.dressStyle));
        }
          

        setFilteredProducts(updatedProducts);
    }, [filters, allProducts]);

    // Pagination
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return filteredProducts.slice(startIndex, startIndex + productsPerPage);
    }, [filteredProducts, currentPage]);

    // Handle pagination click
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Render loading state
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

    // Render error state
    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="w-full mt-6 flex flex-col justify-center items-center">
            <Breadcrumb className="mx-[16px] md:mx-[100px] w-[81.25vw]">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{filters.category || "All Products"}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex gap-[20px] mt-6 justify-center">
                {/* Filter Section */}
                <Filter onFilterChange={handleFilterChange} />

                {/* Product List Section */}
                <div className="flex flex-col justify-start items-center w-full md:max-w-[950px] px-[16px] md:max-px-[100px]">
                    <div className="flex flex-col xl:flex-row gap-[8px] lg:justify-between w-full">
                        <div className="flex items-center justify-between">
                            <h1 className="font-bold text-2xl md:text-[28px] tracking-tighter text-nowrap">
                                {filters.category || "All Products"}
                            </h1>
                        </div>

                        <div className=" w-full flex flex-col sm:flex-row justify-between md:justify-end items-center text-nowrap sm:text-wrap">
                            <span className="text-sm md:text-base text-black/60 md:mr-3 tracking-tighter">
                                Showing {(currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, totalProducts)} of{" "}
                                {totalProducts} Products
                            </span>
                            <div className="flex flex-row items-center tracking-tighter">
                                Sort by:{" "}
                                <Select defaultValue="most-popular" onValueChange={handleSortChange}>
                                    <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none focus:ring-transparent">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="most-popular">Most Popular</SelectItem>
                                        <SelectItem value="low-price">Low Price</SelectItem>
                                        <SelectItem value="high-price">High Price</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Sheet>
                                <SheetTrigger asChild>
                                    <Button className='flex md:hidden bg-[#F0F0F0] w-[32px] h-[32px] rounded-full'>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.75 7.75V13.5C8.75 13.6989 8.67098 13.8897 8.53033 14.0303C8.38968 14.171 8.19891 14.25 8 14.25C7.80109 14.25 7.61032 14.171 7.46967 14.0303C7.32902 13.8897 7.25 13.6989 7.25 13.5V7.75C7.25 7.55109 7.32902 7.36032 7.46967 7.21967C7.61032 7.07902 7.80109 7 8 7C8.19891 7 8.38968 7.07902 8.53033 7.21967C8.67098 7.36032 8.75 7.55109 8.75 7.75ZM12.5 12C12.3011 12 12.1103 12.079 11.9697 12.2197C11.829 12.3603 11.75 12.5511 11.75 12.75V13.5C11.75 13.6989 11.829 13.8897 11.9697 14.0303C12.1103 14.171 12.3011 14.25 12.5 14.25C12.6989 14.25 12.8897 14.171 13.0303 14.0303C13.171 13.8897 13.25 13.6989 13.25 13.5V12.75C13.25 12.5511 13.171 12.3603 13.0303 12.2197C12.8897 12.079 12.6989 12 12.5 12ZM14 9.5H13.25V2.5C13.25 2.30109 13.171 2.11032 13.0303 1.96967C12.8897 1.82902 12.6989 1.75 12.5 1.75C12.3011 1.75 12.1103 1.82902 11.9697 1.96967C11.829 2.11032 11.75 2.30109 11.75 2.5V9.5H11C10.8011 9.5 10.6103 9.57902 10.4697 9.71967C10.329 9.86032 10.25 10.0511 10.25 10.25C10.25 10.4489 10.329 10.6397 10.4697 10.7803C10.6103 10.921 10.8011 11 11 11H14C14.1989 11 14.3897 10.921 14.5303 10.7803C14.671 10.6397 14.75 10.4489 14.75 10.25C14.75 10.0511 14.671 9.86032 14.5303 9.71967C14.3897 9.57902 14.1989 9.5 14 9.5ZM3.5 10C3.30109 10 3.11032 10.079 2.96967 10.2197C2.82902 10.3603 2.75 10.5511 2.75 10.75V13.5C2.75 13.6989 2.82902 13.8897 2.96967 14.0303C3.11032 14.171 3.30109 14.25 3.5 14.25C3.69891 14.25 3.88968 14.171 4.03033 14.0303C4.17098 13.8897 4.25 13.6989 4.25 13.5V10.75C4.25 10.5511 4.17098 10.3603 4.03033 10.2197C3.88968 10.079 3.69891 10 3.5 10ZM5 7.5H4.25V2.5C4.25 2.30109 4.17098 2.11032 4.03033 1.96967C3.88968 1.82902 3.69891 1.75 3.5 1.75C3.30109 1.75 3.11032 1.82902 2.96967 1.96967C2.82902 2.11032 2.75 2.30109 2.75 2.5V7.5H2C1.80109 7.5 1.61032 7.57902 1.46967 7.71967C1.32902 7.86032 1.25 8.05109 1.25 8.25C1.25 8.44891 1.32902 8.63968 1.46967 8.78033C1.61032 8.92098 1.80109 9 2 9H5C5.19891 9 5.38968 8.92098 5.53033 8.78033C5.67098 8.63968 5.75 8.44891 5.75 8.25C5.75 8.05109 5.67098 7.86032 5.53033 7.71967C5.38968 7.57902 5.19891 7.5 5 7.5ZM9.5 4.5H8.75V2.5C8.75 2.30109 8.67098 2.11032 8.53033 1.96967C8.38968 1.82902 8.19891 1.75 8 1.75C7.80109 1.75 7.61032 1.82902 7.46967 1.96967C7.32902 2.11032 7.25 2.30109 7.25 2.5V4.5H6.5C6.30109 4.5 6.11032 4.57902 5.96967 4.71967C5.82902 4.86032 5.75 5.05109 5.75 5.25C5.75 5.44891 5.82902 5.63968 5.96967 5.78033C6.11032 5.92098 6.30109 6 6.5 6H9.5C9.69891 6 9.88968 5.92098 10.0303 5.78033C10.171 5.63968 10.25 5.44891 10.25 5.25C10.25 5.05109 10.171 4.86032 10.0303 4.71967C9.88968 4.57902 9.69891 4.5 9.5 4.5Z" fill="black" />
                                        </svg>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-screen w-full overflow-y-auto flex justify-center">
                                    <Filter onFilterChange={handleFilterChange} isMobile={true} />
                                </SheetContent>
                            </Sheet>
                            </div>
                           
                        </div>
                    </div>

                    <ProductList filters={filters} currentPage={currentPage} productsPerPage={productsPerPage}  sortOption={sortOption}  />

                    <hr className="w-full mt-[32px] mb-[20px] border-gray-200" />

                    <Pagination className="justify-between">
                        <PaginationPrevious
                            href="#"
                            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                            isActive={currentPage !== 1}
                            className="w-[85px] md:w-auto border border-black/10"
                        />
                        <PaginationContent>
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === index + 1}
                                        onClick={() => handlePageChange(index + 1)}
                                        className="text-black/50 font-medium text-sm"
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                        </PaginationContent>
                        <PaginationNext
                            href="#"
                            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                            isActive={currentPage !== totalPages}
                            className="w-[60px] md:w-auto border border-black/10"
                        />
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

export default Page;
