'use server';
import { generateDogMealPlan } from '@/ai/flows/generate-dog-meal-plan';
import { z } from 'zod';
import { initializeAdminApp } from '@/firebase/admin';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';

const { auth, firestore } = initializeAdminApp();

const MealPlanSchema = z.object({
  dogWeight: z.coerce.number().min(0.5, "Waga musi być większa niż 0.5 kg."),
  dogAge: z.coerce.number().min(0, "Wiek nie może być ujemny."),
  activityLevel: z.enum(['sedentary', 'moderate', 'active'], {
    required_error: "Proszę wybrać poziom aktywności."
  }),
  ingredients: z.string().min(10, "Wpisz co najmniej kilka składników, aby plan był wartościowy."),
});

export type FormState = {
  message: string;
  mealPlan?: string;
  generationsLeft: number;
  errors?: {
    dogWeight?: string[];
    dogAge?: string[];
    activityLevel?: string[];
    ingredients?: string[];
  };
}

const FREE_GENERATIONS_LIMIT = 2;

export async function createMealPlanAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const sessionCookie = cookies().get('__session')?.value;
  if (!sessionCookie) {
    return { ...prevState, message: 'Brak autoryzacji. Proszę się zalogować.' };
  }

  let userId: string;
  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    userId = decodedToken.uid;
  } catch (error) {
    return { ...prevState, message: 'Nieprawidłowa sesja. Zaloguj się ponownie.' };
  }

  const userRef = firestore.collection('users').doc(userId);

  try {
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    const generationsCount = userData?.mealPlanGenerations ?? 0;
    
    let generationsLeft = FREE_GENERATIONS_LIMIT - generationsCount;

    if (generationsLeft <= 0) {
      return {
        ...prevState,
        message: 'Osiągnięto limit darmowych generacji.',
        generationsLeft: 0,
      };
    }

    const validatedFields = MealPlanSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
      return {
        ...prevState,
        message: 'Popraw błędy w formularzu.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const result = await generateDogMealPlan(validatedFields.data);

    await userRef.update({
      mealPlanGenerations: FieldValue.increment(1),
    });
    
    generationsLeft--;

    return {
      message: 'Plan posiłków wygenerowany pomyślnie!',
      mealPlan: result.mealPlan,
      generationsLeft: generationsLeft,
      errors: {},
    };
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return {
      ...prevState,
      message: 'Wystąpił błąd podczas generowania planu. Spróbuj ponownie.',
    };
  }
}
