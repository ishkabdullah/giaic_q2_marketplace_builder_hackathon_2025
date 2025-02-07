import Stripe from "stripe";

const key: any = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(key, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerId, orderId, shippingRate: rawShippingRate, email } = body;

    // Validate cart items
    if (!items || !Array.isArray(items)) {
      return new Response(
        JSON.stringify({ error: "Invalid items data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convert and validate the shipping rate
    const shippingRate = Number(rawShippingRate);
    const includeShipping = !isNaN(shippingRate);

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `Size: ${item.size.join(", ")}`,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Conditionally include shipping options if shipping rate is valid and greater than zero
    const sessionParams: any = {
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL_l}/checkout/success?session_id={CHECKOUT_SESSION_ID}&customerId=${customerId}&orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: email,
      metadata: {
        customerId: customerId || "guest",
        orderId: orderId.toString(),
      },
      line_items: lineItems,
    };

    if (includeShipping) {
      sessionParams.shipping_options = [
        {
          shipping_rate_data: {
            display_name: "Standard Shipping",
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingRate * 100, // Convert to cents
              currency: "usd",
            },
          },
        },
      ];
    }

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}



export async function GET(request: Request) {
  // ✅ Extract session_id from URL query parameters
  const { searchParams } = new URL(request.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return new Response(JSON.stringify({ error: "Missing session_id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // ✅ Fetch session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch session" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
