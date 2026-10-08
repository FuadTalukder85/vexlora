"use client";

import React from "react";
import {
  ShoppingBag,
  Clock,
  Wallet,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CustomerDashboardStats } from "@/lib/api/user";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";

interface AccountStatCardsProps {
  stats?: CustomerDashboardStats;
  onSelectTab: (tab: string) => void;
}

interface StatCardConfig {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  value: React.ReactNode;
  unit?: string;
  subtitle: string;
  actionText: string;
  onAction: () => void;
  badge: React.ReactNode;
}

export const AccountStatCards: React.FC<AccountStatCardsProps> = ({
  stats,
  onSelectTab,
}) => {
  const { setCartDrawerOpen } = useUIStore();
  const liveCartCount = useCartStore((s) => s.getItemCount());
  const liveCartSubtotal = useCartStore((s) => s.getSubtotal());

  const cartProductsCount = liveCartCount > 0 ? liveCartCount : (stats?.cartItemsCount ?? 0);
  const pendingOrders = stats?.pendingOrdersCount ?? 0;
  const totalSpent = stats?.totalSpent ?? 0;

  const cardItems: StatCardConfig[] = [
    {
      id: "cart",
      title: "In Your Cart",
      icon: ShoppingBag,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      value: cartProductsCount,
      unit: cartProductsCount === 1 ? "product" : "products",
      subtitle:
        liveCartSubtotal > 0
          ? `Subtotal: ${formatCurrency(liveCartSubtotal)}`
          : "Active shopping bag",
      actionText: "View Cart",
      onAction: () => setCartDrawerOpen(true),
      badge: (
        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
          Ready to checkout
        </span>
      ),
    },
    {
      id: "pending_orders",
      title: "Pending Orders",
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      value: pendingOrders,
      unit: "in progress",
      subtitle:
        pendingOrders > 0
          ? `${pendingOrders} order package${pendingOrders === 1 ? "" : "s"} in progress`
          : "All past orders fulfilled",
      actionText: "Track Orders",
      onAction: () => onSelectTab("orders"),
      badge: (
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
            pendingOrders > 0
              ? "text-amber-700 bg-amber-50"
              : "text-emerald-700 bg-emerald-50"
          }`}
        >
          {pendingOrders > 0 ? "Active Shipments" : "Up to date"}
        </span>
      ),
    },
    {
      id: "total_spent",
      title: "Total Ordered / Spent",
      icon: Wallet,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      value: formatCurrency(totalSpent),
      subtitle: `Across ${stats?.totalOrdersCount ?? 0} confirmed purchase${
        (stats?.totalOrdersCount ?? 0) === 1 ? "" : "s"
      }`,
      actionText: "Order History",
      onAction: () => onSelectTab("orders"),
      badge: (
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          Verified Buyer
        </span>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 h-full">
      {cardItems.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl border border-border p-4 hover:border-primary/40 hover:shadow-xs transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                  {card.title}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border group-hover:scale-105 transition-transform ${card.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-[11px] text-secondary font-medium">
                    {card.unit}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-secondary mt-0.5 truncate">
                {card.subtitle}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
              <button
                onClick={card.onAction}
                className="text-[11px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
              >
                <span>{card.actionText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              {card.badge}
            </div>
          </div>
        );
      })}
    </div>
  );
};
