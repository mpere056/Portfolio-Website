import { createClient } from '@supabase/supabase-js'

export const supa = createClient(
  process.env.NEXT_PUBLIC_SUPA_URL!,
  process.env.NEXT_PUBLIC_SUPA_ANON_KEY!,
  { auth: { persistSession: false } }
)


