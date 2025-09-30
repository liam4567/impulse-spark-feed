import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://lrqbjhidknuzdjmqkmef.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycWJqaGlka251emRqbXFrbWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NzYyMjQsImV4cCI6MjA1MTE1MjIyNH0.0Sd0IZkN-j2-5PY5sVvZ1n1wbQCHO88jQNO8zZMxlsM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
