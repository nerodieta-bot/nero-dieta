type CheckoutResponse =
  | { ok: true; sessionId: string }
  | { ok: false; code: 'NOT_AUTH'|'PRICE_MISSING'|'STRIPE_FAIL'|'UNEXPECTED'; message: string };

function msg(key: 'notAuth'|'priceMissing'|'stripeFail'|'unexpected', lang: 'pl'|'en' = 'pl') {
  const d = {
    pl: {
      notAuth: 'Musisz być zalogowany, aby dokonać zakupu.',
      priceMissing: 'Plan płatny nie jest poprawnie skonfigurowany.',
      stripeFail: 'Płatność nie może zostać przetworzona. Spróbuj ponownie.',
      unexpected: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
    },
    en: {
      notAuth: 'You must be signed in to complete the purchase.',
      priceMissing: 'Paid plan is not properly configured.',
      stripeFail: 'The payment could not be processed. Please try again.',
      unexpected: 'An unexpected error occurred. Please try again.',
    },
  } as const;
  return d[lang][key];
}

export async function createCheckoutSession(
  plan: 'monthly' | 'yearly',
  lang: 'pl'|'en' = 'pl'
): Promise<CheckoutResponse> {
  try {
    const { auth } = initializeAdminApp();
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return { ok: false, code: 'NOT_AUTH', message: msg('notAuth', lang) };
    }

    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;

    const priceId =
      plan === 'monthly'
        ? process.env.STRIPE_MONTHLY_PRICE_ID
        : process.env.STRIPE_YEARLY_PRICE_ID;

    if (!priceId) {
      return { ok: false, code: 'PRICE_MISSING', message: msg('priceMissing', lang) };
    }

    const hdrs = headers();
    const fallbackBase = process.env.NEXT_PUBLIC_APP_URL || 'https://nero-dieta.ch';
    const referer = hdrs.get('origin') || hdrs.get('referer') || fallbackBase;
    const base = new URL(referer).origin;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_collection: 'always',
      success_url: `${base}/profil?status=success`,
      cancel_url: `${base}/pricing?status=cancelled`,
      metadata: { userId },
    });

    if (!session.id) {
      return { ok: false, code: 'STRIPE_FAIL', message: msg('stripeFail', lang) };
    }

    return { ok: true, sessionId: session.id };
  } catch (err: any) {
    console.error('createCheckoutSession error:', err?.type || err?.name, err?.message);
    return { ok: false, code: 'UNEXPECTED', message: msg('unexpected', lang) };
  }
}
