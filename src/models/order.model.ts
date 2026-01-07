import { MealModel } from "@/models/meal.model";

export type OrderMealModel = {
  id: number;
  quantity: number;
  meal: MealModel;
};

export type OrderModel = {
  id: number;
  createdAt: Date;
  meals: OrderMealModel[];
};
