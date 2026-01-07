import React from "react";

import { OrderManager } from "@/app/(main)/manager/order-manager";
import { prisma } from "@/config/prisma.config";
import { formatPrice } from "@/utils/format";

export async function MainPage() {
  const orders = await prisma.order.findMany({
    include: {
      meals: {
        include: {
          meal: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const meals = await prisma.meal.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const mealsForManager = meals.map((meal) => ({
    id: meal.id,
    name: meal.name,
    price: parseFloat(meal.price.toString()),
  }));

  return (
    <div className='min-h-screen p-12'>
      <header className='flex justify-between items-center mb-6'>
        <h1 className='font-black text-xl'>Orders</h1>
        <OrderManager meals={mealsForManager} />
      </header>

      {orders.length === 0 ? (
        <div className='text-center text-gray-500 py-12'>
          No orders yet. Create your first order!
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {orders.map((order) => {
            const totalPrice = order.meals.reduce((sum, orderMeal) => {
              const mealPrice = parseFloat(orderMeal.meal.price.toString());
              return sum + mealPrice * orderMeal.quantity;
            }, 0);

            return (
              <div key={order.id} className='border rounded-md p-6'>
                <div className='flex justify-between items-start mb-2'>
                  <div>
                    <h2 className='font-bold text-lg'>Order #{order.id}</h2>
                    <p className='text-sm text-gray-600'>
                      {new Date(order.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className='mt-4'>
                  <div className='space-y-2'>
                    {order.meals.map((orderMeal) => {
                      const mealPrice = parseFloat(
                        orderMeal.meal.price.toString()
                      );
                      const itemTotal = mealPrice * orderMeal.quantity;

                      return (
                        <div
                          key={orderMeal.id}
                          className='flex justify-between items-center py-2 border-b'
                        >
                          <div className='flex-1'>
                            <span className='font-medium'>
                              {orderMeal.meal.name}
                            </span>
                            <span className='text-gray-600 ml-2'>
                              x{orderMeal.quantity}
                            </span>
                          </div>
                          <div className='flex gap-4 items-center'>
                            <span className='text-sm text-gray-600'>
                              {formatPrice(mealPrice)} each
                            </span>
                            <span className='font-medium w-24 text-right'>
                              {formatPrice(itemTotal)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className='w-full flex justify-end mt-4'>
                    <div className='text-right'>
                      <p className='text-sm text-gray-600 mb-1'>Total</p>
                      <p className='text-xl font-bold'>
                        {formatPrice(totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
