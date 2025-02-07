import React from "react";
import Image from "next/image";
import Link from 'next/link';

interface BrowseCardProps {
    title: string;
    imgSrc: string;
    link: string;
    customWidth?: string;
}

const BrowseCard: React.FC<BrowseCardProps> = ({ title, imgSrc, customWidth, link }) => (
    <div
        className={`relative flex flex-col ${
            customWidth ? `w-[${customWidth}]` : "w-full"
        } max-md:w-full h-[190px] md:h-[289px] rounded-3xl`}
    >
        <h1 className="absolute left-[24px] md:left-[36px] top-[16px] md:top-[25px] font-bold text-[24px] md:text-[36px] leading-[49px] flex items-center text-[#000000]">
            {title}
        </h1>
        <Link href={link || '' } className="w-full h-full">
        <Image
            src={imgSrc}
            alt={`${title} image`}
            width={200}
            height={200}
            className="object-cover grow rounded-3xl w-full h-full"
        />
        </Link>
    </div>
);

export default function Browse() {
    const cardData = [
        { title: "Casual", imgSrc: "/Browse/img1.png", width: "37%", link: '/category?search=Casual' },
        { title: "Formal", imgSrc: "/Browse/img2.png", width: "63%", link: '/category?search=Formal' },
        { title: "Party", imgSrc: "/Browse/img3.png", width: "63%", link: '/category?search=Party' },
        { title: "Gym", imgSrc: "/Browse/img4.png", width: "37%", link: '/category?search=Gym' },
    ];

    return (
        <div className="flex justify-center items-center px-[16px] md:mt-[80px]">
            <div className="flex overflow-hidden flex-col px-[24px] pt-[40px] w-full bg-zinc-100 max-w-[1239px] rounded-[40px] max-md:px-5 max-md:mt-10 max-md:max-w-full">
                <h1 className="self-center text-5xl font-bold text-center text-black max-md:max-w-full max-md:text-4xl">
                    BROWSE BY DRESS STYLE
                </h1>
                <div className="mt-7 max-md:mt-10 max-md:max-w-full">
                    {/* First Row */}
                    <div className="flex gap-4 md:gap-5 max-md:flex-col">
                        <BrowseCard
                            title={cardData[0].title}
                            link={cardData[0].link}
                            imgSrc={cardData[0].imgSrc}
                            customWidth={cardData[0].width}
                        />
                        <BrowseCard
                            title={cardData[1].title}
                            link={cardData[1].link}
                            imgSrc={cardData[1].imgSrc}
                            customWidth={cardData[1].width}
                        />
                    </div>
                </div>
                <div className="mt-4 md:mt-5 max-md:max-w-full mb-[37px] md:mb-[76px]">
                    {/* Second Row */}
                    <div className="flex gap-4 md:gap-5 max-md:flex-col">
                        <BrowseCard
                            title={cardData[2].title}
                            link={cardData[2].link}
                            imgSrc={cardData[2].imgSrc}
                            customWidth={cardData[2].width}
                        />
                        <BrowseCard
                            title={cardData[3].title}
                            link={cardData[3].link}
                            imgSrc={cardData[3].imgSrc}
                            customWidth={cardData[3].width}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
