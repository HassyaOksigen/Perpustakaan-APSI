import { createClient } from '@supabase/supabase-js';

// Ambil dari Dashboard Supabase -> Project Settings -> API
const supabaseUrl = 'https://cwyeveltjqacltoxlqlw.supabase.co';
const supabaseKey = 'sb_publishable_Gmr9i6Kps0uDlVinEsQd2w_6-IknSx7';

export const supabase = createClient(supabaseUrl, supabaseKey);