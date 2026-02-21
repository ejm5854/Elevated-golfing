import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = 'https://kfxbkujayqyhdppmujxm.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_dQgPRkSvBCXRGYN7RuzOeg_PUb3Gv76'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
