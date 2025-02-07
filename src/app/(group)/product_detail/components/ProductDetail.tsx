"use client";

import React, { useCallback, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Card from "./Suggestion/Cards";
import TabNavigation from "./TabNavigation";
import { useCart } from "@/contexts/CardContext";
import { useToast } from "@/hooks/use-toast";

export default function ProductClient({ product }: { product: any }) {
    const [selectedColor, setSelectedColor] = useState<string[]>([]);
    const [selectedSize, setSelectedSize] = useState<string[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const { addToCart } = useCart();
    const { toast } = useToast();

    // Handle quantity changes
    const handleQuantityChange = (type: "increment" | "decrement") => {
        setQuantity((prev) => (type === "increment" ? prev + 1 : Math.max(1, prev - 1)));
    };

    // Handle color selection
    const toggleColorSelection = (color: string) => {
        setSelectedColor((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
        );
    };

    // Handle size selection
    const toggleSizeSelection = (size: string) => {
        setSelectedSize((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    // Handle adding to cart
    const handleAddToCart = useCallback(() => {
        if (selectedColor.length === 0 || selectedSize.length === 0) {
            toast({
                title: "Please select color and size",
                description: "Both color and size must be selected before adding to cart.",
                variant: "destructive",
            });
            return;
        }

        const itemToAdd = {
            id: product.id,
            name: product.name,
            discount: product.discount,
            price: product.price,
            image: product.images[0],
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
        };

        try {
            addToCart(itemToAdd);
            toast({
                title: "Added to cart",
                description: `${quantity} ${product.name} added to your cart.`,
            });
        } catch (error) {
            toast({
                title: "Error adding to cart",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
    }, [selectedColor, selectedSize, quantity, product, addToCart, toast]);

    return (
        <div className="w-full mt-6 flex flex-col justify-center items-center">
            {/* Breadcrumb */}
            <Breadcrumb className="mx-[16px] md:mx-[100px] w-[81.25vw]">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Shop</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{product.tags[0]}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Product Detail */}
            <div className="flex flex-col lg:flex-row items-center justify-center px-[16px] gap-[12px] md:gap-[14px] mt-[20px] md:mt-[36px]">
                {/* Product Images */}
                <div className="flex flex-col-reverse lg:flex-row gap-[12px] md:gap-[14px]">
                    <div className="flex lg:flex-col gap-[12px] overflow-x-auto lg:overflow-y-auto">
                        {product.images.map((image: string, index: number) => (
                            <button
                                title="button"
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`min-w-[85px] md:min-w-[100px] border-2 ${selectedImage === index ? "border-black" : "border-transparent"
                                    }`}
                            >
                                <Image
                                    src={image || "/placeholder.svg"}
                                    alt={`${product.name} view ${index + 1}`}
                                    width={100}
                                    height={120}
                                    className="w-full h-[85px] md:h-[120px] object-cover"
                                />
                            </button>
                        ))}
                    </div>
                    <Image
                        src={product.images[selectedImage] || "/placeholder.svg"}
                        alt={product.name}
                        width={500}
                        height={600}
                        className="w-full md:w-[444px] h-[290px] md:h-[530px] object-cover"
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-[40px] mt-5 md:mt-0 md:ml-[40px]">
                    <h1 className="font-bold text-[24px] md:text-[40px]">{product.name}</h1>
                    <div className="flex flex-row items-center gap-[7.1px] w-[290px] h-[21px] text-[20px]">
                        {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
                            >
                                ★
                            </span>
                        ))}
                        <p className="font-normal text-[14px] leading-[21px] ml-4">
                            {product.rating}/<span className="text-muted-foreground">5</span>
                        </p>
                    </div>
                    <p className="text-[32px] font-bold">
                        ${product.price}{" "}
                        {product.originalPrice !== product.price && (
                            <span className="line-through text-muted-foreground">${product.originalPrice}</span>
                        )}
                    </p>

                    {/* Colors */}
                    {product.colors && product.colors.length > 0 && (
                        <div>
                            <p className="text-[16px] font-normal opacity-50">Select Colors</p>
                            <div className="flex gap-2 mt-2">
                                {product.colors.map((color: string) => (
                                    <button
                                        title="button"
                                        key={color}
                                        onClick={() => toggleColorSelection(color)}
                                        className={`w-8 h-8 rounded-full border ${selectedColor.includes(color) ? "border-black" : "border-gray-300"
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div>
                            <p className="text-[16px] font-normal opacity-50">Choose Sizes</p>
                            <div className="flex gap-2 mt-2">
                                {product.sizes.map((size: string) => (
                                    <button
                                        key={size}
                                        onClick={() => toggleSizeSelection(size)}
                                        className={`px-4 py-2 rounded-full ${selectedSize.includes(size) ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex flex-row items-center justify-between py-[14px] px-[20px] w-[110px] md:w-[170px] h-[44px] md:h-[52px] rounded-full bg-[#F0F0F0]">
                            <button
                                title="button"
                                onClick={() => handleQuantityChange("decrement")} className="rounded">
                                <Minus className="w-[20px] md:w-[24px] h-[20px] md:h-[24px]" />
                            </button>
                            <p>{quantity}</p>
                            <button
                                title="button"
                                onClick={() => handleQuantityChange("increment")} className="rounded">
                                <Plus className="w-[20px] md:w-[24px] h-[20px] md:h-[24px]" />
                            </button>
                        </div>
                        <Button className="w-[236px] md:w-[400px] h-[44px] rounded-full text-[14px] md:text-[16px] text-white" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
             {/* Reviews */}
             <div className="w-full md:w-[86.111vw] mt-[80px] flex flex-col justify-center items-center">
                <TabNavigation productId={product.id} />
                {/* heading  */}
                <div className='mt-[49.81px] md:mt-[64px] flex flex-col justify-center items-center px-[16px]'>
                    <h1 className='max-w-[579px] px-[53px] sm:px-0 uppercase font-[700] text-[32px] md:text-[48px] leading-[36px] md:leading-[58px] text-center text-[#000000] mb-[40px] md:mb-[55px]'>
                        You might also like
                    </h1>
                    <div className='w-[95vw] mt-[32px] md:mt-[55px] flex justify-center items-center overflow-x-hidden'>
                        <Card relatedTags={product.tags} />
                    </div>
                </div>
            </div>
        </div>
    );
}
