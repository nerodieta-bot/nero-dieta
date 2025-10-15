
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { initializeAdminApp } from '@/firebase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; 


export async function POST(req: Request) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!apiKey || !webhookSecret) {
        console.error('Brak kluczy konfiguracyjnych Stripe.');
        return NextResponse.json({ error: 'Serwer jest niepoprawnie skonfigurowany.' }, { status: 500 });
    }

    const stripe = new Stripe(apiKey, { apiVersion: '2024-06-20' });

    const body = await req.text();
    const sig = headers().get('stripe-signature');

    let event: Stripe.Event;

    try {
        if (!sig) {
            throw new Error('Brak sygnatury Stripe w nagłówkach.');
        }
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
        console.error(`❌ Błąd weryfikacji webhooka: ${errorMessage}`);
        return NextResponse.json({ error: `Błąd webhooka: ${errorMessage}` }, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.metadata?.userId) {
            console.error('Brak ID użytkownika w metadanych sesji checkout');
            return NextResponse.json({ error: 'Brak ID użytkownika w metadanych' }, { status: 400 });
        }

        const userId = session.metadata.userId;
        const { firestore } = initializeAdminApp();

        try {
            const userRef = firestore.collection('users').doc(userId);
            // Here you can set more details, like subscription ID, end date, etc.
            await userRef.update({
                plan: 'premium',
                stripeSubscriptionId: session.subscription, // Store subscription ID for future management
                stripeCustomerId: session.customer, // Store customer ID
            });

            console.log(`Pomyślnie zaktualizowano użytkownika ${userId} do planu premium.`);
        } catch (error) {
            console.error(`Błąd aktualizacji użytkownika ${userId} w Firestore:`, error);
            return NextResponse.json({ error: 'Nie udało się zaktualizować profilu użytkownika' }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
