'use server';
import { generateDogMealPlan } from '@/ai/flows/generate-dog-meal-plan';
import { translateText } from '@/ai/flows/translate-text';
import { z } from 'zod';

const MealPlanSchema = z.object({
  dogWeight: z.coerce.number().min(1, "Waga musi być większa niż 0."),
  dogAge: z.coerce.number().min(0, "Wiek nie może być ujemny."),
  activityLevel: z.enum(['sedentary', 'moderate', 'active']),
  ingredients: z.string().min(10, "Wpisz co najmniej kilka składników."),
});

export type FormState = {
  message: string;
  mealPlan?: string;
  errors?: {
    dogWeight?: string[];
    dogAge?: string[];
    activityLevel?: string[];
    ingredients?: string[];
  };
}

export async function createMealPlanAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = MealPlanSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Popraw błędy w formularzu.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateDogMealPlan(validatedFields.data);
    const translationResult = await translateText({
        text: result.mealPlan,
        targetLanguage: 'Polish'
    });

    return {
      message: 'Plan posiłków wygenerowany pomyślnie!',
      mealPlan: translationResult.translatedText,
    };
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return {
      message: 'Wystąpił błąd podczas generowania planu. Spróbuj ponownie.',
    };
  }
}
