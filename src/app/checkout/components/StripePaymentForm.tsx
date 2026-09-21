"use client";

import * as React from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Lock, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { PaymentIntentResponse } from "@/lib/api/orders";

interface StripePaymentFormProps {
  amount: number;
  publishableKey?: string;
  createPaymentIntent: () => Promise<PaymentIntentResponse | null>;
  onPaymentSuccess: (paymentIntentId: string) => Promise<void>;
  onError: (errorMessage: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  formSubmitRef: React.MutableRefObject<(() => void) | null>;
}

function CheckoutForm({
  createPaymentIntent,
  onPaymentSuccess,
  onError,
  isProcessing,
  setIsProcessing,
  formSubmitRef,
}: Omit<StripePaymentFormProps, "amount" | "publishableKey">) {
  const stripe = useStripe();
  const elements = useElements();
  const [isElementLoaded, setIsElementLoaded] = React.useState(false);

  const handleSubmit = React.useCallback(async () => {
    if (!stripe || !elements) {
      onError("Stripe has not initialized yet. Please try again in a moment.");
      return;
    }

    setIsProcessing(true);
    onError("");

    // Safety timeout: if the entire payment flow takes > 60 seconds, reset the spinner
    const safetyTimer = setTimeout(() => {
      console.error("[Stripe] Payment flow timed out after 60s. Resetting.");
      setIsProcessing(false);
      onError("Payment timed out. Please try again.");
    }, 60000);

    try {
      // 1. Validate card inputs via Stripe Elements before server request.
      console.log("[Stripe] Submitting elements for validation...");
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.warn("[Stripe] elements.submit() error:", submitError);
        onError(submitError.message || "Please check your payment information.");
        setIsProcessing(false);
        clearTimeout(safetyTimer);
        return;
      }
      console.log("[Stripe] elements.submit() passed.");

      // 2. Create the PaymentIntent on backend for exact verified checkout amount
      console.log("[Stripe] Creating PaymentIntent on backend...");
      const intentRes = await createPaymentIntent();
      if (!intentRes || !intentRes.clientSecret) {
        onError("Could not initialize payment with server. Please try again.");
        setIsProcessing(false);
        clearTimeout(safetyTimer);
        return;
      }
      console.log("[Stripe] PaymentIntent created:", intentRes.paymentIntentId);

      // 3. Confirm card payment with Stripe.
      console.log("[Stripe] Confirming payment...");
      const result = await stripe.confirmPayment({
        elements,
        clientSecret: intentRes.clientSecret,
        redirect: "if_required",
      });

      console.log("[Stripe] confirmPayment result:", result);

      if (result.error) {
        console.error("[Stripe] confirmPayment error:", result.error);
        onError(
          result.error.message ||
          "Payment authorization failed. Please check your card details or try another card.",
        );
        setIsProcessing(false);
        clearTimeout(safetyTimer);
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        console.log("[Stripe] Payment succeeded:", result.paymentIntent.id);
        clearTimeout(safetyTimer);
        await onPaymentSuccess(result.paymentIntent.id);
      } else if (result.paymentIntent && result.paymentIntent.status === "requires_action") {
        onError("Additional 3D Secure card verification is required. Please follow the prompts.");
        setIsProcessing(false);
        clearTimeout(safetyTimer);
      } else {
        const unknownStatus = result.paymentIntent?.status || "unknown";
        console.warn("[Stripe] Unexpected payment status:", unknownStatus, result);
        onError(
          `Payment could not be completed (status: ${unknownStatus}). Order has not been placed.`,
        );
        setIsProcessing(false);
        clearTimeout(safetyTimer);
      }
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ||
        "An unexpected error occurred during card payment processing.";
      console.error("[Stripe] Caught error in handleSubmit:", err);
      onError(msg);
      setIsProcessing(false);
      clearTimeout(safetyTimer);
    }
  }, [stripe, elements, createPaymentIntent, onPaymentSuccess, onError, setIsProcessing]);

  React.useEffect(() => {
    formSubmitRef.current = handleSubmit;
    return () => {
      formSubmitRef.current = null;
    };
  }, [handleSubmit, formSubmitRef]);

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between text-[11px] text-secondary pb-1">
        <span className="flex items-center gap-1.5 font-medium text-secondary">
          <Lock className="h-3.5 w-3.5 text-primary" />
          <span>256-bit Encrypted Card Payment</span>
        </span>
        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>PCI-DSS Compliant</span>
        </span>
      </div>

      <div className="min-h-[140px] relative">
        {!isElementLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/70 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-secondary font-medium">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Loading secure card element...</span>
            </div>
          </div>
        )}
        <PaymentElement
          onReady={() => setIsElementLoaded(true)}
          options={{
            layout: "tabs",
          }}
        />
      </div>
    </div>
  );
}

let stripePromiseCache: Promise<Stripe | null> | null = null;
let cachedKey = "";

const getStripePromise = (publishableKey?: string) => {
  const key =
    publishableKey ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "";

  if (!key) {
    return null;
  }

  if (!stripePromiseCache || cachedKey !== key) {
    cachedKey = key;
    stripePromiseCache = loadStripe(key);
  }
  return stripePromiseCache;
};

export function StripePaymentSection({
  amount,
  publishableKey,
  createPaymentIntent,
  onPaymentSuccess,
  onError,
  isProcessing,
  setIsProcessing,
  formSubmitRef,
}: StripePaymentFormProps) {
  const key =
    publishableKey ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "";

  const stripePromise = React.useMemo(() => getStripePromise(key), [key]);

  const amountInCents = Math.max(50, Math.round((amount || 1) * 100));

  const options: StripeElementsOptions = React.useMemo(
    () => ({
      mode: "payment",
      amount: amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#062D54",
          colorBackground: "#ffffff",
          colorText: "#062D54",
          colorDanger: "#e11d48",
          fontFamily: "inherit",
          borderRadius: "0.75rem",
        },
      },
    }),
    [amountInCents],
  );

  if (!key || !stripePromise) {
    return (
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Stripe Publishable Key Not Configured</span>
        </div>
        <p className="text-[11px] text-amber-800">
          Please add <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</code> to your environment file to enable live card entry.
        </p>
      </div>
    );
  }

  return (
    <Elements key={`${key}-${amountInCents}`} stripe={stripePromise} options={options}>
      <CheckoutForm
        createPaymentIntent={createPaymentIntent}
        onPaymentSuccess={onPaymentSuccess}
        onError={onError}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        formSubmitRef={formSubmitRef}
      />
    </Elements>
  );
}
