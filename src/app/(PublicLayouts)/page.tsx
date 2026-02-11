import { CategoryGrid } from "@/components/Home/CategoryGrid";
import { HeroSection } from "@/components/Home/HeroSection";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center flex-col gap-10">
    <HeroSection></HeroSection>
    <CategoryGrid></CategoryGrid>
    </div>
  );
}
