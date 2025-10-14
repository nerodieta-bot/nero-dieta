'use server';

import { cookies } from 'next/headers';
import { initializeAdminApp } from '@/firebase/admin';
import Stripe from 'stripe';
import { headers } from 'next/headers';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});

type CheckoutResponse = {
    sessionId?: string;
    error?: string;
};

export async function createCheckoutSession(plan: 'monthly' | 'yearly'): Promise<CheckoutResponse> {
    const { auth } = initializeAdminApp();
    const sessionCookie = cookies().get('__session')?.value;
    
    if (!sessionCookie) {
        return { error: 'Musisz być zalogowany, aby dokonać zakupu.' };
    }

    try {
        const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
        const userId = decodedToken.uid;
        
        const priceId = plan === 'monthly'
            ? process.env.STRIPE_MONTHLY_PRICE_ID
            : process.env.STRIPE_YEARLY_PRICE_ID;

        if (!priceId) {
            throw new Error(`Price ID for ${plan} plan is not configured.`);
        }
        
        const referer = headers().get('referer') || 'https://nero-dieta.ch';
        const successUrl = new URL('/profil?status=success', referer).toString();
        const cancelUrl = new URL('/pricing?status=cancelled', referer).toString();


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'blik', 'p24'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                userId: userId,
            },
        });

        if (!session.id) {
            throw new Error('Could not create Stripe session.');
        }

        return { sessionId: session.id };

    } catch (error) {
        console.error('Error creating checkout session:', error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.' };
    }
}
