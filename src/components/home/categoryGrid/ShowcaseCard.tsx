"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface DealTile {
  id: string;
  title: string;
  image: string;
  discount?: string;
  dealType?: string;
  label?: string;
  bgColor?: string;
  hasTimer?: boolean;
}

export interface ShowcaseCardProps {
  id?: string;
  title: string;
  href?: string;
  isDealCard?: boolean;
  items: DealTile[];
  timerString?: string;
}

export function ShowcaseCard({
  id,
  title,
  href = "#",
  isDealCard = false,
  items,
  timerString,
}: ShowcaseCardProps) {
  return (
    <div key={id} className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all group">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-base sm:text-lg font-bold text-primary tracking-tight leading-snug group-hover:text-highlight transition-colors line-clamp-2">
          {title}
        </h3>
        <Link
          href={href}
          className="p-1 text-primary hover:text-primary transition-colors shrink-0 ml-2"
          aria-label={`View ${title}`}
        >
          <ChevronRight className="h-5 w-5 text-secondary group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 2x2 Grid of Items */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {items.map((item) => {
          const dealLabel = item.hasTimer && timerString
            ? `Ends in ${timerString}`
            : item.dealType;

          return (
            <Link
              key={item.id}
              href="#"
              className={`flex flex-col justify-between rounded-xl ${isDealCard
                  ? "bg-[#f5f5f7] hover:bg-[#ebebeb] p-2"
                  : "group/item p-1.5 hover:opacity-90"
                } transition-colors`}
            >
              <div
                className={`w-full h-28 sm:h-32 rounded-xl flex items-center justify-center overflow-hidden p-2 relative ${item.bgColor || "bg-slate-100/70"
                  }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={`max-h-full max-w-full object-contain ${isDealCard ? "mix-blend-multiply" : "object-cover w-full h-full rounded-lg"
                    } transition-transform duration-300 group-hover/item:scale-105`}
                />
              </div>

              {isDealCard ? (
                <div className="flex flex-col gap-0.5 mt-2">
                  <span className="bg-highlight text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs w-max">
                    {item.discount}
                  </span>
                  <span className="text-primary text-[11px] font-semibold truncate mt-0.5">
                    {dealLabel?.startsWith("Ends in ") ? (
                      <>
                        Ends in{" "}
                        <span className="text-highlight font-bold">
                          {dealLabel.replace("Ends in ", "")}
                        </span>
                      </>
                    ) : (
                      dealLabel
                    )}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-semibold text-primary truncate mt-2 block">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
