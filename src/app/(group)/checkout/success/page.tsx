"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CardContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const session_id = searchParams.get("session_id");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderUpdated, setOrderUpdated] = useState<boolean>(false);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (session_id && !requestSent) {
      setRequestSent(true); // Mark request as sent immediately

      // Show a success toast immediately
      toast({ title: "Payment Successful!", description: "Your order has been placed" });

      // Fetch the checkout session details from your API
      fetch(`/api/checkout?session_id=${session_id}`)
        .then((res) => res.json())
        .then((data) => {
          const fetchedOrderId = data?.metadata?.orderId;
          if (!fetchedOrderId) {
            console.warn("❌ Order ID not found in session metadata.");
            return;
          }
          setOrderId(fetchedOrderId);

          // Update the order status to "Paid"
          return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders?order_id=${fetchedOrderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Paid" }),
          });
        })
        .then((res) => {
          if (!res) return;
          if (!res.ok) {
            return res.text().then((errorBody) => {
              throw new Error(`Failed to update order: ${errorBody}`);
            });
          }
          return res.json();
        })
        .then((orderData) => {
          if (orderData) {
            console.log("✅ Order updated successfully:", orderData);
            setOrderUpdated(true);
            clearCart();
          }
        })
        .catch((error) => {
          console.error("❌ Error updating order status:", error);
          toast({ title: "Error", description: error.message, variant: "destructive" });
        });
    }
  }, [session_id, requestSent, clearCart]);

  if (orderUpdated) {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col gap-6 justify-center items-center container mx-auto py-12">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>

        {/* Loading Text */}
        <h1 className="text-3xl font-bold">Loading...</h1>
        <p>Processing your order</p>
      </div>
    );
  }


  return (
    <div className="w-full h-screen flex flex-col gap-6 justify-center items-center container mx-auto py-12">
      <h1 className="text-3xl font-bold">Order Confirmed</h1>
      <p>Thank you for your purchase!</p>
      {orderId !== "Loading..."  && (
        <p>Your Order ID: {orderId}</p>
      )}
      {orderUpdated && <p>Successfully Paid</p>}
      <Button>
        <Link href="/dashboard" className="flex items-center gap-2">
          Continue To Dashboard <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}


const LoadingSpinner = () => {

  return (
    <div className="w-full h-screen flex flex-col gap-6 justify-center items-center container mx-auto py-12">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>

      {/* Loading Text */}
      <h1 className="text-3xl font-bold">Loading...</h1>
      <p>Processing your order</p>
    </div>
  );
}


export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuccessPage />
    </Suspense>
  );
}