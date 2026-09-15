import { FlashDealsSection } from "@/components/home/flashDeals/FlashDealsSection";
import { HeroSection } from "@/components/home/heroSection/HeroSection";


export default function HomePage() {
  return (
    <div className="w-full flex-1 flex flex-col">
      <HeroSection />
      <FlashDealsSection />
    </div>
  );
}
