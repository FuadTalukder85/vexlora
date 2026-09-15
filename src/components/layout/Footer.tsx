"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sparkles,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import {
  newsletterSchema,
  type NewsletterFormData,
} from "@/schemas/newsletter.schema";

export function Footer() {
  const [subscribed, setSubscribed] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubscribe = async (_data: NewsletterFormData) => {
    // In production, this can call an API endpoint via our axios client
    void _data;
    await new Promise((res) => setTimeout(res, 600));
    setSubscribed(true);
    reset();
  };

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200/90 text-secondary mt-auto">
      {/* 1. Value Proposition Highlights (Full Width) */}
      <div className="w-full border-b border-slate-200/80 bg-white py-8 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center text-primary shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">
                Free Nationwide Shipping
              </h4>
              <p className="text-sm text-secondary">
                On all qualifying orders over $50
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center text-primary shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">
                Escrow Buyer Protection
              </h4>
              <p className="text-sm text-secondary">
                Funds released after order delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center text-primary shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">
                30-Day Hassle-Free Returns
              </h4>
              <p className="text-sm text-secondary">
                Easy return policy across vendors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center text-primary shrink-0">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">
                24/7 Dedicated Support
              </h4>
              <p className="text-sm text-secondary">
                Live marketplace assistance anytime
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Newsletter Subscription Strip (Full Width) */}
      <div className="w-full border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 py-10 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Stay in the Loop
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-primary tracking-tight mt-1">
              Join Vexlora Insider Deals
            </h3>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              Subscribe to receive weekly curated deals, multi-vendor discount coupons, and new brand releases.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] sm:min-w-[420px]">
            {subscribed ? (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-primary text-xs font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Thank you for subscribing! Check your inbox for your welcome discount code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubscribe)} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary pointer-events-none" />
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      {...register("email")}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-primary placeholder:text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-5 rounded-xl bg-primary hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-150 active:scale-[0.98] cursor-pointer shrink-0"
                  >
                    <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {errors.email && (
                  <p className="text-xs text-secondary font-medium pl-1">
                    {errors.email.message}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Multi-Column Directory (Full Width) */}
      <div className="w-full py-12 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand Info */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-black text-xl tracking-tight text-primary">
                VEXLORA
              </span>
            </Link>
            <p className="text-[14px] text-secondary leading-relaxed">
              Vexlora is a premier multi-vendor marketplace connecting verified independent vendors and artisan creators with discerning customers worldwide.
            </p>
            <div className="text-[14px] text-secondary space-y-1">
              <p className="font-semibold text-primary">Customer Helpline:</p>
              <p>+1 (800) 555-VEXLORA</p>
              <p className="text-secondary opacity-80">Mon - Fri: 8:00 AM - 9:00 PM EST</p>
            </div>
          </div>

          {/* Column 2: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-primary">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Shipping Rates & Delivery
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Returns & Refunds Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Shop & Explore */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-primary">
              Shop & Explore
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  All Marketplace Categories
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Featured Brands & Stores
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Today&apos;s Flash Deals
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Top Rated Products
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Gift Cards & Vouchers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Multi-Vendor Platform */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-primary">
              Vendor Platform
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="#" className="text-primary font-semibold hover:underline">
                  Sell on Vexlora
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Vendor Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Commission & Fee Schedules
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Vendor Compliance & Rules
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Affiliate Partner Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust & Policies */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-primary">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Cookie Preferences
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Anti-Fraud Safeguards
                </Link>
              </li>
              <li>
                <Link href="#" className="text-secondary hover:text-primary transition-colors">
                  Dispute Resolution Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Bottom Copyright & Trust Strip (Full Width) */}
      <div className="w-full border-t border-slate-200/90 bg-white py-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px] text-secondary">
          <div>
            <p>© 2026 Vexlora Inc. All rights reserved. Production Multi-Vendor E-Commerce Platform.</p>
          </div>

          {/* Payment & Security Indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-secondary bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              <span>Encrypted Checkout</span>
            </div>
            <span className="text-secondary">•</span>
            <span>PCI-DSS Level 1 Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
