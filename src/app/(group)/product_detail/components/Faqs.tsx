"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQsProps {
  faqs?: FAQ[]; // Optional prop to override default FAQs
}

const defaultFAQs: FAQ[] = [
  {
    question: "What is the return policy?",
    answer: "You can return the product within 30 days of purchase. Please ensure the product is unused and in its original packaging.",
  },
  {
    question: "What is the warranty on this product?",
    answer: "This product comes with a 1-year warranty covering manufacturing defects.",
  },
  {
    question: "Is this product available in different sizes?",
    answer: "Yes, this product is available in multiple sizes. Please check the size chart for accurate measurements.",
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping usually takes 3-5 business days depending on your location.",
  },
];

const FAQs: React.FC<FAQsProps> = ({ faqs = defaultFAQs }) => {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="w-full px-[16px] mt-6">
      <h2 className="text-[20px] md:text-[24px] font-bold mb-4">Frequently Asked Questions</h2>
      <div className="flex flex-col gap-[10px]">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="w-full border-[1px] border-gray-200 rounded-lg p-4 bg-white shadow-sm"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="font-medium text-[16px] md:text-[18px]">{faq.question}</h3>
              {openFAQIndex === index ? (
                <ChevronUp className="text-gray-500" />
              ) : (
                <ChevronDown className="text-gray-500" />
              )}
            </div>
            {openFAQIndex === index && (
              <p className="text-gray-600 mt-2 text-[14px] md:text-[16px]">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
