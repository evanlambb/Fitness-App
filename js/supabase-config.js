// Supabase Configuration
// Replace these with your actual Supabase project details
const SUPABASE_URL = 'https://bokcvarqpiyfphcudpww.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJva2N2YXJxcGl5ZnBoY3VkcHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTQxNzcsImV4cCI6MjA2ODY3MDE3N30.nZGcCbxgrZKUY96amDst5Yv-ahs9uGGP-SXCrdGVY5k'

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Export for use in other files
window.supabaseClient = supabase

// Optional: Log configuration status (remove in production)
console.log('✅ Supabase configured successfully') 