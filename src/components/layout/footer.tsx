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
    <footer className="w-full bg-slate-50 border-t border-slate-200/90 text-slate-600 mt-auto">
      {/* 1. Value Proposition Highlights (Full Width) */}
      <div className="w-full border-b border-slate-200/80 bg-white py-8 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Free Nationwide Shipping
              </h4>
              <p className="text-sm text-slate-500">
                On all qualifying orders over $50
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Escrow Buyer Protection
              </h4>
              <p className="text-sm text-slate-500">
                Funds released after order delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="h-11 w-11 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                30-Day Hassle-Free Returns
              </h4>
              <p className="text-sm text-slate-500">
                Easy return policy across vendors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="h-11 w-11 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                24/7 Dedicated Support
              </h4>
              <p className="text-sm text-slate-500">
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
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Stay in the Loop
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Join Vexlora Insider Deals
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Subscribe to receive weekly curated deals, multi-vendor discount coupons, and new brand releases.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] sm:min-w-[420px]">
            {subscribed ? (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Thank you for subscribing! Check your inbox for your welcome discount code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubscribe)} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      {...register("email")}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-all duration-150 active:scale-[0.98] cursor-pointer shrink-0"
                  >
                    <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-500 font-medium pl-1">
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
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900">
                VEXLORA
              </span>
            </Link>
            <p className="text-[14px] text-slate-500 leading-relaxed">
              Vexlora is a premier multi-vendor marketplace connecting verified independent vendors and artisan creators with discerning customers worldwide.
            </p>
            <div className="text-[14px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900">Customer Helpline:</p>
              <p>+1 (800) 555-VEXLORA</p>
              <p className="text-slate-400">Mon - Fri: 8:00 AM - 9:00 PM EST</p>
            </div>
          </div>

          {/* Column 2: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-slate-900">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Shipping Rates & Delivery
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Returns & Refunds Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Shop & Explore */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-slate-900">
              Shop & Explore
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  All Marketplace Categories
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Featured Brands & Stores
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Today&apos;s Flash Deals
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Top Rated Products
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Gift Cards & Vouchers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Multi-Vendor Platform */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-slate-900">
              Vendor Platform
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="#" className="text-indigo-600 font-semibold hover:underline">
                  Sell on Vexlora
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Vendor Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Commission & Fee Schedules
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Vendor Compliance & Rules
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Affiliate Partner Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust & Policies */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-slate-900">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Cookie Preferences
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Anti-Fraud Safeguards
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  Dispute Resolution Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Bottom Copyright & Trust Strip (Full Width) */}
      <div className="w-full border-t border-slate-200/90 bg-white py-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px] text-slate-500">
          <div>
            <p>© 2026 Vexlora Inc. All rights reserved. Production Multi-Vendor E-Commerce Platform.</p>
          </div>

          {/* Payment & Security Indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
              <CreditCard className="h-3.5 w-3.5 text-indigo-600" />
              <span>Encrypted Checkout</span>
            </div>
            <span className="text-slate-300">•</span>
            <span>PCI-DSS Level 1 Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
