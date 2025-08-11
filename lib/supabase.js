import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnjeuivflseyixyypirku.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuamV1aXZmbHNleWl4eXBpcmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTAyNjAsImV4cCI6MjA2OTk4NjI2MH0.B45q6oNZ3u8170LB9II1HZATltuBsmQtjXBNWoLqmo4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)