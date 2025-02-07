import { notFound } from "next/navigation";
import ProductClient from "../components/ProductDetail";

async function getProduct(slug: string) {
    console.log("Received slug in get:", slug); // Debugging log

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products?slug=${slug}`, { cache: "no-store" });

        if (res.status === 404) {
            console.warn("Product not found.");
            return null; // Product not found
        }

        if (!res.ok) {
            console.error(`Failed to fetch product. Status: ${res.status}, StatusText: ${res.statusText}`);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const slug = params?.slug;

    if (!slug) {
        console.error("Slug is undefined. Cannot fetch product.");
        notFound();
    }

    console.log("Received slug in ProductPage:", slug); // Debugging log
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    return <ProductClient product={product} />;
}
