import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

// POST: Add a new order
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, products, status, orderId } = body;

    // Validate required fields
    if (!customerId || !products || !status || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, products, or status' },
        { status: 400 }
      );
    }

    // Create the order object
    const newOrder = {
      _type: 'order',
      orderId,
      customerId,
      products,
      status,
      createdAt: new Date().toISOString(),
    };

    // Add the order to Sanity
    const result = await client.create(newOrder);

    // Return success response
    return NextResponse.json(
      { message: 'Order created successfully', order: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update order status by orderId
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { status } = body;
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');  // This is your custom orderId field

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing order_id or status' }, { status: 400 });
    }

    // First, fetch the document by the custom orderId field
    const orderDocs = await client.fetch(
      `*[_type == "order" && orderId == $orderId][0]._id`,
      { orderId }
    );

    if (!orderDocs) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Now, update the document using its actual _id
    const updatedOrder = await client.patch(orderDocs).set({ status }).commit();
    return NextResponse.json({ message: 'Order updated successfully', order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



// GET: Fetch order details either by orderId or by customerId
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');

    // If order_id is provided, fetch that single order
    if (orderId) {
      const order = await client.fetch(
        `*[_type == "order" && orderId == $orderId][0] {
          orderId,
          customerId,
          products[] {
            id,
            name,
            price,
            image,
            color[],
            size[],
            quantity
          },
          status,
          createdAt
        }`,
        { orderId }
      );
      return NextResponse.json(order, { status: 200 });
    }

    // Otherwise, require customerId to fetch all orders for that customer
    const customerId = searchParams.get('customerId');
    if (!customerId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: customerId' },
        { status: 400 }
      );
    }

    const orders = await client.fetch(
      `*[_type == "order" && customerId == $customerId] | order(createdAt desc) {
        orderId,
        customerId,
        products[] {
          id,
          name,
          price,
          image,
          color[],
          size[],
          quantity
        },
        status,
        createdAt
      }`,
      { customerId }
    );
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
