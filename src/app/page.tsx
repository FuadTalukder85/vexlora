import { FlashDealsSection } from "@/components/home/flashDeals/FlashDealsSection";
import { HeroSection } from "@/components/home/HeroSection";


export default function HomePage() {
  return (
    <div className="w-full flex-1 flex flex-col">
      {/* 1st Section: Hero Showcase & Category Sidebar Grid */}
      <HeroSection />

      {/* 2nd Section: Flash Deals / Today's Hot Deals Row with Countdown Timer */}
      <FlashDealsSection />
    </div>
  );
}
