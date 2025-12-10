import Stripe from "stripe";
import { updateStripeIds, activateSubscription, cancelSubscription, getPlanByCode } from "./subscription";

let stripeClient: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment.");
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-04-30.basil",
    });
  }
  return stripeClient;
}

export async function createCheckoutSession(
  userId: string,
  planCode: "monthly" | "yearly",
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }> {
  const stripe = getStripeClient();
  const plan = await getPlanByCode(planCode);
  
  if (!plan) {
    throw new Error(`Plan not found: ${planCode}`);
  }
  
  if (!plan.stripePriceId) {
    throw new Error(`Plan ${planCode} does not have a Stripe price ID configured`);
  }
  
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    metadata: {
      userId,
      planCode,
    },
    subscription_data: {
      trial_period_days: plan.trialDays > 0 ? plan.trialDays : undefined,
      metadata: {
        userId,
        planCode,
      },
    },
  });
  
  return {
    sessionId: session.id,
    url: session.url || "",
  };
}

export async function createCustomerPortalSession(
  stripeCustomerId: string,
  returnUrl: string
): Promise<{ url: string }> {
  const stripe = getStripeClient();
  
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  
  return { url: session.url };
}

export async function cancelStripeSubscription(
  stripeSubscriptionId: string
): Promise<void> {
  const stripe = getStripeClient();
  
  await stripe.subscriptions.cancel(stripeSubscriptionId);
}

export async function handleWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Promise<{ received: boolean; type: string }> {
  const stripe = getStripeClient();
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    throw new Error("Invalid webhook signature");
  }
  
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;
    }
    
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(subscription);
      break;
    }
    
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice);
      break;
    }
    
    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }
  
  return { received: true, type: event.type };
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const userId = session.metadata?.userId || session.client_reference_id;
  const planCode = session.metadata?.planCode as "monthly" | "yearly";
  
  if (!userId || !planCode) {
    console.error("Missing userId or planCode in checkout session metadata");
    return;
  }
  
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  
  await activateSubscription(
    userId,
    planCode,
    false,
    customerId,
    subscriptionId
  );
  
  console.log(`Subscription activated for user ${userId} with plan ${planCode}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const userId = subscription.metadata?.userId;
  const planCode = subscription.metadata?.planCode as "monthly" | "yearly";
  
  if (!userId) {
    console.error("Missing userId in subscription metadata");
    return;
  }
  
  const customerId = subscription.customer as string;
  
  if (subscription.status === "active" || subscription.status === "trialing") {
    await updateStripeIds(userId, customerId, subscription.id);
    
    if (planCode) {
      const startTrial = subscription.status === "trialing";
      await activateSubscription(userId, planCode, startTrial, customerId, subscription.id);
    }
  } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
    await cancelSubscription(userId);
  }
  
  console.log(`Subscription ${subscription.id} updated to status: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const userId = subscription.metadata?.userId;
  
  if (!userId) {
    console.error("Missing userId in subscription metadata");
    return;
  }
  
  await cancelSubscription(userId);
  console.log(`Subscription cancelled for user ${userId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string;
  console.error(`Payment failed for customer ${customerId}, invoice ${invoice.id}`);
}
