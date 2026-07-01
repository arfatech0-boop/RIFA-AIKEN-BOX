import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://imhkzdksrrvmnfqylpnl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaGt6ZGtzcnJ2bW5mcXlscG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NDk3NjksImV4cCI6MjA5ODQyNTc2OX0.O-oIiQkqWjsXFn258q8ytOE13MwCKGzxUy46Eyjq8pk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Fetching from Supabase...");
  const { data, error } = await supabase.from('raffle_numbers').select('*').order('number');
  
  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log(`Success! Fetched ${data ? data.length : 0} rows.`);
    if (data && data.length > 0) {
      console.log("First row:", data[0]);
    } else {
      console.log("Data is empty array []");
    }
  }
}

test();
