import { createClient } from "@supabase/supabase-js";

const VITE_VERCEL_SUPABASE_URL = import.meta.env.VITE_VERCEL_SUPABASE_URL;
const VITE_VERCEL_ANON_KEY = import.meta.env.VITE_VERCEL_ANON_KEY;

const supabase = createClient(VITE_VERCEL_SUPABASE_URL, VITE_VERCEL_ANON_KEY);

export { supabase };
