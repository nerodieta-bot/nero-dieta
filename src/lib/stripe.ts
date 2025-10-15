
import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // This error will only be thrown at runtime, not build time
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(key, { apiVersion: "2024-06-20" });
}
