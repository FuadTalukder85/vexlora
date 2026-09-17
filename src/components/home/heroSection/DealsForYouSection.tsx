"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";

export function DealsForYouSection() {
  const [timerSeconds, setTimerSeconds] = React.useState(32786); // 09:06:26

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
    <div className="lg:col-span-3 flex flex-col gap-3 justify-between">
      {/* Deals for You Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between flex-1">
        <div className="flex items-center justify-between pb-2 mb-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Deals for you
          </h3>
          <Link href="#" className="p-1 text-primary hover:text-primary transition-colors">
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
  );
}
