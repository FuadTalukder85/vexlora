import * as React from "react";
import { Banknote, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { StripePaymentSection } from "./StripePaymentForm";
import { PaymentIntentResponse } from "@/lib/api/orders";

interface PaymentMethodSectionProps {
  paymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
  finalTotal: number;
  stripePublishableKey?: string;
  handleCreatePaymentIntent: () => Promise<PaymentIntentResponse | null>;
  handlePaymentSuccess: (paymentIntentId: string) => Promise<void>;
  isPlacingOrder: boolean;
  setIsPlacingOrder: (val: boolean) => void;
  stripeSubmitRef: React.MutableRefObject<(() => void) | null>;
}

export function PaymentMethodSection({
  paymentMethod,
  onSelectPaymentMethod,
  finalTotal,
  stripePublishableKey,
  handleCreatePaymentIntent,
  handlePaymentSuccess,
  isPlacingOrder,
  setIsPlacingOrder,
  stripeSubmitRef,
}: PaymentMethodSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-4">
        <div className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
          2
        </div>
        <h2 className="text-base font-bold text-primary">
          Payment Method
        </h2>
      </div>

      <div className="space-y-3">
        {/* Cash On Delivery */}
        <label
          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
            paymentMethod === "cod"
              ? "border-primary bg-primary/5 shadow-2xs"
              : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => onSelectPaymentMethod("cod")}
              className="h-4 w-4 text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              <div>
                <span className="text-sm font-bold text-primary block">
                  Cash on Delivery (COD)
                </span>
                <span className="text-xs text-secondary">
                  Pay in cash when your packages are delivered to your doorstep
                </span>
              </div>
            </div>
          </div>
        </label>

        {/* Credit / Debit Card (Stripe) */}
        <div
          className={`p-4 rounded-xl border-2 transition-all ${
            paymentMethod === "stripe"
              ? "border-primary bg-primary/5 shadow-2xs"
              : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={() => onSelectPaymentMethod("stripe")}
                className="h-4 w-4 text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <span className="text-sm font-bold text-primary block">
                    Debit or Credit Card (Stripe)
                  </span>
                  <span className="text-xs text-secondary">
                    Safe & encrypted payment via Visa, Mastercard, AMEX
                  </span>
                </div>
              </div>
            </div>
          </label>

          {/* Embedded Stripe Elements Form */}
          {paymentMethod === "stripe" && (
            <div className="mt-4 pt-4 border-t border-slate-200/70">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <StripePaymentSection
                  amount={finalTotal}
                  publishableKey={stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
                  createPaymentIntent={handleCreatePaymentIntent}
                  onPaymentSuccess={handlePaymentSuccess}
                  onError={(msg) => {
                    if (msg) {
                      toast.error(msg);
                      setIsPlacingOrder(false);
                    }
                  }}
                  isProcessing={isPlacingOrder}
                  setIsProcessing={setIsPlacingOrder}
                  formSubmitRef={stripeSubmitRef}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
