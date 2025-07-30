import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import { ProductFormData } from '@/lib/validations'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'

export const useProductsSecure = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { toast } = useToast()
  const { user } = useAuth()

  // Load products from Supabase
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading products:', error)
        toast({
          title: "Error",
          description: "Failed to load products.",
          variant: "destructive",
        })
        return
      }

      // Transform database format to frontend format
      const transformedProducts: Product[] = (data || []).map(item => ({
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
      }))

      setProducts(transformedProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (productData: ProductFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to add products.",
        variant: "destructive",
      })
      return false
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            title: productData.title,
            description: productData.description,
            price: productData.price,
            image_url: productData.imageUrl,
            affiliate_url: productData.affiliateUrl,
            category: productData.category,
            is_featured: productData.isFeatured,
            is_time_limited: productData.isTimeLimited,
            discount: productData.discount || null,
            created_by: user.id,
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error adding product:', error)
        toast({
          title: "Error",
          description: "Failed to add product.",
          variant: "destructive",
        })
        return false
      }

      // Add to local state
      const newProduct: Product = {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        imageUrl: data.image_url,
        affiliateUrl: data.affiliate_url,
        category: data.category,
        isFeatured: data.is_featured,
        isTimeLimited: data.is_time_limited,
        discount: data.discount || undefined,
        clicks: data.clicks,
        createdAt: new Date(data.created_at),
      }

      setProducts(prev => [newProduct, ...prev])

      toast({
        title: "Success!",
        description: "Product added successfully.",
      })

      return true
    } catch (error) {
      console.error('Error adding product:', error)
      toast({
        title: "Error",
        description: "Failed to add product.",
        variant: "destructive",
      })
      return false
    }
  }

  const trackProductClick = async (productId: string) => {
    try {
      const { error } = await supabase.rpc('increment_product_clicks', {
        product_id: productId
      })

      if (error) {
        console.error('Error tracking click:', error)
        return
      }

      // Update local state
      setProducts(prev =>
        prev.map(product =>
          product.id === productId
            ? { ...product, clicks: (product.clicks || 0) + 1 }
            : product
        )
      )
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        product =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Sort: featured first, then by creation date
    return filtered.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1
      if (!a.isFeatured && b.isFeatured) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [products, searchQuery, selectedCategory])

  // Calculate product counts by category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length }
    
    products.forEach(product => {
      counts[product.category] = (counts[product.category] || 0) + 1
    })
    
    return counts
  }, [products])

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
    refreshProducts: loadProducts,
  }
}