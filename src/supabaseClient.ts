import { createClient } from "@supabase/supabase-js";

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || "https://omubicoajncplzzdbjri.supabase.co";
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || "sb_publishable_7_n8wUOQfpzHAy9cKe5roQ_qfLAlyVn";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

