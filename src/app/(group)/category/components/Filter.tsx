'use client'

import React, { useState } from 'react'
import { ChevronRight, ChevronUp } from 'lucide-react'
import PriceRangeSlider from './Slider'
import ColorSelector from './ColorSelector'
import { Button } from '@/components/ui/button'

interface Filters {
    category: string;
    priceRange: number[];
    colors: string[];
    size: string[];
    dressStyle: string;
}

interface FilterProps {
    onFilterChange: (filters: Partial<Filters>) => void;
    isMobile?: boolean;
}

function Filter({ onFilterChange, isMobile = false }: FilterProps) {
    const initialFilters: Filters = {
        category: '',
        priceRange: [0, Infinity],
        colors: [],
        size: [],
        dressStyle: '',
      };
    
      const [filters, setFilters] = useState<Filters>(initialFilters);

    const updateFilters = (newFilters: Partial<Filters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters); // Pass the entire updated state to the parent
    };

    const handleCategoryChange = (category: string) => {
        updateFilters({ category, dressStyle: '' });
    };

    const handleDressStyleChange = (dressStyle: string) => {
        updateFilters({ dressStyle, category: '' }); 
    };

    const handlePriceChange = (priceRange: number[]) => {
        updateFilters({ priceRange });
    };

    const handleColorChange = (color: string) => {
        const updatedColors = filters.colors.includes(color)
            ? filters.colors.filter(c => c !== color)
            : [...filters.colors, color];
        updateFilters({ colors: updatedColors });
    };

    const handleSizeChange = (size: string) => {
        const updatedSizes = filters.size.includes(size)
            ? filters.size.filter(s => s !== size)
            : [...filters.size, size];
        updateFilters({ size: updatedSizes });
    };

    const resetFilters = () => {
        const resetState = initialFilters; // Define the reset state
        setFilters(resetState); // Reset local state
        applyFilters(resetState); // Apply the reset state
      };
      
      const applyFilters = (currentFilters = filters) => {
        onFilterChange(currentFilters); // Notify the parent with the current filters
      };
      

    return (
        <div className={`box-border flex flex-col items-start px-[24px] py-[20px] gap-[24px] w-[295px] min-h-[1220px] border-[1px] border-[rgba(0,0,0,0.1)] rounded-[20px] ${isMobile ? '' : 'hidden md:flex'}`}>
            <div className='box-border flex flex-row justify-between items-center p-0 gap-[20px] w-[247px] h-[27px]'>
                <h1 className='text-[20px] font-bold'>
                    Filter
                </h1>
            </div>
            <hr className='w-full' />
            <ul className='flex flex-col items-start p-0 gap-[20px] w-[247px] text-black/60'>
                {['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'].map((category) => (
                    <li key={category} className='flex justify-between w-full cursor-pointer' onClick={() => handleCategoryChange(category)}>
                        <p className={filters.category === category ? 'font-bold text-black' : ''}>{category}</p>
                        <ChevronRight />
                    </li>
                ))}
            </ul>
            <hr className='w-full' />
            <div className='flex flex-col items-start p-0 gap-[20px] w-[247px] h-[90px]'>
                <div className='flex flex-row justify-between items-center p-0 gap-[20px] w-[247px] h-[27px] text-[20px] font-bold'>
                    <h1>
                        Price
                    </h1>
                    <ChevronUp />
                </div>
                <PriceRangeSlider range={filters.priceRange} onChange={handlePriceChange} />
            </div>
            <hr className='w-full' />
            <div className='flex flex-col items-start p-0 gap-[20px] w-[247px] h-[137px]'>
                <div className='flex flex-row justify-between items-center p-0 gap-[20px] w-[247px] h-[27px] text-[20px] font-bold'>
                    <h1>
                        Colors
                    </h1>
                    <ChevronUp />
                </div>
                <ColorSelector selectedColors={filters.colors} setSelectedColor={handleColorChange} />
            </div>
            <hr className='w-full' />
            <div className='flex flex-col items-start p-0 gap-[20px] w-[247px] h-[274px]'>
                <div className='flex flex-row justify-between items-center p-0 gap-[20px] w-[247px] h-[27px] text-[20px] font-bold'>
                    <h1>
                        Size
                    </h1>
                    <ChevronUp />
                </div>
                <div className='flex flex-row flex-wrap items-start content-start p-0 gap-[8px] w-[247px] h-[227px]'>
                    {['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'].map((size) => (
                        <Button
                            key={size}
                            className={`px-[20px] py-[10px] rounded-full ${filters.size.includes(size) ? 'bg-[#111111] text-white' : 'bg-[#F0F0F0] text-black/60'} text-[14px]`}
                            onClick={() => handleSizeChange(size)}
                        >
                            {size}
                        </Button>
                    ))}
                </div>
            </div>
            <hr className='w-full' />
            <div className='flex flex-col items-start p-0 gap-[20px] w-[247px]'>
                <div className='flex flex-row justify-between items-center p-0 gap-[20px] w-[247px] h-[27px] text-[20px] font-bold'>
                    <h1>
                        Dress Style
                    </h1>
                    <ChevronUp />
                </div>
                <ul className='flex flex-col items-start p-0 gap-[20px] w-[247px] text-black/60'>
                    {['Casual', 'Formal', 'Party', 'Gym'].map((style) => (
                        <li key={style} className='flex justify-between w-full cursor-pointer' onClick={() => handleDressStyleChange(style)}>
                            <p className={filters.dressStyle === style ? 'font-bold text-black' : ''}>{style}</p>
                            <ChevronRight />
                        </li>
                    ))}
                </ul>
            </div>
            <Button className='w-[247px] h-[48px] text-[14px] font-medium rounded-full' onClick={() => applyFilters()}>
                Apply Filter
            </Button>
            <Button className='w-[247px] h-[48px] text-[14px] font-medium rounded-full' onClick={resetFilters}>
                Reset Filter
            </Button>
        </div>
    );
}

export default Filter;
