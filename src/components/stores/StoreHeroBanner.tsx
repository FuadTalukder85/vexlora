"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

export const StoreHeroBanner: React.FC = () => {
  return (
    <div className="bg-primary text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-highlight/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-4 border border-white/20">
          <ShieldCheck className="w-4 h-4 text-highlight" /> Certified Merchants & Creator Stores
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
          Verified Marketplace Stores
        </h1>
        <p className="text-sm sm:text-base text-white/80 mt-3 leading-relaxed">
          Shop directly from independent brands, certified makers, and official sellers with guaranteed authentic merchandise and fast dispatch.
        </p>
      </div>
    </div>
  );
};
