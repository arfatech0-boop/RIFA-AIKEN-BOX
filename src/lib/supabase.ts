import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://imhkzdksrrvmnfqylpnl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaGt6ZGtzcnJ2bW5mcXlscG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NDk3NjksImV4cCI6MjA5ODQyNTc2OX0.O-oIiQkqWjsXFn258q8ytOE13MwCKGzxUy46Eyjq8pk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
