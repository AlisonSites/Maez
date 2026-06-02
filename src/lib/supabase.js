import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ssjtfcxepicguwalbdzh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzanRmY3hlcGljZ3V3YWxiZHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNzI4NTMsImV4cCI6MjA5NTk0ODg1M30.4ZIw-LzvfsrxU-7QE6p0k0HyTFVXmdIrkB0FKi10yS8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
