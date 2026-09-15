"use client";

import * as React from "react";
import Link from "next/link";
import {
  Laptop,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Store,
  Award,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const categories = [
  { name: "Electronics & Tech", icon: Laptop, count: "1,240 items", tag: "Popular" },
  { name: "Fashion & Apparel", icon: Shirt, count: "3,890 items", tag: "Hot" },
  { name: "Home & Kitchen", icon: HomeIcon, count: "980 items" },
  { name: "Beauty & Wellness", icon: Sparkles, count: "640 items" },
  { name: "Top Rated Stores", icon: Store, count: "500+ vendors", tag: "Verified" },
  { name: "Trending Products", icon: TrendingUp, count: "850 items" },
];

export function HeroSection() {
  const [activeSlide, setActiveSlide] = React.useState(0);

  const heroSlides = [
    {
      badge: "Mega Multi-Vendor Fest • Up to 60% Off",
      title: "Discover Premium Verified Multi-Vendor Stores",
      subtitle:
        "Connect directly with independent creators, artisan brands, and verified global vendors with 100% escrow buyer protection.",
      ctaPrimary: "Explore Marketplace",
      ctaSecondary: "View Verified Stores",
      bgGradient: "from-primary via-[#0a3a6b] to-[#124d88]",
      discountTag: "60% OFF",
    },
    {
      badge: "Next-Gen Tech & Electronics",
      title: "Upgrade Your Gear with Factory Direct Deals",
      subtitle:
        "Get direct warranty coverage and fast dispatch on certified tech gear across top vendor storefronts.",
      ctaPrimary: "Shop Tech Deals",
      ctaSecondary: "Browse Brands",
      bgGradient: "from-[#04203e] via-primary to-[#0e447b]",
      discountTag: "HOT DEAL",
    },
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section className="w-full py-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-slate-50/50">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Vertical Category Navigation */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 px-2">
              <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Categories</span>
              </h3>
              <span className="text-[10px] font-semibold text-secondary uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                50k+ Products
              </span>
            </div>

            <nav className="space-y-1">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href="#"
                    className="flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-secondary hover:bg-slate-50 hover:text-primary transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-primary transition-colors">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span>{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {cat.tag && (
                        <span className="text-[9px] font-bold text-white bg-primary px-1.5 py-0.5 rounded">
                          {cat.tag}
                        </span>
                      )}
                      <ChevronRight className="h-3.5 w-3.5 text-secondary group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <div className="text-[11px] text-secondary">
              <span className="font-bold text-primary block">Buyer Escrow Safe</span>
              <span>Protected payments on all orders</span>
            </div>
          </div>
        </div>

        {/* Center Main Column: Dynamic Hero Slider Showcase */}
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-lg border border-primary/20 min-h-[380px] lg:min-h-[420px] flex flex-col justify-between">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.title}
              className={`absolute inset-0 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br ${
                slide.bgGradient
              } text-white transition-opacity duration-700 ${
                index === activeSlide ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="space-y-4 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{slide.badge}</span>
                </span>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {slide.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {slide.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-6">
                <Button
                  variant="outline"
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  className="bg-white text-primary border-white hover:bg-slate-100 font-bold shadow-md"
                >
                  {slide.ctaPrimary}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-xs font-semibold"
                >
                  {slide.ctaSecondary}
                </Button>
              </div>
            </div>
          ))}

          {/* Slider Pagination Controls */}
          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === activeSlide ? "w-8 bg-white" : "w-2 bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Featured Vendor Highlight Cards */}
        <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-4">
          {/* Top Card: Verified Store Card */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-primary" />
                Featured Vendor
              </span>
              <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full">
                VERIFIED
              </span>
            </div>

            <div className="py-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-base shadow-xs">
                  A
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">Apex Tech Store</h4>
                  <div className="flex items-center gap-1 text-[11px] text-secondary">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-primary">4.9</span>
                    <span>(1.2k sales)</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-secondary line-clamp-2">
                Official distributor for premium gadgets, accessories, and audio gear.
              </p>
            </div>

            <Link
              href="#"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-slate-200 text-xs font-bold text-primary hover:bg-slate-50 transition-colors"
            >
              <span>Visit Storefront</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Bottom Card: Buyer Guarantee Highlight */}
          <div className="flex-1 bg-primary text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-white" />
                <h4 className="text-sm font-bold text-white">Vexlora Guarantee</h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Orders are held in secure escrow until delivered and verified by you.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-200 font-medium">
              <span>• Fast Express Dispatch</span>
              <span>• 30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
