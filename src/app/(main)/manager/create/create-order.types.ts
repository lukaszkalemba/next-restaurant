export type MealData = {
  mealId: number;
  quantity: number;
};

export type CreateOrderValue = {
  meals: MealData[];
};
