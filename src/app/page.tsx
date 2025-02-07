import Browse from "@/components/Browse/Browse";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero/Hero";
import NewArrival from "@/components/product/NewArrival/NewArrival";
import TopSelling from "@/components/product/TopSelling/TopSelling";
import Reviews from "@/components/Reviews/Reviews";

export default function Home() {
  return (
    <div>
        <Header />
        <Hero />
        <NewArrival />
        <TopSelling />
        <Browse />
        <Reviews />
        <Footer />
    </div>
  );
}
