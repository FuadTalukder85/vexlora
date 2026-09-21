"use client";

import * as React from "react";
import showcaseGridData from "./showcaseGrid.json";
import { ShowcaseCard, ShowcaseCardProps } from "./ShowcaseCard";

export function CategoryGridSection() {
  const [timerSeconds, setTimerSeconds] = React.useState(28946); // 08:02:26

  React.useEffect(() => {
    const countdown = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 28800));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const cards = showcaseGridData as ShowcaseCardProps[];

  return (
    <section className="w-full py-8 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-muted/50">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <ShowcaseCard
            key={card.id}
            id={card.id}
            title={card.title}
            href={card.href}
            isDealCard={card.isDealCard}
            items={card.items}
            timerString={formatTimer(timerSeconds)}
          />
        ))}
      </div>
    </section>
  );
}
