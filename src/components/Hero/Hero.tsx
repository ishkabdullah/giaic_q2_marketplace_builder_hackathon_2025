import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Banner from "./Banner";

function Hero() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center md:justify-between w-full max-w-[1440px] min-h-[663px] bg-[#F2F0F1] overflow-hidden">
        {/* Text Content */}
        <div className="flex flex-col gap-5 md:gap-8 px-4 md:px-0 md:ml-[100px] mt-10 lg:mt-[103px]">
          <h1 className="min-w-[300px] max-w-[577px] text-[36px] lg:text-[64px] font-extrabold tracking-tighter leading-[34px] lg:leading-[64px]">
            FIND CLOTHES THAT MATCH YOUR STYLE
          </h1>
          <p className="min-w-[300px] max-w-[545px] text-[16px] leading-[22px] text-[rgba(0,0,0,0.6)]">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <Button className="w-full md:w-[210px] h-[52px] text-[16px] font-medium rounded-full">
            Shop Now
          </Button>

          {/* Stats for Small Screens */}
          <div className="flex md:hidden flex-col gap-3 justify-center items-center">
            <div className="flex gap-14">
              <StatBlock number="200+" text="International Brands" />
              <Divider />
              <StatBlock number="2,000+" text="High-Quality Products" />
            </div>
            <StatBlock number="30,000+" text="Happy Customers" />
          </div>
        </div>

        {/* Image Section */}
        <Image
          src="/Hero/model.png"
          alt="Models"
          width={500}
          height={500}
          className="relative left-[-15px] sm:static min-w-[600px] lg:w-[650px] min-h-[448px] md:h-[663px]"
        />
      </div>
      <Banner />
    </>
  );
}

/** Divider Component */
const Divider = () => (
  <svg
    width="2"
    height="52"
    viewBox="0 0 2 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="1" y1="0" x2="1" y2="52" stroke="black" strokeOpacity="0.1" />
  </svg>
);

/** Stat Block Component */
interface StatBlockProps {
  number: string;
  text: string;
}

const StatBlock: React.FC<StatBlockProps> = ({ number, text }) => (
  <div className="flex flex-col items-center text-center">
    <h1 className="text-[24px] font-bold">{number}</h1>
    <p className="text-[12px] font-normal leading-[22px] text-[rgba(0,0,0,0.6)]">
      {text}
    </p>
  </div>
);

export default Hero;
