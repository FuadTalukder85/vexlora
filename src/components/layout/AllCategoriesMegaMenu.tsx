"use client";

import * as React from "react";
import Link from "next/link";
import {
  Star,
  Laptop,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  Dumbbell,
  Layers,
  ChevronRight,
  ArrowRight,
  Sparkle,
} from "lucide-react";
import { useCategoryTree } from "@/hooks/useCategories";
import { Category } from "@/types/category";
import { useIsMounted } from "@/lib/utils";

interface AllCategoriesMegaMenuProps {
  onClose?: () => void;
}

// Icon resolver helper for category taxonomy
function getCategoryIcon(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes("electr") || s.includes("laptop") || s.includes("tech") || s.includes("computer")) {
    return Laptop;
  }
  if (s.includes("fashion") || s.includes("apparel") || s.includes("cloth")) {
    return Shirt;
  }
  if (s.includes("home") || s.includes("kitchen")) {
    return HomeIcon;
  }
  if (s.includes("beauty") || s.includes("welness") || s.includes("care")) {
    return Sparkles;
  }
  if (s.includes("fit") || s.includes("sport")) {
    return Dumbbell;
  }
  return Layers;
}

export function AllCategoriesMegaMenu({ onClose }: AllCategoriesMegaMenuProps) {
  const mounted = useIsMounted();
  const { data: categoryTree = [] } = useCategoryTree();
  const [activeSlug, setActiveSlug] = React.useState<string>("featured");
  const rightContainerRef = React.useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = React.useRef<boolean>(false);

  // Directly use categories from database
  const rootCategories: Category[] = categoryTree || [];

  // Featured items for "Categories for you"
  const featuredSubcategories = React.useMemo(() => {
    const list: Array<{ id: string; name: string; slug: string; image?: string | null; parentName: string }> = [];
    rootCategories.forEach((cat) => {
      (cat.children || []).slice(0, 3).forEach((child) => {
        list.push({
          id: child.id,
          name: child.name,
          slug: child.slug,
          image: child.image,
          parentName: cat.name,
        });
      });
    });
    return list.slice(0, 14);
  }, [rootCategories]);

  // All section slugs for scroll spy
  const allSectionSlugs = React.useMemo(() => {
    return ["featured", ...rootCategories.map((c) => c.slug)];
  }, [rootCategories]);

  // Smooth scroll right container to specific category section
  const scrollToCategorySection = (slug: string) => {
    setActiveSlug(slug);
    const container = rightContainerRef.current;
    if (!container) return;

    const targetElement = document.getElementById(`mega-section-${slug}`);
    if (targetElement) {
      isProgrammaticScrollRef.current = true;
      const targetTop = targetElement.offsetTop - container.offsetTop;
      container.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });

      // Reset programmatic flag after smooth scroll completes
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);
    }
  };

  // ScrollSpy listener: whichever section reaches the top, activate its parent in the left sidebar
  const handleRightScroll = () => {
    if (isProgrammaticScrollRef.current) return;
    const container = rightContainerRef.current;
    if (!container) return;

    const scrollPos = container.scrollTop + 80;

    for (let i = allSectionSlugs.length - 1; i >= 0; i--) {
      const slug = allSectionSlugs[i];
      const elem = document.getElementById(`mega-section-${slug}`);
      if (elem) {
        const top = elem.offsetTop - container.offsetTop;
        if (scrollPos >= top) {
          setActiveSlug(slug);
          break;
        }
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full h-[600px] max-h-[78vh] flex flex-row overflow-hidden bg-white">
      {/* 1. Left Sticky Navigation Sidebar */}
      <div className="w-72 sm:w-80 bg-muted/30 border-r border-border p-3.5 space-y-1.5 shrink-0 h-full overflow-y-auto">
        {/* Categories for you (Featured Tab) */}
        <button
          type="button"
          onClick={() => scrollToCategorySection("featured")}
          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
            activeSlug === "featured"
              ? "bg-white text-primary shadow-xs border-l-4 border-l-primary border-t border-r border-b border-border pl-3.5"
              : "text-secondary hover:text-primary hover:bg-white/70"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl transition-colors ${
                activeSlug === "featured"
                  ? "bg-amber-100 text-amber-600"
                  : "bg-muted text-secondary"
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-[14px]">Categories for you</span>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-transform ${
              activeSlug === "featured"
                ? "text-primary translate-x-0.5"
                : "text-secondary/50"
            }`}
          />
        </button>

        {/* Dynamic Root Categories List */}
        {rootCategories.map((cat) => {
          const IconComp = getCategoryIcon(cat.slug);
          const isActive = activeSlug === cat.slug;

          return (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => scrollToCategorySection(cat.slug)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-primary font-bold shadow-xs border-l-4 border-l-primary border-t border-r border-b border-border pl-3.5"
                  : "text-secondary hover:text-primary hover:bg-white/70"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <div
                  className={`p-2 rounded-xl shrink-0 transition-colors ${
                    isActive ? "bg-primary text-white" : "bg-muted text-secondary"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="truncate text-[14px]">{cat.name}</span>
              </div>
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? "text-primary translate-x-0.5" : "text-secondary/40"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* 2. Right Main Scrollable Showcase Area (All categories stacked) */}
      <div
        ref={rightContainerRef}
        onScroll={handleRightScroll}
        className="flex-1 h-full overflow-y-auto px-8 lg:px-10 py-7 space-y-12 scroll-smooth bg-white"
      >
        {/* Section 1: Categories for you */}
        <section id="mega-section-featured" className="space-y-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-primary tracking-tight">
                  Categories for you
                </h4>
                <p className="text-xs text-secondary mt-0.5">
                  Most popular product taxonomies tailored for you
                </p>
              </div>
            </div>
            <Link
              href="/products"
              onClick={onClose}
              className="text-sm font-bold text-highlight hover:opacity-80 transition-opacity flex items-center gap-1.5 group"
            >
              <span>Browse All Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Grid of Featured Subcategories */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-5 pt-1">
            {featuredSubcategories.map((sub) => (
              <Link
                key={sub.id || sub.slug}
                href={`/products?category=${sub.slug}`}
                onClick={onClose}
                className="flex flex-col items-center group/sub text-center"
              >
                <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-2xl bg-muted/60 p-2.5 flex items-center justify-center overflow-hidden border border-border/70 group-hover/sub:border-primary/40 group-hover/sub:shadow-md transition-all relative">
                  {sub.image ? (
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-full h-full object-contain rounded-xl group-hover/sub:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <Sparkle className="w-7 h-7 text-secondary/60" />
                  )}
                  {/* Indicator dot */}
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-highlight" />
                </div>
                <span className="text-xs sm:text-[13px] font-semibold text-primary truncate w-full mt-2.5 group-hover/sub:text-highlight transition-colors">
                  {sub.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2..N: Every Root Category Stacked in Feed */}
        {rootCategories.map((cat) => (
          <section
            key={cat.id || cat.slug}
            id={`mega-section-${cat.slug}`}
            className="space-y-5 pt-2"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-border">
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-primary tracking-tight">
                  {cat.name}
                </h4>
                <p className="text-xs text-secondary mt-0.5">
                  {(cat.children || []).length} curated sub-taxonomies in this collection
                </p>
              </div>
              <Link
                href={`/products?category=${cat.slug}`}
                onClick={onClose}
                className="text-sm font-bold text-primary hover:text-highlight transition-colors flex items-center gap-1.5 group"
              >
                <span>Browse featured selections</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-5 pt-1">
              {(cat.children || []).map((sub) => (
                <Link
                  key={sub.id || sub.slug}
                  href={`/products?category=${sub.slug}`}
                  onClick={onClose}
                  className="flex flex-col items-center group/sub text-center"
                >
                  <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-2xl bg-muted/60 p-2.5 flex items-center justify-center overflow-hidden border border-border/70 group-hover/sub:border-primary/40 group-hover/sub:shadow-md transition-all relative">
                    {sub.image ? (
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-full h-full object-contain rounded-xl group-hover/sub:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <Layers className="w-7 h-7 text-secondary/60" />
                    )}
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-highlight/80 group-hover/sub:bg-highlight transition-colors" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-semibold text-primary truncate w-full mt-2.5 group-hover/sub:text-highlight transition-colors">
                    {sub.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
