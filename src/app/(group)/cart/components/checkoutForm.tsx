"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CardContext";
import { loadStripe } from "@stripe/stripe-js";

const pub_key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripe = loadStripe(pub_key!);

const formSchema = z.object({
  user_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  Contact: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 digits"),
});

type CheckoutFormProps = {
  customerId: string | null;
  onShipmentRateUpdate: (rate: number | null) => void;
};

export default function CheckoutForm({ customerId, onShipmentRateUpdate }: CheckoutFormProps) {
  const [shipmentDetails, setShipmentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { cartItems } = useCart();
  const [rateLoading, setRateLoading] = useState(false);
  const orderId = `order-` + Date.now() + `${customerId}` + Math.random().toString(36).substring(7);



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: "",
      email: "",
      Contact: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });



  // Fetch existing customer details on mount
  useEffect(() => {
    if (customerId) {
      fetch(`/api/customers?id=${customerId}`)
        .then((res) => res.json())
        .then(({ customer }) => {
          if (customer) {
            form.reset({
              user_name: customer.user_name || "",
              email: customer.email || "",
              Contact: customer.Contact || "",
              address: customer.address || "",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching customer details:", error);
          toast({
            title: "Error",
            description: "Failed to fetch customer details. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [customerId, form]);

  async function calculateShipping(values: z.infer<typeof formSchema>) {
    const rateResponse = await fetch("/api/get-rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: {
          name: values.user_name,
          phone: values.Contact,
          street: values.address,
          city: values.city,
          state: values.state,
          postalCode: values.zipCode,
          country: "PK",
        },
        packages: [
          {
            weight: { value: 1, unit: "pound" },
            dimensions: { length: 10, width: 6, height: 4, unit: "inch" },
          },
        ],
      }),
    });

    const rateData = await rateResponse.json();

    if (!rateResponse.ok) {
      throw new Error(rateData.error || "Failed to fetch shipping rates");
    }
    return rateData;
  };

  // Handler to fetch shipping rates when "Get Rate" is clicked
  const handleGetRate = async () => {
    setRateLoading(true);
    try {
      const values = form.getValues();
      const shippingData = await calculateShipping(values);
      setShipmentDetails(shippingData);
      onShipmentRateUpdate(shippingData.rate);
      toast({
        title: "Shipping Rate Fetched",
        description: `Rate: $${shippingData.rate}, Estimated Delivery: ${shippingData.estimatedDelivery}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch shipping rates",
        variant: "destructive",
      });
    } finally {
      setRateLoading(false);
    }
  };


  const handleCheckout = async () => {
    try {
      const stripeUI = await stripe;

      // Send cart items and customer ID to checkout API
      const sessionResponse = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            size: item.size || [],
            quantity: item.quantity,
          })),
          shippingRate: shipmentDetails?.rate,
          customerId: customerId,
          orderId: orderId,
          email: form.getValues("email")
        }),
      });

      if (!sessionResponse.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await sessionResponse.json();

      // Redirect to Stripe Checkout
      if (!stripeUI) {
        throw new Error("Stripe failed to load");
      }
      const { error } = await stripeUI.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };




  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      // Post user details to Sanity 
      await fetch(`/api/customers?id=${customerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: customerId,
          email: values.email,
          name: values.user_name,
          address: `${values.address}, ${values.city}, ${values.state}, ${values.zipCode}`,
          Contact: values.Contact,
        }),
      });

      await PostOrder();

      await handleCheckout();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Checkout failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const PostOrder = async () => {
    const orderPayload = {
      orderId: orderId,
      customerId,
      products: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        color: item.color || [],
        size: item.size || [],
        quantity: item.quantity,
      })),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      console.log("✅ Order placed successfully");
    } catch (error) {
      console.error("❌ Error placing order:", error);
      throw error; // Re-throw the error to stop checkout if order fails
    }
  };




  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
          <CardDescription>Please verify and complete your details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="user_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="Contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="123-456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* get rate button */}
              <Button
                type="button"
                onClick={handleGetRate}
                disabled={rateLoading}
                className="w-full bg-black hover:bg-gray-800 text-white"
              >
                {rateLoading ? "Fetching Rates..." : "Get Rate"}
              </Button>

              {/* checkout button */}
              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={loading}>
                {loading ? "Processing..." : "Complete Checkout"}
              </Button>
            </form>
          </Form>
          {shipmentDetails && (
            <div className="mt-4">
              <p>Shipping Rate: ${shipmentDetails.rate}</p>
              <p>Estimated Delivery: {shipmentDetails.estimatedDelivery}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
