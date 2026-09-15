"use client";

import * as React from "react";
import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import mockFlashDeals from "./flashDeal.json";

export function FlashDealsSection() {
  // Simulated countdown timer (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = React.useState({
    hours: 4,
    minutes: 32,
    seconds: 45,
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (val: number) => String(val).padStart(2, "0");

  return (
    <section className="w-full py-10 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-white">
      {/* 1. Flash Deals Section Header with Live Countdown Timer */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-highlight shadow-xs">
              <Flame className="h-5 w-5 fill-highlight text-highlight" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                Today&apos;s Hot Deals
              </h2>
              <p className="text-xs text-secondary">
                Limited time multi-vendor flash discounts with real-time stock limits
              </p>
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-bold text-secondary uppercase mr-1">Ends In:</span>
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-white">
              <span className="bg-primary px-2 py-0.5 rounded">{formatDigits(timeLeft.hours)}h</span>
              <span className="text-primary font-sans">:</span>
              <span className="bg-primary px-2 py-0.5 rounded">{formatDigits(timeLeft.minutes)}m</span>
              <span className="text-primary font-sans">:</span>
              <span className="bg-highlight px-2 py-0.5 rounded">{formatDigits(timeLeft.seconds)}s</span>
            </div>
          </div>
        </div>

        <Link
          href="#"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80 transition-opacity"
        >
          <span>View All Flash Deals</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* 2. Products Grid with Reusable Product Card */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 pt-6">
        {mockFlashDeals.map((deal) => (
          <ProductCard
            key={deal.id}
            id={deal.id}
            name={deal.name}
            price={deal.price}
            originalPrice={deal.originalPrice}
            vendor={deal.vendor}
            rating={deal.rating}
            reviews={deal.reviews}
            discount={deal.discount}
            image={deal.image}
          />
        ))}
      </div>
    </section>
  );
}

