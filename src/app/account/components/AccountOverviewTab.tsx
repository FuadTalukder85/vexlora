"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Store,
  ArrowRight,
  CheckCircle2,
  Clock,
  Truck,
  Edit3,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CustomerDashboardData } from "@/lib/api/user";
import { AccountStatCards } from "./AccountStatCards";

interface AccountOverviewTabProps {
  dashboardData?: CustomerDashboardData;
  onSelectTab: (tab: string) => void;
}

export const AccountOverviewTab: React.FC<AccountOverviewTabProps> = ({
  dashboardData,
  onSelectTab,
}) => {
  const user = dashboardData?.user;
  const recentOrders = dashboardData?.recentOrders || [];
  const defaultAddress =
    user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3 h-3" /> In Transit
          </span>
        );
      case "CONFIRMED":
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-muted text-secondary border border-border">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Section: Daraz-Style Profile & Address Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Personal Profile Summary Card */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-xs flex flex-col justify-between hover:border-primary/30 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Personal Profile
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified
                </span>
              </div>
              <button
                onClick={() => onSelectTab("settings")}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Edit</span>
                <Edit3 className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4 flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center font-bold text-xl text-primary shrink-0 overflow-hidden relative">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user?.name || "Customer"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span>{user?.name?.[0]?.toUpperCase() || "U"}</span>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-primary text-sm">{user?.name || "Customer"}</p>
                <p className="text-secondary">{user?.email || "No email"}</p>
                <p className="text-secondary font-medium">
                  {user?.phone || "No phone number added"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-secondary">
            <span>
              Role: <strong className="text-primary">{user?.role || "CUSTOMER"}</strong>
            </span>
            <span className="text-muted-foreground">Vexlora Member</span>
          </div>
        </div>

        {/* Address Book Summary Card */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-xs flex flex-col justify-between hover:border-primary/30 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Address Book
                </span>
                {defaultAddress && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Default Shipping
                  </span>
                )}
              </div>
              <button
                onClick={() => onSelectTab("addresses")}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Manage</span>
                <Edit3 className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4">
              {defaultAddress ? (
                <div className="space-y-1.5 text-xs text-secondary">
                  <p className="font-bold text-primary text-sm">
                    {defaultAddress.label || "Home / Office"}
                  </p>
                  <p className="text-primary font-medium">{defaultAddress.street}</p>
                  <p>
                    {defaultAddress.city}, {defaultAddress.zip}
                  </p>
                  {defaultAddress.phone && (
                    <p className="text-[11px]">Contact: {defaultAddress.phone}</p>
                  )}
                </div>
              ) : (
                <div className="text-xs text-secondary py-2">
                  <p>No default shipping address selected.</p>
                  <button
                    onClick={() => onSelectTab("addresses")}
                    className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer block"
                  >
                    + Add New Address
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-secondary">
            <span>
              Total Saved:{" "}
              <strong className="text-primary">
                {user?.addresses?.length || 0} address
                {(user?.addresses?.length || 0) === 1 ? "" : "es"}
              </strong>
            </span>
            <button
              onClick={() => onSelectTab("addresses")}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
        </div>
      </div>

      {/* 2. Middle Section: Activity & Order Lifecycle Funnel (Stat Cards in one row) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
            Activity & Purchase Pipeline
          </h4>
        </div>
        <AccountStatCards
          stats={dashboardData?.stats}
          onSelectTab={onSelectTab}
        />
      </div>

      {/* 3. Bottom Section: Daraz-Style Recent Orders Snapshot */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">Recent Orders</h3>
              <p className="text-xs text-secondary">
                Track live delivery milestones and view store packages
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectTab("orders")}
            className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-secondary">
            <Package className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-bold text-primary">No orders placed yet</p>
            <p className="text-xs text-secondary mt-1 mb-4">
              Discover verified products across 500+ multi-vendor stores.
            </p>
            <Link
              href="/products"
              className="inline-block px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.slice(0, 4).map((order) => {
              const firstSubOrder = order.subOrders?.[0];
              const totalItems = order.subOrders?.reduce(
                (acc, so) => acc + (so.items?.length || 0),
                0
              );

              return (
                <div
                  key={order.id}
                  className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 px-2 rounded-2xl transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0">
                      {firstSubOrder?.vendor?.storeLogo ? (
                        <Image
                          src={firstSubOrder.vendor.storeLogo}
                          alt={firstSubOrder.vendor.storeName}
                          width={40}
                          height={40}
                          className="rounded-xl object-cover"
                        />
                      ) : (
                        <Store className="w-5 h-5 text-primary" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold font-mono text-primary">
                          #{order.orderNumber}
                        </span>
                        {firstSubOrder && getStatusBadge(firstSubOrder.status)}
                      </div>
                      <p className="text-xs text-secondary mt-1">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        • {totalItems} item{totalItems === 1 ? "" : "s"} across{" "}
                        {order.subOrders?.length || 1} store
                        {(order.subOrders?.length || 1) === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-15 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <span className="text-sm font-black text-primary block">
                        {formatCurrency(Number(order.totalAmount))}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {order.paymentStatus}
                      </span>
                    </div>

                    <Link
                      href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}
                      className="px-3.5 py-1.5 rounded-xl border border-border bg-white hover:bg-muted text-primary text-xs font-bold transition-colors"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
