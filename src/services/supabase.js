import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://xfbmcnrjqxwkxshxpxoc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYm1jbnJqcXh3a3hzaHhweG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMTIwOTQsImV4cCI6MjA3Mjg4ODA5NH0.13hmbfTX6WN8et0l1sl4vnPC6XLsBgpSSu1eEmzzXT4";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
