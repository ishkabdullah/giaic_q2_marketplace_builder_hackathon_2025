import React from "react";
import Image from "next/image";

const brandLogos = [
  { src: "/Hero/versace.png", alt: "Versace Logo", width: 116.74, height: 23.25, mdWidth: 166.48, mdHeight: 33.16 },
  { src: "/Hero/zara.png", alt: "Zara Logo", width: 63.81, height: 26.65, mdWidth: 91, mdHeight: 38 },
  { src: "/Hero/gucci.png", alt: "Gucci Logo", width: 109.39, height: 25.24, mdWidth: 156, mdHeight: 36 },
  { src: "/Hero/parada.png", alt: "Parada Logo", width: 127, height: 21, mdWidth: 194, mdHeight: 32 },
  { src: "/Hero/calvin.png", alt: "Calvin Klein Logo", width: 134.84, height: 21.75, mdWidth: 206.79, mdHeight: 33.35 },
];

function Banner() {
  return (
    <div id="brand" className="flex flex-wrap justify-center items-center gap-[32px] md:gap-[106px] max-w-[1440px] min-h-[122px] bg-[#000000] py-[40px]">
      {brandLogos.map((logo, index) => (
        <Image
          key={index}
          src={logo.src}
          alt={logo.alt}
          width={100}
          height={100}
          className={`h-[${logo.height}px] md:h-[${logo.mdHeight}px] w-[${logo.width}px] md:w-[${logo.mdWidth}px]`}
        />
      ))}
    </div>
  );
}

export default Banner;
