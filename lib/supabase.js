import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url === 'your_supabase_project_url_here') {
    console.error('Supabase configuration missing:', { url: !!url, key: !!key });
    throw new Error('Supabase configuration is missing. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.')
  }

  console.log('Creating Supabase client with URL:', url);
  return createSupabaseClient(url, key)
}

// Create a default client export for easier usage
export const supabase = createClient();