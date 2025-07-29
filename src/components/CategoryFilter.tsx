import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CATEGORIES } from '@/types/product';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  productCounts: Record<string, number>;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange, productCounts }: CategoryFilterProps) => {
  const allCategories = ['All', ...CATEGORIES];

  return (
    <div className="py-4 border-b bg-muted/20">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2">
            {allCategories.map((category) => {
              const isSelected = selectedCategory === category;
              const count = category === 'All' ? 
                Object.values(productCounts).reduce((sum, count) => sum + count, 0) : 
                productCounts[category] || 0;

              return (
                <Button
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    isSelected ? 'bg-gradient-to-r from-primary to-secondary' : ''
                  }`}
                >
                  {category}
                  {count > 0 && (
                    <Badge 
                      variant={isSelected ? "secondary" : "outline"} 
                      className="text-xs px-1.5 py-0.5"
                    >
                      {count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};