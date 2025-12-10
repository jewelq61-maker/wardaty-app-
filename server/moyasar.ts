import { activateSubscription, cancelSubscription, getPlanByCode } from "./subscription";

const MOYASAR_API_BASE = "https://api.moyasar.com/v1";

export function isMoyasarConfigured(): boolean {
  return !!process.env.MOYASAR_SECRET_KEY;
}

export function getMoyasarPublishableKey(): string | null {
  return process.env.MOYASAR_PUBLISHABLE_KEY || null;
}

function getAuthHeader(): string {
  const secretKey = process.env.MOYASAR_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Moyasar is not configured. Please add MOYASAR_SECRET_KEY to your environment.");
  }
  return "Basic " + Buffer.from(secretKey + ":").toString("base64");
}

export interface MoyasarPayment {
  id: string;
  status: "initiated" | "paid" | "failed" | "authorized" | "captured" | "refunded" | "voided";
  amount: number;
  fee: number;
  currency: string;
  refunded: number;
  refunded_at: string | null;
  captured: number;
  captured_at: string | null;
  voided_at: string | null;
  description: string;
  amount_format: string;
  fee_format: string;
  refunded_format: string;
  captured_format: string;
  invoice_id: string | null;
  ip: string | null;
  callback_url: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, string>;
  source: {
    type: string;
    company?: string;
    name?: string;
    number?: string;
    gateway_id?: string;
    reference_number?: string;
    token?: string;
    message?: string;
    transaction_url?: string;
  };
}

export interface CreatePaymentParams {
  amount: number;
  currency?: string;
  description: string;
  callbackUrl: string;
  metadata?: Record<string, string>;
  source?: {
    type: "creditcard" | "applepay" | "stcpay";
    name?: string;
    number?: string;
    cvc?: string;
    month?: string;
    year?: string;
    token?: string;
  };
}

export async function createPayment(params: CreatePaymentParams): Promise<MoyasarPayment> {
  const response = await fetch(`${MOYASAR_API_BASE}/payments`, {
    method: "POST",
    headers: {
      "Authorization": getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency || "SAR",
      description: params.description,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
      source: params.source,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create payment");
  }

  return response.json();
}

export async function getPayment(paymentId: string): Promise<MoyasarPayment> {
  const response = await fetch(`${MOYASAR_API_BASE}/payments/${paymentId}`, {
    method: "GET",
    headers: {
      "Authorization": getAuthHeader(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch payment");
  }

  return response.json();
}

export async function refundPayment(paymentId: string, amount?: number): Promise<MoyasarPayment> {
  const body: Record<string, unknown> = {};
  if (amount) {
    body.amount = amount;
  }

  const response = await fetch(`${MOYASAR_API_BASE}/payments/${paymentId}/refund`, {
    method: "POST",
    headers: {
      "Authorization": getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to refund payment");
  }

  return response.json();
}

export function generatePaymentFormHtml(
  publishableKey: string,
  amount: number,
  description: string,
  callbackUrl: string,
  metadata?: Record<string, string>
): string {
  const metadataInputs = metadata
    ? Object.entries(metadata)
        .map(([key, value]) => `<input type="hidden" name="metadata[${key}]" value="${value}">`)
        .join("\n")
    : "";

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>الدفع - ورديتي</title>
  <link rel="stylesheet" href="https://cdn.moyasar.com/mpf/1.14.0/moyasar.css">
  <script src="https://cdn.moyasar.com/mpf/1.14.0/moyasar.js"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #FCE4EC 0%, #F3E5F5 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .payment-container {
      background: white;
      border-radius: 24px;
      padding: 32px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 8px 32px rgba(233, 30, 99, 0.12);
    }
    .payment-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .payment-logo {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #E91E63 0%, #9C27B0 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    .payment-logo svg {
      width: 32px;
      height: 32px;
      fill: white;
    }
    .payment-title {
      font-size: 24px;
      font-weight: 700;
      color: #1A1A1A;
      margin-bottom: 8px;
    }
    .payment-amount {
      font-size: 32px;
      font-weight: 700;
      color: #E91E63;
      margin-bottom: 4px;
    }
    .payment-description {
      font-size: 14px;
      color: #666;
    }
    .mysr-form {
      margin-top: 24px;
    }
    .mysr-form .mysr-form-group {
      margin-bottom: 16px;
    }
    .mysr-form .mysr-card-form-group {
      border: 2px solid #E0E0E0;
      border-radius: 12px;
      padding: 14px;
    }
    .mysr-form .mysr-card-form-group:focus-within {
      border-color: #E91E63;
    }
    .mysr-form button {
      width: 100%;
      background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 16px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .mysr-form button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(233, 30, 99, 0.3);
    }
    .mysr-form button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    .secure-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
      color: #666;
      font-size: 12px;
    }
    .secure-badge svg {
      width: 16px;
      height: 16px;
    }
  </style>
</head>
<body>
  <div class="payment-container">
    <div class="payment-header">
      <div class="payment-logo">
        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </div>
      <h1 class="payment-title">ورديتي بلس</h1>
      <div class="payment-amount">${(amount / 100).toFixed(2)} ر.س</div>
      <p class="payment-description">${description}</p>
    </div>
    
    <div class="mysr-form"></div>
    
    <div class="secure-badge">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
      <span>دفع آمن ومشفر</span>
    </div>
  </div>

  <script>
    Moyasar.init({
      element: '.mysr-form',
      amount: ${amount},
      currency: 'SAR',
      description: '${description.replace(/'/g, "\\'")}',
      publishable_api_key: '${publishableKey}',
      callback_url: '${callbackUrl}',
      methods: ['creditcard', 'applepay', 'stcpay'],
      apple_pay: {
        country: 'SA',
        label: 'ورديتي بلس',
        validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
      },
      on_initiating: function() {
        console.log('Payment initiating...');
      },
      on_completed: function(payment) {
        console.log('Payment completed:', payment);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'payment_completed',
            payment: payment
          }));
        }
      },
      on_failure: function(error) {
        console.error('Payment failed:', error);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'payment_failed',
            error: error
          }));
        }
      }
    });
  </script>
</body>
</html>
  `.trim();
}

export async function handlePaymentCallback(
  paymentId: string,
  status: string
): Promise<{ success: boolean; payment?: MoyasarPayment; error?: string }> {
  try {
    const payment = await getPayment(paymentId);
    
    if (payment.status === "paid") {
      const metadata = payment.metadata;
      const userId = metadata?.userId;
      const planCode = metadata?.planCode as "monthly" | "yearly";
      
      if (userId && planCode) {
        await activateSubscription(
          userId,
          planCode,
          false,
          payment.id,
          undefined
        );
        console.log(`Subscription activated for user ${userId} with plan ${planCode}`);
      }
      
      return { success: true, payment };
    }
    
    return { 
      success: false, 
      payment, 
      error: `Payment status: ${payment.status}` 
    };
  } catch (error) {
    console.error("Error handling payment callback:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export async function handlePaymentWebhook(
  paymentId: string,
  eventType: string
): Promise<{ received: boolean; type: string }> {
  try {
    const payment = await getPayment(paymentId);
    
    switch (eventType) {
      case "payment_paid": {
        const metadata = payment.metadata;
        const userId = metadata?.userId;
        const planCode = metadata?.planCode as "monthly" | "yearly";
        
        if (userId && planCode) {
          await activateSubscription(
            userId,
            planCode,
            false,
            payment.id,
            undefined
          );
          console.log(`Webhook: Subscription activated for user ${userId}`);
        }
        break;
      }
      
      case "payment_failed": {
        console.log(`Payment ${paymentId} failed`);
        break;
      }
      
      case "refund_created": {
        const metadata = payment.metadata;
        const userId = metadata?.userId;
        
        if (userId) {
          await cancelSubscription(userId);
          console.log(`Webhook: Subscription cancelled for user ${userId}`);
        }
        break;
      }
      
      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }
    
    return { received: true, type: eventType };
  } catch (error) {
    console.error("Error handling webhook:", error);
    throw error;
  }
}

export async function createSubscriptionPayment(
  userId: string,
  planCode: "monthly" | "yearly",
  callbackUrl: string
): Promise<{ formHtml: string; amount: number; description: string }> {
  const plan = await getPlanByCode(planCode);
  
  if (!plan) {
    throw new Error(`Plan not found: ${planCode}`);
  }
  
  const publishableKey = getMoyasarPublishableKey();
  if (!publishableKey) {
    throw new Error("Moyasar publishable key not configured");
  }
  
  const priceInSAR = parseFloat(plan.price);
  const amountInHalalas = Math.round(priceInSAR * 100);
  
  const description = plan.period === "yearly" 
    ? "اشتراك ورديتي بلس - سنوي"
    : "اشتراك ورديتي بلس - شهري";
  
  const formHtml = generatePaymentFormHtml(
    publishableKey,
    amountInHalalas,
    description,
    callbackUrl,
    {
      userId,
      planCode,
    }
  );
  
  return {
    formHtml,
    amount: amountInHalalas,
    description,
  };
}
