"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Minus, Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/form/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateOrderValue } from "./create-order.types";
import { MealModel } from "@/models/meal.model";
import { createOrderAction } from "./create-order.actions";

type CreateOrderProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  meals: MealModel[];
};

const schema = z.object({
  meals: z
    .array(
      z.object({
        mealId: z
          .number({ required_error: "Please select a meal" })
          .min(1, "Please select a meal"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "Please add at least one meal"),
});

export function CreateOrder({ open, onOpenChange, meals }: CreateOrderProps) {
  const form = useForm<CreateOrderValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      meals: [{ mealId: 0, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "meals",
  });

  const onSubmit = async (values: CreateOrderValue) => {
    try {
      await createOrderAction(values.meals);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const handleNewMeal = () => {
    append({ mealId: 0, quantity: 1 });
  };

  const handleMealRemove = (index: number) => {
    remove(index);
  };

  const handleQuantityChange = (index: number, delta: number) => {
    const currentQuantity = form.getValues(`meals.${index}.quantity`);
    const newQuantity = Math.max(1, currentQuantity + delta);
    form.setValue(`meals.${index}.quantity`, newQuantity);
  };

  const mealOptions = meals.map((meal) => ({
    label: `${meal.name} - $${meal.price}`,
    value: meal.id.toString(),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='flex flex-col gap-0'>
          <DialogTitle className='text-md'>Create an order</DialogTitle>
          <DialogDescription className='text-xs'>
            Select meals you want to add to your order
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-4'>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className='flex gap-2 items-start border p-4 rounded-md'
                >
                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name={`meals.${index}.mealId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meal</FormLabel>
                          <FormControl>
                            <Select
                              value={
                                field.value > 0 ? field.value.toString() : ""
                              }
                              onValueChange={(value: string) =>
                                field.onChange(parseInt(value))
                              }
                            >
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select a meal' />
                              </SelectTrigger>
                              <SelectContent>
                                {mealOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='w-32'>
                    <FormField
                      control={form.control}
                      name={`meals.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <div className='flex items-center gap-2'>
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={() => handleQuantityChange(index, -1)}
                                disabled={field.value <= 1}
                              >
                                <Minus className='h-4 w-4' />
                              </Button>
                              <div className='flex-1 text-center font-medium'>
                                {field.value}
                              </div>
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={() => handleQuantityChange(index, 1)}
                              >
                                <Plus className='h-4 w-4' />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => handleMealRemove(index)}
                    className='mt-6'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>

            {form.formState.errors.meals?.root && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.meals.root.message}
              </p>
            )}

            <Button
              type='button'
              variant='secondary'
              onClick={handleNewMeal}
              className='w-full'
              size='sm'
            >
              Add another meal
            </Button>

            <div className='flex items-center justify-end gap-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit' variant='default'>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
