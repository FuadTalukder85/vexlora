"use client";

import * as React from "react";
import { CategorySidebar } from "./CategorySidebar";
import { HeroBannerSlider } from "./HeroBannerSlider";
import { DealsForYouSection } from "./DealsForYouSection";

export function HeroSection() {
  return (
    <section className="w-full py-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-slate-50/50">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <CategorySidebar />
        <HeroBannerSlider />
        <DealsForYouSection />
      </div>
    </section>
  );
}
