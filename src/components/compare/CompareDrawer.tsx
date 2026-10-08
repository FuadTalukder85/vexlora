"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCompareStore } from "@/stores/compare.store";
import { ArrowLeftRight, X, Trash2 } from "lucide-react";
import { CompareModal } from "./CompareModal";

export const CompareDrawer = () => {
  const { items, removeFromCompare, clearCompare } = useCompareStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Compare Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl bg-primary/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-primary/20 p-3 sm:p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Info & Thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
            <div className="flex items-center gap-2 pr-2 border-r border-white/20 shrink-0">
              <div className="p-2 rounded-xl bg-white/10 text-white">
                <ArrowLeftRight className="w-5 h-5 text-highlight" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Compare</p>
                <p className="text-sm font-bold text-white">{items.length}/4 Selected</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative group w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/20 shrink-0"
                  title={item.title}
                >
                  <Image
                    src={item.images?.[0] || "/images/placeholder.png"}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCompare(item.id);
                    }}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    aria-label={`Remove ${item.title} from comparison`}
                  >
                    <X className="w-4 h-4 text-highlight" />
                  </button>
                </div>
              ))}

              {/* Placeholder slots for up to 4 */}
              {Array.from({ length: 4 - items.length }).map((_, idx) => (
                <div
                  key={`slot-${idx}`}
                  className="w-12 h-12 rounded-xl border border-dashed border-white/30 flex items-center justify-center text-white/50 text-xs shrink-0"
                >
                  +
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearCompare}
              className="px-3 py-2 text-xs font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Clear</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-highlight hover:bg-highlight/90 active:scale-95 transition-all rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <span>Compare Now</span>
              <span className="bg-black/20 text-white px-1.5 py-0.5 rounded-full text-[10px]">
                {items.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <CompareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
