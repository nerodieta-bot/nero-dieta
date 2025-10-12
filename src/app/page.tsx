import { HeroSection } from '@/components/hero-section';
import { IngredientGrid } from '@/components/ingredient-grid';
import { ingredients } from '@/app/data/ingredients';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <IngredientGrid ingredients={ingredients} />
    </div>
  );
}
