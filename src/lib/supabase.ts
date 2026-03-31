import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vukforaoffuwdopuzsku.supabase.co";
const supabaseAnonKey = "sb_publishable_bFW1vpM5F-BLr31aVzfFzg_vZbvupy5";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface RainReading {
  id: number;
  gauge_value: number;
  place: string;
  recorded_at: string;
  created_at: string;
}

export type RainStatus = 'green' | 'yellow' | 'red';

export function classifyRain(mm: number): RainStatus {
  if (mm >= 65) return 'red';
  if (mm >= 30) return 'yellow';
  return 'green';
}
