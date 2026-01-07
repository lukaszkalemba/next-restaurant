"use server";

import { prisma } from "@/config/prisma.config";
import { revalidatePath } from "next/cache";
import { MealData } from "./create-order.types";

export async function createOrderAction(meals: MealData[]) {
  const order = await prisma.order.create({
    data: {
      meals: {
        create: meals.map((meal) => ({
          mealId: meal.mealId,
          quantity: meal.quantity,
        })),
      },
    },
  });

  revalidatePath("/");

  return order;
}
