"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import Cart from "./components/ProductCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CardContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import CheckoutForm from "./components/checkoutForm";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useUser } from "@/contexts/UserContext";
import { useCallback } from "react";

function Page() {
  const { cartItems } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number | null >(null); 
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const { customerId, setCustomerId } = useUser();
  const { user } = useClerkUser();

  useEffect(() => {
    if (user) {
      setCustomerId(user.id); 
    } else {
      setCustomerId(null); 
    }
  }, [user]);

  const DISCOUNT_RATE = cartItems.reduce((total, item) => total + item.discount, 0);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = DISCOUNT_RATE;
  const total = subtotal + (deliveryFee || 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const handleShipmentRate = useCallback((rate: number | null) => {
    if (rate === null) {
      setDeliveryFee(null);
    } else {
      setDeliveryFee(rate);
    }
  }, []);

  const handleCheckout = async () => {
    setLoading(true);

    // Check if user details exist in Sanity
    const response = await fetch(`/api/customers?id=${customerId}`, { method: "GET" });
    const { customer } = await response.json();

    if (!customer || !customer.Contact || !customer.address) {
      setShowCheckoutForm(true);
      toast({
        title: "Incomplete Details",
        description: "Please fill in your details to proceed to checkout.",
        variant: "destructive",
      });
      setLoading(false);

      // Scroll to the Checkout Form section
      document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Scroll to the Checkout Form section
    setShowCheckoutForm(true);
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
    setLoading(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-[24px] md:text-[32px] font-bold">Your cart is empty!</h1>
        <Link href="/" className="mt-4">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-[24px] w-full justify-center items-center gap-[24px]">
      <Breadcrumb className="mx-[16px] md:mx-[100px] w-[81.25vw]">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="text-gray-500" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Cart</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="font-bold text-[32px] md:text-[40px] uppercase w-full px-[16px] md:px-[100px]">
        Your cart
      </h1>

      <div className="flex flex-col lg:flex-row justify-center items-start gap-[20px] w-full px-[16px]">
        {/* Cart Section */}
        <div className="flex flex-col items-start justify-center gap-[16px] md:gap-[24px] border-[1px] rounded-[20px] min-w-[300px] w-full lg:w-[50%] p-[16px]">
          {cartItems.map((item) => (
            <Cart key={`${item.id}-${item.color}-${item.size}`} item={item} />
          ))}
        </div>

        {/* Order Summary Section */}
        <div className="box-border flex flex-col items-start gap-[16px] md:gap-[24px] border-[1px] rounded-[20px] min-w-[300px] w-full lg:w-[35%] p-[16px]">
          <h1 className="font-bold text-[20px] md:text-[24px]">Order Summary</h1>

          <div className="flex flex-col gap-[16px] md:gap-[20px] w-full">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>{formatCurrency(subtotal)}</p>
            </div>
            <div className="flex justify-between">
              <p>Discount</p>
              <p className="text-[#FF3333]">-{(discount)}%</p>
            </div>
            <div className="flex justify-between">
              <p>Delivery Fee</p>
              <p>{deliveryFee === null ? "Not Set" : formatCurrency(deliveryFee)}</p>
            </div>
            <hr />
            <div className="flex justify-between">
              <p>Total</p>
              <p className="font-bold">{formatCurrency(total)}</p>
            </div>
          </div>

          <Button onClick={handleCheckout} disabled={loading}>
            {loading ? "Processing..." : "Go to Checkout"}
            <ArrowRight />
          </Button>
        </div>
      </div>

      {showCheckoutForm && (
        <div id="checkout" className="mt-8 w-full px-[16px] md:px-[100px]">
          <CheckoutForm customerId={customerId} onShipmentRateUpdate={handleShipmentRate}/>
        </div>
      )}
    </div>
  );
}

export default Page;
