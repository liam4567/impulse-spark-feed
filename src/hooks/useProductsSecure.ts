import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { ProductFormData } from '@/lib/validations';
import { useToast } from '@/hooks/use-toast';

export const useProductsSecure = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toast } = useToast();

  // Load products from database
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProducts: Product[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        imageUrl: item.image_url,
        affiliateUrl: item.affiliate_url,
        category: item.category,
        isFeatured: item.is_featured,
        isTimeLimited: item.is_time_limited,
        discount: item.discount || undefined,
        clicks: item.clicks,
        createdAt: new Date(item.created_at),
      }));

      setProducts(formattedProducts);
    } catch (error: any) {
      console.error('Error loading products:', error);
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productForm: ProductFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add products",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('products')
        .insert({
          title: productForm.title,
          description: productForm.description,
          price: productForm.price,
          image_url: productForm.imageUrl,
          affiliate_url: productForm.affiliateUrl,
          category: productForm.category,
          is_featured: productForm.isFeatured,
          is_time_limited: productForm.isTimeLimited,
          discount: productForm.discount || null,
          created_by: user.id,
        });

      if (error) throw error;

      toast({
        title: "Product added!",
        description: "Your product has been added successfully",
      });

      // Reload products
      await loadProducts();
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: "Error adding product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const trackProductClick = async (productId: string) => {
    try {
      await supabase.rpc('increment_product_clicks', {
        product_id: productId
      });

      // Update local state optimistically
      setProducts(prev =>
        prev.map(product =>
          product.id === productId
            ? { ...product, clicks: (product.clicks || 0) + 1 }
            : product
        )
      );
    } catch (error) {
      console.error('Error tracking click:', error);
    }
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
    loading,
    searchQuery,
    selectedCategory,
    productCounts,
    addProduct,
    trackProductClick,
    setSearchQuery,
    setSelectedCategory,
  };
};
