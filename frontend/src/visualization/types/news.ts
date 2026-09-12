export interface NewsEvent {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  published_at: string;
  time_ago?: string;
  category?: string;
  source?: string;
  url?: string;
  likes_count: number;
  views_count: number;
  is_trending?: boolean;
  trending_rank?: number;
  read_time_mins?: number;
}
