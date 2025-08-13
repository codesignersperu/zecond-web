import Header from "@/components/pages/landing/header";
import Influencers from "@/components/pages/landing/influencers";
import Auction from "@/components/pages/landing/auction";
import Categories from "@/components/pages/landing/categories";
import NewArrivals from "@/components/pages/landing/new-arrivals";
import Luxury from "@/components/pages/landing/luxury";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Influencers />
      <NewArrivals />
      <Categories />
      <Luxury />
      <Auction />
    </main>
  );
}
