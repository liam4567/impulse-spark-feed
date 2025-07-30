import { z } from 'zod'

// URL validation with security checks
const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .refine((url) => {
    try {
      const parsed = new URL(url)
      // Allow common image hosts and affiliate networks
      const allowedDomains = [
        'amazon.com', 'amazon.co.uk', 'amazon.ca', 'amazon.de', 'amazon.fr',
        'jumia.com', 'jumia.co.ke', 'jumia.com.ng',
        'kilimall.com', 'kilimall.co.ke',
        'aliexpress.com', 'alibaba.com',
        'unsplash.com', 'pexels.com', 'pixabay.com',
        'imgur.com', 'cloudinary.com',
        'shopify.com', 'woocommerce.com',
        'ebay.com', 'etsy.com'
      ]
      
      const hostname = parsed.hostname.toLowerCase()
      return allowedDomains.some(domain => 
        hostname === domain || hostname.endsWith(`.${domain}`)
      ) || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }, 'URL must be from a trusted domain and use HTTPS')

// Image URL validation
const imageUrlSchema = z
  .string()
  .url('Please enter a valid image URL')
  .refine((url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const lowerUrl = url.toLowerCase()
    return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('unsplash') || 
           lowerUrl.includes('pexels') ||
           lowerUrl.includes('pixabay') ||
           lowerUrl.includes('imgur') ||
           lowerUrl.includes('cloudinary')
  }, 'URL must point to a valid image')

// Product form validation schema
export const productFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  
  price: z
    .string()
    .min(1, 'Price is required')
    .max(20, 'Price must be less than 20 characters')
    .trim(),
  
  imageUrl: imageUrlSchema,
  
  affiliateUrl: urlSchema,
  
  category: z
    .string()
    .min(1, 'Category is required'),
  
  isFeatured: z.boolean(),
  
  isTimeLimited: z.boolean(),
  
  discount: z
    .string()
    .max(20, 'Discount must be less than 20 characters')
    .trim()
    .optional()
})

export type ProductFormData = z.infer<typeof productFormSchema>

// Auth validation schemas
export const signInSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters')
})

export const signUpSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  confirmPassword: z
    .string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type SignInData = z.infer<typeof signInSchema>
export type SignUpData = z.infer<typeof signUpSchema>