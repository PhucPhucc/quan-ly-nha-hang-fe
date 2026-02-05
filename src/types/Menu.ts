export interface MenuItem {
  code: string;
  name: string;
  dine_in_price: number;
  take_away_price?: number;
  description?: string;
  category?: string;
}
