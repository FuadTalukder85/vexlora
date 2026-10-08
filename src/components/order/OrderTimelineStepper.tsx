"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Package, Truck, Sparkles } from "lucide-react";

export const ORDER_MILESTONES = [
  { key: "PLACED", label: "Order Placed", icon: CheckCircle2, desc: "Order details received" },
  { key: "CONFIRMED", label: "Payment Confirmed", icon: ShieldCheck, desc: "Payment successfully verified" },
  { key: "PROCESSING", label: "Vendor Processing", icon: Package, desc: "Items prepared & packed" },
  { key: "SHIPPED", label: "Shipped & In Transit", icon: Truck, desc: "Handed over to carrier" },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle2, desc: "Package delivered safely" },
];

interface OrderTimelineStepperProps {
  activeStepIdx: number;
}

export const OrderTimelineStepper: React.FC<OrderTimelineStepperProps> = ({ activeStepIdx }) => {
  return (
    <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm">
      <h3 className="text-base font-bold text-primary mb-6 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-highlight" /> Fulfillment Timeline
      </h3>

      <div className="relative">
        {/* Progress Bar Line */}
        <div className="hidden md:block absolute top-6 left-12 right-12 h-1 bg-muted -z-0">
          <div
            className="h-full bg-primary transition-all duration-700"
            style={{ width: `${(activeStepIdx / (ORDER_MILESTONES.length - 1)) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
          {ORDER_MILESTONES.map((step, idx) => {
            const isPast = idx < activeStepIdx;
            const isCurrent = idx === activeStepIdx;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isCurrent
                      ? "bg-highlight text-white shadow-lg ring-4 ring-highlight/20 scale-105"
                      : isPast
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <p
                    className={`text-xs sm:text-sm font-bold ${
                      isCurrent ? "text-highlight" : isPast ? "text-primary" : "text-secondary"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-secondary mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
