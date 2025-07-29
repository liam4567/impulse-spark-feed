import { useState, useEffect, useMemo } from 'react';
import { Product, ProductForm } from '@/types/product';

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium sound quality with active noise cancellation. Perfect for work, travel, and music lovers.',
    price: '$199.99',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    affiliateUrl: 'https://example.com/headphones',
    category: 'Tech',
    isFeatured: true,
    discount: '20% OFF',
    clicks: 0,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Smart Fitness Watch',
    description: 'Track your health, workouts, and stay connected. Water-resistant with 7-day battery life.',
    price: '$249.99',
    imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop',
    affiliateUrl: 'https://example.com/smartwatch',
    category: 'Tech',
    isTimeLimited: true,
    clicks: 0,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Cozy Oversized Hoodie',
    description: 'Ultra-soft, warm, and stylish. Perfect for lounging or casual outings. Available in multiple colors.',
    price: '$49.99',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop',
    affiliateUrl: 'https://example.com/hoodie',
    category: 'Fashion',
    clicks: 0,
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'Portable Coffee Maker',
    description: 'Brew perfect coffee anywhere. Compact, lightweight, and works with ground coffee or pods.',
    price: '$89.99',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    affiliateUrl: 'https://example.com/coffee-maker',
    category: 'Gadgets',
    isFeatured: true,
    discount: '15% OFF',
    clicks: 0,
    createdAt: new Date(),
  },
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('impulse-products');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        setProducts(parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
        })));
      } catch (error) {
        console.error('Failed to parse saved products:', error);
        setProducts(SAMPLE_PRODUCTS);
      }
    } else {
      setProducts(SAMPLE_PRODUCTS);
    }
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('impulse-products', JSON.stringify(products));
  }, [products]);

  const addProduct = (productForm: ProductForm) => {
    const newProduct: Product = {
      ...productForm,
      id: Date.now().toString(),
      clicks: 0,
      createdAt: new Date(),
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const trackProductClick = (productId: string) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, clicks: (product.clicks || 0) + 1 }
          : product
      )
    );
  };

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Sort: featured first, then by creation date
    return filtered.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [products, searchQuery, selectedCategory]);

  // Calculate product counts by category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(product => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  return {
    products: filteredProducts,
    allProducts: products,
    searchQuery,
    selectedCategory,
    productCounts,
    addProduct,
    trackProductClick,
    setSearchQuery,
    setSelectedCategory,
  };
};