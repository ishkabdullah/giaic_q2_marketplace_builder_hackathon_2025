"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Skeleton from "react-loading-skeleton"; 
import "react-loading-skeleton/dist/skeleton.css"; 

// Review Interface
interface Review {
    id: number;
    name: string;
    rating: number;
    review: string;
}

// Reviews Component
export default function Reviews() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reviewsData, setReviewsData] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true); // Add loading state

    // Fetch reviews data
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch("/api/reviews");
                if (!response.ok) {
                    throw new Error(`Failed to fetch reviews: ${response.status}`);
                }
                const data = await response.json();
                setReviewsData(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false); // Set loading to false after fetch
            }
        };
        fetchReviews();
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : reviewsData.length - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviewsData.length);
    };

    return (
        <div className="flex flex-col justify-center items-center gap-[24px] md:gap-[40px]">
            {/* Header Section */}
            <div className="flex justify-between items-center w-full mt-[50px] md:mt-[80px] px-[16px] md:px-[100px]">
                <h1 className="text-[32px] md:text-[48px] leading-[36px] font-bold">
                    OUR HAPPY CUSTOMERS
                </h1>
                <div className="flex gap-4">
                    {/* Functional Arrow Icons */}
                    <ArrowLeft
                        id="arrow-left"
                        className="cursor-pointer"
                        onClick={handlePrev}
                    />
                    <ArrowRight
                        id="arrow-right"
                        className="cursor-pointer"
                        onClick={handleNext}
                    />
                </div>
            </div>
            {/* Reviews Section */}
            <div className="relative overflow-hidden w-full">
                {loading ? (
                    <LoadingSkeleton /> // Display loading skeletons
                ) : (
                    <ReviewCard currentIndex={currentIndex} reviewsData={reviewsData} />
                )}
            </div>
        </div>
    );
}

// Loading Skeleton Component
function LoadingSkeleton() {
    return (
        <div className="flex transition-transform duration-300 ease-in-out">
            {[...Array(3)].map((_, index) => (
                <div
                    key={index}
                    className="min-w-[33.33%] h-[240px] bg-transparent p-6 rounded-lg border-[1px] border-[rgba(0,0,0,0.1)] mx-[10px]"
                >
                    <Skeleton count={3} height={20} width="80%" />
                    <Skeleton count={1} height={20} width="60%" style={{ marginTop: "10px" }} />
                    <Skeleton count={3} height={20} width="90%" style={{ marginTop: "10px" }} />
                </div>
            ))}
        </div>
    );
}

// ReviewCard Component
function ReviewCard({
    currentIndex,
    reviewsData,
}: {
    currentIndex: number;
    reviewsData: Review[];
}) {
    if (!reviewsData || reviewsData.length === 0) {
        return null;
    }
    return (
        <div className="relative w-full flex overflow-hidden">
            <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                    transform: `translateX(-${currentIndex * 33.33}%)`,
                    width: `${reviewsData.length * 100}%`,
                }}
            >
                {reviewsData.map((review, index) => (
                    <ReviewItem key={index} review={review} />
                ))}
            </div>
        </div>
    );
}

// ReviewItem Component
function ReviewItem({ review }: { review: Review }) {
    return (
        <div className="min-w-[33.33%] h-[240px] bg-transparent p-6 rounded-lg hover:shadow-2xl flex flex-col items-start justify-start border-[1px] border-[rgba(0,0,0,0.1)] mx-[10px]">
            <div className="flex flex-col items-center mb-4">
                {/* Star Rating */}
                <div className="flex items-center text-yellow-400 mr-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i}>&#9733;</span>
                    ))}
                </div>
                {/* Reviewer Name and Icon */}
                <div className="flex items-center gap-[6.25px]">
                    <h3 className="text-[20px] font-bold">{review.name}</h3>
                    <VerifiedIcon />
                </div>
            </div>
            {/* Review Text */}
            <p className="text-gray-600">{review.review}</p>
        </div>
    );
}

// Verified Icon Component
function VerifiedIcon() {
    return (
        <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10 0.829102C8.07164 0.829102 6.18657 1.40093 4.58319 2.47227C2.97982 3.54362 1.73013 5.06636 0.992179 6.84794C0.254225 8.62952 0.061142 10.5899 0.437348 12.4812C0.813554 14.3725 1.74215 16.1098 3.10571 17.4734C4.46928 18.837 6.20656 19.7656 8.09787 20.1418C9.98919 20.518 11.9496 20.3249 13.7312 19.5869C15.5127 18.849 17.0355 17.5993 18.1068 15.9959C19.1782 14.3925 19.75 12.5075 19.75 10.5791C19.7473 7.99408 18.7192 5.51571 16.8913 3.68783C15.0634 1.85994 12.585 0.831831 10 0.829102ZM14.2806 8.85973L9.03063 14.1097C8.96097 14.1795 8.87826 14.2348 8.78721 14.2725C8.69616 14.3103 8.59857 14.3297 8.5 14.3297C8.40144 14.3297 8.30385 14.3103 8.2128 14.2725C8.12175 14.2348 8.03903 14.1795 7.96938 14.1097L5.71938 11.8597C5.57865 11.719 5.49959 11.5281 5.49959 11.3291C5.49959 11.1301 5.57865 10.9392 5.71938 10.7985C5.86011 10.6577 6.05098 10.5787 6.25 10.5787C6.44903 10.5787 6.6399 10.6577 6.78063 10.7985L8.5 12.5188L13.2194 7.79848C13.2891 7.72879 13.3718 7.67352 13.4628 7.63581C13.5539 7.59809 13.6515 7.57868 13.75 7.57868C13.8486 7.57868 13.9461 7.59809 14.0372 7.63581C14.1282 7.67352 14.2109 7.72879 14.2806 7.79848C14.3503 7.86816 14.4056 7.95088 14.4433 8.04193C14.481 8.13297 14.5004 8.23056 14.5004 8.3291C14.5004 8.42765 14.481 8.52523 14.4433 8.61627C14.4056 8.70732 14.3503 8.79004 14.2806 8.85973Z"
                fill="#01AB31"
            />
        </svg>
    );
}