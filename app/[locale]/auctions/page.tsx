import FeaturedAuctionsSlider from "@/components/pages/auctions/featured-slider";
import Auction from "@/components/pages/auctions/auction";

export default function AuctionsPage() {
  return (
    <main>
      <FeaturedAuctionsSlider />
      {/* Add other sections of the auctions page here */}
      <Auction />
    </main>
  );
}
