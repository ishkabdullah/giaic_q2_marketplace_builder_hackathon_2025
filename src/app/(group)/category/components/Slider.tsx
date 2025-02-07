import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

interface PriceRangeSliderProps {
  range: number[];
  onChange: (range: number[]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ range, onChange }) => {
  return (
    <div className='w-full'>
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={range}
        onValueChange={onChange}
        max={1000}
        step={1}
      >
        <SliderPrimitive.Track className="bg-black/10 relative grow rounded-full h-[3px]">
          <SliderPrimitive.Range className="absolute bg-black rounded-full h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block w-5 h-5 bg-black border-2 border-black rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black" />
        <SliderPrimitive.Thumb className="block w-5 h-5 bg-black border-2 border-black rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black" />
      </SliderPrimitive.Root>
      <div className="flex justify-between mt-2">
        <span>${range[0]}</span>
        <span>${range[1]}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;

