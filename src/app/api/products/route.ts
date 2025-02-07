import { fetchProducts, addReviewToProduct } from "./sanityQuery"; // Import the fetch function from sanityQuery.ts
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Fetch all products from Sanity
    const productData = await fetchProducts();

    // Handle "id" parameter
    const id = searchParams.get("id");
    if (id) {
      const productById = productData.find((product: { id: string }) => product.id === id);
      if (productById) {
        return new Response(JSON.stringify(productById), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        });
      } else {
        return new Response(JSON.stringify({ message: "Product not found by ID." }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Handle "slug" parameter
    const slug = searchParams.get("slug");
    console.log(`Received slug: ${slug}`);
    if (slug) {
      const productBySlug = productData.find((product: { slug: string }) => product.slug === slug);
      if (productBySlug) {
        return new Response(JSON.stringify(productBySlug), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        });
      } else {
        return new Response(JSON.stringify({ message: "Product not found by slug." }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Handle "search" parameter
    const search = searchParams.get("search");
    if (search) {
      const sanitizedSearch = search.trim().toLowerCase().replace(/[<>;'"(){}[\]]/g, "");
      const searchResults = productData.filter((product: { name: string }) =>
        product.name.toLowerCase().includes(sanitizedSearch)
      );
      return new Response(JSON.stringify(searchResults), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // Default: Return all products if no parameters are provided
    return new Response(JSON.stringify(productData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error handling request:", error.message, error.stack);
    } else {
      console.error("Error handling request:", error);
    }
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


export async function POST(request: Request) {
  try {
    const { id, rating, name, review } = await request.json();

    if (!id || !rating || !name || !review) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newReview = {
      id: uuidv4(),
      rating,
      name,
      review,
      date: new Date().toISOString().split('T')[0],
        };

    const updatedProduct = await addReviewToProduct(id, newReview);

    if (updatedProduct) {
      return new Response(JSON.stringify(updatedProduct), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error handling request:", error.message, error.stack);
    } else {
      console.error("Error handling request:", error);
    }
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}