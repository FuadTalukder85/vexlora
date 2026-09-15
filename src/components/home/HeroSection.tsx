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
  ChevronLeft,
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
  const [timerSeconds, setTimerSeconds] = React.useState(32786); // 09:06:26

  const heroSlides = [
    {
      badge: "Limited Edition",
      titleLine1: "Modern",
      titleLine2: "Dinning Chair",
      subtitle: "Discover our new items. Up to ",
      highlight: "25% Off !",
      cta: "Shop Now",
      image: "/images/bg-01.png",
      align: "right",
    },
    {
      badge: "New Arrivals",
      titleLine1: "Wall clock",
      titleLine2: "renaissance",
      subtitle: "Discover our new items. Up to ",
      highlight: "25% Off !",
      cta: "Shop Now",
      image: "/images/bg-02.png",
      align: "left",
    },
  ];

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  React.useEffect(() => {
    const countdown = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 32400));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const dealsForYou = [
    {
      id: "deal-1",
      title: "Laptop Keyboard Cover",
      discount: "11% off",
      dealType: "Limited time deal",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "deal-2",
      title: "Windows 11 Gaming Laptop",
      discount: "40% off",
      dealType: "Limited time deal",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "deal-3",
      title: "Black Wide-Leg High Waist Jeans",
      discount: "44% off",
      dealType: `Ends in ${formatTimer(timerSeconds)}`,
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "deal-4",
      title: "Blue Wide-Leg Denim Jeans",
      discount: "12% off",
      dealType: "Limited Prime deal",
      image: "https://images.unsplash.com/photo-1542272604-780c36856f67?auto=format&fit=crop&w=500&q=80",
    },
  ];

  return (
    <section className="w-full py-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-slate-50/50">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Vertical Category Navigation */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 px-2">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
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
                    className="flex items-center justify-between p-2.5 rounded-xl text-sm font-normal text-primary hover:bg-slate-50 hover:text-primary transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-primary transition-colors">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span>{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {cat.tag && (
                        <span className="text-[9px] font-bold text-white bg-highlight px-1.5 py-0.5 rounded">
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
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 min-h-[380px] lg:min-h-[420px] flex flex-col justify-between group bg-white">
          {/* Previous Slide Button */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 shadow-md hover:bg-slate-50 hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer border border-slate-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Next Slide Button */}
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 shadow-md hover:bg-slate-50 hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer border border-slate-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {heroSlides.map((slide, index) => (
            <div
              key={slide.badge + index}
              className={`absolute inset-0 p-6 sm:p-10 flex flex-col justify-center transition-opacity duration-700 ${index === activeSlide
                ? "opacity-100 z-10 pointer-events-auto"
                : "opacity-0 z-0 pointer-events-none"
                }`}
            >
              {/* Background Banner Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={`${slide.titleLine1} ${slide.titleLine2}`}
                  className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>

              {/* Banner Content */}
              <div
                className={`relative z-10 space-y-3 sm:space-y-4 ${slide.align === "right"
                  ? "ml-auto mr-6 sm:mr-14 lg:mr-20 text-right items-end flex flex-col max-w-xs sm:max-w-sm lg:max-w-md"
                  : slide.align === "left"
                    ? "mr-auto ml-4 sm:ml-10 text-left items-start flex flex-col max-w-xs sm:max-w-sm lg:max-w-md"
                    : "mx-auto text-center items-center flex flex-col max-w-lg"
                  }`}
              >
                <span className="inline-block px-3.5 py-1 rounded-md bg-white/25 border border-highlight text-highlight text-xs font-semibold shadow-xs">
                  {slide.badge}
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.12] text-primary">
                  {slide.titleLine1}
                  <br />
                  {slide.titleLine2}
                </h1>

                <p className="text-xs sm:text-sm text-primary font-medium leading-relaxed">
                  {slide.subtitle}
                  <span className="font-bold text-highlight">{slide.highlight}</span>
                </p>

                <div className="pt-2 sm:pt-3">
                  <button
                    type="button"
                    className="bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-7 py-2.5 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 border-none"
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Pagination Controls (Dots) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${i === activeSlide ? "w-6 bg-primary" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Deals for you Section */}
        <div className="lg:col-span-3 flex flex-col gap-3 justify-between">
          {/* Deals for You Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between flex-1">
            <div className="flex items-center justify-between pb-2 mb-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Deals for you
              </h3>
              <Link href="#" className="p-1 text-slate-800 hover:text-primary transition-colors">
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 flex-1">
              {dealsForYou.map((deal) => (
                <Link
                  key={deal.id}
                  href="#"
                  className="bg-[#f5f5f7] hover:bg-[#ebebeb] rounded-xl p-2 flex flex-col justify-between group transition-colors"
                >
                  <div className="w-full h-24 sm:h-28 flex items-center justify-center overflow-hidden rounded-lg">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex items-center gap-1 mt-1.5 flex-wrap sm:flex-nowrap">
                    <span className="bg-highlight text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs shrink-0">
                      {deal.discount}
                    </span>
                    <span className="text-primary text-xs font-semibold truncate leading-none">
                      {deal.dealType.startsWith("Ends in ") ? (
                        <>
                          Ends in{" "}
                          <span className="text-highlight font-bold">
                            {deal.dealType.replace("Ends in ", "")}
                          </span>
                        </>
                      ) : (
                        deal.dealType
                      )}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Vexlora Guarantee Banner */}
          <div className="bg-primary text-white rounded-2xl p-3 sm:p-3.5 shadow-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-white shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Vexlora Guarantee</h4>
                <p className="text-xs text-white">Escrow buyer protection</p>
              </div>
            </div>
            <div className="text-xs text-white font-medium whitespace-nowrap hidden sm:block">
              30-Day Returns
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
