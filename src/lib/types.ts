export type IngredientStatus = 'safe' | 'warning' | 'danger';

export interface Ingredient {
  name: string;
  cat_icon: string;
  icon: string;
  status: IngredientStatus;
  category: string;
  desc: string;
  WARNING?: string;
  portion?: string;
  prep?: string;
  nero: string;
}
