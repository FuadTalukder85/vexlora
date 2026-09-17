"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroBannerSlider() {
  const [activeSlide, setActiveSlide] = React.useState(0);

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

  return (
    <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 min-h-[380px] lg:min-h-[420px] flex flex-col justify-between group bg-white">
      {/* Previous Slide Button */}
      <button
        type="button"
        onClick={handlePrevSlide}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-primary shadow-md hover:bg-slate-50 hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer border border-slate-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Next Slide Button */}
      <button
        type="button"
        onClick={handleNextSlide}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-primary shadow-md hover:bg-slate-50 hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer border border-slate-100"
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
            className={`h-2 rounded-full transition-all cursor-pointer ${i === activeSlide ? "w-6 bg-primary" : "w-2 bg-slate-300 hover:bg-secondary"
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
