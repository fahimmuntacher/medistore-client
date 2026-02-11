import { CategoryGrid } from "@/components/Home/CategoryGrid";
import { FeaturedMedicines } from "@/components/Home/FeaturedMedicines";
import { HeroSection } from "@/components/Home/HeroSection";
import { Newsletter } from "@/components/Home/Newsletter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center flex-col gap-10">
    <HeroSection></HeroSection>
    <CategoryGrid></CategoryGrid>
    <FeaturedMedicines></FeaturedMedicines>
    <Newsletter></Newsletter>
    </div>
  );
}
