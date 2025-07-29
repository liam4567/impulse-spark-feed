import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onShare?: (product: Product) => void;
  onProductClick?: (productId: string) => void;
}

export const ProductGrid = ({ products, onShare, onProductClick }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your search or category filter</p>
      </div>
    );
  }

  // Separate featured products
  const featuredProducts = products.filter(p => p.isFeatured);
  const regularProducts = products.filter(p => !p.isFeatured);

  return (
    <div className="space-y-8">
      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ⭐ Featured Deals
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onShare={onShare}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Regular Products */}
      {regularProducts.length > 0 && (
        <section>
          {featuredProducts.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold">More Great Finds</h2>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onShare={onShare}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};