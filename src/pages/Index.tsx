import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductGrid } from '@/components/ProductGrid';
import { AdminPanel } from '@/components/AdminPanel';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const { toast } = useToast();
  const {
    products,
    allProducts,
    searchQuery,
    selectedCategory,
    productCounts,
    addProduct,
    trackProductClick,
    setSearchQuery,
    setSelectedCategory,
  } = useProducts();

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  const handleShare = (product: Product) => {
    // Simulate social sharing
    toast({
      title: "Shared!",
      description: `"${product.title}" shared to social media`,
    });
  };

  const handleProductClick = (productId: string) => {
    trackProductClick(productId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onSearch={setSearchQuery}
        totalProducts={allProducts.length}
      />
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        productCounts={productCounts}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {!searchQuery && selectedCategory === 'All' && (
          <section className="text-center mb-12">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ImpulseBuyAddict
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                Discover amazing products that you never knew you needed. From trending gadgets to must-have fashion - feed your impulse buying addiction! 🛍️
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span>✨ Curated Deals</span>
                <span>🚀 Latest Trends</span>
                <span>💝 Limited Offers</span>
                <span>📱 Mobile Optimized</span>
              </div>
            </div>
          </section>
        )}

        {/* Search Results Header */}
        {(searchQuery || selectedCategory !== 'All') && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {searchQuery ? `Search results for "${searchQuery}"` : `${selectedCategory} Products`}
            </h2>
            <p className="text-muted-foreground">
              Found {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid
          products={products}
          onShare={handleShare}
          onProductClick={handleProductClick}
        />

        {/* Admin Panel */}
        <AdminPanel onAddProduct={addProduct} />
      </main>
    </div>
  );
};

export default Index;
