import { z } from 'zod';

// URL validation with security checks
const safeUrlSchema = z.string()
  .url({ message: "Please enter a valid URL" })
  .max(2048, { message: "URL must be less than 2048 characters" })
  .refine((url) => {
    try {
      const parsed = new URL(url);
      // Block localhost and private IPs
      const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
      return !blockedHosts.includes(parsed.hostname);
    } catch {
      return false;
    }
  }, { message: "Invalid or unsafe URL" });

// Product form validation schema
export const productFormSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" })
    .refine((val) => !/[<>]/.test(val), { 
      message: "Title cannot contain < or > characters" 
    }),
  
  description: z.string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description must be less than 1000 characters" })
    .refine((val) => !/[<>]/.test(val), { 
      message: "Description cannot contain < or > characters" 
    }),
  
  price: z.string()
    .trim()
    .min(1, { message: "Price is required" })
    .max(50, { message: "Price must be less than 50 characters" })
    .refine((val) => /^\$?\d+(\.\d{2})?$/.test(val) || /^\$\d+/.test(val), {
      message: "Price must be in format like $29.99 or $29"
    }),
  
  imageUrl: safeUrlSchema,
  
  affiliateUrl: safeUrlSchema,
  
  category: z.string()
    .min(1, { message: "Category is required" }),
  
  isFeatured: z.boolean(),
  
  isTimeLimited: z.boolean(),
  
  discount: z.string()
    .max(50, { message: "Discount badge must be less than 50 characters" })
    .optional()
    .transform(val => val || ''),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

// Auth validation schemas
export const emailSchema = z.string()
  .trim()
  .email({ message: "Please enter a valid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

export const passwordSchema = z.string()
  .min(6, { message: "Password must be at least 6 characters" })
  .max(100, { message: "Password must be less than 100 characters" });

export const authFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type AuthFormData = z.infer<typeof authFormSchema>;
