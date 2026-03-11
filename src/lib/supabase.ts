import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// TODO: Reemplaza estas URL y Key con las de tu proyecto de Supabase
const supabaseUrl = 'https://arbuskcqldcdmnuemmpu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyYnVza2NxbGRjZG1udWVtbXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxODAyNDMsImV4cCI6MjA4ODc1NjI0M30.SxS8DVM1ty5XpoRipUZF1fYeZFlv66uFrJx8ccjVVAc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
