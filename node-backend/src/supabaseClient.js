const { createClient } = require('@supabase/supabase-js');

const VERCEL_SUPABASE_URL = process.env.VERCEL_SUPABASE_URL;
const VERCEL_ANON_KEY = process.env.VERCEL_ANON_KEY;

const supabase = createClient(VERCEL_SUPABASE_URL, VERCEL_ANON_KEY);

module.exports = supabase;
