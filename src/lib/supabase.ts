import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          title: string
          description: string
          price: string
          image_url: string
          affiliate_url: string
          category: string
          is_featured: boolean
          is_time_limited: boolean
          discount: string | null
          clicks: number
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: string
          image_url: string
          affiliate_url: string
          category: string
          is_featured?: boolean
          is_time_limited?: boolean
          discount?: string | null
          clicks?: number
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: string
          image_url?: string
          affiliate_url?: string
          category?: string
          is_featured?: boolean
          is_time_limited?: boolean
          discount?: string | null
          clicks?: number
          created_at?: string
          created_by?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_admin?: boolean
          created_at?: string
        }
      }
    }
  }
}