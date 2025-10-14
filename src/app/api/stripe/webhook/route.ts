
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { initializeAdminApp } from '@/firebase/admin';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    if (!webhookSecret) {
        console.error('Stripe webhook secret is not configured.');
        return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
    }

    const body = await req.text();
    const sig = headers().get('stripe-signature');

    let event: Stripe.Event;

    try {
        if (!sig) {
            throw new Error('No Stripe signature found in headers.');
        }
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`❌ Error message: ${errorMessage}`);
        return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.metadata?.userId) {
            console.error('User ID not found in checkout session metadata');
            return NextResponse.json({ error: 'User ID not found in metadata' }, { status: 400 });
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

            console.log(`Successfully updated user ${userId} to premium plan.`);
        } catch (error) {
            console.error(`Failed to update user ${userId} in Firestore:`, error);
            return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
