const { createClient } = require('@supabase/supabase-js');

// Direkt hartcodierte Werte verwenden
const supabaseUrl = 'https://pcksxutihtxpxwgdmzxc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBja3N4dXRpaHR4cHh3Z2RtenhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjIyODgsImV4cCI6MjA2MDIzODI4OH0.8N7lUYyhKV81YKl00EuGO2MErVCrDW64_fjq4ozKoUg';

console.log('Supabase URL:', supabaseUrl); // Debug-Ausgabe

// Create client directly
try {
  const supabase = createClient(supabaseUrl, supabaseKey);
  module.exports = supabase;
} catch (error) {
  console.error(`Error creating Supabase client:`, error);
  console.error('Please check your credentials.');
  process.exit(1);
} 